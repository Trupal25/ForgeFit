import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toggleFavoriteWorkout } from "@/lib/db/models/workouts";

/**
 * Toggle favorite status for a workout
 * POST /api/workout/[id]/favorite
 * 
 * Toggles the favorite status of a workout for the authenticated user
 * Returns the new favorite status (true/false)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const workoutId = parseInt(params.id);
    
    if (isNaN(workoutId)) {
      return NextResponse.json(
        { error: "Invalid workout ID" },
        { status: 400 }
      );
    }

    // Toggle favorite status
    const isFavorite = await toggleFavoriteWorkout(session.user.id, workoutId);

    return NextResponse.json({
      success: true,
      isFavorite,
      message: isFavorite ? "Added to favorites" : "Removed from favorites"
    });

  } catch (error) {
    console.error("Error toggling workout favorite:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite status" },
      { status: 500 }
    );
  }
} 