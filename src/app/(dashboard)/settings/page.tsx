"use client";

import SettingsNav from '@/components/app/SettingsNav';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserData {
  name: string;
  email: string;
  username: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    username: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const result = await response.json();
        setUserData({
          name: result.data.user.name || '',
          email: result.data.user.email || '',
          username: result.data.user.username || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userData.name,
          username: userData.username
        })
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };
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
              {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  message.includes('success') 
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                        value={userData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
                  

                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
                    <button 
                      type="button" 
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      disabled={saving}
                    >
                      Reset
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading || saving}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
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