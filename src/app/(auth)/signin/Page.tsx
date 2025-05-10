"use client"

import React, { useEffect } from 'react';
import AuthPage from "@/pages/AuthPage";
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignIn() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
    
    useEffect(() => {
        if (status === 'authenticated' && session) {
            router.push(callbackUrl);
        }
    }, [session, status, router, callbackUrl]);
    
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    return <AuthPage />;
}