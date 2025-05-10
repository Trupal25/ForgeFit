'use client';

import { LogOut, Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface SignOutButtonProps {
  variant?: 'default' | 'subtle' | 'icon';
  className?: string;
}

export default function SignOutButton({ 
  variant = 'default',
  className = ''
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: '/signin' });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (variant === 'icon') {
    return (
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className={`p-2 text-gray-500 hover:text-gray-700 focus:outline-none ${className}`}
        aria-label="Sign out"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <LogOut className="h-5 w-5" />
        )}
      </button>
    );
  }
  
  if (variant === 'subtle') {
    return (
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className={`flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors ${className}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4 mr-2" />
        )}
        Sign out
      </button>
    );
  }
  
  // Default variant
  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={`flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </>
      )}
    </button>
  );
} 