import prisma from '../../../lib/prisma';
import type { Prisma } from '@prisma/client';

// Define Exercise type from Prisma
type Exercise = Prisma.ExerciseCreateInput;

/**
 * Get all exercises with optional filtering
 */
export async function getExercises(
  muscleGroups?: string[],
  equipment?: string[],
  difficultyLevel?: string
) {
  let whereClause: any = {};
  
  if (muscleGroups && muscleGroups.length > 0 && !muscleGroups.includes('All')) {
    // Create OR conditions for each muscle group
    whereClause.OR = muscleGroups.map(group => ({
      muscleGroups: {
        has: group,
      }
    }));
  }
  
  if (equipment && equipment.length > 0 && !equipment.includes('All')) {
    // Create OR conditions for each equipment
    const equipmentConditions = equipment.map(item => ({
      equipment: {
        contains: item,
      }
    }));
    
    // Add to existing OR conditions or create new ones
    whereClause.OR = whereClause.OR 
      ? [...whereClause.OR, ...equipmentConditions]
      : equipmentConditions;
  }
  
  if (difficultyLevel && difficultyLevel !== 'All') {
    whereClause.difficultyLevel = difficultyLevel;
  }
  
  return prisma.exercise.findMany({
    where: whereClause,
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Get an exercise by ID
 */
export async function getExerciseById(id: number) {
  return prisma.exercise.findUnique({
    where: { id },
    include: {
      workouts: {
        include: {
          workout: true,
        },
      },
    },
  });
}

/**
 * Search exercises by name
 */
export async function searchExercisesByName(searchQuery: string) {
  return prisma.exercise.findMany({
    where: {
      name: {
        contains: searchQuery,
        mode: 'insensitive',
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Create a new exercise
 */
export async function createExercise(exerciseData: {
  name: string;
  description: string;
  instructions: string[];
  muscleGroups: string[];
  equipment: string;
  difficultyLevel: string;
  muscleId: number;
  imageUrl?: string;
  videoUrl?: string;
}) {
  return prisma.exercise.create({
    data: exerciseData,
  });
}

/**
 * Update an exercise
 */
export async function updateExercise(id: number, exerciseData: Prisma.ExerciseUpdateInput) {
  return prisma.exercise.update({
    where: { id },
    data: exerciseData,
  });
}

/**
 * Delete an exercise
 */
export async function deleteExercise(id: number) {
  return prisma.exercise.delete({
    where: { id },
  });
}

/**
 * Get exercises by muscle group
 */
export async function getExercisesByMuscleGroup(muscleGroup: string) {
  return prisma.exercise.findMany({
    where: {
      muscleGroups: {
        has: muscleGroup,
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Get exercises by equipment
 */
export async function getExercisesByEquipment(equipment: string) {
  return prisma.exercise.findMany({
    where: {
      equipment: {
        contains: equipment,
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Get exercises by difficulty level
 */
export async function getExercisesByDifficultyLevel(difficultyLevel: string) {
  return prisma.exercise.findMany({
    where: {
      difficultyLevel,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Get total count of exercises
 */
export async function getExerciseCount() {
  return prisma.exercise.count();
} 