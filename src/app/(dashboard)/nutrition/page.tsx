"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NutritionCard from '@/components/app/NutritionCard';
import { PlusCircle, Info } from 'lucide-react';

export default function NutritionPage() {
  const [showApiInfo, setShowApiInfo] = useState(false);
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('query') || '';

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
          <p className="mb-2">
            The nutrition lookup feature uses the CalorieNinjas API to fetch real nutritional data for various foods.
          </p>
          <p>
            Simply type a food name in the search box and click the search button to get detailed nutritional information.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NutritionCard initialQuery={initialQuery} />
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