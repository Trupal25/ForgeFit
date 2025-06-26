"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import EnergyCheck from "@/components/app/EnergyCheck"
import GoalTracker from "@/components/app/GoalTracker" 
import NutritionCard from "@/components/app/NutritionCard"
import StatsCard from "@/components/app/StatsCard"
import WorkoutSummaryCard from "@/components/app/WorkoutSummaryCard"
import ProgressCard from "@/components/app/ProgressCard"

interface DashboardData {
  goals: any[];
  dailyStats: any;
  recentWorkouts: any[];
  upcomingWorkouts: any[];
  weightProgress: any[];
  weeklyProgress: any;
  userProfile: any;
  workoutStreak: number;
  summary: any;
}

export default function Home(){
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setDashboardData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const userName = session?.user?.name?.split(' ')[0] || 'there';
  const stats = dashboardData?.dailyStats || {};

  const seedSampleData = async () => {
    try {
      const response = await fetch('/api/dashboard/seed', { method: 'POST' });
      if (response.ok) {
        await fetchDashboardData(); // Refresh data
        alert('Sample data created successfully!');
      } else {
        alert('Failed to create sample data');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Error creating sample data');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="text-2xl font-bold text-gray-800">
          Welcome Back, {userName}! 👋
        </div>
        {(!dashboardData?.goals?.length || dashboardData.goals.length === 0) && (
          <button
            onClick={seedSampleData}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
          >
            Create Sample Data
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <GoalTracker dashboardData={dashboardData} />
        <ProgressCard />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <WorkoutSummaryCard dashboardData={dashboardData} />
        <StatsCard
          title="Daily Steps"
          value={stats.steps?.toLocaleString() || "0"}
          target={stats.stepsGoal?.toLocaleString() || "10,000"}
          icon="footprints"
          trend={12}
        />
        <StatsCard
          title="Water Intake"
          value={`${stats.waterIntake ? Math.round(stats.waterIntake * 10) / 10 : 0}L`}
          target={`${stats.waterGoal || 2.5}L`}
          icon="droplets"
          trend={5}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NutritionCard />
        <EnergyCheck dashboardData={dashboardData} />
      </div>
    </div>
  );
}