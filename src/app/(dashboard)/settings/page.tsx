"use client";

import SettingsNav from '@/components/app/SettingsNav';
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings navigation */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <SettingsNav />
          </div>
        </div>

          {/* Todo: add details like account settings in this after database setup */}

        {/* Account settings form */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Account Settings</h2>
              <p className="text-gray-500 mt-1">Update your personal information and preferences.</p>
            </div>
            
            <div className="p-6">
              <form>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        defaultValue="Trupal"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        defaultValue="Patel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue="trupal@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        @
                      </span>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        defaultValue="trupal25"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      Fitness Goals
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {["Weight Loss", "Build Muscle", "Improve Fitness", "Maintain Weight", "Increase Flexibility", "Enhance Performance"].map((goal, i) => (
                        <label key={i} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={i === 0 || i === 2}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="text-sm">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      defaultValue="Fitness enthusiast focusing on strength training and weight management."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                    <p className="mt-1 text-sm text-gray-500">Brief description for your profile.</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
                    <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 