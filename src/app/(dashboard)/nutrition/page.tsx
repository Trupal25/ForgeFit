"use client";

import React, { useState } from 'react';
import NutritionCard from '@/components/app/NutritionCard';
import { PlusCircle, Info } from 'lucide-react';

export default function NutritionPage() {
  const [showApiInfo, setShowApiInfo] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Nutrition</h1>
          <p className="text-gray-600">
            Track your nutrition and search for nutritional information to reach your fitness goals.
          </p>
        </div>
        <button 
          onClick={() => setShowApiInfo(!showApiInfo)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="About this feature"
        >
          <Info size={24} />
        </button>
      </div>

      {showApiInfo && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm">
          <h3 className="font-semibold text-blue-800 mb-2">About Nutrition Lookup</h3>
          <div className="space-y-2">
            <p>
              <strong>Text Search:</strong> Uses the CalorieNinjas API to fetch nutritional data for various foods. Simply type a food name and search.
            </p>
            <p>
              <strong>Photo Analysis:</strong> Uses Google's Gemini AI to analyze food images and calculate nutrition content. Upload a photo of your meal for instant analysis.
            </p>
            <p className="text-blue-700 font-medium">
              💡 Pro tip: The AI can identify multiple foods in one image and provide comprehensive nutrition breakdown!
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NutritionCard />
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Meal Plans</h2>
          <p className="text-gray-600 mb-4">
            Create custom meal plans based on your nutrition goals. Save your favorite foods and track your daily intake.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-700">
              Track your meals over time and see nutritional insights to help optimize your fitness journey.
            </p>
          </div>
          <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <PlusCircle size={18} />
            Create Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
} 