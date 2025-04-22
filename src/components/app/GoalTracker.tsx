import React from 'react'
import { TargetIcon, TrendingUpIcon } from 'lucide-react'
const GoalTracker: React.FC = () => {
  const goals = {
    primary: {
      type: 'Weight Loss',
      target: 'Lose 15 lbs',
      timeline: '3 months',
      progress: 40,
      recommendation:
        "Today's plan recommends high protein intake to support muscle retention during weight loss.",
    },
  }
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Goal Tracking</h2>
        <TargetIcon className="text-blue-500" size={24} />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">{goals.primary.type}</h3>
            <p className="text-sm text-gray-500">
              Target: {goals.primary.target}
            </p>
          </div>
          <span className="text-sm font-medium text-blue-600">
            {goals.primary.timeline} remaining
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: `${goals.primary.progress}%`,
            }}
          />
        </div>
        <div className="flex items-start p-4 bg-blue-50 rounded-lg">
          <TrendingUpIcon className="text-blue-500 mr-3 mt-1" size={20} />
          <p className="text-sm text-gray-600">
            {goals.primary.recommendation}
          </p>
        </div>
      </div>
    </div>
  )
}
export default GoalTracker
