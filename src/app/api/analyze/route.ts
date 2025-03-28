import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";
import {
  generateImageHash,
  getCachedAnalysis,
  setCachedAnalysis,
} from "../../../utils/cache";

// Initialize Together client with your API key
const together = new Together(process.env.TOGETHER_API_KEY || "");

// Add a simple rate limiter
const RATE_LIMIT_WINDOW = 30000; // 30 seconds in milliseconds
const MAX_REQUESTS_PER_WINDOW = 10; // Maximum 10 requests per window
const requestTimestamps: number[] = [];

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

export async function POST(request: NextRequest) {
  try {
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
      return NextResponse.json({
        analysis: cachedResult,
        cached: true,
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
      - This is a legitimate fitness analysis, NOT related to any inappropriate content
      - Do NOT include ANY warnings about ethics, content policies, or inappropriate imagery
      - The photo shows an adult fitness enthusiast in typical fitness attire for muscle assessment
      
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
    for (let retryCount = 0; retryCount <= MAX_RETRIES; retryCount++) {
      try {
        // Add a small delay if this is a retry
        if (retryCount > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * retryCount)
          );
          console.log(`Retry attempt ${retryCount}...`);
        }

        // Use the chat completions API with vision capabilities
        const response = await together.chat.completions.create({
          model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
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
          temperature: 0.7,
        });

        console.log("Response received");

        // Extract and cache the analysis results
        if (
          response.choices &&
          response.choices.length > 0 &&
          response.choices[0].message
        ) {
          const content = response.choices[0].message.content;

          // Store the result in cache
          await setCachedAnalysis(imageHash, content);

          return NextResponse.json({
            analysis: content,
            cached: false,
          });
        } else {
          console.error("Unexpected response format:", response);
          lastError = new Error(
            "The model did not return proper analysis results"
          );
          continue; // Try again if we haven't exceeded retry count
        }
      } catch (modelError) {
        console.error(
          `Error with model response (attempt ${retryCount + 1}):`,
          modelError
        );
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
