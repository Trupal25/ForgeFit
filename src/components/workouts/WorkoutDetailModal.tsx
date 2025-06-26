"use client";

import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Flame,
  Dumbbell,
  Star,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronRight
} from 'lucide-react';

// Types (matching our schema)
interface ExerciseSetDetail {
  id: string;
  reps: string;
  weight?: number;
}

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
  // Parsed set details from notes
  setDetails?: ExerciseSetDetail[];
  userNotes?: string;
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
}

interface WorkoutDetailModalProps {
  workout: Workout | null;
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout?: (workout: Workout) => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  workout,
  isOpen,
  onClose,
  onStartWorkout
}) => {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [completedSets, setCompletedSets] = useState<Record<number, number>>({});
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);

  // Parse workout exercises to include individual set details
  const parsedWorkout = workout ? {
    ...workout,
    exercises: workout.exercises.map(exercise => {
      let setDetails: ExerciseSetDetail[] = [];
      let userNotes = "";
      
      try {
        if (exercise.notes) {
          const parsed = JSON.parse(exercise.notes);
          setDetails = parsed.setDetails || [];
          userNotes = parsed.userNotes || "";
        }
      } catch (e) {
        // Fallback for old format or invalid JSON
        userNotes = exercise.notes || "";
        // Create sets based on the sets count and reps
        const repsArray = exercise.reps?.split(',') || ['10'];
        for (let i = 0; i < (exercise.sets || 1); i++) {
          setDetails.push({
            id: `${exercise.id}-set-${i + 1}`,
            reps: repsArray[i] || repsArray[0] || '10',
            weight: exercise.weight || undefined
          });
        }
      }
      
      return {
        ...exercise,
        setDetails,
        userNotes
      };
    })
  } : null;

  if (!isOpen || !parsedWorkout) return null;

  const currentExercise = parsedWorkout.exercises[activeExerciseIndex];
  const totalExercises = parsedWorkout.exercises.length;

  // Handle exercise navigation
  const goToNextExercise = () => {
    if (activeExerciseIndex < totalExercises - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
      setCompletedSets({...completedSets, [currentExercise.id]: 0});
    }
  };

  const goToPreviousExercise = () => {
    if (activeExerciseIndex > 0) {
      setActiveExerciseIndex(activeExerciseIndex - 1);
    }
  };

  // Handle set completion
  const markSetComplete = (exerciseId: number) => {
    const currentSets = completedSets[exerciseId] || 0;
    const totalSets = parsedWorkout.exercises.find(e => e.id === exerciseId)?.sets || 0;
    
    if (currentSets < totalSets) {
      setCompletedSets({
        ...completedSets,
        [exerciseId]: currentSets + 1
      });
      
      // Start rest timer if not the last set
      if (currentSets + 1 < totalSets) {
        const restTime = parsedWorkout.exercises.find(e => e.id === exerciseId)?.restTime || 90;
        setRestTimer(restTime);
        setIsResting(true);
      }
    }
  };

  // Rest timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev ? prev - 1 : 0);
      }, 1000);
    } else if (restTimer === 0) {
      setIsResting(false);
      setRestTimer(null);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{parsedWorkout.title}</h2>
            <p className="text-gray-600 mt-1">{parsedWorkout.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{parsedWorkout.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame size={16} />
                <span>{parsedWorkout.calories} cal</span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell size={16} />
                <span>{parsedWorkout.exercises.length} exercises</span>
              </div>
              {parsedWorkout.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star size={16} fill="currentColor" className="text-yellow-500" />
                  <span>{parsedWorkout.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Exercise List Sidebar */}
          <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Exercises</h3>
              <div className="space-y-2">
                {parsedWorkout.exercises.map((exercise, index) => {
                  const isActive = index === activeExerciseIndex;
                  const isCompleted = (completedSets[exercise.id] || 0) >= (exercise.sets || 0);
                  
                  return (
                    <button
                      key={exercise.id}
                      onClick={() => setActiveExerciseIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-100 border-2 border-blue-300' 
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">
                              {index + 1}.
                            </span>
                            <h4 className="font-medium text-gray-900 truncate">
                              {exercise.exercise.name}
                            </h4>
                            {isCompleted && (
                              <Check size={16} className="text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {exercise.sets} sets × {exercise.reps} reps
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {exercise.exercise.muscleGroups.slice(0, 2).map((muscle, idx) => (
                              <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {muscle}
                              </span>
                            ))}
                          </div>
                        </div>
                        {isActive && (
                          <ChevronRight size={16} className="text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Exercise View */}
          <div className="flex-1 overflow-y-auto">
            {currentExercise && (
              <div className="p-6">
                {/* Exercise Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {currentExercise.exercise.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Exercise {activeExerciseIndex + 1} of {totalExercises}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{currentExercise.exercise.description}</p>
                  
                  {/* Exercise Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{currentExercise.sets}</div>
                      <div className="text-sm text-gray-600">Sets</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{currentExercise.reps}</div>
                      <div className="text-sm text-gray-600">Reps</div>
                    </div>
                    {currentExercise.weight && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{currentExercise.weight}kg</div>
                        <div className="text-sm text-gray-600">Weight</div>
                      </div>
                    )}
                    {currentExercise.restTime && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">{currentExercise.restTime}s</div>
                        <div className="text-sm text-gray-600">Rest</div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {currentExercise.userNotes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <h4 className="font-medium text-yellow-800 mb-1">Notes:</h4>
                      <p className="text-yellow-700">{currentExercise.userNotes}</p>
                    </div>
                  )}
                </div>

                {/* Set Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Set Progress</h4>
                    <span className="text-sm text-gray-600">
                      {completedSets[currentExercise.id] || 0} / {currentExercise.sets} completed
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {currentExercise.setDetails && currentExercise.setDetails.length > 0 ? (
                      currentExercise.setDetails.map((set, i) => {
                        const isCompleted = (completedSets[currentExercise.id] || 0) > i;
                        const isCurrent = (completedSets[currentExercise.id] || 0) === i;
                        
                        return (
                          <button
                            key={set.id}
                            onClick={() => markSetComplete(currentExercise.id)}
                            disabled={!isCurrent}
                            className={`p-3 rounded-lg border-2 transition-colors ${
                              isCompleted
                                ? 'bg-green-100 border-green-300 text-green-800'
                                : isCurrent
                                ? 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200'
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                            }`}
                          >
                            <div className="text-sm font-medium">Set {i + 1}</div>
                            <div className="text-xs">
                              {set.reps} reps
                              {set.weight && ` @ ${set.weight}kg`}
                            </div>
                            {isCompleted && <Check size={16} className="mx-auto mt-1" />}
                          </button>
                        );
                      })
                    ) : (
                      // Fallback for exercises without detailed set information
                      Array.from({length: currentExercise.sets || 0}, (_, i) => {
                        const isCompleted = (completedSets[currentExercise.id] || 0) > i;
                        const isCurrent = (completedSets[currentExercise.id] || 0) === i;
                        
                        return (
                          <button
                            key={i}
                            onClick={() => markSetComplete(currentExercise.id)}
                            disabled={!isCurrent}
                            className={`p-3 rounded-lg border-2 transition-colors ${
                              isCompleted
                                ? 'bg-green-100 border-green-300 text-green-800'
                                : isCurrent
                                ? 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200'
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                            }`}
                          >
                            <div className="text-sm font-medium">Set {i + 1}</div>
                            <div className="text-xs">
                              {currentExercise.reps} reps
                              {currentExercise.weight && ` @ ${currentExercise.weight}kg`}
                            </div>
                            {isCompleted && <Check size={16} className="mx-auto mt-1" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Rest Timer */}
                {isResting && restTimer && (
                  <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-orange-800 mb-2">Rest Time</h4>
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {formatTime(restTimer)}
                    </div>
                    <button
                      onClick={() => {
                        setIsResting(false);
                        setRestTimer(null);
                      }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Skip Rest
                    </button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={goToPreviousExercise}
                    disabled={activeExerciseIndex === 0}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous Exercise
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {activeExerciseIndex === totalExercises - 1 && 
                     (completedSets[currentExercise.id] || 0) >= (currentExercise.sets || 0) ? (
                      <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Complete Workout
                      </button>
                    ) : (
                      <button
                        onClick={goToNextExercise}
                        disabled={activeExerciseIndex === totalExercises - 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Next Exercise
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 