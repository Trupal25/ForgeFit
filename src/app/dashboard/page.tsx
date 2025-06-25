'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Dumbbell, Calendar, TrendingUp, Settings, Search, ChevronRight } from 'lucide-react';
import SignOutButton from '@/components/auth/SignOutButton';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [nutritionTip, setNutritionTip] = useState<string>('');
  const [isLoadingTip, setIsLoadingTip] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Array of nutrition tips - memoized to prevent unnecessary recreation
  const nutritionTips = useMemo(() => [
    "Protein helps repair muscles after workouts.",
    "Hydration is key for optimal performance.",
    "Healthy carbs provide energy for your workouts.",
    "Omega-3 fatty acids support recovery and reduce inflammation.",
    "Antioxidants help reduce exercise-induced oxidative stress.",
    "Eating within 30 minutes post-workout maximizes recovery.",
    "Fiber helps maintain steady energy levels throughout the day."
  ], []);
  
  // Load a random nutrition tip
  useEffect(() => {
    setIsLoadingTip(true);
    
    // Simulate API call to get nutrition tip
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * nutritionTips.length);
      setNutritionTip(nutritionTips[randomIndex]);
      setIsLoadingTip(false);
    }, 1000);
    
    // Load recent nutrition searches from local storage
    const storedSearches = localStorage.getItem('recentNutritionSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, [nutritionTips]);
  
  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  const handleNutritionSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('searchQuery') as HTMLInputElement;
    const searchQuery = input.value.trim();
    
    if (searchQuery) {
      // Save to recent searches
      const updatedSearches = [searchQuery, ...recentSearches.slice(0, 2)];
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentNutritionSearches', JSON.stringify(updatedSearches));
      
      // Redirect to nutrition page with the search query
      window.location.href = `/nutrition?query=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (status === 'unauthenticated') {
    window.location.href = '/signin';
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showMobileMenu={toggleMobileMenu} />
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <nav className="flex flex-col space-y-2">
            <Link href="/workouts" className="px-3 py-2 rounded-md hover:bg-gray-100">Workouts</Link>
            <Link href="/nutrition" className="px-3 py-2 rounded-md hover:bg-gray-100">Nutrition</Link>
            <Link href="/calendar" className="px-3 py-2 rounded-md hover:bg-gray-100">Calendar</Link>
            <Link href="/profile" className="px-3 py-2 rounded-md hover:bg-gray-100">Profile</Link>
            <div className="pt-2 border-t border-gray-100">
              <SignOutButton variant="subtle" className="w-full justify-start" />
            </div>
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User welcome card */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-md p-6 text-white col-span-full">
            <h2 className="text-xl font-bold mb-2">Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}!</h2>
            <p className="opacity-90">Ready to continue your fitness journey today?</p>
            <div className="mt-4 flex space-x-2">
              <Link href="/workouts/new" className="px-4 py-2 bg-white text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                Start Workout
              </Link>
              <Link href="/nutrition" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors border border-blue-400">
                Nutrition Guide
              </Link>
            </div>
          </div>
          
          {/* Nutrition Search Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 col-span-full lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Quick Nutrition Search</h3>
              <Link href="/nutrition" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <form onSubmit={handleNutritionSearch} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  name="searchQuery"
                  placeholder="Search for any food (e.g., apple, chicken, rice...)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
            
            {recentSearches.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Link 
                      key={index} 
                      href={`/nutrition?query=${encodeURIComponent(search)}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-800 transition-colors"
                    >
                      {search}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Nutrition Tip</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {isLoadingTip ? 'Loading tip...' : nutritionTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/workouts" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Dumbbell className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-sm">Workouts</span>
              </Link>
              <Link href="/nutrition" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <TrendingUp className="h-6 w-6 text-green-500 mb-2" />
                <span className="text-sm">Nutrition</span>
              </Link>
              <Link href="/calendar" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Calendar className="h-6 w-6 text-purple-500 mb-2" />
                <span className="text-sm">Calendar</span>
              </Link>
              <Link href="/settings" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="h-6 w-6 text-gray-500 mb-2" />
                <span className="text-sm">Settings</span>
              </Link>
            </div>
          </div>
          
          {/* Activity summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">This Week</span>
                <span className="text-sm font-medium">3 workouts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <YoureOnTrack />
            </div>
          </div>
          
          {/* Profile info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Profile</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500 block">Email</span>
                <span className="font-medium">{session?.user?.email}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">Member Since</span>
                <span className="font-medium">Today</span>
              </div>
              <div className="pt-2">
                <Link href="/profile" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  Complete your profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function YoureOnTrack() {
  return (
    <p className="text-sm text-gray-600">You&apos;re on track to reach your weekly goal of 5 workouts!</p>
  );
} 