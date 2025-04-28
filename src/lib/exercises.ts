// import { prisma } from './db';
// import type { PrismaClient } from '@prisma/client';

// // Define Exercise type from Prisma
// // type Exercise = PrismaClient['exercise']['create']['data'];

// /**
//  * Get all exercises with optional filtering
//  */
// export async function getExercises(
//   muscleGroups?: string[],
//   equipment?: string[],
//   difficultyLevel?: string
// ) {
//   let whereClause: any = {};
  
//   if (muscleGroups && muscleGroups.length > 0 && !muscleGroups.includes('All')) {
//     whereClause.muscleGroups = {
//       hasSome: muscleGroups,
//     };
//   }
  
//   if (equipment && equipment.length > 0 && !equipment.includes('All')) {
//     whereClause.equipment = {
//       hasSome: equipment,
//     };
//   }
  
//   if (difficultyLevel && difficultyLevel !== 'All') {
//     whereClause.difficultyLevel = difficultyLevel;
//   }
  
//   return prisma.exercise.findMany({
//     where: whereClause,
//     orderBy: {
//       name: 'asc',
//     },
//   });
// }

// /**
//  * Get an exercise by ID
//  */
// export async function getExerciseById(id: number) {
//   return prisma.exercise.findUnique({
//     where: { id },
//     include: {
//       workouts: {
//         include: {
//           workout: true,
//         },
//       },
//     },
//   });
// }

// /**
//  * Search exercises by name
//  */
// export async function searchExercisesByName(searchQuery: string) {
//   return prisma.exercise.findMany({
//     where: {
//       name: {
//         contains: searchQuery,
//         mode: 'insensitive',
//       },
//     },
//     orderBy: {
//       name: 'asc',
//     },
//   });
// }

// /**
//  * Create a new exercise
//  */
// export async function createExercise(exerciseData: Partial<Exercise>) {
//   return prisma.exercise.create({
//     data: exerciseData as Exercise,
//   });
// }

// /**
//  * Update an exercise
//  */
// export async function updateExercise(id: number, exerciseData: Partial<Exercise>) {
//   return prisma.exercise.update({
//     where: { id },
//     data: exerciseData,
//   });
// }

// /**
//  * Delete an exercise
//  */
// export async function deleteExercise(id: number) {
//   return prisma.exercise.delete({
//     where: { id },
//   });
// }

// /**
//  * Get exercises by muscle group
//  */
// export async function getExercisesByMuscleGroup(muscleGroup: string) {
//   return prisma.exercise.findMany({
//     where: {
//       muscleGroups: {
//         has: muscleGroup,
//       },
//     },
//     orderBy: {
//       name: 'asc',
//     },
//   });
// }

// /**
//  * Get exercises by equipment
//  */
// export async function getExercisesByEquipment(equipment: string) {
//   return prisma.exercise.findMany({
//     where: {
//       equipment: {
//         has: equipment,
//       },
//     },
//     orderBy: {
//       name: 'asc',
//     },
//   });
// }

// /**
//  * Get exercises by difficulty level
//  */
// export async function getExercisesByDifficultyLevel(difficultyLevel: string) {
//   return prisma.exercise.findMany({
//     where: {
//       difficultyLevel,
//     },
//     orderBy: {
//       name: 'asc',
//     },
//   });
// }

// /**
//  * Get total count of exercises
//  */
// export async function getExerciseCount() {
//   return prisma.exercise.count();
// } 