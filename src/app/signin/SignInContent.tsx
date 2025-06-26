"use client";

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthPage from '@/components/auth/AuthPage';

// This client component contains all the dynamic logic and hooks for the sign-in process.
export default function SignInContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // On component mount, check the session status
    useEffect(() => {
        // If the user is authenticated, redirect them to the dashboard or the callback URL
        if (status === 'authenticated' && session) {
            const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
            router.push(callbackUrl);
        }
    }, [session, status, router, searchParams]);

    // This component will only be rendered if the user is not authenticated,
    // as the useEffect hook above will redirect them otherwise.
    // The loading state is handled by the Suspense boundary in the parent page component.
    if (status === 'unauthenticated') {
        return <AuthPage />;
    }

    // Return null or a minimal loader if status is 'loading',
    // though the Suspense fallback in page.tsx should handle this.
    return null;
} 