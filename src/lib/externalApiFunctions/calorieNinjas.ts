import { NextResponse } from "next/server";

const apiKey = process.env.NINJAS_API_KEY;

export default async function useCalorieNinjas(search:string){

const response = await fetch(
        `https://api.calorieninjas.com/v1/nutrition?query=${search}`,
    {
        method: "GET",
        headers: {
            "X-Api-Key": apiKey || ""
        }
    }   
);
    // api handling logic boi
    console.log("used ninja")
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
;

}