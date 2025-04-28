"use client";

import React from 'react';
import { User, Edit, Camera, Dumbbell, Calendar, Award, BarChart } from 'lucide-react';
import ProfileCard from '@/components/app/ProfileCard';

export default function ProfilePage() {
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
                <p className="text-2xl font-bold">179 lbs</p>
                <p className="text-sm text-green-500">-6 lbs (30 days)</p>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <BarChart size={18} className="text-blue-600 mr-2" />
                  <h3 className="font-medium">Avg. Calories</h3>
                </div>
                <p className="text-2xl font-bold">2,140 cal</p>
                <p className="text-sm text-gray-500">Daily (last week)</p>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar size={18} className="text-blue-600 mr-2" />
                  <h3 className="font-medium">Active Days</h3>
                </div>
                <p className="text-2xl font-bold">18 / 30</p>
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
              {[
                {type: "workout", name: "Full Body Strength", date: "Today, 07:15 AM"},
                {type: "weight", value: "179 lbs", date: "Yesterday, 08:30 PM"},
                {type: "workout", name: "HIIT Cardio", date: "April 20, 06:45 AM"},
                {type: "goal", name: "Weight Goal Updated", date: "April 18, 10:20 AM"}
              ].map((activity, i) => (
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
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
} 