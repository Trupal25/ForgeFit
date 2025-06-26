import { prisma } from '@/lib/prisma';

interface ScheduledEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  duration: number;
  eventType: string;
  completed: boolean;
  isRecurring: boolean;
  recurringType?: string;
  workoutId?: number;
  meditationId?: number;
  yogaId?: number;
  workout?: any;
  meditation?: any;
  yoga?: any;
  reminderMinutes?: number;
  notes?: string;
}

interface CreateEventData {
  userId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number;
  eventType: 'Workout' | 'Meditation' | 'Yoga';
  workoutId?: number;
  meditationId?: number;
  yogaId?: number;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  recurringUntil?: string;
  reminderMinutes?: number;
  notes?: string;
}

// Utility functions
const stringToArray = (str: string): string[] => {
  return str ? str.split(',').map(item => item.trim()) : [];
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// CALENDAR SERVICE FUNCTIONS

// Get all scheduled events for a user within a date range
export const getScheduledEvents = async (
  userId: string, 
  startDate?: string, 
  endDate?: string
): Promise<ScheduledEvent[]> => {
  try {
    const whereClause: any = { userId };
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const events = await prisma.scheduledEvent.findMany({
      where: whereClause,
      include: {
        workout: true,
        meditation: true,
        yoga: true
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });

    return events.map((event: any) => ({
      ...event,
      description: event.description || undefined,
      workout: event.workout ? {
        ...event.workout,
        muscleGroups: stringToArray(event.workout.muscleGroups)
      } : null
    })) as ScheduledEvent[];
  } catch (error) {
    console.error('Error fetching scheduled events:', error);
    return [];
  }
};

// Get events for a specific date
export const getEventsForDate = async (userId: string, date: string): Promise<ScheduledEvent[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return getScheduledEvents(userId, startOfDay.toISOString(), endOfDay.toISOString());
};

// Check for scheduling conflicts
export const checkSchedulingConflict = async (
  userId: string,
  date: string,
  time: string,
  duration: number,
  excludeEventId?: string
): Promise<boolean> => {
  try {
    const eventDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    
    const eventStart = new Date(eventDate);
    eventStart.setHours(hours, minutes, 0, 0);
    
    const eventEnd = new Date(eventStart);
    eventEnd.setMinutes(eventEnd.getMinutes() + duration);

    const conflictingEvents = await prisma.scheduledEvent.findMany({
      where: {
        userId,
        date: eventDate,
        ...(excludeEventId && { id: { not: excludeEventId } })
      }
    });

    for (const existingEvent of conflictingEvents) {
      const [existingHours, existingMinutes] = existingEvent.time.split(':').map(Number);
      const existingStart = new Date(existingEvent.date);
      existingStart.setHours(existingHours, existingMinutes, 0, 0);
      
      const existingEnd = new Date(existingStart);
      existingEnd.setMinutes(existingEnd.getMinutes() + existingEvent.duration);

      // Check for overlap
      if (eventStart < existingEnd && eventEnd > existingStart) {
        return true; // Conflict found
      }
    }

    return false; // No conflict
  } catch (error) {
    console.error('Error checking scheduling conflict:', error);
    return true; // Assume conflict on error for safety
  }
};

// Create a single event
export const createScheduledEvent = async (eventData: CreateEventData): Promise<ScheduledEvent | null> => {
  try {
    // Check for conflicts
    const hasConflict = await checkSchedulingConflict(
      eventData.userId,
      eventData.date,
      eventData.time,
      eventData.duration
    );

    if (hasConflict) {
      throw new Error('Scheduling conflict detected');
    }

    // Create the event
    const event = await prisma.scheduledEvent.create({
      data: {
        userId: eventData.userId,
        title: eventData.title,
        description: eventData.description,
        date: new Date(eventData.date),
        time: eventData.time,
        duration: eventData.duration,
        eventType: eventData.eventType,
        workoutId: eventData.workoutId,
        meditationId: eventData.meditationId,
        yogaId: eventData.yogaId,
        isRecurring: eventData.isRecurring || false,
        recurringType: eventData.recurringType,
        recurringUntil: eventData.recurringUntil ? new Date(eventData.recurringUntil) : null,
        reminderMinutes: eventData.reminderMinutes,
        notes: eventData.notes
      },
      include: {
        workout: true,
        meditation: true,
        yoga: true
      }
    });

    return {
      ...event,
      description: event.description || undefined,
      workout: event.workout ? {
        ...event.workout,
        muscleGroups: stringToArray(event.workout.muscleGroups)
      } : null
    } as ScheduledEvent;
  } catch (error) {
    console.error('Error creating scheduled event:', error);
    return null;
  }
};

// Update an event
export const updateScheduledEvent = async (
  eventId: string,
  updateData: Partial<CreateEventData>
): Promise<ScheduledEvent | null> => {
  try {
    // If updating time/date, check for conflicts
    if (updateData.date || updateData.time || updateData.duration) {
      const currentEvent = await prisma.scheduledEvent.findUnique({
        where: { id: eventId }
      });

      if (currentEvent) {
        const checkDate = updateData.date || currentEvent.date.toISOString().split('T')[0];
        const checkTime = updateData.time || currentEvent.time;
        const checkDuration = updateData.duration || currentEvent.duration;

        const hasConflict = await checkSchedulingConflict(
          currentEvent.userId,
          checkDate,
          checkTime,
          checkDuration,
          eventId
        );

        if (hasConflict) {
          throw new Error('Scheduling conflict detected');
        }
      }
    }

    const updatedEvent = await prisma.scheduledEvent.update({
      where: { id: eventId },
      data: {
        ...(updateData.title && { title: updateData.title }),
        ...(updateData.description && { description: updateData.description }),
        ...(updateData.date && { date: new Date(updateData.date) }),
        ...(updateData.time && { time: updateData.time }),
        ...(updateData.duration && { duration: updateData.duration }),
        ...(updateData.notes && { notes: updateData.notes }),
        ...(updateData.reminderMinutes && { reminderMinutes: updateData.reminderMinutes }),
        updatedAt: new Date()
      },
      include: {
        workout: true,
        meditation: true,
        yoga: true
      }
    });

    return {
      ...updatedEvent,
      description: updatedEvent.description || undefined,
      workout: updatedEvent.workout ? {
        ...updatedEvent.workout,
        muscleGroups: stringToArray(updatedEvent.workout.muscleGroups)
      } : null
    } as ScheduledEvent;
  } catch (error) {
    console.error('Error updating scheduled event:', error);
    return null;
  }
};

// Mark event as completed and update streak
export const completeEvent = async (eventId: string): Promise<ScheduledEvent | null> => {
  try {
    const event = await prisma.scheduledEvent.findUnique({
      where: { id: eventId },
      include: { user: true }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Mark event as completed
    const completedEvent = await prisma.scheduledEvent.update({
      where: { id: eventId },
      data: { 
        completed: true,
        updatedAt: new Date()
      },
      include: {
        workout: true,
        meditation: true,
        yoga: true
      }
    });

    // Update workout streak if it's a workout
    if (event.eventType === 'Workout') {
      await updateWorkoutStreak(event.userId);
    }

    // Create workout history entry
    if (event.workoutId) {
      await prisma.workoutHistory.create({
        data: {
          userId: event.userId,
          workoutId: event.workoutId,
          completedAt: new Date(),
          duration: event.duration,
          notes: `Completed from scheduled event: ${event.title}`
        }
      });
    }

    return {
      ...completedEvent,
      description: completedEvent.description || undefined,
      workout: completedEvent.workout ? {
        ...completedEvent.workout,
        muscleGroups: stringToArray(completedEvent.workout.muscleGroups)
      } : null
    } as ScheduledEvent;
  } catch (error) {
    console.error('Error completing event:', error);
    return null;
  }
};

// Mark event as uncompleted
export const uncompleteEvent = async (eventId: string): Promise<ScheduledEvent | null> => {
  try {
    const event = await prisma.scheduledEvent.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Mark event as uncompleted
    const uncompletedEvent = await prisma.scheduledEvent.update({
      where: { id: eventId },
      data: { 
        completed: false,
        updatedAt: new Date()
      },
      include: {
        workout: true,
        meditation: true,
        yoga: true
      }
    });

    return {
      ...uncompletedEvent,
      description: uncompletedEvent.description || undefined,
      workout: uncompletedEvent.workout ? {
        ...uncompletedEvent.workout,
        muscleGroups: stringToArray(uncompletedEvent.workout.muscleGroups)
      } : null
    } as ScheduledEvent;
  } catch (error) {
    console.error('Error uncompleting event:', error);
    return null;
  }
};

// Delete an event
export const deleteScheduledEvent = async (eventId: string): Promise<boolean> => {
  try {
    await prisma.scheduledEvent.delete({
      where: { id: eventId }
    });
    return true;
  } catch (error) {
    console.error('Error deleting scheduled event:', error);
    return false;
  }
};

// STREAK MANAGEMENT FUNCTIONS

// Update workout streak
export const updateWorkoutStreak = async (userId: string): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create streak record
    let streak = await prisma.workoutStreak.findUnique({
      where: { userId }
    });

    if (!streak) {
      streak = await prisma.workoutStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastWorkoutDate: today,
          totalWorkouts: 1,
          streakStartDate: today
        }
      });
      return;
    }

    const lastWorkout = streak.lastWorkoutDate ? new Date(streak.lastWorkoutDate) : null;
    
    if (lastWorkout) {
      lastWorkout.setHours(0, 0, 0, 0);
      const daysSinceLastWorkout = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));

      let newCurrentStreak = streak.currentStreak;
      let newStreakStartDate = streak.streakStartDate;

      if (daysSinceLastWorkout === 0) {
        // Same day, don't update streak
        return;
      } else if (daysSinceLastWorkout === 1) {
        // Consecutive day, increment streak
        newCurrentStreak += 1;
      } else {
        // Streak broken, reset
        newCurrentStreak = 1;
        newStreakStartDate = today;
      }

      await prisma.workoutStreak.update({
        where: { userId },
        data: {
          currentStreak: newCurrentStreak,
          longestStreak: Math.max(streak.longestStreak, newCurrentStreak),
          lastWorkoutDate: today,
          totalWorkouts: streak.totalWorkouts + 1,
          streakStartDate: newStreakStartDate
        }
      });
    }
  } catch (error) {
    console.error('Error updating workout streak:', error);
  }
};

// Get workout streak data
export const getWorkoutStreak = async (userId: string) => {
  try {
    return await prisma.workoutStreak.findUnique({
      where: { userId }
    });
  } catch (error) {
    console.error('Error fetching workout streak:', error);
    return null;
  }
};

// Get calendar statistics
export const getCalendarStats = async (userId: string, month: number, year: number) => {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const events = await prisma.scheduledEvent.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const completedEvents = events.filter(event => event.completed);
    const workoutEvents = events.filter(event => event.eventType === 'Workout');
    const completedWorkouts = workoutEvents.filter(event => event.completed);

    return {
      totalEvents: events.length,
      completedEvents: completedEvents.length,
      totalWorkouts: workoutEvents.length,
      completedWorkouts: completedWorkouts.length,
      completionRate: events.length > 0 ? Math.min(100, Math.round((completedEvents.length / events.length) * 100)) : 0,
      workoutCompletionRate: workoutEvents.length > 0 ? Math.min(100, Math.round((completedWorkouts.length / workoutEvents.length) * 100)) : 0
    };
  } catch (error) {
    console.error('Error fetching calendar stats:', error);
    return null;
  }
};

// Legacy functions for backward compatibility
export const getScheduledWorkouts = async (userId: string) => {
  const events = await getScheduledEvents(userId);
  return events.filter(event => event.eventType === 'Workout');
};

export const scheduleWorkout = async (
  userId: string,
  workout: any,
  date: string,
  time: string
) => {
  return createScheduledEvent({
    userId,
    title: workout.title,
    date,
    time,
    duration: workout.duration,
    eventType: 'Workout',
    workoutId: workout.id
  });
};

export const isWorkoutScheduledForDate = async (
  userId: string,
  workoutId: number,
  date: string
): Promise<boolean> => {
  const events = await getEventsForDate(userId, date);
  return events.some(event => event.workoutId === workoutId);
}; 