import prisma from '../../../lib/prisma';
import type { Prisma } from '@prisma/client';

/**
 * Get all workouts with optional filtering
 */
export async function getWorkouts(
  category?: string,
  difficulty?: string,
  duration?: number,
  muscleGroups?: string[]
) {
  let whereClause: any = {};
  
  if (category && category !== 'All') {
    whereClause.category = category;
  }
  
  if (difficulty && difficulty !== 'All') {
    whereClause.difficulty = difficulty;
  }
  
  if (duration) {
    whereClause.duration = {
      lte: duration,
    };
  }
  
  if (muscleGroups && muscleGroups.length > 0 && !muscleGroups.includes('All')) {
    // Create OR conditions for each muscle group
    whereClause.OR = muscleGroups.map(group => ({
      muscleGroups: {
        contains: group,
      }
    }));
  }
  
  return prisma.workout.findMany({
    where: whereClause,
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}

/**
 * Get a workout by ID
 */
export async function getWorkoutById(id: number) {
  return prisma.workout.findUnique({
    where: { id },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}

/**
 * Create a new workout
 */
export async function createWorkout(
  workoutData: Omit<Prisma.WorkoutCreateInput, 'exercises'> & {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    duration: number;
    calories: number;
    muscleGroups: string;
  },
  exerciseData?: Array<{
    exerciseId: number;
    sets: number;
    reps: string;
    weight?: number;
    restTime?: number;
    notes?: string;
    order: number;
  }>
) {
  return prisma.workout.create({
    data: {
      ...workoutData,
      exercises: exerciseData
        ? {
            create: exerciseData,
          }
        : undefined,
    },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}

/**
 * Update a workout
 */
export async function updateWorkout(
  id: number,
  workoutData: Prisma.WorkoutUpdateInput,
  exerciseData?: Array<{
    id?: number;
    exerciseId: number;
    sets: number;
    reps: string;
    weight?: number;
    restTime?: number;
    notes?: string;
    order: number;
  }>
) {
  if (exerciseData) {
    // Delete existing workout-exercise relationships
    await prisma.workoutExercise.deleteMany({
      where: {
        workoutId: id,
      },
    });
    
    // Create new relationships
    await Promise.all(
      exerciseData.map((exercise, index) => {
        return prisma.workoutExercise.create({
          data: {
            workoutId: id,
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            restTime: exercise.restTime,
            notes: exercise.notes,
            order: exercise.order || index,
          },
        });
      })
    );
  }
  
  return prisma.workout.update({
    where: { id },
    data: workoutData,
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}

/**
 * Delete a workout
 */
export async function deleteWorkout(id: number) {
  return prisma.workout.delete({
    where: { id },
  });
}

/**
 * Toggle favorite status for a workout
 */
export async function toggleFavoriteWorkout(userId: string, workoutId: number) {
  const existingFavorite = await prisma.favoriteWorkout.findFirst({
    where: {
      userId,
      workoutId,
    },
  });
  
  if (existingFavorite) {
    // Remove from favorites
    await prisma.favoriteWorkout.delete({
      where: {
        id: existingFavorite.id,
      },
    });
    return false; // No longer a favorite
  } else {
    // Add to favorites
    await prisma.favoriteWorkout.create({
      data: {
        userId,
        workoutId,
      },
    });
    return true; // Now a favorite
  }
}

/**
 * Record a completed workout
 */
export async function recordWorkoutCompletion(
  userId: string,
  workoutId: number,
  duration: number,
  exerciseResults?: any,
  notes?: string,
  rating?: number
) {
  return prisma.workoutHistory.create({
    data: {
      userId,
      workoutId,
      duration,
      exerciseResults: exerciseResults ? JSON.stringify(exerciseResults) : undefined,
      notes,
      rating,
    },
  });
} 