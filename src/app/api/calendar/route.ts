import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  getScheduledEvents, 
  createScheduledEvent, 
  updateScheduledEvent,
  completeEvent,
  uncompleteEvent,
  deleteScheduledEvent,
  getCalendarStats,
  checkSchedulingConflict
} from '@/lib/db/models/calendarService';

// GET - Fetch calendar events
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const eventType = searchParams.get('eventType');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // Build date range for service call
    let dateStart: string | undefined;
    let dateEnd: string | undefined;

    if (startDate && endDate) {
      dateStart = startDate;
      dateEnd = endDate;
    } else if (month && year) {
      const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
      dateStart = startOfMonth.toISOString();
      dateEnd = endOfMonth.toISOString();
    }

    // Fetch events using service
    const events = await getScheduledEvents(session.user.id, dateStart, dateEnd);

    // Filter by event type if specified
    const filteredEvents = eventType 
      ? events.filter((event: any) => event.eventType === eventType)
      : events;

    // Get calendar statistics
    const stats = month && year 
      ? await getCalendarStats(session.user.id, parseInt(month), parseInt(year))
      : {
          totalEvents: filteredEvents.length,
          completedEvents: filteredEvents.filter((event: any) => event.completed).length,
          totalWorkouts: filteredEvents.filter((event: any) => event.eventType === 'Workout').length,
          completedWorkouts: filteredEvents.filter((event: any) => event.eventType === 'Workout' && event.completed).length,
          completionRate: filteredEvents.length > 0 ? Math.round((filteredEvents.filter((event: any) => event.completed).length / filteredEvents.length) * 100) : 0,
          workoutCompletionRate: 0
        };

    return NextResponse.json({
      success: true,
      data: filteredEvents,
      stats
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}

// POST - Create a new calendar event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      date, 
      time, 
      duration, 
      eventType, 
      workoutId, 
      meditationId, 
      yogaId,
      reminderMinutes,
      notes
    } = body;

    // Validation
    if (!title || !date || !time || !duration || !eventType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, date, time, duration, eventType' },
        { status: 400 }
      );
    }

    // Validate date format
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Check if date is in the past (allow today)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (eventDate < today) {
      return NextResponse.json(
        { success: false, error: 'Cannot schedule events in the past' },
        { status: 400 }
      );
    }

    // Validate time format
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return NextResponse.json(
        { success: false, error: 'Invalid time format. Use HH:MM (24-hour format)' },
        { status: 400 }
      );
    }

    // Check for scheduling conflicts using service
    const hasConflict = await checkSchedulingConflict(
      session.user.id,
      date,
      time,
      parseInt(duration)
    );

    if (hasConflict) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Scheduling conflict detected. Please choose a different time.'
        },
        { status: 409 }
      );
    }

    // Create the event using service
    const newEvent = await createScheduledEvent({
      userId: session.user.id,
      title,
      description,
      date,
      time,
      duration: parseInt(duration),
      eventType: eventType as 'Workout' | 'Meditation' | 'Yoga',
      workoutId: workoutId ? parseInt(workoutId) : undefined,
      meditationId: meditationId ? parseInt(meditationId) : undefined,
      yogaId: yogaId ? parseInt(yogaId) : undefined,
      reminderMinutes: reminderMinutes ? parseInt(reminderMinutes) : undefined,
      notes
    });

    if (!newEvent) {
      return NextResponse.json(
        { success: false, error: 'Failed to create event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Event scheduled successfully'
    });

  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}

// PUT - Update/Complete a calendar event
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    let updatedEvent;

    switch (action) {
      case 'complete':
        updatedEvent = await completeEvent(id);
        if (!updatedEvent) {
          return NextResponse.json(
            { success: false, error: 'Event not found or access denied' },
            { status: 404 }
          );
        }
        break;

      case 'uncomplete':
        updatedEvent = await uncompleteEvent(id);
        if (!updatedEvent) {
          return NextResponse.json(
            { success: false, error: 'Event not found or access denied' },
            { status: 404 }
          );
        }
        break;

      case 'update':
        updatedEvent = await updateScheduledEvent(id, updateData);
        if (!updatedEvent) {
          return NextResponse.json(
            { success: false, error: 'Event not found, access denied, or scheduling conflict' },
            { status: 404 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: complete, uncomplete, or update' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      message: `Event ${action}d successfully`
    });

  } catch (error) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update calendar event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a calendar event
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const success = await deleteScheduledEvent(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Event not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete calendar event' },
      { status: 500 }
    );
  }
}

 