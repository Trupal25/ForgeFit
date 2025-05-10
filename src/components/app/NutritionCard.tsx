'use client'

import React, { useState } from 'react'
import { SearchIcon, Loader2 } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

type NutritionItem = {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

type NutritionResponse = {
  items: NutritionItem[];
}

const NutritionCard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [foodData, setFoodData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search: searchTerm
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch nutrition data')
      }
      
      const data: NutritionResponse = await response.json()
      console.log('API response:', data)
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0]
        setFoodData({
          name: item.name,
          macros: [
            {
              name: 'Protein',
              value: Math.round(item.protein_g * 10) / 10,
              color: '#FFCE56',
            },
            {
              name: 'Carbs',
              value: Math.round(item.carbohydrates_total_g * 10) / 10,
              color: '#60a5fa',
            },
            {
              name: 'Fat',
              value: Math.round(item.fat_total_g * 10) / 10,
              color: '#f87171',
            },
          ],
          calories: Math.round(item.calories),
          details: {
            servingSize: item.serving_size_g,
            sodium: item.sodium_mg,
            potassium: item.potassium_mg,
            cholesterol: item.cholesterol_mg,
            fiber: item.fiber_g,
            sugar: item.sugar_g
          }
        })
      } else {
        setError('No nutrition data found for this food')
        setFoodData(null)
      }
    } catch (err) {
      console.error('Error fetching nutrition data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch nutrition data')
      setFoodData(null)
    } finally {
      setLoading(false)
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
            placeholder="Enter a food (e.g., apple, chicken, etc.)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <SearchIcon size={20} />}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      )}
      
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
          
          {foodData.details && (
            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium mb-2">Additional Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Serving Size: <span className="font-medium">{foodData.details.servingSize}g</span></div>
                <div>Sodium: <span className="font-medium">{foodData.details.sodium}mg</span></div>
                <div>Fiber: <span className="font-medium">{foodData.details.fiber}g</span></div>
                <div>Sugar: <span className="font-medium">{foodData.details.sugar}g</span></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        !loading && !error && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <SearchIcon size={48} className="mb-2" />
            <p>Search for a food to see its nutritional breakdown</p>
            <p className="text-sm mt-1">
              Try: chicken, apple, banana, rice...
            </p>
          </div>
        )
      )}
      
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Loader2 size={48} className="mb-2 animate-spin" />
          <p>Loading nutrition data...</p>
        </div>
      )}
    </div>
  )
}

export default NutritionCard
