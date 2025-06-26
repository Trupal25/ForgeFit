import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toggleFavoriteWorkout } from "@/lib/db/models/workouts";

// POST endpoint to toggle favorite status for a workout
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { workoutId } = body;
        
        if (!workoutId) {
            return NextResponse.json(
                { error: "Workout ID is required" },
                { status: 400 }
            );
        }

        // Toggle favorite status
        const isFavorite = await toggleFavoriteWorkout(session.user.id, parseInt(workoutId));

        return NextResponse.json({
            message: isFavorite ? "Added to favorites" : "Removed from favorites",
            isFavorite,
            workoutId: parseInt(workoutId),
        });

    } catch (error) {
        console.error("Error toggling favorite:", error);
        return NextResponse.json(
            { error: "Failed to toggle favorite" },
            { status: 500 }
        );
    }
} 