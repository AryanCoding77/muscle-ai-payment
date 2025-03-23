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
      Look at this body image carefully and identify which muscle groups appear to be underdeveloped or need more training.
      
      For each muscle group that needs work:
      1. Name the specific muscle (e.g., pectorals, deltoids, latissimus dorsi, etc.)
      2. Rate its development on a scale of 1-10
      3. Suggest 2-3 specific exercises to improve that muscle group
      
      Be comprehensive but focus on the most noticeable areas that need improvement.
      If the image doesn't show certain parts of the body clearly, mention that in your analysis.
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
