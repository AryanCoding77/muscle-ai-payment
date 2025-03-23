import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";

// Initialize Together client with your API key
const together = new Together(process.env.TOGETHER_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    // Get the image data from the request
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert the file to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
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
      
      Example for a back view photo:
      "Muscles not visible in this image:
      - Chest (Pectorals)
      - Abs
      - Front Deltoids
      - Biceps (front of arms)
      - Quadriceps (front of thighs)"
    `;

    // Use the chat completions API with vision capabilities
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo", // Using the correct model name
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

    // Extract and return the analysis results
    if (
      response.choices &&
      response.choices.length > 0 &&
      response.choices[0].message
    ) {
      return NextResponse.json({
        analysis: response.choices[0].message.content,
      });
    } else {
      console.error("Unexpected response format:", response);
      return NextResponse.json(
        { error: "The model did not return proper analysis results" },
        { status: 500 }
      );
    }
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
