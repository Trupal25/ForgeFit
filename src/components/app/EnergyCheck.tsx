"use client"
import React, { useState } from 'react'
import {
  BatteryFullIcon,
  BatteryMediumIcon,
  BatteryLowIcon,
} from 'lucide-react'
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
const EnergyCheck: React.FC = () => {
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null)
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        How&apos;s Your Energy Today?
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(energyLevels).map(([key, { level, icon }]) => (
          <button
            key={key}
            onClick={() => setSelectedEnergy(key)}
            className={`p-4 rounded-lg border-2 transition-all ${selectedEnergy === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
          >
            <div className="flex flex-col items-center">
              {icon}
              <span className="mt-2 capitalize">{level}</span>
            </div>
          </button>
        ))}
      </div>
      {selectedEnergy && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">
            {energyLevels[selectedEnergy].recommendation}
          </p>
          <p className="font-medium text-blue-600">
            {energyLevels[selectedEnergy].workout}
          </p>
        </div>
      )}
    </div>
  )
}
export default EnergyCheck
