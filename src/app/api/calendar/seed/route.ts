import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get some workouts to schedule
    const workouts = await prisma.workout.findMany({
      take: 10,
      orderBy: { id: 'asc' }
    });

    if (workouts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No workouts found. Please create workouts first.' },
        { status: 400 }
      );
    }

    // Clear existing events for this user (optional)
    await prisma.scheduledEvent.deleteMany({
      where: { userId: session.user.id }
    });

    // Clear existing streak data
    await prisma.workoutStreak.deleteMany({
      where: { userId: session.user.id }
    });

    const today = new Date();
    const events = [];

    // Create events for the past 2 weeks and next 2 weeks
    for (let i = -14; i <= 14; i++) {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + i);
      
      // Skip some days randomly to make it realistic
      if (Math.random() < 0.6) { // 60% chance of having an event
        const workout = workouts[Math.floor(Math.random() * workouts.length)];
        
        // Random time between 6 AM and 8 PM
        const hour = Math.floor(Math.random() * 14) + 6; // 6-19 (6 AM - 7 PM)
        const minute = Math.random() < 0.5 ? 0 : 30; // Either :00 or :30
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Past events have a 80% chance of being completed
        const isPastEvent = eventDate < today;
        const completed = isPastEvent ? Math.random() < 0.8 : false;
        
        events.push({
          userId: session.user.id,
          title: workout.title,
          description: `Scheduled ${workout.category} workout`,
          date: eventDate,
          time,
          duration: workout.duration,
          eventType: 'Workout',
          workoutId: workout.id,
          completed,
          reminderMinutes: 15
        });
      }
    }

    // Add some meditation and yoga sessions
    const additionalEvents = [
      {
        userId: session.user.id,
        title: 'Morning Meditation',
        description: 'Start the day with mindfulness',
        date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        time: '07:00',
        duration: 20,
        eventType: 'Meditation',
        completed: false,
        reminderMinutes: 10
      },
      {
        userId: session.user.id,
        title: 'Evening Yoga',
        description: 'Relaxing yoga session',
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        time: '19:00',
        duration: 45,
        eventType: 'Yoga',
        completed: false,
        reminderMinutes: 15
      },
      {
        userId: session.user.id,
        title: 'Rest Day Stretching',
        description: 'Light stretching and recovery',
        date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        time: '18:00',
        duration: 30,
        eventType: 'Yoga',
        completed: false,
        reminderMinutes: 5
      }
    ];

    events.push(...additionalEvents);

    // Create all events
    const createdEvents = await Promise.all(
      events.map(event => 
        prisma.scheduledEvent.create({
          data: event,
          include: {
            workout: true
          }
        })
      )
    );

    // Create initial streak data
    const completedWorkouts = createdEvents.filter(event => 
      event.eventType === 'Workout' && event.completed
    );

    if (completedWorkouts.length > 0) {
      // Calculate streak from completed workouts
      const workoutDates = completedWorkouts
        .map(workout => new Date(workout.date))
        .sort((a, b) => b.getTime() - a.getTime());

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Calculate current streak (from today backwards)
      const todayCheck = new Date(today);
      todayCheck.setHours(0, 0, 0, 0);
      
      for (let i = 0; i <= 14; i++) {
        const checkDate = new Date(todayCheck);
        checkDate.setDate(todayCheck.getDate() - i);
        
        const hasWorkout = workoutDates.some(date => {
          const workoutDate = new Date(date);
          workoutDate.setHours(0, 0, 0, 0);
          return workoutDate.getTime() === checkDate.getTime();
        });

        if (hasWorkout) {
          if (i === 0 || currentStreak > 0) { // Either today or consecutive
            currentStreak++;
          }
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          if (i === 0) { // No workout today, current streak is 0
            currentStreak = 0;
          }
          tempStreak = 0;
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

      await prisma.workoutStreak.create({
        data: {
          userId: session.user.id,
          currentStreak,
          longestStreak,
          totalWorkouts: completedWorkouts.length,
          lastWorkoutDate: workoutDates.length > 0 ? workoutDates[0] : null,
          streakStartDate: currentStreak > 0 ? new Date(todayCheck.getTime() - (currentStreak - 1) * 24 * 60 * 60 * 1000) : null,
          weeklyGoal: 4
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Created ${events.length} sample calendar events`,
      data: {
        totalEvents: events.length,
        workoutEvents: events.filter(e => e.eventType === 'Workout').length,
        meditationEvents: events.filter(e => e.eventType === 'Meditation').length,
        yogaEvents: events.filter(e => e.eventType === 'Yoga').length,
        completedEvents: events.filter(e => e.completed).length
      }
    });

  } catch (error) {
    console.error('Error seeding calendar data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed calendar data' },
      { status: 500 }
    );
  }
} 