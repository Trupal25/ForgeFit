import { NextRequest, NextResponse } from "next/server";


const apiKey = process.env.NINJAS_API_KEY;
console.log(apiKey);

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
        
        const response = await fetch(
            `https://api.calorieninjas.com/v1/nutrition?query=${search}`,
            {
                method: "GET",
                headers: {
                    "X-Api-Key": apiKey || ""
                }
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
            return NextResponse.json(
                { error: "Failed to fetch nutrition data", details: errorText }, 
                { status: response.status }
            );
        }
        
        const data = await response.json();
        console.log("Nutrition data:", data);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching nutrition data:", error);
        return NextResponse.json(
            { error: "Failed to process request" }, 
            { status: 500 }
        );
    }
}
