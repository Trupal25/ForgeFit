"use client"
import React from 'react'
import {
  FootprintsIcon,
  DropletsIcon,
  FlameIcon,
  HeartIcon,
  BedIcon,
  ActivityIcon,
} from 'lucide-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
interface StatsCardProps {
  title: string
  value: string
  target?: string
  icon: string
  trend?: number
}
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  target,
  icon,
  trend,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'footprints':
        return <FootprintsIcon size={24} className="text-blue-500" />
      case 'droplets':
        return <DropletsIcon size={24} className="text-blue-500" />
      case 'flame':
        return <FlameIcon size={24} className="text-orange-500" />
      case 'heart':
        return <HeartIcon size={24} className="text-red-500" />
      case 'bed':
        return <BedIcon size={24} className="text-indigo-500" />
      default:
        return <ActivityIcon size={24} className="text-green-500" />
    }
  }
  const percentage = target
    ? Math.min(
        Math.round(
          (parseFloat(value.replace(/,/g, '')) /
            parseFloat(target.replace(/,/g, ''))) *
            100,
        ),
        100,
      )
    : 100
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 font-medium">{title}</h3>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {target && (
              <p className="ml-2 text-sm text-gray-500">of {target}</p>
            )}
          </div>
        </div>
        {renderIcon()}
      </div>
      {target && (
        <div className="flex items-center justify-between">
          <div className="w-24 h-24">
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                pathColor: '#3b82f6',
                textColor: '#1f2937',
                trailColor: '#e5e7eb',
              })}
            />
          </div>
          <div className="flex-1 ml-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">Daily Progress</p>
              <p className="text-xs font-medium text-blue-600">
                {value} / {target}
              </p>
            </div>
            {trend && (
              <p className="text-xs text-green-500 mt-2">
                +{trend}% from last week
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default StatsCard
