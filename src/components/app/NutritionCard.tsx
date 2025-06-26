'use client'

import React, { useState, useEffect, useRef } from 'react'
import { SearchIcon, Loader2, Camera, Upload, X } from 'lucide-react'
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [searchMode, setSearchMode] = useState<'text' | 'image'>('text')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
      
      processNutritionResponse(data);
    } catch (err) {
      console.error('Error fetching nutrition data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch nutrition data');
      setFoodData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchNutritionFromImage = async (imageBase64: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/nutrition/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: imageBase64
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }
      
      const data: NutritionResponse = await response.json();
      console.log('Image API response:', data);
      
      processNutritionResponse(data);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      setFoodData(null);
    } finally {
      setLoading(false);
    }
  };

  const processNutritionResponse = (data: NutritionResponse) => {
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
      setError('No nutrition data found');
      setFoodData(null);
    }
  };
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'text') {
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
    } else if (uploadedImage) {
      await fetchNutritionFromImage(uploadedImage);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image file size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Extract base64 data (remove data:image/type;base64, prefix)
        const base64Data = result.split(',')[1];
        setUploadedImage(base64Data);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setUploadedImage(null);
    setFoodData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const switchToTextMode = () => {
    setSearchMode('text');
    clearImage();
  };

  const switchToImageMode = () => {
    setSearchMode('image');
    setSearchTerm('');
    setFoodData(null);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Nutrition Lookup
        </h2>
        
        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={switchToTextMode}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              searchMode === 'text' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <SearchIcon size={16} className="inline mr-1" />
            Text
          </button>
          <button
            type="button"
            onClick={switchToImageMode}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              searchMode === 'image' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Camera size={16} className="inline mr-1" />
            Photo
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        {searchMode === 'text' ? (
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
        ) : (
          <div className="space-y-4">
            {/* Image Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                uploadedImage 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {uploadedImage ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center text-green-600">
                    <Camera size={24} className="mr-2" />
                    <span className="font-medium">Image uploaded successfully!</span>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={clearImage}
                      className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-1"
                    >
                      <X size={16} />
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={handleImageUploadClick}
                      className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1"
                    >
                      <Upload size={16} />
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center text-gray-400">
                    <Camera size={48} />
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Upload a photo of your food</p>
                    <p className="text-sm text-gray-500 mt-1">AI will analyze the nutrition content</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleImageUploadClick}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Upload size={20} />
                    Choose Image
                  </button>
                  <p className="text-xs text-gray-500">Max file size: 5MB</p>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Analyze button */}
            {uploadedImage && (
              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-green-400 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing image...
                  </>
                ) : (
                  <>
                    <Camera size={20} />
                    Analyze Nutrition
                  </>
                )}
              </button>
            )}
          </div>
        )}
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
            {searchMode === 'text' ? (
              <>
                <SearchIcon size={48} className="mb-2" />
                <p>Search for a food to see its nutritional breakdown</p>
                <p className="text-sm mt-1">
                  Try: chicken, apple, banana, rice...
                </p>
              </>
            ) : (
              <>
                <Camera size={48} className="mb-2" />
                <p>Upload a photo to analyze nutrition content</p>
                <p className="text-sm mt-1">
                  AI will identify foods and calculate nutrition
                </p>
              </>
            )}
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
