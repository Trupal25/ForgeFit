"use client"
import { useState } from 'react';
import Sidebar from '@/components/app/Sidebar';
import Navbar from "@/components/app/Navbar";

export default function DashboardLayout({children}: { children: React.ReactNode }){
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    

    // Define navbar height for consistent spacing
    const navbarHeight = 'h-16'; // 16 * 0.25rem = 4rem = 64px

    return (
        <div className="min-h-screen flex flex-col">
            
            {/* Navbar - Fixed at the top */}
            <Navbar
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarOpen={isSidebarOpen}
                navbarHeight={navbarHeight}
            />

            {/* Content Area below Navbar */}
            <div className="flex flex-1 pt-16"> {/* pt-16 to offset the fixed navbar */}
                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                />

                {/* Main Content - Scrollable separately from sidebar */}
                <main className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-4rem)]"> 
                    {children}
                </main>
            </div>
        </div>
    );
}