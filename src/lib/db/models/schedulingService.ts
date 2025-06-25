
import { prisma } from '../../prisma';

// Basic type definitions to match the database schema
interface Workout {
  id: number;
  title: string;
  duration: number;
  muscleGroups: string; // Now a string instead of array
  [key: string]: any;
}

interface ScheduledEvent {
  id: string;
  userId: string;
  title: string;
  date: Date;
  time: string;
  duration: number;
  eventType: string;
  completed: boolean;
  workoutId?: number;
  workout?: Workout;
  [key: string]: any;
}

// Helper functions to convert between string and array
const stringToArray = (str: string) => str.split(',');
const arrayToString = (arr: string[]) => arr.join(',');

// Get all scheduled workouts for a user
export const getScheduledWorkouts = async (userId: string) => {
  if (typeof window === 'undefined') return [];
  
  try {
    const events = await prisma.scheduledEvent.findMany({
      where: {
        userId,
        eventType: 'Workout'
      },
      include: {
        workout: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    // Convert muscleGroups from string to array for frontend
    return events.map((event: any) => {
      if (event.workout && event.workout.muscleGroups) {
        return {
          ...event,
          workout: {
            ...event.workout,
            muscleGroups: stringToArray(event.workout.muscleGroups)
          }
        };
      }
      return event;
    });
  } catch (error) {
    console.error('Error fetching scheduled workouts:', error);
    return [];
  }
};

// Add a new scheduled workout
export const scheduleWorkout = async (
  userId: string,
  workout: Workout,
  date: string, 
  time: string
) => {
  try {
    return await prisma.scheduledEvent.create({
      data: {
        userId,
        title: workout.title,
        date: new Date(date),
        time,
        duration: workout.duration,
        eventType: 'Workout',
        workoutId: workout.id,
        completed: false
      },
      include: {
        workout: true
      }
    });
  } catch (error) {
    console.error('Error scheduling workout:', error);
    throw error;
  }
};

// Delete a scheduled workout by ID
export const deleteScheduledWorkout = async (id: string): Promise<void> => {
  try {
    await prisma.scheduledEvent.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting scheduled workout:', error);
    throw error;
  }
};

// Update a scheduled workout
export const updateScheduledWorkout = async (updatedWorkout: ScheduledEvent) => {
  try {
    const { id, workout, ...data } = updatedWorkout;
    
    return await prisma.scheduledEvent.update({
      where: { id },
      data,
      include: {
        workout: true
      }
    });
  } catch (error) {
    console.error('Error updating scheduled workout:', error);
    throw error;
  }
};

// Toggle completion status of a workout
export const toggleWorkoutCompletion = async (id: string, completed: boolean): Promise<void> => {
  try {
    await prisma.scheduledEvent.update({
      where: { id },
      data: { completed }
    });
  } catch (error) {
    console.error('Error toggling workout completion:', error);
    throw error;
  }
};

// Get workouts scheduled for a specific date
export const getWorkoutsForDate = async (userId: string, date: string) => {
  const dateObj = new Date(date);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  try {
    const events = await prisma.scheduledEvent.findMany({
      where: {
        userId,
        eventType: 'Workout',
        date: {
          gte: dateObj,
          lt: nextDay
        }
      },
      include: {
        workout: true
      },
      orderBy: {
        time: 'asc'
      }
    });
    
    // Convert muscleGroups from string to array for frontend
    return events.map((event: any) => {
      if (event.workout && event.workout.muscleGroups) {
        return {
          ...event,
          workout: {
            ...event.workout,
            muscleGroups: stringToArray(event.workout.muscleGroups)
          }
        };
      }
      return event;
    });
  } catch (error) {
    console.error('Error fetching workouts for date:', error);
    return [];
  }
};

// Check if a workout is already scheduled for a specific date
export const isWorkoutScheduledForDate = async (userId: string, workoutId: number, date: string): Promise<boolean> => {
  const dateObj = new Date(date);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  try {
    const count = await prisma.scheduledEvent.count({
      where: {
        userId,
        workoutId,
        date: {
          gte: dateObj,
          lt: nextDay
        }
      }
    });
    
    return count > 0;
  } catch (error) {
    console.error('Error checking if workout is scheduled for date:', error);
    return false;
  }
}; 