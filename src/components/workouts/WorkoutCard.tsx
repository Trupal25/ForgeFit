"use client";

import React from 'react';
import { Clock, Flame, BarChart, Star, Heart } from 'lucide-react';
import Card from '@/components/ui/Card';

export interface WorkoutExercise {
  id: number;
  sets: number | null;
  reps: string | null;
  weight: number | null;
  restTime: number | null;
  notes: string | null;
  order: number;
  exercise: {
    id: number;
    name: string;
    description: string;
    muscleGroups: string[];
    equipment: string;
    difficultyLevel: string;
    imageUrl: string | null;
  };
}

export interface WorkoutItem {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  duration: number;
  calories: number;
  muscleGroups: string;
  imageUrl: string | null;
  videoUrl: string | null;
  rating: number;
  ratingCount: number;
  description: string;
  exercises: WorkoutExercise[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

interface WorkoutCardProps {
  workout: WorkoutItem;
  onToggleFavorite: (id: number) => void;
  onSelect?: (workout: WorkoutItem) => void;
  onEdit?: (workout: WorkoutItem) => void;
  onDelete?: (workout: WorkoutItem) => void;
  onSchedule?: (workout: WorkoutItem) => void;
  onStartWorkout?: (workout: WorkoutItem) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onToggleFavorite,
  onSelect,
  onEdit,
  onDelete,
  onSchedule,
  onStartWorkout,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(workout.id);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(workout);
    }
  };

  return (
    <Card className="h-full ">
      <div 
        className="p-5 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col h-full"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{workout.title}</h3>
            <span className="text-sm text-gray-500">{workout.category} • {workout.difficulty}</span>
          </div>
          <button 
            className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
            onClick={handleFavoriteClick}
            aria-label={workout.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              size={20} 
              fill={workout.isFavorite ? "#ef4444" : "none"} 
              stroke={workout.isFavorite ? "#ef4444" : "currentColor"} 
            />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2 flex-shrink-0">{workout.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
          {workout.muscleGroups.split(',').map((group, index) => (
            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
              {group.trim()}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock size={16} />
              <span className="text-sm">{workout.duration} min</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Flame size={16} />
              <span className="text-sm">{workout.calories} cal</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <BarChart size={16} />
              <span className="text-sm">{workout.exercises.length} exercises</span>
            </div>
          </div>
          
          {workout.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{workout.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Exercise Preview */}
        {workout.exercises.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex-grow">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h4>
            <div className="space-y-2 mb-4">
              {workout.exercises.slice(0, 3).map((exercise) => (
                <div key={exercise.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 truncate flex-1 mr-2">{exercise.exercise.name}</span>
                  <span className="text-gray-500 flex-shrink-0">
                    {exercise.sets}x{exercise.reps}
                  </span>
                </div>
              ))}
              {workout.exercises.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{workout.exercises.length - 3} more exercises
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto flex flex-wrap gap-2">
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(workout);
              }}
              className="flex-1 min-w-[80px] px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
          
          {onDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(workout);
              }}
              className="flex-1 min-w-[80px] px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
          
          {onSchedule && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSchedule(workout);
              }}
              className="flex-1 min-w-[80px] px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors"
            >
              Schedule
            </button>
          )}
          
          {onStartWorkout && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onStartWorkout(workout);
              }}
              className="flex-1 min-w-[80px] px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
            >
              Start
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};



export default WorkoutCard; 