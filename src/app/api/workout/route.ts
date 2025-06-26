import { createWorkout, getWorkouts, updateWorkout, deleteWorkout } from "@/lib/db/models/workouts";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Custom Workout API Endpoint - Complete CRUD Operations
 * 
 * GET /api/workout
 * Fetches workouts with optional filtering
 * Query Parameters:
 * - category: Filter by workout category (Strength, Cardio, etc.)
 * - difficulty: Filter by difficulty level (Beginner, Intermediate, Advanced)
 * - duration: Maximum duration in minutes
 * - muscleGroups: Comma-separated muscle groups to filter by
 * 
 * POST /api/workout
 * Creates a custom workout with exercises, sets, and reps
 * Request Body: (same as before - see below)
 * 
 * PUT /api/workout
 * Updates an existing workout
 * Request Body: Same as POST but with required "id" field
 * 
 * DELETE /api/workout
 * Deletes a workout
 * Request Body: { "id": number }
 * 
 * POST Request Body Format:
 * {
 *   "title": "My Custom Workout",
 *   "description": "A personalized strength training routine",
 *   "category": "Strength", // Strength, Cardio, Core, Flexibility, HIIT, etc.
 *   "difficulty": "Intermediate", // Beginner, Intermediate, Advanced
 *   "duration": 45, // in minutes
 *   "muscleGroups": "Chest, Shoulders, Triceps", // optional
 *   "imageUrl": "https://...", // optional
 *   "videoUrl": "https://...", // optional
 *   "exercises": [
 *     {
 *       "exerciseId": 1,
 *       "sets": 3,
 *       "reps": "8-12", // Can be "10", "8-12", "30 seconds", etc.
 *       "weight": 135.5, // optional, in kg
 *       "restTime": 90, // optional, in seconds
 *       "notes": "Focus on form" // optional
 *     }
 *   ]
 * }
 * 
 * All endpoints require authentication via NextAuth session
 */

// GET endpoint to retrieve workouts with optional filtering
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        
        // Extract query parameters for filtering
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');
        const durationParam = searchParams.get('duration');
        const muscleGroupsParam = searchParams.get('muscleGroups');
        
        // Parse parameters
        const duration = durationParam ? parseInt(durationParam) : undefined;
        const muscleGroups = muscleGroupsParam ? muscleGroupsParam.split(',').map(g => g.trim()) : undefined;
        
        // Fetch workouts with filtering
        const workouts = await getWorkouts(category || undefined, difficulty || undefined, duration, muscleGroups);
        
        return NextResponse.json({
            workouts,
            count: workouts.length,
            filters: {
                category: category || 'All',
                difficulty: difficulty || 'All',
                maxDuration: duration,
                muscleGroups: muscleGroups || []
            }
        });

    } catch (error) {
        console.error("Error fetching workouts:", error);
        return NextResponse.json(
            { error: "Failed to fetch workouts" },
            { status: 500 }
        );
    }
}

// POST endpoint to create a custom workout
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
        
        // Validate required fields
        const { title, description, category, difficulty, duration, exercises } = body;
        
        if (!title || !description || !category || !difficulty || !duration) {
            return NextResponse.json(
                { error: "Missing required fields: title, description, category, difficulty, duration" },
                { status: 400 }
            );
        }

        if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
            return NextResponse.json(
                { error: "At least one exercise is required" },
                { status: 400 }
            );
        }

        // Validate exercise structure
        for (const exercise of exercises) {
            if (!exercise.exerciseId || !exercise.sets || !exercise.reps) {
                return NextResponse.json(
                    { error: "Each exercise must have exerciseId, sets, and reps" },
                    { status: 400 }
                );
            }
        }

        // Calculate estimated calories (basic calculation)
        const estimatedCalories = Math.round(duration * 8); // Rough estimate: 8 calories per minute

        // Prepare workout data
        const workoutData = {
            title,
            description,
            category,
            difficulty,
            duration: parseInt(duration),
            calories: estimatedCalories,
            muscleGroups: body.muscleGroups || "Full Body", // Default if not provided
            imageUrl: body.imageUrl || null,
            videoUrl: body.videoUrl || null,
        };

        // Prepare exercise data with proper ordering
        const exerciseData = exercises.map((exercise: any, index: number) => ({
            exerciseId: parseInt(exercise.exerciseId),
            sets: parseInt(exercise.sets),
            reps: exercise.reps.toString(), // Can be "10" or "8-12" or "30 seconds"
            weight: exercise.weight ? parseFloat(exercise.weight) : undefined,
            restTime: exercise.restTime ? parseInt(exercise.restTime) : undefined,
            notes: exercise.notes || undefined,
            order: index + 1, // 1-based ordering
        }));

        // Create the workout
        const newWorkout = await createWorkout(workoutData, exerciseData);

        return NextResponse.json({
            message: "Workout created successfully",
            workout: newWorkout,
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating workout:", error);
        return NextResponse.json(
            { error: "Failed to create workout" },
            { status: 500 }
        );
    }
}

// PUT endpoint to update an existing workout
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await request.json();
        
        // Validate required fields including ID
        const { id, title, description, category, difficulty, duration, exercises } = body;
        
        if (!id) {
            return NextResponse.json(
                { error: "Workout ID is required for updates" },
                { status: 400 }
            );
        }

        if (!title || !description || !category || !difficulty || !duration) {
            return NextResponse.json(
                { error: "Missing required fields: title, description, category, difficulty, duration" },
                { status: 400 }
            );
        }

        // Prepare workout data for update
        const workoutData = {
            title,
            description,
            category,
            difficulty,
            duration: parseInt(duration),
            calories: Math.round(duration * 8), // Recalculate calories
            muscleGroups: body.muscleGroups || undefined,
            imageUrl: body.imageUrl || undefined,
            videoUrl: body.videoUrl || undefined,
        };

        // Prepare exercise data if provided
        let exerciseData;
        if (exercises && Array.isArray(exercises)) {
            // Validate exercise structure
            for (const exercise of exercises) {
                if (!exercise.exerciseId || !exercise.sets || !exercise.reps) {
                    return NextResponse.json(
                        { error: "Each exercise must have exerciseId, sets, and reps" },
                        { status: 400 }
                    );
                }
            }

            exerciseData = exercises.map((exercise: any, index: number) => ({
                exerciseId: parseInt(exercise.exerciseId),
                sets: parseInt(exercise.sets),
                reps: exercise.reps.toString(),
                weight: exercise.weight ? parseFloat(exercise.weight) : undefined,
                restTime: exercise.restTime ? parseInt(exercise.restTime) : undefined,
                notes: exercise.notes || undefined,
                order: index + 1,
            }));
        }

        // Update the workout
        const updatedWorkout = await updateWorkout(parseInt(id), workoutData, exerciseData);

        return NextResponse.json({
            message: "Workout updated successfully",
            workout: updatedWorkout,
        });

    } catch (error) {
        console.error("Error updating workout:", error);
        return NextResponse.json(
            { error: "Failed to update workout" },
            { status: 500 }
        );
    }
}

// DELETE endpoint to delete a workout
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id } = body;
        
        if (!id) {
            return NextResponse.json(
                { error: "Workout ID is required" },
                { status: 400 }
            );
        }

        // Delete the workout
        await deleteWorkout(parseInt(id));

        return NextResponse.json({
            message: "Workout deleted successfully",
            deletedId: parseInt(id),
        });

    } catch (error) {
        console.error("Error deleting workout:", error);
        return NextResponse.json(
            { error: "Failed to delete workout" },
            { status: 500 }
        );
    }
} 