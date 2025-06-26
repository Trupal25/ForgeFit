"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, Search, Plus } from 'lucide-react';
import WorkoutCard, { WorkoutItem } from '@/components/workouts/WorkoutCard';
import { ScheduleWorkoutModal } from '@/components/workouts/ScheduleWorkoutModal';

interface ScheduledWorkout {
  id: string;
  workoutId: number;
  date: string;
  time: string;
  workout: WorkoutItem;
  completed: boolean;
}

export default function SchedulePage() {
  // State management
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<number | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch workouts from API
  useEffect(() => {
    fetchWorkouts();
    fetchScheduledWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workout');
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.success ? data.data : []);
      } else {
        console.error('Failed to fetch workouts');
        // Fallback to sample data for development
        setWorkouts(getSampleWorkouts());
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkouts(getSampleWorkouts());
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledWorkouts = async () => {
    try {
      const response = await fetch('/api/schedule');
      if (response.ok) {
        const data = await response.json();
        setScheduledWorkouts(data.success ? data.data : []);
      }
    } catch (error) {
      console.error('Error fetching scheduled workouts:', error);
    }
  };

  // Filter workouts based on search and filters
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || workout.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || workout.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Event handlers
  const handleScheduleClick = (workout: WorkoutItem) => {
    setSelectedWorkout(workout);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedWorkout(null);
  };

  const handleWorkoutScheduled = async (scheduleData: { date: string; time: string }) => {
    if (!selectedWorkout) return;

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutId: selectedWorkout.id,
          date: scheduleData.date,
          time: scheduleData.time,
        }),
      });

      if (response.ok) {
        // Refresh scheduled workouts
        await fetchScheduledWorkouts();
        
        // Add to local state for immediate UI update
        const newScheduled: ScheduledWorkout = {
          id: `${Date.now()}`,
          workoutId: selectedWorkout.id,
          date: scheduleData.date,
          time: scheduleData.time,
          workout: selectedWorkout,
          completed: false,
        };
        setScheduledWorkouts(prev => [...prev, newScheduled]);
      }
    } catch (error) {
      console.error('Error scheduling workout:', error);
    }

    handleModalClose();
  };

  const handleToggleExpand = (id: number) => {
    setExpandedWorkoutId(expandedWorkoutId === id ? null : id);
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      const response = await fetch('/api/workout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          action: 'toggle_favorite',
        }),
      });

      if (response.ok) {
        // Update local state
        setWorkouts(prev => 
          prev.map(workout => 
            workout.id === id 
              ? { ...workout, isFavorite: !workout.isFavorite }
              : workout
          )
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleStartWorkout = (workout: WorkoutItem) => {
    // Navigate to workout session
    window.location.href = `/dashboard/workouts/${workout.id}/session`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
  };

  // Get unique categories and difficulties for filters
  const categories = ["All", ...new Set(workouts.map(w => w.category))];
  const difficulties = ["All", ...new Set(workouts.map(w => w.difficulty))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Schedule Workouts</h1>
        <p className="text-gray-600">Plan your fitness journey by scheduling workouts</p>
        
        {scheduledWorkouts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="text-blue-600" size={20} />
              <span className="text-blue-800 font-medium">
                You have {scheduledWorkouts.length} workout{scheduledWorkouts.length !== 1 ? 's' : ''} scheduled
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
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
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
          </button>
          {(searchTerm || selectedCategory !== "All" || selectedDifficulty !== "All") && (
            <button 
              onClick={clearFilters}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredWorkouts.length} of {workouts.length} workouts
        </p>
      </div>

      {/* Workout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            <Calendar size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No workouts found</h3>
            <p className="text-gray-500 text-center">
              Try adjusting your search or filters to find workouts to schedule.
            </p>
          </div>
        ) : (
          filteredWorkouts.map(workout => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout}
              isExpanded={expandedWorkoutId === workout.id}
              onToggleExpand={handleToggleExpand}
              onToggleFavorite={handleToggleFavorite}
              onSchedule={handleScheduleClick}
              onStartWorkout={handleStartWorkout}
            />
          ))
        )}
      </div>

      {/* Schedule Modal */}
      {selectedWorkout && (
        <ScheduleWorkoutModal
          workout={selectedWorkout}
          isOpen={modalOpen}
          onClose={handleModalClose}
          onScheduled={handleWorkoutScheduled}
        />
      )}
    </div>
  );
}

// Sample data fallback
function getSampleWorkouts(): WorkoutItem[] {
  return [
    {
      id: 1,
      title: "Full Body Strength",
      category: "Strength",
      difficulty: "Intermediate",
      duration: 45,
      calories: 350,
      muscleGroups: ["Chest", "Back", "Legs", "Arms"],
      isFavorite: false,
      completions: 8,
      rating: 4.8,
      description: "A comprehensive strength workout targeting all major muscle groups for overall body development.",
      imageUrl: "/images/workouts/full-body-strength.jpg",
      videoUrl: "/videos/workouts/full-body-strength.mp4",
      equipment: ["Barbell", "Dumbbells", "Bench", "Pull-up Bar"],
      instructions: ["Perform each exercise in sequence with proper form.", "Rest between sets as needed.", "Complete all sets before moving to the next exercise."],
      exercises: [
        { name: "Barbell Squat", sets: 3, reps: "8-10", restTime: 90 },
        { name: "Bench Press", sets: 3, reps: "8-10", restTime: 90 },
        { name: "Bent-Over Row", sets: 3, reps: "8-10", restTime: 90 },
        { name: "Overhead Press", sets: 3, reps: "8-10", restTime: 90 },
        { name: "Romanian Deadlift", sets: 3, reps: "8-10", restTime: 90 },
      ]
    },
    {
      id: 2,
      title: "HIIT Cardio Blast",
      category: "Cardio",
      difficulty: "Advanced",
      duration: 30,
      calories: 400,
      muscleGroups: ["Full Body"],
      isFavorite: false,
      completions: 4,
      rating: 4.5,
      description: "Intense interval training to maximize calorie burn and improve cardiovascular endurance.",
      imageUrl: "/images/workouts/hiit-cardio.jpg",
      videoUrl: "/videos/workouts/hiit-cardio.mp4",
      equipment: [],
      instructions: ["Perform each exercise for the specified time.", "Rest for the indicated rest period.", "Complete all rounds before finishing."],
      exercises: [
        { name: "Burpees", sets: 1, reps: "45 sec", restTime: 15 },
        { name: "Mountain Climbers", sets: 1, reps: "45 sec", restTime: 15 },
        { name: "Jump Squats", sets: 1, reps: "45 sec", restTime: 15 },
        { name: "High Knees", sets: 1, reps: "45 sec", restTime: 15 },
        { name: "Plank Jacks", sets: 1, reps: "45 sec", restTime: 15 },
      ]
    },
    {
      id: 3,
      title: "Core Crusher",
      category: "Core",
      difficulty: "Intermediate",
      duration: 25,
      calories: 220,
      muscleGroups: ["Abs", "Obliques", "Lower Back"],
      isFavorite: false,
      completions: 15,
      rating: 4.7,
      description: "Strengthen your core and improve stability with this targeted ab workout.",
      imageUrl: "/images/workouts/core-crusher.jpg",
      videoUrl: "/videos/workouts/core-crusher.mp4",
      equipment: ["Mat", "Ab Wheel"],
      instructions: ["Focus on engaging your core throughout each exercise.", "Maintain proper form to avoid injury.", "Complete all sets before moving to the next exercise."],
      exercises: [
        { name: "Plank", sets: 3, reps: "45 sec hold", restTime: 30 },
        { name: "Russian Twists", sets: 3, reps: "20 total", restTime: 30 },
        { name: "Leg Raises", sets: 3, reps: "12-15", restTime: 30 },
        { name: "Mountain Climbers", sets: 3, reps: "30 sec", restTime: 30 },
        { name: "Ab Rollouts", sets: 3, reps: "8-10", restTime: 45 },
      ]
    }
  ];
} 