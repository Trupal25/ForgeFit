import  { Type, GoogleGenAI, GenerateContentResponse, Image} from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
import { NextResponse } from "next/server";
import useCalorieNinjas from './calorieNinjas';

// Type definitions for modular usage
export type NutritionProvider = 'gemini' | 'calorie-ninja';

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        calories: { type: Type.NUMBER },
        serving_size_g: { type: Type.NUMBER },
        fat_total_g: { type: Type.NUMBER },
        fat_saturated_g: { type: Type.NUMBER },
        protein_g: { type: Type.NUMBER },
        sodium_mg: { type: Type.NUMBER },
        potassium_mg: { type: Type.NUMBER },
        cholesterol_mg: { type: Type.NUMBER },
        carbohydrates_total_g: { type: Type.NUMBER },
        fiber_g: { type: Type.NUMBER },
        sugar_g: { type: Type.NUMBER },
        aminoAcids: {
          type: Type.OBJECT,
          properties: {
            leucine: { type: Type.STRING },
            lysine: { type: Type.STRING },
            valine: { type: Type.STRING },
            isoleucine: { type: Type.STRING },
            threonine: { type: Type.STRING },
            methionine: { type: Type.STRING },
            phenylalanine: { type: Type.STRING },
            tryptophan: { type: Type.STRING },
            histidine: { type: Type.STRING },
          },
          nullable: true,
        },
      },
      propertyOrdering: [
        "name",
        "calories",
        "serving_size_g",
        "fat_total_g",
        "fat_saturated_g",
        "protein_g",
        "sodium_mg",
        "potassium_mg",
        "cholesterol_mg",
        "carbohydrates_total_g",
        "fiber_g",
        "sugar_g",
        "aminoAcids"
      ],
    },
  };


export async function useGeminiTextApi(search:string) {   
    
  console.log("used gemini api")
          const response:GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents:
              `Analyze the nutritional content of the following food item and provide detailed macronutrient information in grams and milligrams as appropriate. Include amino acid profile if available. Be as precise as possible for a standard serving size - ${search}`,
            config: {
              responseMimeType: "application/json",
              responseSchema: responseSchema,
            },
          });
          const result = JSON.parse(response.text!)
          return NextResponse.json({
            items: result
          })
    }

export async function useGeminiImageApi(base64ImageFile:Base64URLString) {
  
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Analyze the nutritional content of all food items visible in this image. Provide detailed macronutrient information in grams and milligrams as appropriate. Include amino acid profiles if available for standard serving sizes." },
  ];
  
  try{
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
    contents: contents,
    config:{
      responseMimeType:"application/json",
      responseSchema:responseSchema
    }
  });

  const result = JSON.parse(response.text!);

  return NextResponse.json({
    items: result
  })
  
}catch(err){
  console.log("Gemini Image API error:", err)
  return NextResponse.json({
    error: "Failed to process image with Gemini API"
  }, { status: 500 })
}

}

// Modular nutrition service functions - Gemini as default, Calorie Ninja as fallback
export async function getNutritionData(search: string, provider: NutritionProvider = 'gemini') {
  console.log(`Using ${provider} provider for nutrition data`);
  
  switch (provider) {
    case 'gemini':
      return await useGeminiTextApi(search);
    case 'calorie-ninja':
      return await useCalorieNinjas(search);
    default:
      return NextResponse.json({
        error: "Invalid nutrition provider specified"
      }, { status: 400 });
  }
}

export async function getNutritionDataWithFallback(search: string, primaryProvider: NutritionProvider = 'gemini') {
  const fallbackProvider: NutritionProvider = primaryProvider === 'gemini' ? 'calorie-ninja' : 'gemini';
  
  try {
    console.log(`Trying primary provider: ${primaryProvider}`);
    const response = await getNutritionData(search, primaryProvider);
    
    // Check if response was successful (status < 400)
    if (response.status < 400) {
      return response;
    }
    
    console.log(`Primary provider failed, trying fallback: ${fallbackProvider}`);
    return await getNutritionData(search, fallbackProvider);
    
  } catch (error) {
    console.log(`Primary provider error, trying fallback: ${fallbackProvider}`);
    console.error(`${primaryProvider} error:`, error);
    
    try {
      return await getNutritionData(search, fallbackProvider);
    } catch (fallbackError) {
      console.error(`${fallbackProvider} error:`, fallbackError);
      return NextResponse.json({
        error: "Both nutrition providers failed"
      }, { status: 500 });
    }
  }
}