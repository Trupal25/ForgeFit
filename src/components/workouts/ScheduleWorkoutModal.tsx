"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { WorkoutItem } from '@/components/workouts/WorkoutCard';
import { Calendar, Clock, X } from 'lucide-react';

interface ScheduleWorkoutModalProps {
  workout: WorkoutItem;
  isOpen: boolean;
  onClose: () => void;
  onScheduled: (scheduleData: { date: string; time: string }) => void;
}

export function ScheduleWorkoutModal({ 
  workout, 
  isOpen, 
  onClose, 
  onScheduled 
}: ScheduleWorkoutModalProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onScheduled({
        date: selectedDate,
        time: selectedTime
      });
      
      // Reset form
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setSelectedTime('08:00');
    } catch (error) {
      console.error('Error scheduling workout:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Schedule Workout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Workout Info */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{workout.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{workout.duration} minutes</span>
              </div>
              <span>•</span>
              <span>{workout.difficulty}</span>
              <span>•</span>
              <span>{workout.calories} calories</span>
            </div>
          </div>
          
          {/* Date Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Calendar className="text-gray-400" size={18} />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          {/* Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Clock className="text-gray-400" size={18} />
              </div>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          {/* Preview */}
          {selectedDate && selectedTime && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Schedule Preview</h4>
              <p className="text-blue-800 text-sm">
                {workout.title} on {format(new Date(selectedDate), 'EEEE, MMMM do, yyyy')} at {selectedTime}
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 