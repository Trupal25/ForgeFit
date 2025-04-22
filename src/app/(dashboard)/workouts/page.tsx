"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Dumbbell, 
  Clock, 
  Flame, 
  ChevronDown, 
  Plus, 
  Star, 
  StarHalf,
  BarChart,
  Heart,
  Save,
  Trash2,
  Calendar,
  Bookmark
} from 'lucide-react';

// Mock data for workouts
const WORKOUT_DATA = [
  {
    id: 1,
    title: "Full Body Strength",
    category: "Strength",
    difficulty: "Intermediate",
    duration: 45,
    calories: 350,
    muscleGroups: ["Chest", "Back", "Legs", "Arms"],
    isFavorite: true,
    completions: 8,
    rating: 4.8,
    description: "A comprehensive strength workout targeting all major muscle groups for overall body development.",
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
    title: "Upper Body Focus",
    category: "Strength",
    difficulty: "Beginner",
    duration: 35,
    calories: 280,
    muscleGroups: ["Chest", "Back", "Shoulders", "Arms"],
    isFavorite: true,
    completions: 12,
    rating: 4.2,
    description: "Target your upper body with this beginner-friendly strength routine.",
    exercises: [
      { name: "Push-Ups", sets: 3, reps: "8-12", restTime: 60 },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12", restTime: 60 },
      { name: "Lateral Raises", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Bicep Curls", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Tricep Dips", sets: 3, reps: "10-12", restTime: 60 },
    ]
  },
  {
    id: 4,
    title: "Lower Body Strength",
    category: "Strength",
    difficulty: "Intermediate",
    duration: 40,
    calories: 320,
    muscleGroups: ["Quads", "Hamstrings", "Glutes", "Calves"],
    isFavorite: false,
    completions: 6,
    rating: 4.6,
    description: "Build strong, powerful legs with this focused lower body workout.",
    exercises: [
      { name: "Goblet Squats", sets: 4, reps: "10-12", restTime: 90 },
      { name: "Walking Lunges", sets: 3, reps: "12 per leg", restTime: 60 },
      { name: "Leg Press", sets: 3, reps: "12-15", restTime: 90 },
      { name: "Leg Curls", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Calf Raises", sets: 4, reps: "15-20", restTime: 45 },
    ]
  },
  {
    id: 5,
    title: "Core Crusher",
    category: "Core",
    difficulty: "Intermediate",
    duration: 25,
    calories: 220,
    muscleGroups: ["Abs", "Obliques", "Lower Back"],
    isFavorite: true,
    completions: 15,
    rating: 4.7,
    description: "Strengthen your core and improve stability with this targeted ab workout.",
    exercises: [
      { name: "Plank", sets: 3, reps: "45 sec hold", restTime: 30 },
      { name: "Russian Twists", sets: 3, reps: "20 total", restTime: 30 },
      { name: "Leg Raises", sets: 3, reps: "12-15", restTime: 30 },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec", restTime: 30 },
      { name: "Ab Rollouts", sets: 3, reps: "8-10", restTime: 45 },
    ]
  },
  {
    id: 6,
    title: "Yoga Flow",
    category: "Flexibility",
    difficulty: "Beginner",
    duration: 50,
    calories: 180,
    muscleGroups: ["Full Body"],
    isFavorite: false,
    completions: 3,
    rating: 4.3,
    description: "Improve flexibility, balance and mental clarity with this calming yoga sequence.",
    exercises: [
      { name: "Sun Salutation", sets: 1, reps: "5 flows", restTime: 0 },
      { name: "Warrior Sequence", sets: 1, reps: "3 min", restTime: 0 },
      { name: "Balance Poses", sets: 1, reps: "5 min", restTime: 0 },
      { name: "Seated Stretches", sets: 1, reps: "8 min", restTime: 0 },
      { name: "Savasana", sets: 1, reps: "5 min", restTime: 0 },
    ]
  },
];

// Available filters
const CATEGORIES = ["All", "Strength", "Cardio", "Core", "Flexibility", "HIIT"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const DURATIONS = ["All", "Under 30 min", "30-45 min", "Over 45 min"];
const MUSCLE_GROUPS = [
  "All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Abs", 
  "Full Body", "Quads", "Hamstrings", "Glutes", "Calves", "Obliques", "Lower Back"
];

export default function WorkoutsPage() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [workouts, setWorkouts] = useState(WORKOUT_DATA);
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);

  // Filter workouts based on criteria
  useEffect(() => {
    let filteredWorkouts = [...WORKOUT_DATA];
    
    // Apply search filter
    if (searchTerm) {
      filteredWorkouts = filteredWorkouts.filter(workout =>
        workout.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "All") {
      filteredWorkouts = filteredWorkouts.filter(workout =>
        workout.category === selectedCategory
      );
    }
    
    // Apply difficulty filter
    if (selectedDifficulty !== "All") {
      filteredWorkouts = filteredWorkouts.filter(workout =>
        workout.difficulty === selectedDifficulty
      );
    }
    
    // Apply duration filter
    if (selectedDuration !== "All") {
      filteredWorkouts = filteredWorkouts.filter(workout => {
        if (selectedDuration === "Under 30 min") return workout.duration < 30;
        if (selectedDuration === "30-45 min") return workout.duration >= 30 && workout.duration <= 45;
        if (selectedDuration === "Over 45 min") return workout.duration > 45;
        return true;
      });
    }
    
    // Apply muscle group filter
    if (selectedMuscleGroup !== "All") {
      filteredWorkouts = filteredWorkouts.filter(workout =>
        workout.muscleGroups.includes(selectedMuscleGroup)
      );
    }
    
    setWorkouts(filteredWorkouts);
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedDuration, selectedMuscleGroup]);

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setWorkouts(workouts.map(workout => 
      workout.id === id 
        ? {...workout, isFavorite: !workout.isFavorite} 
        : workout
    ));
  };

  // Handle workout selection
  const handleWorkoutSelect = (id: number) => {
    setSelectedWorkout(selectedWorkout === id ? null : id);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Workouts</h1>
        <p className="text-gray-600">Find, track, and create custom workouts to meet your fitness goals.</p>
      </div>
      
      {/* Search and Filter Bar */}
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
            <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            <Plus size={18} />
            New Workout
          </button>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map(category => (
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
                {DIFFICULTIES.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                {DURATIONS.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Group</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              >
                {MUSCLE_GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Workout Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workouts.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            <Dumbbell size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No workouts found</h3>
            <p className="text-gray-500 text-center">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
        ) : (
          workouts.map(workout => (
            <div 
              key={workout.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div 
                className="p-5 cursor-pointer"
                onClick={() => handleWorkoutSelect(workout.id)}
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
                      toggleFavorite(workout.id);
                    }}
                  >
                    <Heart size={20} fill={workout.isFavorite ? "#ef4444" : "none"} stroke={workout.isFavorite ? "#ef4444" : "currentColor"} />
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
              {selectedWorkout === workout.id && (
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
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1">
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
          ))
        )}
      </div>
    </div>
  );
}
