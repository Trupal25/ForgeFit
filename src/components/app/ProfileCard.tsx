"use client";

import { Award, Camera, Edit, User } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    image?: string;
    createdAt: Date;
  };
  stats: {
    totalWorkouts: number;
    currentStreak: number;
    longestStreak: number;
  };
}

export default function ProfileCard(){
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

  if (loading) {
    return (
      <div className="lg:w-1/3 animate-pulse">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-200 h-32"></div>
          <div className="pt-14 pb-6 px-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const memberSince = profileData?.user.createdAt 
    ? new Date(profileData.user.createdAt).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : 'Recently';

  return(
        <div className="lg:w-1/3">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-blue-600 h-32 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                <User size={40} className="text-gray-400" />
              </div>
            </div>
            <button className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
              <Camera size={18} />
            </button>
          </div>
          
          <div className="pt-14 pb-6 px-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{profileData?.user.name || 'User'}</h2>
                <p className="text-gray-500">@{profileData?.user.username || 'user'}</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Edit size={18} className="text-gray-400" />
              </button>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p>{profileData?.user.email || 'No email'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p>{memberSince}</p>
              </div>

            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-4">
              <div>
                <p className="text-2xl font-bold text-blue-600">{profileData?.stats.totalWorkouts || 0}</p>
                <p className="text-sm text-gray-500">Workouts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{profileData?.stats.currentStreak || 0}</p>
                <p className="text-sm text-gray-500">Days Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{profileData?.stats.longestStreak || 0}</p>
                <p className="text-sm text-gray-500">Best Streak</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Achievements</h2>
            <button className="text-sm text-blue-600">View All</button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {["Early Bird", "Consistency", "Strength"].map((badge, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Award size={24} className="text-blue-600" />
                </div>
                <p className="text-xs text-center">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      </div>        
    )
}