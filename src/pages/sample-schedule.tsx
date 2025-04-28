import React, { useState } from 'react';
import WorkoutCard, { WorkoutItem } from '@/components/workouts/WorkoutCard';
import { ScheduleWorkoutModal } from '@/components/workouts/ScheduleWorkoutModal';

// Sample workout data
const sampleWorkouts: WorkoutItem[] = [
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
    isFavorite: true,
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

export default function SampleSchedulePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<number | null>(null);
  
  const handleScheduleClick = (workout: WorkoutItem) => {
    setSelectedWorkout(workout);
    setModalOpen(true);
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedWorkout(null);
  };
  
  const handleWorkoutScheduled = () => {
    setScheduledCount(prev => prev + 1);
  };
  
  const handleToggleExpand = (id: number) => {
    setExpandedWorkoutId(expandedWorkoutId === id ? null : id);
  };
  
  const handleToggleFavorite = (id: number) => {
    // Update the favorite status in our sample data
    const updatedWorkouts = sampleWorkouts.map(workout => 
      workout.id === id 
        ? { ...workout, isFavorite: !workout.isFavorite } 
        : workout
    );
    
    // In a real app, you'd update state or call an API here
    console.log(`Toggled favorite status for workout ${id}`);
  };
  
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Schedule Your Workouts</h1>
        <p className="text-gray-600">Select a workout to schedule for later</p>
        {scheduledCount > 0 && (
          <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md">
            You have scheduled {scheduledCount} workout{scheduledCount !== 1 ? 's' : ''}.
            Check your calendar to view them.
          </div>
        )}
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleWorkouts.map(workout => (
          <WorkoutCard 
            key={workout.id} 
            workout={workout}
            isExpanded={expandedWorkoutId === workout.id}
            onToggleExpand={handleToggleExpand}
            onToggleFavorite={handleToggleFavorite}
            onSchedule={handleScheduleClick}
          />
        ))}
      </div>
      
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