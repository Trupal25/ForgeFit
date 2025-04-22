"use client";

import React from 'react';
import NutritionCard from '@/components/app/NutritionCard';

export default function NutritionPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Nutrition</h1>
        <p className="text-gray-600">Track your nutrition and meal plans to reach your fitness goals.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NutritionCard />
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Meal Plans</h2>
          <p className="text-gray-600">Your meal plans will appear here once you create them.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Create Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
} 