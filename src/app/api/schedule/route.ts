import { NextRequest, NextResponse } from 'next/server';

interface ScheduledWorkout {
  id: string;
  workoutId: number;
  date: string;
  time: string;
  userId?: string;
  completed: boolean;
  createdAt: string;
}

// Mock scheduled workouts (replace with database)
let scheduledWorkouts: ScheduledWorkout[] = [];

// GET - Fetch scheduled workouts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');
    
    let filteredWorkouts = [...scheduledWorkouts];
    
    // Filter by user if provided
    if (userId) {
      filteredWorkouts = filteredWorkouts.filter(workout => workout.userId === userId);
    }
    
    // Filter by date if provided
    if (date) {
      filteredWorkouts = filteredWorkouts.filter(workout => workout.date === date);
    }
    
    // Sort by date and time
    filteredWorkouts.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json({
      success: true,
      data: filteredWorkouts,
      total: filteredWorkouts.length
    });

  } catch (error) {
    console.error('Error fetching scheduled workouts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scheduled workouts' },
      { status: 500 }
    );
  }
}

// POST - Schedule a new workout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workoutId, date, time, userId } = body;

    if (!workoutId || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Workout ID, date, and time are required' },
        { status: 400 }
      );
    }

    // Validate date format
    const workoutDate = new Date(date);
    if (isNaN(workoutDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Check if date is in the future
    const now = new Date();
    const scheduledDateTime = new Date(`${date}T${time}`);
    if (scheduledDateTime <= now) {
      return NextResponse.json(
        { success: false, error: 'Cannot schedule workouts in the past' },
        { status: 400 }
      );
    }

    // Check for conflicts (same time slot)
    const existingSchedule = scheduledWorkouts.find(workout => 
      workout.date === date && 
      workout.time === time && 
      workout.userId === userId
    );

    if (existingSchedule) {
      return NextResponse.json(
        { success: false, error: 'You already have a workout scheduled at this time' },
        { status: 409 }
      );
    }

    // Create new scheduled workout
    const newScheduledWorkout: ScheduledWorkout = {
      id: `schedule_${Date.now()}`,
      workoutId: parseInt(workoutId),
      date,
      time,
      userId: userId || 'default_user',
      completed: false,
      createdAt: new Date().toISOString()
    };

    scheduledWorkouts.push(newScheduledWorkout);

    // In a real app, you would:
    // 1. Save to database
    // 2. Send calendar invite
    // 3. Set up notifications

    return NextResponse.json({
      success: true,
      data: newScheduledWorkout,
      message: 'Workout scheduled successfully'
    });

  } catch (error) {
    console.error('Error scheduling workout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to schedule workout' },
      { status: 500 }
    );
  }
}

// PUT - Update scheduled workout (mark as completed, reschedule, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: 'Schedule ID and action are required' },
        { status: 400 }
      );
    }

    const scheduleIndex = scheduledWorkouts.findIndex(workout => workout.id === id);
    if (scheduleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Scheduled workout not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'complete':
        scheduledWorkouts[scheduleIndex].completed = true;
        break;
      
      case 'reschedule':
        if (!updateData.date || !updateData.time) {
          return NextResponse.json(
            { success: false, error: 'New date and time are required for rescheduling' },
            { status: 400 }
          );
        }
        scheduledWorkouts[scheduleIndex].date = updateData.date;
        scheduledWorkouts[scheduleIndex].time = updateData.time;
        break;
      
      case 'cancel':
        scheduledWorkouts.splice(scheduleIndex, 1);
        return NextResponse.json({
          success: true,
          message: 'Workout cancelled successfully'
        });
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: scheduledWorkouts[scheduleIndex],
      message: `Workout ${action}d successfully`
    });

  } catch (error) {
    console.error('Error updating scheduled workout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update scheduled workout' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/delete scheduled workout
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    const scheduleIndex = scheduledWorkouts.findIndex(workout => workout.id === id);
    if (scheduleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Scheduled workout not found' },
        { status: 404 }
      );
    }

    scheduledWorkouts.splice(scheduleIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Scheduled workout deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting scheduled workout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete scheduled workout' },
      { status: 500 }
    );
  }
} 