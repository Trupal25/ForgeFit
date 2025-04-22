import { prisma } from './db';
import type { PrismaClient } from '@prisma/client';

// Define User type from Prisma
type User = PrismaClient['user']['create']['data'];

/**
 * Get a user by ID
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      settings: true,
    },
  });
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      settings: true,
    },
  });
}

/**
 * Create a new user
 */
export async function createUser(userData: Partial<User>) {
  return prisma.user.create({
    data: {
      ...userData,
      settings: {
        create: {}, // Create default settings
      },
    },
    include: {
      settings: true,
    },
  });
}

/**
 * Update user data
 */
export async function updateUser(id: string, data: Partial<User>) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

/**
 * Get user favorites
 */
export async function getUserFavorites(userId: string) {
  const workouts = await prisma.favoriteWorkout.findMany({
    where: { userId },
    include: {
      workout: true,
    },
  });

  const meditations = await prisma.favoriteMeditation.findMany({
    where: { userId },
    include: {
      meditation: true,
    },
  });

  const yogaSessions = await prisma.favoriteYogaSession.findMany({
    where: { userId },
    include: {
      yoga: true,
    },
  });

  const recipes = await prisma.favoriteRecipe.findMany({
    where: { userId },
    include: {
      recipe: true,
    },
  });

  return {
    workouts: workouts.map((fw: any) => fw.workout),
    meditations: meditations.map((fm: any) => fm.meditation),
    yogaSessions: yogaSessions.map((fy: any) => fy.yoga),
    recipes: recipes.map((fr: any) => fr.recipe),
  };
}

/**
 * Get user scheduled events
 */
export async function getUserScheduledEvents(userId: string) {
  return prisma.scheduledEvent.findMany({
    where: { userId },
    include: {
      workout: true,
      meditation: true,
      yoga: true,
    },
    orderBy: {
      date: 'asc',
    },
  });
}

/**
 * Get user workout history
 */
export async function getUserWorkoutHistory(userId: string) {
  return prisma.workoutHistory.findMany({
    where: { userId },
    include: {
      workout: true,
    },
    orderBy: {
      completedAt: 'desc',
    },
  });
}

/**
 * Get user weight history
 */
export async function getUserWeightHistory(userId: string) {
  return prisma.weightHistory.findMany({
    where: { userId },
    orderBy: {
      date: 'desc',
    },
  });
}

/**
 * Get user achievements
 */
export async function getUserAchievements(userId: string) {
  return prisma.userAchievement.findMany({
    where: { userId },
    include: {
      achievement: true,
    },
  });
} 