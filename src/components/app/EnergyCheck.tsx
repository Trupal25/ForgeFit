"use client"
import React, { useState, useEffect } from 'react'
import {
  BatteryFullIcon,
  BatteryMediumIcon,
  BatteryLowIcon,
  Heart,
  Smile,
  Frown,
  Meh
} from 'lucide-react'

interface EnergyCheckProps {
  dashboardData?: any;
}

interface EnergyLevel {
  level: 'high' | 'medium' | 'low'
  icon: React.ReactNode
  recommendation: string
  workout: string
}

const energyLevels: Record<string, EnergyLevel> = {
  high: {
    level: 'high',
    icon: <BatteryFullIcon className="text-green-500" size={24} />,
    recommendation: "You're charged up! Perfect for an intense workout.",
    workout: "Today's Pick: High-Intensity Interval Training (HIIT)",
  },
  medium: {
    level: 'medium',
    icon: <BatteryMediumIcon className="text-yellow-500" size={24} />,
    recommendation: "You've got steady energy. Good for moderate exercise.",
    workout: "Today's Pick: Moderate Cardio & Strength Training",
  },
  low: {
    level: 'low',
    icon: <BatteryLowIcon className="text-red-500" size={24} />,
    recommendation: 'Taking it easy today might be best.',
    workout: "Today's Pick: Light Yoga or Recovery Exercises",
  },
}

const moodIcons = {
  1: <Frown className="text-red-500" size={20} />,
  2: <Frown className="text-orange-500" size={20} />,
  3: <Meh className="text-yellow-500" size={20} />,
  4: <Smile className="text-green-500" size={20} />,
  5: <Smile className="text-green-600" size={20} />
};

const EnergyCheck: React.FC<EnergyCheckProps> = ({ dashboardData }) => {
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load current energy/mood from dashboard data
    if (dashboardData?.dailyStats) {
      const stats = dashboardData.dailyStats;
      if (stats.energyLevel) {
        const energyMap: Record<number, string> = { 5: 'high', 4: 'high', 3: 'medium', 2: 'low', 1: 'low' };
        setSelectedEnergy(energyMap[stats.energyLevel as number] || 'medium');
      }
      if (stats.moodRating) {
        setSelectedMood(stats.moodRating);
      }
    }
  }, [dashboardData]);

  const saveEnergyMood = async (energy: string, mood: number) => {
    setSaving(true);
    try {
      const response = await fetch('/api/dashboard/daily-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energyLevel: energy === 'high' ? 5 : energy === 'medium' ? 3 : 1,
          moodRating: mood
        })
      });
      
      if (!response.ok) {
        console.error('Failed to save energy/mood data');
      }
    } catch (error) {
      console.error('Error saving energy/mood:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEnergySelect = (energy: string) => {
    setSelectedEnergy(energy);
    if (selectedMood) {
      saveEnergyMood(energy, selectedMood);
    }
  };

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    if (selectedEnergy) {
      saveEnergyMood(selectedEnergy, mood);
    }
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        How&apos;s Your Energy Today?
      </h2>
      
      {/* Energy Level Selection */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Object.entries(energyLevels).map(([key, { level, icon }]) => (
          <button
            key={key}
            onClick={() => handleEnergySelect(key)}
            disabled={saving}
            className={`p-3 rounded-lg border-2 transition-all disabled:opacity-50 ${
              selectedEnergy === key 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <div className="flex flex-col items-center">
              {icon}
              <span className="mt-1 text-sm capitalize">{level}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Mood Rating */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Mood Rating</h3>
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((mood) => (
            <button
              key={mood}
              onClick={() => handleMoodSelect(mood)}
              disabled={saving}
              className={`p-2 rounded-full transition-all disabled:opacity-50 ${
                selectedMood === mood
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              {moodIcons[mood as keyof typeof moodIcons]}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Current Status Display */}
      {dashboardData?.dailyStats && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-500" />
              <span>Today&apos;s Status:</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Energy: {selectedEnergy ? selectedEnergy.charAt(0).toUpperCase() + selectedEnergy.slice(1) : 'Not set'}
              </span>
              <span className="text-gray-600">
                Mood: {selectedMood ? `${selectedMood}/5` : 'Not set'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {selectedEnergy && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">
            {energyLevels[selectedEnergy].recommendation}
          </p>
          <p className="font-medium text-blue-600">
            {energyLevels[selectedEnergy].workout}
          </p>
        </div>
      )}
      
      {saving && (
        <div className="text-center text-sm text-blue-600 mt-2">
          Saving your status...
        </div>
      )}
    </div>
  )
}
export default EnergyCheck
