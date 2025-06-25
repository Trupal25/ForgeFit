// app/api/upload-nutrition-image/route.ts
import { useGeminiImageApi } from "@/lib/apiFunctions/gemini";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Processing image upload request...");
    
    // Use Next.js built-in formData() method
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "No image file provided" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return new Response(JSON.stringify({ error: "Unsupported image type" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return new Response(JSON.stringify({ error: "File size too large. Maximum 5MB allowed" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to base64 if needed for Gemini
    const base64Image = buffer.toString("base64");
    
    console.log("Image processed successfully");
    
    return await useGeminiImageApi(base64Image);
    


  } catch (error) {
    console.error("Error processing image upload:", error);
    return new Response(JSON.stringify({ error: "Failed to upload image" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
