'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Dumbbell, User, Menu } from 'lucide-react';
import { Metal_Mania } from 'next/font/google';
import SignOutButton from '@/components/auth/SignOutButton';
import Link from 'next/link';

const logoFont = Metal_Mania({ 
  weight: '400',
  subsets: ['latin'] 
});

interface HeaderProps {
  showMobileMenu?: () => void;
}

export default function Header({ showMobileMenu }: HeaderProps) {
  const { data: session, status } = useSession();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Dumbbell className="h-8 w-8 text-blue-600 mr-3" />
          <Link href="/dashboard">
            <h1 className={`text-2xl font-bold text-gray-900 ${logoFont.className}`}>ForgeFit</h1>
          </Link>
        </div>
        
        {status === 'authenticated' && (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/workouts" className="text-gray-600 hover:text-blue-600">Workouts</Link>
              <Link href="/nutrition" className="text-gray-600 hover:text-blue-600">Nutrition</Link>
              <Link href="/calendar" className="text-gray-600 hover:text-blue-600">Calendar</Link>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                {session?.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                {session?.user?.name || 'User'}
              </span>
            </div>
            
            <div className="hidden md:block">
              <SignOutButton variant="icon" />
            </div>
            
            <button 
              onClick={showMobileMenu}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
} 