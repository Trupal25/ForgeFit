'use client'

import React, { useState, useEffect } from 'react'
import { SearchIcon, Loader2 } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

type AminoAcids = {
  leucine?: string;
  lysine?: string;
  valine?: string;
  isoleucine?: string;
  threonine?: string;
  methionine?: string;
  phenylalanine?: string;
  tryptophan?: string;
  histidine?: string;
}

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
  aminoAcids?: AminoAcids | null;
}

type NutritionResponse = {
  items: NutritionItem[];
}

type MacroNutrient = {
  name: string;
  value: number;
  color: string;
}

type NutritionDetails = {
  servingSize: number;
  sodium: number;
  potassium: number;
  cholesterol: number;
  fiber: number;
  sugar: number;
  aminoAcids?: AminoAcids | null;
}

type FoodData = {
  name: string;
  macros: MacroNutrient[];
  calories: number;
  details?: NutritionDetails;
}

interface NutritionCardProps {
  initialQuery?: string;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ initialQuery = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [foodData, setFoodData] = useState<FoodData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Perform search when initialQuery changes or on component mount if initialQuery exists
  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
      fetchNutritionData(initialQuery);
    }
  }, [initialQuery]);
  
  const fetchNutritionData = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/nutrition/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search: query
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch nutrition data');
      }
      
      const data: NutritionResponse = await response.json();
      console.log('API response:', data);
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
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
            sugar: item.sugar_g,
            aminoAcids: item.aminoAcids
          }
        });
      } else {
        setError('No nutrition data found for this food');
        setFoodData(null);
      }
    } catch (err) {
      console.error('Error fetching nutrition data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch nutrition data');
      setFoodData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchNutritionData(searchTerm);
    
    // Save recent search to localStorage
    try {
      const storedSearches = localStorage.getItem('recentNutritionSearches');
      let recentSearches: string[] = storedSearches ? JSON.parse(storedSearches) : [];
      
      // Add current search to the beginning and remove duplicates
      recentSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      localStorage.setItem('recentNutritionSearches', JSON.stringify(recentSearches));
    } catch (err) {
      console.error('Error saving search history:', err);
    }
  };

  // Helper function to format amino acid values
  const formatAminoAcid = (value: string | undefined) => {
    if (!value) return 'N/A';
    return value.includes('mg') || value.includes('g') ? value : `${value}mg`;
  };

  // Check if amino acids data is available
  const hasAminoAcids = foodData?.details?.aminoAcids && 
    Object.values(foodData.details.aminoAcids).some(value => value && value.trim() !== '');
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Nutrition Lookup
      </h2>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter a food (e.g., apple, chicken, etc.)"
            className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 sm:py-2 sm:px-4 bg-blue-600 text-white rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center min-w-0 sm:min-w-[auto]"
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
                  {foodData.macros.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}g`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {foodData.macros.map((macro, index) => (
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
            <div className="mt-6 space-y-4">
              {/* Basic Nutrition Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Nutrition Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Serving Size: <span className="font-medium">{foodData.details.servingSize}g</span></div>
                  <div>Sodium: <span className="font-medium">{foodData.details.sodium}mg</span></div>
                  <div>Fiber: <span className="font-medium">{foodData.details.fiber}g</span></div>
                  <div>Sugar: <span className="font-medium">{foodData.details.sugar}g</span></div>
                  <div>Potassium: <span className="font-medium">{foodData.details.potassium}mg</span></div>
                  <div>Cholesterol: <span className="font-medium">{foodData.details.cholesterol}mg</span></div>
                </div>
              </div>

              {/* Amino Acids Section - Only show if data is available */}
              {hasAminoAcids && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Essential Amino Acids Profile
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {foodData.details.aminoAcids && Object.entries(foodData.details.aminoAcids).map(([key, value]) => (
                      value && (
                        <div key={key} className="bg-gray-50 p-2 rounded">
                          <div className="capitalize text-gray-600 text-xs">{key}</div>
                          <div className="font-medium text-gray-800">{formatAminoAcid(value)}</div>
                        </div>
                      )
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Amino acids help build and repair muscle tissue
                  </p>
                </div>
              )}
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
