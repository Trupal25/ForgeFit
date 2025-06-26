"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, Clock, Calendar, Dumbbell, Brain, Heart } from 'lucide-react';

interface EventSchedulingModalProps {
  selectedDate: Date | null;
  onClose: () => void;
  onEventCreated: () => void;
}

interface Workout {
  id: number;
  title: string;
  duration: number;
  category: string;
  difficulty: string;
}

interface EventForm {
  title: string;
  eventType: 'Workout' | 'Meditation' | 'Yoga';
  time: string;
  duration: number;
  workoutId?: number;
  description?: string;
}

const EventSchedulingModal: React.FC<EventSchedulingModalProps> = ({
  selectedDate,
  onClose,
  onEventCreated
}) => {
  const { data: session } = useSession();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EventForm>({
    title: '',
    eventType: 'Workout',
    time: '09:00',
    duration: 45,
    description: ''
  });

  useEffect(() => {
    if (form.eventType === 'Workout') {
      fetchWorkouts();
    }
  }, [form.eventType]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/exercises');
      if (response.ok) {
        const result = await response.json();
        setWorkouts(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !session?.user?.id) return;

    setSaving(true);

    try {
      const eventData = {
        userId: session.user.id,
        title: form.title || getDefaultTitle(),
        description: form.description,
        date: selectedDate.toISOString().split('T')[0],
        time: form.time,
        duration: form.duration,
        eventType: form.eventType,
        workoutId: form.eventType === 'Workout' ? form.workoutId : undefined
      };

      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        onEventCreated();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to schedule event');
      }
    } catch (error) {
      console.error('Error scheduling event:', error);
      alert('Failed to schedule event');
    } finally {
      setSaving(false);
    }
  };

  const getDefaultTitle = () => {
    switch (form.eventType) {
      case 'Workout':
        const selectedWorkout = workouts.find(w => w.id === form.workoutId);
        return selectedWorkout?.title || 'Workout Session';
      case 'Meditation':
        return 'Meditation Session';
      case 'Yoga':
        return 'Yoga Practice';
      default:
        return 'Fitness Activity';
    }
  };

  const handleWorkoutSelection = (workout: Workout) => {
    setForm(prev => ({
      ...prev,
      workoutId: workout.id,
      title: workout.title,
      duration: workout.duration
    }));
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'Workout':
        return <Dumbbell size={20} className="text-blue-600" />;
      case 'Meditation':
        return <Brain size={20} className="text-purple-600" />;
      case 'Yoga':
        return <Heart size={20} className="text-pink-600" />;
      default:
        return <Calendar size={20} className="text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Schedule Event</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          {selectedDate && (
            <p className="text-gray-600 mt-1">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Event Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Event Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Workout', 'Meditation', 'Yoga'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, eventType: type, workoutId: undefined }))}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      form.eventType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      {getEventIcon(type)}
                      <span className="mt-2 text-sm font-medium">{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Workout Selection */}
            {form.eventType === 'Workout' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Workout
                </label>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                    {workouts.map((workout) => (
                      <button
                        key={workout.id}
                        type="button"
                        onClick={() => handleWorkoutSelection(workout)}
                        className={`w-full p-4 text-left border-b border-gray-100 last:border-0 hover:bg-gray-50 ${
                          form.workoutId === workout.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{workout.title}</h4>
                            <p className="text-sm text-gray-600">
                              {workout.category} • {workout.difficulty}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {workout.duration} min
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder={getDefaultTitle()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Time and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock size={16} className="inline mr-1" />
                  Start Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={form.time}
                  onChange={(e) => setForm(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={form.duration}
                  onChange={(e) => setForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 45 }))}
                  min="5"
                  max="240"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Add any notes about this event..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || (form.eventType === 'Workout' && !form.workoutId)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Scheduling...' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventSchedulingModal; 