import React from 'react'
import { CalendarIcon, CheckCircleIcon } from 'lucide-react'
const WorkoutSummaryCard: React.FC = () => {
  const workouts = [
    {
      id: 1,
      name: 'Upper Body Strength',
      completed: true,
      date: 'Today',
      time: '06:30 AM',
    },
    {
      id: 2,
      name: 'HIIT Cardio',
      completed: false,
      date: 'Tomorrow',
      time: '07:00 AM',
    },
    {
      id: 3,
      name: 'Lower Body Focus',
      completed: false,
      date: 'Wed, Jun 15',
      time: '06:30 AM',
    },
  ]
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Workout Plan</h2>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className={`p-3 rounded-lg border ${workout.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-800">{workout.name}</h3>
              {workout.completed ? (
                <span className="text-green-500 flex items-center">
                  <CheckCircleIcon size={16} className="mr-1" />
                  <span className="text-sm">Completed</span>
                </span>
              ) : (
                <span className="text-gray-500 text-sm">Upcoming</span>
              )}
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <CalendarIcon size={14} className="mr-1" />
              <span>
                {workout.date} • {workout.time}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
        View Full Schedule
      </button>
    </div>
  )
}
export default WorkoutSummaryCard
