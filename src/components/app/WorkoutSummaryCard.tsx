import React, { useState, useEffect } from 'react'
import { CalendarIcon, CheckCircleIcon, Plus, Clock } from 'lucide-react'
import Link from 'next/link'

interface WorkoutSummaryCardProps {
  dashboardData?: any;
}

const WorkoutSummaryCard: React.FC<WorkoutSummaryCardProps> = ({ dashboardData }) => {
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dashboardData?.upcomingWorkouts) {
      setUpcomingWorkouts(dashboardData.upcomingWorkouts);
    }
  }, [dashboardData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const markAsCompleted = async (eventId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, completed: true })
      });
      
      if (response.ok) {
        setUpcomingWorkouts(prev => 
          prev.filter(workout => workout.id !== eventId)
        );
      }
    } catch (error) {
      console.error('Error marking workout as completed:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Workout Plan</h2>
        <Link href="/workouts" className="text-blue-600 hover:text-blue-800">
          <Plus size={20} />
        </Link>
      </div>
      
      <div className="space-y-4">
        {upcomingWorkouts.length > 0 ? (
          upcomingWorkouts.slice(0, 3).map((workout) => (
            <div
              key={workout.id}
              className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">
                    {workout.workout?.title || workout.title}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <CalendarIcon size={14} className="mr-1" />
                    <span>
                      {formatDate(workout.date)} • {workout.time}
                    </span>
                    {workout.duration && (
                      <>
                        <Clock size={14} className="ml-3 mr-1" />
                        <span>{workout.duration} min</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => markAsCompleted(workout.id)}
                  disabled={loading}
                  className="ml-2 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors disabled:opacity-50"
                >
                  ✓ Done
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No workouts scheduled</p>
            <p className="text-xs text-gray-400">Schedule workouts to see them here</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 mt-4">
        <Link 
          href="/workouts"
          className="flex-1 py-2 text-center text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
        >
          Browse Workouts
        </Link>
        <Link 
          href="/calendar"
          className="flex-1 py-2 text-center text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors"
        >
          View Calendar
        </Link>
      </div>
    </div>
  )
}
export default WorkoutSummaryCard
