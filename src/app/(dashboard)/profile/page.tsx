"use client";

import { Dumbbell, Calendar, Award, BarChart } from 'lucide-react';
import ProfileCard from '@/components/app/ProfileCard';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface ProfileData {
  user: {
    name: string;
    email: string;
  };
  stats: {
    currentWeight: number;
    weightChange: number;
    avgCalories: number;
    activeDaysThisMonth: number;
    totalDaysInMonth: number;
  };
  recentActivity: Array<{
    type: string;
    name?: string;
    value?: string;
    date: Date;
  }>;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchProfileData();
    }
  }, [session]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const result = await response.json();
        setProfileData(result.data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account and view your fitness progress.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Card */}
       
       <ProfileCard />

        
        {/* Stats and Activity */}
        <div className="lg:w-2/3 space-y-6">
          {/* Stats Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Fitness Stats</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Dumbbell size={18} className="text-blue-600 mr-2" />
                  <h3 className="font-medium">Current Weight</h3>
                </div>
                <p className="text-2xl font-bold">
                  {profileData?.stats.currentWeight ? `${profileData.stats.currentWeight} lbs` : 'Not set'}
                </p>
                <p className={`text-sm ${
                  !profileData?.stats.weightChange ? 'text-gray-500' :
                  profileData.stats.weightChange < 0 ? 'text-green-500' : 'text-orange-500'
                }`}>
                  {profileData?.stats.weightChange 
                    ? `${profileData.stats.weightChange > 0 ? '+' : ''}${profileData.stats.weightChange} lbs (30 days)`
                    : 'No change data'
                  }
                </p>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <BarChart size={18} className="text-blue-600 mr-2" />
                  <h3 className="font-medium">Avg. Calories</h3>
                </div>
                <p className="text-2xl font-bold">
                  {profileData?.stats.avgCalories ? `${profileData.stats.avgCalories} cal` : 'No data'}
                </p>
                <p className="text-sm text-gray-500">Daily (last week)</p>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar size={18} className="text-blue-600 mr-2" />
                  <h3 className="font-medium">Active Days</h3>
                </div>
                <p className="text-2xl font-bold">
                  {profileData?.stats.activeDaysThisMonth || 0} / {profileData?.stats.totalDaysInMonth || 30}
                </p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <button className="text-sm text-blue-600">View All</button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="flex items-start py-3 border-b border-gray-100 last:border-0 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : profileData?.recentActivity && profileData.recentActivity.length > 0 ? (
                profileData.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start py-3 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-3">
                      {activity.type === "workout" ? (
                        <Dumbbell size={20} className="text-blue-600" />
                      ) : activity.type === "weight" ? (
                        <BarChart size={20} className="text-blue-600" />
                      ) : (
                        <Award size={20} className="text-blue-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {activity.type === "workout" ? `Completed: ${activity.name}` : 
                             activity.type === "weight" ? `Weight Updated: ${activity.value}` :
                             activity.name}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award size={36} className="mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start tracking your workouts to see activity here!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
} 