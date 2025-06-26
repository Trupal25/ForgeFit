import useCalorieNinjas from "@/lib/externalApiFunctions/calorieNinjas";
import getNutritionInfo from "@/lib/externalApiFunctions/calorieNinjas";
import { 
    useGeminiTextApi, 
    getNutritionData, 
    getNutritionDataWithFallback, 
    NutritionProvider 
} from "@/lib/externalApiFunctions/gemini";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        // Parse the request body as JSON
        const body = await request.json();
        const search = body.search;
        const provider = body.provider as NutritionProvider || 'gemini'; // Default to gemini
        const useFallback = body.useFallback || true; // Default to true for better reliability
        
        console.log("Search query:", search);
        console.log("Provider:", provider);
        console.log("Use fallback:", useFallback);
        
        if (!search) {
            return NextResponse.json(
                { error: "Search query is required" }, 
                { status: 400 }
            );
        }
        
        // Use the new modular nutrition service
        if (useFallback) {
            return await getNutritionDataWithFallback(search, provider);
        } else {
            return await getNutritionData(search, provider);
        }
    
    } catch (error) {
        console.error("Error fetching nutrition data:", error);
        return NextResponse.json(
            { error: "Failed to process request" }, 
            { status: 500 }
        );
    }
}
