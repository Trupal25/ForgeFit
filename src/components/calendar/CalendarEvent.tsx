"use client";

import React from 'react';
import { Dumbbell, Clock, X, Edit } from 'lucide-react';

export interface ScheduledWorkout {
  id: string;
  workoutId: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  category: string;
  completed?: boolean;
}

interface CalendarEventProps {
  event: ScheduledWorkout;
  onDelete?: (id: string) => void;
  onEdit?: (event: ScheduledWorkout) => void;
  onComplete?: (id: string, completed: boolean) => void;
  detailed?: boolean;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({
  event,
  onDelete,
  onEdit,
  onComplete,
  detailed = false,
}) => {
  // Format time from 24hr to 12hr format with AM/PM
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onComplete) {
      onComplete(event.id, !event.completed);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(event.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(event);
    }
  };

  return (
    <div 
      className={`
        p-3 rounded-md border mb-2 cursor-pointer hover:shadow-md transition-shadow
        ${event.completed ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}
        ${detailed ? 'flex flex-col' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          <Dumbbell 
            size={16} 
            className={event.completed ? 'text-green-500' : 'text-blue-500'} 
          />
          <div>
            <h4 className="font-medium text-sm">{event.title}</h4>
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <Clock size={12} />
              <span>{formatTime(event.time)}</span>
              <span>•</span>
              <span>{event.duration} min</span>
            </div>
            {detailed && (
              <p className="text-xs text-gray-500 mt-1">{event.category}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          {onComplete && (
            <button
              onClick={handleComplete}
              className={`
                p-0.5 rounded hover:bg-opacity-80
                ${event.completed ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}
              `}
              title={event.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title="Edit event"
            >
              <Edit size={14} />
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-0.5 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100"
              title="Remove from calendar"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarEvent; 