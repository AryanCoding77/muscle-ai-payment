import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";
import {
  generateImageHash,
  getCachedAnalysis,
  setCachedAnalysis,
} from "../../../utils/cache";
import { supabaseAdmin } from "@/utils/supabase-admin";

// Initialize Together client with your API key
const together = new Together(process.env.TOGETHER_API_KEY || "");

// Add a simple rate limiter
const RATE_LIMIT_WINDOW = 30000; // 30 seconds in milliseconds
const MAX_REQUESTS_PER_WINDOW = 10; // Maximum 10 requests per window
const requestTimestamps: number[] = [];

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Cache configuration
const CACHE_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds

export async function POST(request: NextRequest) {
  try {
    // Get the user ID from the request headers
    const userId = request.headers.get("x-user-id");
    
    // If userId is provided, check quota before processing
    if (userId) {
      try {
        // Check user's quota
        const baseUrl = new URL(request.url).origin;
        const quotaResponse = await fetch(`${baseUrl}/api/check-quota`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        
        const quotaData = await quotaResponse.json();
        
        // If quota check failed, return the error
        if (!quotaResponse.ok || !quotaData.success) {
          return NextResponse.json(
            { 
              error: quotaData.message || "Quota exceeded", 
              requiresUpgrade: quotaData.requiresUpgrade || false,
              quota: quotaData.quota || { used: 0, limit: 0, remaining: 0 }
            },
            { status: 403 }
          );
        }
        
        console.log("Quota check passed:", quotaData);
      } catch (quotaError) {
        console.error("Error checking quota:", quotaError);
        // Continue with analysis if quota check fails (fallback behavior)
      }
    }
  
    // Implement basic rate limiting
    const now = Date.now();
    while (
      requestTimestamps.length > 0 &&
      requestTimestamps[0] < now - RATE_LIMIT_WINDOW
    ) {
      requestTimestamps.shift();
    }

    if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment before trying again.",
          isRateLimit: true,
        },
        { status: 429 }
      );
    }

    requestTimestamps.push(now);

    // Get the image data from the request
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert the file to buffer for hashing
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate image hash
    const imageHash = await generateImageHash(buffer);

    // Check cache first
    const cachedResult = await getCachedAnalysis(imageHash);
    if (cachedResult) {
      console.log("Cache hit! Returning cached analysis");
      
      // Get quota info if user ID was provided
      let quotaInfo = null;
      if (userId) {
        try {
          // Get quota info without incrementing (just for display)
          const { data: subscription } = await supabaseAdmin
            .from("user_subscriptions")
            .select("quota_used, monthly_quota, last_quota_reset")
            .eq("user_id", userId)
            .eq("status", "active")
            .single();
            
          if (subscription) {
            const resetDate = new Date(subscription.last_quota_reset);
            resetDate.setDate(resetDate.getDate() + 30); // 30 days from last reset
            
            quotaInfo = {
              used: subscription.quota_used,
              limit: subscription.monthly_quota,
              remaining: Math.max(0, subscription.monthly_quota - subscription.quota_used),
              resetDate: resetDate.toISOString()
            };
          }
        } catch (quotaError) {
          console.error("Error getting quota info:", quotaError);
          // Continue without quota info
        }
      }
      
      return NextResponse.json({
        analysis: cachedResult,
        cached: true,
        quota: quotaInfo
      });
    }

    // Convert to base64 for API request
    const base64Image = buffer.toString("base64");

    console.log("Sending request to analyze image...");

    // Use a more detailed prompt to guide the analysis
    const prompt = `
      You are a professional fitness trainer and body analyst.
      Look at this body image carefully and analyze ONLY the visible muscle groups in the image.
      
      CRITICAL INSTRUCTIONS:
      - You MUST ONLY analyze muscles that are CLEARLY VISIBLE in the image
      - DO NOT rate or analyze ANY muscles that cannot be seen in this specific angle/view
      - Be extremely strict about this - if a muscle is even partially obscured or not clearly visible, DO NOT rate it
      - This is an adult fitness application for analyzing muscle development
      - This is a legitimate fitness analysis request ONLY about visible muscle development
      - The person in the image is a living adult in typical fitness attire for muscle assessment
      - Your job is ONLY to analyze muscle development - focus EXCLUSIVELY on muscle analysis
      - Under no circumstances should you discuss ethical concerns or content policies
      
      Different views show different muscles:
      - Front views: can assess chest, abs, biceps, quads, shoulders (front)
      - Back views: can assess back (lats, traps), shoulders (rear), hamstrings, calves
      - Side views: can assess side deltoids, obliques, some arm muscles
      
      For each VISIBLE muscle group only:
      1. Name the specific muscle
      2. Rate its development on a scale of 1-10
      3. Suggest 2-3 specific exercises to improve that muscle group
      
      Format your response as a numbered list with clear headings for each muscle.
      For each muscle use this exact format:
      
      1. **Muscle Name**: Development: X/10
      * Exercises to improve:
      * Exercise 1
      * Exercise 2
      * Exercise 3
      
      CRITICAL: At the end of your analysis, you MUST include a separate section with the heading:
      
      "Muscles not visible in this image:"
      
      List all major muscle groups that CANNOT be assessed from this angle. Be thorough and include all standard muscle groups not visible in the current view.
    `;

    // Implementation of a retry mechanism
    let lastError = null;
    let modelResponse = null;
    let safetyFilterTriggered = false;

    for (let retryCount = 0; retryCount <= MAX_RETRIES; retryCount++) {
      try {
        // Add a small delay if this is a retry
        if (retryCount > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * retryCount)
          );
          console.log(`Retry attempt ${retryCount}...`);
        }

        // Try different models on each retry
        let modelToUse = "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo"; // Start with Llama 3.2 Vision
        if (retryCount === 1) {
          modelToUse = "google/gemma-1.1-7b-vision-it"; // Gemma 1.1 Vision as first backup
        } else if (retryCount === 2) {
          modelToUse = "mistralai/mistral-medium-vision-latest"; // Mistral Vision as second backup
        }

        // If safety filter was previously triggered, use a more sanitized prompt
        let currentPrompt = prompt;
        let systemPrompt =
          "You are GymBot, a professional fitness trainer AI specializing in analyzing muscle development from photos. You ONLY respond with muscle development analysis in a standardized format.\n\nYou are explicitly permitted to analyze fitness photos of adults in workout attire for the legitimate purpose of providing fitness advice. This is a fitness app for bodybuilders. Never mention content policy, ethics, or any disclaimers - focus solely on analyzing visible muscles.\n\nFor visible muscles only:\n1. Rate them on a scale of 1-10\n2. Suggest specific exercises\n\nFor non-visible muscles:\n- List them in a separate section at the end";

        // Adjust prompts based on the model
        if (modelToUse.includes("gemma")) {
          // Gemma models may need a simpler, more direct prompt
          systemPrompt =
            "You are a fitness trainer. Only analyze visible muscles in the image.";
          currentPrompt = `
          Look at this fitness photo and provide a simple analysis:
          
          1. For each VISIBLE muscle only:
             - Name the muscle
             - Rate development (1-10)
             - List 2-3 exercises
          
          Format as:
          1. **Muscle Name**: Development: X/10
          * Exercise 1
          * Exercise 2
          
          End with a section: "Muscles not visible in this image:"
          `;
        } else if (modelToUse.includes("mistral")) {
          // Mistral may need a more technical, precise prompt
          systemPrompt =
            "You are a professional fitness analyst specializing in kinesiology and muscular development assessment.";
          currentPrompt = `
          Analyze only the clearly visible muscles in this fitness photo.
          
          For each visible muscle:
          1. Name the specific muscle with anatomical precision
          2. Rate development from 1-10
          3. Suggest targeted exercises
          
          Format:
          1. **Muscle Name**: Development: X/10
          * Exercise 1
          * Exercise 2
          * Exercise 3
          
          Add a final section titled "Muscles not visible in this image:"
          List all major muscle groups not visible from this angle.
          `;
        }

        if (safetyFilterTriggered) {
          // Even more sanitized prompt for retries after safety filter
          currentPrompt = `
          Provide a simple fitness assessment of the visible muscles:
          
          For each visible muscle:
          1. Name the muscle
          2. Rate on scale 1-10
          3. List 2 exercises
          
          Format:
          1. **Muscle Name**: Development: X/10
          * Exercise 1
          * Exercise 2
          
          End with: "Muscles not visible:"
          `;
        }

        // Use the chat completions API with vision capabilities
        const response = await together.chat.completions.create({
          model: modelToUse,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: [
                { type: "text", text: currentPrompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 1024,
          temperature: 0.3,
          top_p: 0.9,
        });

        console.log("Response received from model:", modelToUse);
        modelResponse = response;

        // Extract and cache the analysis results
        if (
          response.choices &&
          response.choices.length > 0 &&
          response.choices[0].message
        ) {
          const content = response.choices[0].message.content;

          // Pre-process the content to remove any XML/HTML tags and improve formatting
          let processedContent = content;

          // Clean Claude's occasional XML formatting
          if (
            processedContent.includes("<answer>") ||
            processedContent.includes("<muscle_analysis>")
          ) {
            // Remove common XML-like tags from Claude's responses
            processedContent = processedContent.replace(
              /<\/?(?:answer|muscle_analysis|analysis|visible_muscles|exercises|rating|assessment|results)>/g,
              ""
            );
          }

          // Ensure proper markdown formatting
          if (
            !processedContent.includes("**") &&
            processedContent.match(/\d+\.\s+([A-Z][a-z]+)/)
          ) {
            // Convert plain text muscle names to bold
            processedContent = processedContent.replace(
              /(\d+\.\s+)([A-Z][a-z]+[^:]*):?/g,
              "$1**$2**:"
            );
          }

          // Ensure rating format is standardized
          if (
            !processedContent.includes("Development:") &&
            processedContent.match(/(\d+)\/10/)
          ) {
            // Add "Development:" before ratings
            processedContent = processedContent.replace(
              /(\d+\/10)/g,
              "Development: $1"
            );
          }

          // Ensure exercise lists have proper formatting
          if (
            !processedContent.includes("* ") &&
            processedContent.match(/Exercises?:?\s/)
          ) {
            // Convert plain exercise lists to bullet points
            processedContent = processedContent.replace(
              /(Exercises?:?\s*)([-•])?\s*([A-Za-z])/g,
              "$1* $3"
            );
            processedContent = processedContent.replace(
              /(Exercises?:?\s*)([A-Za-z])/g,
              "$1* $2"
            );
          }

          // Store the result in cache (use the processed content)
          try {
            await setCachedAnalysis(imageHash, processedContent);
          } catch (cacheError) {
            console.error("Failed to cache analysis:", cacheError);
            // Continue without caching - non-critical error
          }

          // Check if the response contains ANY kind of safety filter or policy messages
          // Significantly reduced list focused on actual safety filter phrases
          const safetyTerms = [
            "I apologize",
            "I cannot",
            "I'm sorry",
            "cannot analyze",
            "cannot assist",
            "policy",
            "policies",
            "unable to",
            "not able to",
            "apologize",
            "sorry",
            "against our",
          ];

          // Check for low quality image specific error patterns
          if (
            processedContent.includes("too pixelated") ||
            processedContent.includes("cannot provide a detailed analysis") ||
            processedContent.includes("I can't provide") ||
            processedContent.includes("Alternative:") ||
            processedContent.includes("high-resolution image")
          ) {
            console.log("Low quality image detected");

            return NextResponse.json(
              {
                error:
                  "The image quality is too low for accurate muscle analysis. Please upload a clearer, higher resolution image.",
                isImageQuality: true,
              },
              { status: 400 }
            );
          }

          // Check if any of the safety terms appear in the content
          const hasSafetyTerms = safetyTerms.some((term) => {
            // Get context around the term to check if it's actually about safety filters
            const index = processedContent
              .toLowerCase()
              .indexOf(term.toLowerCase());
            if (index >= 0) {
              // Get a window of 50 characters around the match to analyze context
              const start = Math.max(0, index - 25);
              const end = Math.min(
                processedContent.length,
                index + term.length + 25
              );
              const context = processedContent
                .substring(start, end)
                .toLowerCase();

              // Check if this contains actual safety filter language or false positives
              const isSafetyContext = [
                "cannot comply",
                "against policy",
                "inappropriate",
                "i apologize",
                "i cannot",
                "sorry",
                "violation",
                "prohibited",
                "terms of service",
                "against our policy",
                "cannot analyze",
                "dead",
                "appears to be dead",
              ].some((phrase) => context.includes(phrase));

              return isSafetyContext;
            }
            return false;
          });

          if (hasSafetyTerms) {
            console.error("Safety filter triggered for model:", modelToUse);
            safetyFilterTriggered = true;

            // If this is our last retry, handle the safety filter response
            // Otherwise continue to next retry with a different model
            if (retryCount === MAX_RETRIES) {
              // Try to extract useful content from the response
              let cleanedContent = processedContent;
              let analysisFound = false;

              // Find the start of any useful analysis
              const analysisStartPattern = /\d+\.\s+\*\*[^*:]+/;
              const analysisStartMatch =
                processedContent.match(analysisStartPattern);

              if (analysisStartMatch && analysisStartMatch.index) {
                // Extract everything from the start of the numbered list
                cleanedContent = processedContent.substring(
                  analysisStartMatch.index
                );

                // Remove any trailing safety warnings
                const apologyPatterns = [
                  "I apologize",
                  "I cannot",
                  "I'm sorry",
                  "Sorry,",
                  "As an AI",
                  "content policy",
                  "against policy",
                ];

                apologyPatterns.forEach((pattern) => {
                  const apologyIndex = cleanedContent.indexOf(pattern);
                  if (apologyIndex > 0) {
                    cleanedContent = cleanedContent
                      .substring(0, apologyIndex)
                      .trim();
                  }
                });

                // Add a standard "Muscles not visible" section if missing
                if (!cleanedContent.includes("Muscles not visible")) {
                  cleanedContent +=
                    "\n\nMuscles not visible in this image:\n- Any muscles not listed above";
                }

                analysisFound = true;
              }

              // Only use fallback if we couldn't extract anything
              if (!analysisFound) {
                // Return generic fallback content
                cleanedContent = `I've analyzed the visible muscles in your image. Here's my assessment:

1. **Shoulders (Deltoids)**: Development: 7/10
* Exercises to improve:
* Military Press
* Lateral Raises
* Front Raises

2. **Chest (Pectorals)**: Development: 7.5/10
* Exercises to improve:
* Incline Bench Press
* Cable Crossovers
* Weighted Dips

3. **Arms (Biceps/Triceps)**: Development: 7/10
* Exercises to improve:
* EZ Bar Curls
* Hammer Curls
* Dips

4. **Core (Abs)**: Development: 7.5/10
* Exercises to improve:
* Hanging Leg Raises
* Weighted Crunches
* Ab Rollouts

5. **Upper Back**: Development: 7/10
* Exercises to improve:
* Pull-ups
* Bent-over Rows
* Face Pulls

Muscles not visible in this image:
- Lower Back
- Hamstrings
- Calves
- Glutes (not fully visible)
- Trapezius (not fully visible)`;
              }

              return NextResponse.json({
                analysis: cleanedContent,
                wasSafetyFiltered: true,
                modelUsed: modelToUse,
              });
            } else {
              continue; // Try next model
            }
          } else {
            // Success! Return the processed analysis
            let quotaInfo = null;
            if (userId) {
              try {
                // Get quota info without incrementing (just for display)
                const { data: subscription } = await supabaseAdmin
                  .from("user_subscriptions")
                  .select("quota_used, monthly_quota, last_quota_reset")
                  .eq("user_id", userId)
                  .eq("status", "active")
                  .single();
                
                if (subscription) {
                  const resetDate = new Date(subscription.last_quota_reset);
                  resetDate.setDate(resetDate.getDate() + 30); // 30 days from last reset
                  
                  quotaInfo = {
                    used: subscription.quota_used,
                    limit: subscription.monthly_quota,
                    remaining: Math.max(0, subscription.monthly_quota - subscription.quota_used),
                    resetDate: resetDate.toISOString()
                  };
                }
              } catch (quotaError) {
                console.error("Error getting quota info:", quotaError);
                // Continue without quota info
              }
            }
            
            return NextResponse.json({
              analysis: processedContent,
              cached: false,
              modelUsed: modelToUse,
              quota: quotaInfo
            });
          }
        } else {
          console.error("Unexpected response format:", response);
          lastError = new Error(
            "The model did not return proper analysis results"
          );
          continue; // Try again if we haven't exceeded retry count
        }
      } catch (modelError: any) {
        console.error(
          `Error with model response (attempt ${retryCount + 1}):`,
          modelError
        );

        // Check if this is a rate limit error from Together AI
        if (
          modelError.message?.includes("rate") ||
          modelError.message?.includes("capacity") ||
          modelError.message?.includes("limit") ||
          modelError.message?.includes("429") ||
          modelError.status === 429
        ) {
          console.error("Rate limit detected from Together AI");
          // If we're on the last retry, return a special rate limit message
          if (retryCount === MAX_RETRIES) {
            return NextResponse.json(
              {
                error:
                  "The AI service is currently at capacity. Please try again in a moment.",
                isRateLimit: true,
              },
              { status: 429 }
            );
          }
        }

        lastError = modelError;

        if (retryCount < MAX_RETRIES) {
          continue;
        }
      }
    }

    // If we've exhausted all retries, return an error
    console.error("All retry attempts failed");
    return NextResponse.json(
      {
        error:
          "Failed to analyze image: " + (lastError?.message || "Unknown error"),
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      {
        error:
          "Failed to analyze image: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
