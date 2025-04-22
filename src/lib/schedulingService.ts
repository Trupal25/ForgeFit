"use client";

import { v4 as uuidv4 } from 'uuid';
import { ScheduledWorkout } from '@/components/calendar/CalendarEvent';
import { WorkoutItem } from '@/components/workouts/WorkoutCard';

// Key for storing scheduled workouts in localStorage
const SCHEDULED_WORKOUTS_KEY = 'forge-fit-scheduled-workouts';

// Get all scheduled workouts from localStorage
export const getScheduledWorkouts = (): ScheduledWorkout[] => {
  if (typeof window === 'undefined') return [];
  
  const storedWorkouts = localStorage.getItem(SCHEDULED_WORKOUTS_KEY);
  if (!storedWorkouts) return [];
  
  try {
    return JSON.parse(storedWorkouts);
  } catch (error) {
    console.error('Error parsing scheduled workouts from localStorage:', error);
    return [];
  }
};

// Save all scheduled workouts to localStorage
const saveScheduledWorkouts = (workouts: ScheduledWorkout[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SCHEDULED_WORKOUTS_KEY, JSON.stringify(workouts));
};

// Add a new scheduled workout
export const scheduleWorkout = (
  workout: WorkoutItem,
  date: string, 
  time: string
): ScheduledWorkout => {
  const newScheduledWorkout: ScheduledWorkout = {
    id: uuidv4(),
    workoutId: workout.id,
    title: workout.title,
    date,
    time,
    duration: workout.duration,
    category: workout.category,
    completed: false
  };
  
  const currentWorkouts = getScheduledWorkouts();
  saveScheduledWorkouts([...currentWorkouts, newScheduledWorkout]);
  
  return newScheduledWorkout;
};

// Delete a scheduled workout by ID
export const deleteScheduledWorkout = (id: string): void => {
  const currentWorkouts = getScheduledWorkouts();
  const updatedWorkouts = currentWorkouts.filter(workout => workout.id !== id);
  saveScheduledWorkouts(updatedWorkouts);
};

// Update a scheduled workout
export const updateScheduledWorkout = (updatedWorkout: ScheduledWorkout): void => {
  const currentWorkouts = getScheduledWorkouts();
  const updatedWorkouts = currentWorkouts.map(workout => 
    workout.id === updatedWorkout.id ? updatedWorkout : workout
  );
  saveScheduledWorkouts(updatedWorkouts);
};

// Toggle completion status of a workout
export const toggleWorkoutCompletion = (id: string, completed: boolean): void => {
  const currentWorkouts = getScheduledWorkouts();
  const updatedWorkouts = currentWorkouts.map(workout => 
    workout.id === id ? { ...workout, completed } : workout
  );
  saveScheduledWorkouts(updatedWorkouts);
};

// Get workouts scheduled for a specific date
export const getWorkoutsForDate = (date: string): ScheduledWorkout[] => {
  return getScheduledWorkouts().filter(workout => workout.date === date);
};

// Check if a workout is already scheduled for a specific date
export const isWorkoutScheduledForDate = (workoutId: number, date: string): boolean => {
  return getScheduledWorkouts().some(
    workout => workout.workoutId === workoutId && workout.date === date
  );
}; 