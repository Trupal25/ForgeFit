"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell,
  Brain,
  Heart,
  CheckCircle,
  Circle,
  Flame,
  Target
} from 'lucide-react';
import EventSchedulingModal from './EventSchedulingModal';

interface ScheduledEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  duration: number;
  eventType: string;
  completed: boolean;
  workoutId?: number;
  workout?: {
    id: number;
    title: string;
    category: string;
    difficulty: string;
    calories: number;
    muscleGroups: string[];
  };
}

interface CalendarStats {
  totalEvents: number;
  completedEvents: number;
  totalWorkouts: number;
  completedWorkouts: number;
  completionRate: number;
  workoutCompletionRate: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  weeklyGoal: number;
  thisWeeksWorkouts: number;
  weeklyProgress: number;
}

const CalendarView: React.FC = () => {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [stats, setStats] = useState<CalendarStats | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [completingEvents, setCompletingEvents] = useState<Set<string>>(new Set());

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthYearKey = `${currentMonth}-${currentYear}`;

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Check if data is stale (older than 2 minutes)
  const isDataStale = useCallback(() => {
    if (!lastFetched) return true;
    const lastFetchTime = new Date(lastFetched).getTime();
    const now = new Date().getTime();
    return (now - lastFetchTime) > 2 * 60 * 1000; // 2 minutes
  }, [lastFetched]);

  const fetchCalendarData = useCallback(async (force = false) => {
    // Don't fetch if we have fresh data for this month, unless forced
    if (!force && lastFetched === monthYearKey && !isDataStale()) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/calendar?month=${currentMonth + 1}&year=${currentYear}`
      );
      
      if (response.ok) {
        const result = await response.json();
        setEvents(result.data.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        })));
        setStats(result.stats);
        setLastFetched(monthYearKey); // Mark this month as fetched
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear, monthYearKey, lastFetched, isDataStale]);

  const fetchStreakData = useCallback(async () => {
    try {
      const response = await fetch('/api/calendar/streak');
      if (response.ok) {
        const result = await response.json();
        setStreakData(result.data);
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      // Only fetch if we don't have data for this month or data is stale
      const needsRefresh = lastFetched !== monthYearKey || isDataStale();
      if (needsRefresh) {
        fetchCalendarData(true); // Force fetch for new month or stale data
      }
      
      // Always fetch streak data if we don't have it yet
      if (!streakData) {
        fetchStreakData();
      }
    }
  }, [session, monthYearKey, fetchCalendarData, fetchStreakData, streakData, lastFetched, isDataStale]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDate = (day: number): ScheduledEvent[] => {
    const targetDate = new Date(currentYear, currentMonth, day);
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === targetDate.toDateString();
    });
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    const targetDate = new Date(currentYear, currentMonth, day);
    return targetDate.toDateString() === today.toDateString();
  };

  const isPastDate = (day: number): boolean => {
    const today = new Date();
    const targetDate = new Date(currentYear, currentMonth, day);
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate < today;
  };

  const getEventIcon = (eventType: string, completed: boolean) => {
    const iconProps = { size: 12, className: completed ? 'text-green-600' : 'text-blue-600' };
    
    switch (eventType) {
      case 'Workout':
        return <Dumbbell {...iconProps} />;
      case 'Meditation':
        return <Brain {...iconProps} />;
      case 'Yoga':
        return <Heart {...iconProps} />;
      default:
        return <Calendar {...iconProps} />;
    }
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(selectedDate);
    setShowEventModal(true);
  };

  const completeEvent = async (eventId: string) => {
    // Check if event was already completed BEFORE optimistic update
    const originalEvent = events.find(e => e.id === eventId);
    const wasAlreadyCompleted = originalEvent?.completed === true;
    const isWorkout = originalEvent?.eventType === 'Workout';
    
    // Don't do anything if already completed
    if (wasAlreadyCompleted) {
      return;
    }
    
    // Optimistic update - immediately mark as completed
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, completed: true }
          : event
      )
    );
    
    // Add to completing set
    setCompletingEvents(prev => new Set(prev).add(eventId));
    
    try {
      const response = await fetch('/api/calendar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: eventId,
          action: 'complete'
        })
      });

      if (response.ok) {
        // Success - only fetch updated streak data in background (no need to refetch calendar data)
        fetchStreakData();
        
        // Update stats optimistically (we know event wasn't completed since we checked above)
        if (stats) {
          setStats(prevStats => ({
            ...prevStats!,
            completedEvents: prevStats!.completedEvents + 1,
            completedWorkouts: isWorkout ? prevStats!.completedWorkouts + 1 : prevStats!.completedWorkouts,
            completionRate: prevStats!.totalEvents > 0 
              ? Math.min(100, Math.round(((prevStats!.completedEvents + 1) / prevStats!.totalEvents) * 100))
              : 0,
            workoutCompletionRate: prevStats!.totalWorkouts > 0 
              ? Math.min(100, Math.round(((isWorkout ? prevStats!.completedWorkouts + 1 : prevStats!.completedWorkouts) / prevStats!.totalWorkouts) * 100))
              : 0
          }));
        }
      } else {
        // Rollback on failure
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, completed: false }
              : event
          )
        );
        
        throw new Error('Failed to complete event');
      }
    } catch (error) {
      console.error('Error completing event:', error);
      
      // Rollback optimistic update
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, completed: false }
            : event
        )
      );
    } finally {
      // Remove from completing set
      setCompletingEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  // Only show loading skeleton if we have no data AND we're loading
  if (loading && events.length === 0) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }, (_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Workout Calendar</h1>
            <p className="text-gray-600">Schedule and track your fitness journey.</p>
          </div>
          
          {/* Test Seed Button */}
          {(!events || events.length === 0) && (
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/calendar/seed', { method: 'POST' });
                  if (response.ok) {
                    await fetchCalendarData();
                    await fetchStreakData();
                    alert('Sample calendar data created!');
                  } else {
                    alert('Failed to create sample data');
                  }
                } catch (error) {
                  console.error('Error seeding calendar:', error);
                  alert('Error creating sample data');
                }
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
            >
              Create Sample Data
            </button>
          )}
        </div>
        
        {/* Stats and Streak */}
        {(stats || streakData) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {streakData && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="text-orange-500" size={20} />
                  <span className="font-semibold text-orange-700">Current Streak</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {streakData.currentStreak} days
                </div>
                <div className="text-sm text-orange-600">
                  Best: {streakData.longestStreak} days
                </div>
              </div>
            )}
            
            {streakData && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="text-blue-500" size={20} />
                  <span className="font-semibold text-blue-700">Weekly Goal</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {streakData.thisWeeksWorkouts}/{streakData.weeklyGoal}
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(streakData.weeklyProgress, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {stats && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="font-semibold text-green-700">This Month</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.min(100, Math.round(stats.completionRate))}%
                </div>
                <div className="text-sm text-green-600">
                  {stats.completedEvents}/{stats.totalEvents} completed
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid */}
        <div className="lg:w-2/3 bg-white rounded-xl shadow-sm p-6">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="text-center font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={index} className="aspect-square p-1"></div>;
              }
              
              const dayEvents = getEventsForDate(day);
              const hasEvents = dayEvents.length > 0;
              const hasCompletedWorkout = dayEvents.some(event => 
                event.eventType === 'Workout' && event.completed
              );
              
              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square p-1 rounded-lg cursor-pointer transition-colors ${
                    isToday(day)
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : hasEvents
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : 'hover:bg-gray-50'
                  } ${isPastDate(day) ? 'opacity-60' : ''}`}
                >
                  <div className="h-full w-full flex flex-col items-center justify-start p-1">
                    <span className={`text-sm ${
                      isToday(day) ? 'font-bold text-blue-700' : ''
                    }`}>
                      {day}
                    </span>
                    
                    {/* Event indicators */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayEvents.slice(0, 3).map((event, eventIndex) => (
                        <div 
                          key={eventIndex}
                          className={`w-2 h-2 rounded-full ${
                            event.completed ? 'bg-green-500' : 'bg-blue-400'
                          }`}
                          title={`${event.title} - ${event.time}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="w-2 h-2 rounded-full bg-gray-400" title={`+${dayEvents.length - 3} more`} />
                      )}
                    </div>
                    
                    {/* Streak indicator */}
                    {hasCompletedWorkout && (
                      <Flame size={10} className="text-orange-500 mt-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Scheduled Events Sidebar */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <button 
              onClick={() => setShowEventModal(true)}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            {events
              .filter(event => {
                const eventDate = new Date(event.date);
                const today = new Date();
                return eventDate >= today;
              })
              .slice(0, 10)
              .map((event) => (
                <div 
                  key={event.id} 
                  className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getEventIcon(event.eventType, event.completed)}
                        <h3 className="font-medium">{event.title}</h3>
                      </div>
                      
                      <div className="flex items-center mt-2 text-gray-500 text-sm">
                        <Calendar size={14} className="mr-1" />
                        <span>{event.date.toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center mt-1 text-gray-500 text-sm">
                        <Clock size={14} className="mr-1" />
                        <span>{event.time} • {event.duration} min</span>
                      </div>
                      
                      {event.workout && (
                        <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {event.workout.category} • {event.workout.calories} cal
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      {!event.completed && !isPastDate(new Date(event.date).getDate()) && (
                        <button 
                          onClick={() => completeEvent(event.id)}
                          disabled={completingEvents.has(event.id)}
                          className="text-green-600 hover:text-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Mark as completed"
                        >
                          {completingEvents.has(event.id) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-600 border-t-transparent" />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                      )}
                      
                      {event.completed && (
                        <CheckCircle size={20} className="text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            
            {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={36} className="mx-auto mb-2 opacity-50" />
                <p>No upcoming events</p>
                <button 
                  onClick={() => setShowEventModal(true)}
                  className="mt-2 text-blue-600 font-medium hover:text-blue-700"
                >
                  Schedule a workout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Event Scheduling Modal */}
      {showEventModal && (
        <EventSchedulingModal 
          selectedDate={selectedDate}
          onClose={() => setShowEventModal(false)}
          onEventCreated={() => {
            setShowEventModal(false);
            fetchCalendarData(true); // Force refresh after creating event
          }}
        />
      )}
    </div>
  );
};

export default CalendarView; 