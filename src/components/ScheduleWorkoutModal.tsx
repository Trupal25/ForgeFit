import React, { useState } from 'react';
import { X } from 'lucide-react';
import { scheduleWorkout } from '@/lib/schedulingService';
import { WorkoutItem } from '@/components/workouts/WorkoutCard';

interface ScheduleWorkoutModalProps {
  workout: WorkoutItem | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduled?: () => void;
}

const ScheduleWorkoutModal: React.FC<ScheduleWorkoutModalProps> = ({
  workout,
  isOpen,
  onClose,
  onScheduled,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  if (!isOpen || !workout) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check that we have both date and time
    if (!date || !time) {
      alert('Please select both a date and time');
      return;
    }
    
    // Use the scheduleWorkout function from schedulingService
    scheduleWorkout(workout, date, time);
    
    // Call any additional callback if provided
    if (onScheduled) {
      onScheduled();
    }
    
    // Close the modal
    onClose();
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-6">Schedule Workout</h2>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-800">{workout.title}</h3>
          <p className="text-sm text-gray-500">{workout.duration} min • {workout.category}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleWorkoutModal; 