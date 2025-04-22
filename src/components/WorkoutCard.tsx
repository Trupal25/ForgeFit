import React from 'react';
import { 
  Clock, 
  Flame, 
  Heart,
  Star,
  BarChart, 
  Calendar,
  Dumbbell,
  Bookmark
} from 'lucide-react';

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  restTime: number;
}

export interface Workout {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  duration: number;
  calories: number;
  muscleGroups: string[];
  isFavorite: boolean;
  completions: number;
  rating: number;
  description: string;
  exercises: WorkoutExercise[];
}

interface WorkoutCardProps {
  workout: Workout;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onScheduleWorkout: (workout: Workout) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  workout, 
  isExpanded, 
  onToggleExpand, 
  onToggleFavorite,
  onScheduleWorkout
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div 
        className="p-5 cursor-pointer"
        onClick={() => onToggleExpand(workout.id)}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{workout.title}</h3>
            <span className="text-sm text-gray-500">{workout.category} • {workout.difficulty}</span>
          </div>
          <button 
            className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(workout.id);
            }}
          >
            <Heart 
              size={20} 
              fill={workout.isFavorite ? "#ef4444" : "none"} 
              stroke={workout.isFavorite ? "#ef4444" : "currentColor"} 
            />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{workout.description}</p>
        
        <div className="flex flex-wrap gap-3 mb-4">
          {workout.muscleGroups.map(group => (
            <span key={group} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">{group}</span>
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
              <span className="text-sm">{workout.completions}×</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{workout.rating}</span>
          </div>
        </div>
      </div>
      
      {/* Expanded workout details */}
      {isExpanded && (
        <div className="p-5 border-t border-gray-100">
          <h4 className="font-medium text-gray-700 mb-3">Exercises</h4>
          <div className="space-y-3 mb-4">
            {workout.exercises.map((exercise, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{exercise.name}</p>
                  <span className="text-sm text-gray-500">{exercise.sets} sets × {exercise.reps}</span>
                </div>
                <div className="text-sm text-gray-500">{exercise.restTime}s rest</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1"
              onClick={() => onScheduleWorkout(workout)}
            >
              <Calendar size={16} />
              <span>Schedule</span>
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1">
              <Dumbbell size={16} />
              <span>Start Workout</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1">
              <Bookmark size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutCard; 