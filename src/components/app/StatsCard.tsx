import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUpIcon } from 'lucide-react'
const ProgressCard: React.FC = () => {
  // Mock weight data for the past 30 days
  const weightData = [
    {
      day: '1',
      weight: 185,
    },
    {
      day: '5',
      weight: 184,
    },
    {
      day: '10',
      weight: 183,
    },
    {
      day: '15',
      weight: 182.5,
    },
    {
      day: '20',
      weight: 181,
    },
    {
      day: '25',
      weight: 180,
    },
    {
      day: '30',
      weight: 179,
    },
  ]
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Weight Progress</h2>
        <div className="flex items-center text-green-500">
          <TrendingUpIcon size={20} className="mr-1" />
          <span className="font-medium">-6 lbs</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={weightData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
              }}
              tickFormatter={(day) => `Day ${day}`}
            />
            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
              }}
            />
            <Tooltip
              labelFormatter={(day) => `Day ${day}`}
              formatter={(value) => [`${value} lbs`, 'Weight']}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{
                r: 4,
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 flex justify-between">
        <div>
          <p className="text-sm text-gray-500">Starting Weight</p>
          <p className="text-lg font-semibold text-gray-800">185 lbs</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Weight</p>
          <p className="text-lg font-semibold text-gray-800">179 lbs</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Goal Weight</p>
          <p className="text-lg font-semibold text-gray-800">170 lbs</p>
        </div>
      </div>
    </div>
  )
}
export default ProgressCard
