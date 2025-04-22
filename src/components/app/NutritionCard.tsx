'use client'

import React, { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
const NutritionCard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [foodData, setFoodData] = useState<any>(null)
  
  // Mock food database
  const mockFoods = {
    'chicken breast': {
      protein: 31,
      carbs: 0,
      fat: 3.6,
    },
    'brown rice': {
      protein: 5,
      carbs: 45,
      fat: 1.8,
    },
    salmon: {
      protein: 25,
      carbs: 0,
      fat: 13,
    },
    banana: {
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
    },
    broccoli: {
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
    },
    egg: {
      protein: 6,
      carbs: 0.6,
      fat: 5,
    },
    avocado: {
      protein: 2,
      carbs: 9,
      fat: 15,
    },
    oatmeal: {
      protein: 5,
      carbs: 27,
      fat: 3,
    },
    'greek yogurt': {
      protein: 10,
      carbs: 4,
      fat: 0.4,
    },
    'sweet potato': {
      protein: 2,
      carbs: 20,
      fat: 0.1,
    },
  }
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedSearch = searchTerm.toLowerCase()
    if (mockFoods[normalizedSearch as keyof typeof mockFoods]) {
      const food = mockFoods[normalizedSearch as keyof typeof mockFoods]
      setFoodData({
        name: searchTerm.toLowerCase(),
        macros: [
          {
            name: 'Protein',
            value: food.protein,
            color: '#FFCE56',
          },
          {
            name: 'Carbs',
            value: food.carbs,
            color: '#60a5fa',
          },
          {
            name: 'Fat',
            value: food.fat,
            color: '#f87171',
          },
        ],
        calories: Math.round(food.protein * 4 + food.carbs * 4 + food.fat * 9),
      })
    } else {
      // If food not found, set example data
      setFoodData({
        name: searchTerm.toLowerCase(),
        macros: [
          {
            name: 'Protein',
            value: 15,
            color: '#FFCE56',
          },
          {
            name: 'Carbs',
            value: 30,
            color: '#60a5fa',
          },
          {
            name: 'Fat',
            value: 8,
            color: '#f87171',
          },
        ],
        calories: 252,
      })
    }
  }
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Nutrition Lookup
      </h2>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter a food (e.g., chicken breast)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            <SearchIcon size={20} />
          </button>
        </div>
      </form>
      {foodData ? (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium capitalize">{foodData.name}</h3>
            <span className="text-gray-700 font-semibold">
              {foodData.calories} calories
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={foodData.macros}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {foodData.macros.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}g`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {foodData.macros.map((macro: any, index: number) => (
              <div key={index} className="text-center">
                <p className="text-sm text-gray-500">{macro.name}</p>
                <p
                  className="text-xl font-semibold"
                  style={{
                    color: macro.color,
                  }}
                >
                  {macro.value}g
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <SearchIcon size={48} className="mb-2" />
          <p>Search for a food to see its nutritional breakdown</p>
          <p className="text-sm mt-1">
            Try: chicken breast, banana, avocado...
          </p>
        </div>
      )}
    </div>
  )
}
export default NutritionCard
