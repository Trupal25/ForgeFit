"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Minus, 
  Clock, 
  Flame,
  Save,
  ChevronDown,
  Dumbbell
} from 'lucide-react';

// Types
interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string;
  difficultyLevel: string;
  imageUrl: string | null;
}

interface WorkoutExercise {
  exerciseId: number;
  exercise: Exercise;
  sets: number;
  reps: string;
  weight?: number;
  restTime?: number;
  notes?: string;
}

interface CreateWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkoutCreated: (workout: any) => void;
}

const CATEGORIES = ["Strength", "Cardio", "Core", "Flexibility", "HIIT", "Full Body"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({
  isOpen,
  onClose,
  onWorkoutCreated
}) => {
  // Workout details state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Strength");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [estimatedDuration, setEstimatedDuration] = useState(30);

  // Exercise selection state
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);
  
  // Loading and error states
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search for exercises
  useEffect(() => {
    const searchExercises = async () => {
      if (exerciseSearch.length < 2) {
        setAvailableExercises([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/exercises?search=${encodeURIComponent(exerciseSearch)}`);
        if (!response.ok) throw new Error('Failed to search exercises');
        
        const exercises = await response.json();
        setAvailableExercises(exercises.slice(0, 10)); // Limit results
      } catch (err) {
        console.error('Error searching exercises:', err);
        setAvailableExercises([]);
      }
      setIsSearching(false);
    };

    const timeoutId = setTimeout(searchExercises, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [exerciseSearch]);

  // Add exercise to workout
  const addExercise = (exercise: Exercise) => {
    const alreadyAdded = selectedExercises.find(we => we.exerciseId === exercise.id);
    if (alreadyAdded) return;

    const workoutExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exercise,
      sets: 3,
      reps: "10",
      weight: undefined,
      restTime: 90,
      notes: ""
    };

    setSelectedExercises([...selectedExercises, workoutExercise]);
    setExerciseSearch("");
    setShowExerciseDropdown(false);
  };

  // Remove exercise from workout
  const removeExercise = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter(we => we.exerciseId !== exerciseId));
  };

  // Update exercise details
  const updateExercise = (exerciseId: number, field: keyof WorkoutExercise, value: any) => {
    setSelectedExercises(selectedExercises.map(we => 
      we.exerciseId === exerciseId 
        ? { ...we, [field]: value }
        : we
    ));
  };

  // Calculate estimated muscle groups
  const getEstimatedMuscleGroups = () => {
    const muscleGroups = new Set<string>();
    selectedExercises.forEach(we => {
      we.exercise.muscleGroups.forEach(mg => muscleGroups.add(mg));
    });
    return Array.from(muscleGroups).join(", ") || "Full Body";
  };

  // Create workout
  const handleCreateWorkout = async () => {
    if (!title.trim() || !description.trim() || selectedExercises.length === 0) {
      setError("Please fill in all required fields and add at least one exercise");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const workoutData = {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        duration: estimatedDuration,
        muscleGroups: getEstimatedMuscleGroups(),
        exercises: selectedExercises.map((we, index) => ({
          exerciseId: we.exerciseId,
          sets: we.sets,
          reps: we.reps,
          weight: we.weight,
          restTime: we.restTime,
          notes: we.notes || undefined
        }))
      };

      const response = await fetch('/api/workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create workout');
      }

      const result = await response.json();
      onWorkoutCreated(result.workout);
      handleClose();
    } catch (err: any) {
      setError(err.message);
    }
    setIsCreating(false);
  };

  // Reset form and close
  const handleClose = () => {
    setTitle("");
    setDescription("");
    setCategory("Strength");
    setDifficulty("Intermediate");
    setEstimatedDuration(30);
    setSelectedExercises([]);
    setExerciseSearch("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create Custom Workout</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Workout Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Upper Body Strength"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration (minutes)
                </label>
                <input
                  type="number"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(parseInt(e.target.value) || 30)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="5"
                  max="180"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {DIFFICULTIES.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your workout routine..."
              />
            </div>
          </div>

          {/* Exercise Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Add Exercises</h3>
            
            {/* Exercise Search */}
            <div className="relative mb-6">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={exerciseSearch}
                  onChange={(e) => {
                    setExerciseSearch(e.target.value);
                    setShowExerciseDropdown(true);
                  }}
                  onFocus={() => setShowExerciseDropdown(true)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for exercises to add..."
                />
              </div>

              {/* Exercise Dropdown */}
              {showExerciseDropdown && exerciseSearch.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : availableExercises.length > 0 ? (
                    availableExercises.map(exercise => (
                      <button
                        key={exercise.id}
                        onClick={() => addExercise(exercise)}
                        className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{exercise.name}</div>
                        <div className="text-sm text-gray-500">
                          {exercise.muscleGroups.join(", ")} • {exercise.difficultyLevel}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No exercises found</div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Exercises */}
            {selectedExercises.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">
                  Selected Exercises ({selectedExercises.length})
                </h4>
                
                {selectedExercises.map((workoutExercise, index) => (
                  <div key={workoutExercise.exerciseId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h5 className="font-medium text-gray-900">{workoutExercise.exercise.name}</h5>
                        <p className="text-sm text-gray-500">
                          {workoutExercise.exercise.muscleGroups.join(", ")}
                        </p>
                      </div>
                      <button
                        onClick={() => removeExercise(workoutExercise.exerciseId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Sets</label>
                        <input
                          type="number"
                          value={workoutExercise.sets}
                          onChange={(e) => updateExercise(workoutExercise.exerciseId, 'sets', parseInt(e.target.value) || 1)}
                          min="1"
                          max="10"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Reps</label>
                        <input
                          type="text"
                          value={workoutExercise.reps}
                          onChange={(e) => updateExercise(workoutExercise.exerciseId, 'reps', e.target.value)}
                          placeholder="e.g., 10 or 8-12"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          value={workoutExercise.weight || ""}
                          onChange={(e) => updateExercise(workoutExercise.exerciseId, 'weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="Optional"
                          step="0.5"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Rest (sec)</label>
                        <input
                          type="number"
                          value={workoutExercise.restTime || ""}
                          onChange={(e) => updateExercise(workoutExercise.exerciseId, 'restTime', e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="90"
                          step="15"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Notes (Optional)</label>
                      <input
                        type="text"
                        value={workoutExercise.notes || ""}
                        onChange={(e) => updateExercise(workoutExercise.exerciseId, 'notes', e.target.value)}
                        placeholder="e.g., Focus on form, slow tempo"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {selectedExercises.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Workout Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Dumbbell size={16} className="text-gray-500" />
                  <span>{selectedExercises.length} exercises</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span>{estimatedDuration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-gray-500" />
                  <span>~{Math.round(estimatedDuration * 8)} calories</span>
                </div>
                <div className="text-gray-600">
                  {getEstimatedMuscleGroups()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateWorkout}
            disabled={isCreating || !title.trim() || !description.trim() || selectedExercises.length === 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Creating...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Workout
              </>
            )}
          </button>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showExerciseDropdown && (
        <div 
          className="fixed inset-0" 
          onClick={() => setShowExerciseDropdown(false)}
          style={{ zIndex: -1 }}
        />
      )}
    </div>
  );
}; 