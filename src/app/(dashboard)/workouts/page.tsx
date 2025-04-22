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

// Import utility to transform data
import { transformEntity } from '@/lib/dbUtils';

// Define types based on your Prisma schema and frontend needs for Exercise
interface Exercise {
  id: number;
  name: string;
  description: string;
  instructions: string;
  muscleGroups: string[]; // Expected as array on frontend after transformation
  equipment: string[];   // Expected as array on frontend after transformation
  difficultyLevel: string;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Add other fields from schema if needed
  // For displaying, maybe add isFavorite or completions if that logic exists elsewhere
  isFavorite?: boolean; // Assuming a way to track this on the frontend or fetch
}

// Available filters (These can also potentially come from a backend API later)
// Categories and Durations are workout filters, not directly applicable to /api/exercises
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const MUSCLE_GROUPS = [
  "All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Abs", 
  "Full Body", "Quads", "Hamstrings", "Glutes", "Calves", "Obliques", "Lower Back"
];

export default function ExercisesPage() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  // Removed selectedCategory and selectedDuration states
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  
  // State for fetched data (now exercises)
  const [exercises, setExercises] = useState<Exercise[]>([]); // Renamed from workouts
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null); // Renamed from selectedWorkout

  // Fetch exercises from backend based on criteria
  useEffect(() => {
    const fetchExercises = async () => { // Renamed function
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedMuscleGroup !== 'All') params.append('muscleGroups', selectedMuscleGroup);
      if (selectedDifficulty !== 'All') params.append('difficultyLevel', selectedDifficulty);
      // TODO: Add equipment filter if needed

      try {
        const response = await fetch(`/api/exercises?${params.toString()}`);
        if (!response.ok) {
          // Attempt to read error message from response body
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Apply transformation for muscleGroups and equipment from string to array
        const transformedData = data.map((item: any) => transformEntity(item, ['muscleGroups', 'equipment']));
        
        setExercises(transformedData); // Update state
      } catch (err: any) {
        console.error("Error fetching exercises:", err);
        setError(`Failed to fetch exercises: ${err.message}`);
        setExercises([]); // Clear exercises on error
      }
      
      setIsLoading(false);
    };
    
    fetchExercises();

    // Dependencies for useEffect - refetch when filters or search term changes
  }, [searchTerm, selectedMuscleGroup, selectedDifficulty]); // Updated dependencies

  // Toggle favorite status (This needs a new API endpoint for exercises if not already done)
  const toggleFavorite = async (id: number) => {
    // TODO: Implement exercise favorite toggle using a backend API
    console.log(`Toggle favorite for exercise ID: ${id}`);
    // Optimistically update state (optional)
    setExercises(exercises.map(exercise => 
      exercise.id === id 
        ? {...exercise, isFavorite: !exercise.isFavorite} 
        : exercise
    ));
    // Call backend API here
    try {
       // Example: await fetch(`/api/exercises/${id}/favorite`, { method: 'POST' });
       // Need to create this API route if it doesn't exist
    } catch (err) {
       console.error("Failed to toggle favorite status", err);
       // Revert optimistic update or show error
    }
  };

  // Handle exercise selection (to show details)
  const handleExerciseSelect = (id: number) => {
    // This could fetch detailed exercise data from /api/exercises/[id]
    setSelectedExerciseId(selectedExerciseId === id ? null : id); // Updated state variable
  };

  // Render stars based on rating (If exercises had a rating field, currently only Workouts do in schema)
  // const renderStars = (rating: number) => { ... };
  // Removing renderStars as Exercise model doesn't have rating based on the schema provided earlier.

  return (
    <div className="p-6">
      <div className="mb-8">
        {/* Updated title and description to reflect Exercises */}
        <h1 className="text-2xl font-bold mb-2">Exercises</h1>
        <p className="text-gray-600">Browse and discover exercises for your fitness routine.</p>
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
              placeholder="Search exercises..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} /> Filter
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          {/* 
          // TODO: Implement Add New Exercise Modal/Page
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            <Plus size={18} /> Add New Exercise
          </button>
          */}
        </div>
        
        {/* Filter Options - Adjusted to match /api/exercises filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {/* Difficulty Filter */}
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              {DIFFICULTIES.filter(d => d !== 'All').map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
            
            {/* Muscle Group Filter */}
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            >
              <option value="All">All Muscle Groups</option>
               {MUSCLE_GROUPS.filter(mg => mg !== 'All').map(muscleGroup => (
                <option key={muscleGroup} value={muscleGroup}>{muscleGroup}</option>
              ))}
            </select>

            {/* TODO: Add Equipment Filter (Need to add state and filter option) */}

          </div>
        )}
      </div>
      
      {/* Loading and Error States */}
      {isLoading && <p className="text-center text-gray-500">Loading exercises...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!isLoading && !error && exercises.length === 0 && (
        <p className="text-center text-gray-500">No exercises found matching your criteria.</p>
      )}

      {/* Exercise List */}
      {!isLoading && !error && exercises.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Note: Iterating through 'exercises' state */}
          {exercises.map(exercise => (
            <div 
              key={exercise.id} 
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleExerciseSelect(exercise.id)} // Use exercise.id
            >
              <div className="flex justify-between items-start">
                <div>
                  {/* Use exercise.name and exercise.muscleGroups */}
                  <h3 className="text-lg font-semibold mb-1">{exercise.name}</h3>
                  <p className="text-sm text-gray-500">{exercise.muscleGroups.join(', ')}</p> {/* Display muscleGroups array */}
                </div>
                {/* Favorite Toggle - Needs backend implementation for exercises */}
                {/* Re-enable and implement toggleFavorite logic when backend is ready */}
                 <button 
                   className={`p-1 rounded-full ${exercise.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                   onClick={(e) => {
                     e.stopPropagation(); // Prevent card click
                     toggleFavorite(exercise.id);
                   }}
                 >
                   {/* Using Bookmark icon for now, Heart is also an option */}
                   <Bookmark size={20} fill={exercise.isFavorite ? "currentColor" : "none"}/>
                 </button>

              </div>
              
              {/* Display Difficulty Level and Equipment */}
              <div className="flex items-center text-sm text-gray-600 mt-2">
                 <BarChart size={16} className="mr-1" />
                 <span>{exercise.difficultyLevel}</span>
                 <Dumbbell size={16} className="ml-4 mr-1" />
                 <span>{exercise.equipment.join(', ')}</span> {/* Display equipment array */}
              </div>

              {/* Exercise Details (Shown when selected) */}
              {selectedExerciseId === exercise.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 mb-3">{exercise.description}</p>
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  {/* Simple split by period and space for instructions - may need refinement */}
                  <ol className="list-decimal list-inside text-gray-700">
                    {exercise.instructions.split('. ').map((step, index) => step.trim() && <li key={index}>{step.trim()}</li>)}
                  </ol>

                  {/* TODO: Display related workouts if fetched */}
                  {/* TODO: Add options to add to workout, schedule, etc. */}

                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* TODO: Implement Modals for Adding/Editing Exercises if needed on this page */}

    </div>
  );
}

// Removed unused mock data and workout-specific filter constants
// Removed WorkoutCard and ScheduleWorkoutModal imports as they are workout specific
// Removed WorkoutCard and ScheduleWorkoutModal components at the end of the file
