"use client";
// Major todo figure out the calendar part and make this dynamic and refactor calendar component
import React from 'react';
import { Calendar, Clock, Plus } from 'lucide-react';

export default function CalendarPage() {
  // Mock calendar data
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentDay = 22;
  
  // Mock scheduled workouts
  const scheduledWorkouts = [
    { day: 22, name: "Full Body Strength", time: "07:00 AM", duration: 45 },
    { day: 24, name: "HIIT Cardio", time: "06:30 AM", duration: 30 },
    { day: 26, name: "Upper Body Focus", time: "07:00 AM", duration: 35 },
    { day: 28, name: "Yoga Flow", time: "08:00 AM", duration: 50 },
  ];

  // TODO: Change from hardcoded to fetching from database
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Workout Calendar</h1>
        <p className="text-gray-600">Schedule and track your workout sessions.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="lg:w-2/3 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">April 2025</h2>
            {/* fetch  from db */}
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                &#8592; {/* Left arrow */}
              </button>
              {/* here too */}
              <button className="p-2 rounded-lg hover:bg-gray-100">
                &#8594; {/* Right arrow */}
              </button>
            </div>
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Days of week headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {/* Empty cells for days before the month starts (example: first day is Wednesday) */}
            {Array.from({ length: 2 }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square p-1"></div>
            ))}
            
            {/* Days of the month */}
            {days.map((day) => {
              const hasWorkout = scheduledWorkouts.some(workout => workout.day === day);
              
              return (
                <div
                  key={day}
                  className={`aspect-square p-1 rounded-lg ${
                    day === currentDay
                      ? 'bg-blue-100'
                      : hasWorkout
                      ? 'bg-blue-50'
                      : ''
                  }`}
                >
                  <div className="h-full w-full flex flex-col items-center justify-center relative">
                    <span
                      className={`${
                        day === currentDay ? 'font-bold text-blue-700' : ''
                      }`}
                    >
                      {day}
                    </span>
                    {hasWorkout && (
                      <div className="absolute bottom-0 w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Scheduled workouts */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Scheduled Workouts</h2>
            <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
              <Plus size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            {scheduledWorkouts.map((workout, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{workout.name}</h3>
                    <div className="flex items-center mt-2 text-gray-500 text-sm">
                      <Calendar size={14} className="mr-1" />
                      <span>April {workout.day}, 2025</span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-500 text-sm">
                      <Clock size={14} className="mr-1" />
                      <span>{workout.time} • {workout.duration} min</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-blue-500">Edit</button>
                    <button className="text-gray-400 hover:text-red-500">Cancel</button>
                  </div>
                </div>
              </div>
            ))}
            
            {scheduledWorkouts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={36} className="mx-auto mb-2 opacity-50" />
                <p>No workouts scheduled</p>
                <button className="mt-2 text-blue-600 font-medium">Schedule a workout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 