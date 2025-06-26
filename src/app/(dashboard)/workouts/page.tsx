"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus,
  ChevronDown, 
  Clock,
  Flame,
  Heart,
  Star,
  Dumbbell,
  Users
} from 'lucide-react';
import WorkoutCard, { WorkoutItem } from '@/components/workouts/WorkoutCard';
import { CreateWorkoutModal } from '@/components/workouts/CreateWorkoutModal';
import { WorkoutDetailModal } from '@/components/workouts/WorkoutDetailModal';

// Define Workout type based on our schema
interface WorkoutExercise {
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

interface Workout {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  calories: number;
  muscleGroups: string;
  imageUrl: string | null;
  videoUrl: string | null;
  rating: number;
  ratingCount: number;
  exercises: WorkoutExercise[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

// Filter options
const CATEGORIES = ["All", "Strength", "Cardio", "Core", "Flexibility", "HIIT", "Full Body"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const MUSCLE_GROUPS = [
  "All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Abs", 
  "Full Body", "Quads", "Hamstrings", "Glutes", "Calves"
];

export default function WorkoutsPage() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  
  // State for workouts data
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // Fetch workouts from backend
  const fetchWorkouts = async () => {
    setIsLoading(true);
    setError(null);
    
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
    if (maxDuration) params.append('duration', maxDuration.toString());
    if (selectedMuscleGroup !== 'All') params.append('muscleGroups', selectedMuscleGroup);

    try {
      const response = await fetch(`/api/workout?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWorkouts(data.workouts || []);
    } catch (err: any) {
      console.error("Error fetching workouts:", err);
      setError(`Failed to fetch workouts: ${err.message}`);
      setWorkouts([]);
    }
    
    setIsLoading(false);
  };

  // Effect to fetch workouts when filters change
  useEffect(() => {
    fetchWorkouts();
  }, [selectedCategory, selectedDifficulty, selectedMuscleGroup, maxDuration]);

  // Filter workouts based on search term (client-side)
  const filteredWorkouts = workouts.filter(workout =>
    workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle favorite status (optimized)
  const toggleFavorite = async (id: number) => {
    // Optimistic update - update UI immediately
    setWorkouts(workouts.map(workout => 
      workout.id === id 
        ? {...workout, isFavorite: !workout.isFavorite} 
        : workout
    ));

    try {
      const response = await fetch('/api/workout/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workoutId: id })
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setWorkouts(workouts.map(workout => 
          workout.id === id 
            ? {...workout, isFavorite: !workout.isFavorite} 
            : workout
        ));
        throw new Error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Delete workout
  const deleteWorkout = async (workout: Workout) => {
    if (!confirm(`Are you sure you want to delete "${workout.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/workout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: workout.id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }

      // Remove from local state
      setWorkouts(workouts.filter(w => w.id !== workout.id));
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete workout. Please try again.');
    }
  };

  // Handle successful workout creation/update
  const handleWorkoutCreated = (newWorkout: Workout) => {
    if (editingWorkout) {
      // Update existing workout
      setWorkouts(workouts.map(w => w.id === newWorkout.id ? newWorkout : w));
      setEditingWorkout(null);
    } else {
      // Add new workout
      setWorkouts([newWorkout, ...workouts]);
    }
    setShowCreateModal(false);
  };

  // Handle workout selection for detailed view
  const handleWorkoutSelect = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowDetailModal(true);
  };

  // Handle workout edit
  const handleWorkoutEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setShowCreateModal(true);
  };

  // Render workout stats
  const renderStats = (workout: Workout) => (
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <Clock size={16} />
        <span>{workout.duration} min</span>
      </div>
      <div className="flex items-center gap-1">
        <Flame size={16} />
        <span>{workout.calories} cal</span>
      </div>
      <div className="flex items-center gap-1">
        <Dumbbell size={16} />
        <span>{workout.exercises.length} exercises</span>
      </div>
      {workout.rating > 0 && (
        <div className="flex items-center gap-1">
          <Star size={16} fill="currentColor" className="text-yellow-500" />
          <span>{workout.rating.toFixed(1)}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Workouts</h1>
        <p className="text-gray-600">
          Discover premade workouts or create your own custom training routine.
        </p>
      </div>
      
      {/* Search and Actions Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search workouts..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} /> 
            Filters
            <ChevronDown 
              size={16} 
              className={`transition-transform ${showFilters ? 'rotate-180' : 'rotate-0'}`} 
            />
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} /> 
            Create Workout
          </button>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {DIFFICULTIES.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              
              {/* Muscle Group Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Group</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedMuscleGroup}
                  onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                >
                  {MUSCLE_GROUPS.map(muscleGroup => (
                    <option key={muscleGroup} value={muscleGroup}>{muscleGroup}</option>
                  ))}
                </select>
              </div>
              
              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Duration</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={maxDuration || ""}
                  onChange={(e) => setMaxDuration(e.target.value ? parseInt(e.target.value) : undefined)}
                >
                  <option value="">Any Duration</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                </select>
              </div>
              
              {/* Clear Filters */}
              <div className="flex items-end">
                <button 
                  className="w-full px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedDifficulty("All");
                    setSelectedMuscleGroup("All");
                    setMaxDuration(undefined);
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {!isLoading && !error && (
        <div className="mb-6 flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{filteredWorkouts.length} workouts found</span>
          </div>
          {searchTerm && (
            <span>Showing results for "{searchTerm}"</span>
          )}
        </div>
      )}
      
      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading workouts...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={fetchWorkouts}
          >
            Try Again
          </button>
        </div>
      )}
      
      {!isLoading && !error && filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No workouts found matching your criteria.</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Workout
          </button>
        </div>
      )}

      {/* Workouts Grid */}
      {!isLoading && !error && filteredWorkouts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredWorkouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onToggleFavorite={toggleFavorite}
              onSelect={() => handleWorkoutSelect(workout)}
              onEdit={() => handleWorkoutEdit(workout)}
              onDelete={() => deleteWorkout(workout)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Workout Modal */}
      {showCreateModal && (
        <CreateWorkoutModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingWorkout(null);
          }}
          onWorkoutCreated={handleWorkoutCreated}
          editWorkout={editingWorkout}
        />
      )}

      {/* Workout Detail Modal */}
      {showDetailModal && (
        <WorkoutDetailModal
          workout={selectedWorkout}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedWorkout(null);
          }}
        />
      )}
    </div>
  );
}
