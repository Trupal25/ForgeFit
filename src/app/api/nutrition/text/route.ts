import useCalorieNinjas from "@/lib/externalApiFunctions/calorieNinjas";
import getNutritionInfo from "@/lib/externalApiFunctions/calorieNinjas";
import { useGeminiTextApi } from "@/lib/externalApiFunctions/gemini";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        // Parse the request body as JSON
        const body = await request.json();
        const search = body.search;
        
        console.log("Search query:", search);
        
        if (!search) {
            return NextResponse.json(
                { error: "Search query is required" }, 
                { status: 400 }
            );
        }
        
        return await useCalorieNinjas(search);
        // return await useGeminiTextApi(search)    
       
    
    } catch (error) {
        console.error("Error fetching nutrition data:", error);
        return NextResponse.json(
            { error: "Failed to process request" }, 
            { status: 500 }
        );
    }
}
