// app/api/nutrition/image/route.ts
import { useGeminiImageApi } from "@/lib/externalApiFunctions/gemini";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Processing nutrition image analysis request...");
    
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: "No image data provided" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate base64 image data
    if (typeof image !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid image data format" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("Sending image to Gemini API for nutrition analysis...");
    
    return await useGeminiImageApi(image);

  } catch (error) {
    console.error("Error processing nutrition image analysis:", error);
    return new Response(JSON.stringify({ error: "Failed to analyze image nutrition content" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
