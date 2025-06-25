import  { Type, GoogleGenAI, GenerateContentResponse, Image} from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
import { NextResponse } from "next/server";

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        calories: { type: Type.NUMBER },
        servingSize: { type: Type.STRING },
        protein: { type: Type.STRING },
        carbohydrates: { type: Type.STRING },
        fats: { type: Type.STRING },
        saturatedFats: { type: Type.STRING },
        unsaturatedFats: { type: Type.STRING },
        cholesterol: { type: Type.STRING },
        fiber: { type: Type.STRING },
        sugar: { type: Type.STRING },
        aminoAcids: {
          type: Type.OBJECT,
          properties: {
            leucine: { type: Type.STRING },
            lysine: { type: Type.STRING },
            valine: { type: Type.STRING },
          },
        },
      },
      propertyOrdering: [
        "name",
        "calories",
        "servingSize",
        "protein",
        "carbohydrates",
        "fats",
        "saturatedFats",
        "unsaturatedFats",
        "cholesterol",
        "fiber",
        "sugar",
        "aminoAcids"
      ],
    },
  };


export async function useGeminiTextApi(search:string) {   
    
          const response:GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents:
              `List the nutrient content of the following food item be as precise as possible - ${search}`,
            config: {
              responseMimeType: "application/json",
              responseSchema: responseSchema,
            },
          });
          const result = JSON.parse(response.text!)
          return NextResponse.json({
            response: result
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
    { text: "List the nutrient content of the following food item / items in the image" },
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
    response:result
  })
  
}catch(err){
  console.log("Error : ",err)
  NextResponse.json({
    message:"service not available now"
  })
}

}