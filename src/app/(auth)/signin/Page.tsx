import React, { Suspense } from 'react';
import SignInContent from './SignInContent';
import { Loader2 } from 'lucide-react';

// This is the static page component for /signin
// It uses Suspense to handle the loading state of the client component
export default function SignInPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <SignInContent />
        </Suspense>
    );
}

// A simple loading spinner component to be shown during suspense
const LoadingSpinner = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center text-center">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <p className="text-gray-600 mt-4">Loading your session...</p>
            </div>
        </div>
    );
};