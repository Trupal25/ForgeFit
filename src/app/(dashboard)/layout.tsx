"use client"
import { Bell } from "lucide-react"
import Image from 'next/image';
import { MenuIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/app/Sidebar';

export default function DashboardLayout({children}: { children: React.ReactNode }){
    
    const pathname = usePathname() || '';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("dashboard");
    
    // Update active page based on pathname
    useEffect(() => {
        if (pathname.includes('/workouts')) {
            setActivePage('workouts');
        } else if (pathname.includes('/home')) {
            setActivePage('dashboard');
        } else if (pathname.includes('/nutrition')) {
            setActivePage('nutrition');
        } else if (pathname.includes('/recipes')) {
            setActivePage('recipes');
        } else if (pathname.includes('/meditation')) {
            setActivePage('meditation');
        } else if (pathname.includes('/yoga')) {
            setActivePage('yoga');
        } else if (pathname.includes('/blogs')) {
            setActivePage('blogs');
        } else if (pathname.includes('/calendar')) {
            setActivePage('calendar');
        } else if (pathname.includes('/profile')) {
            setActivePage('profile');
        } else if (pathname.includes('/settings')) {
            setActivePage('settings');
        } else if (pathname.includes('/help')) {
            setActivePage('help');
        }
    }, [pathname]);

    // Define navbar height for consistent spacing
    const navbarHeight = 'h-16'; // 16 * 0.25rem = 4rem = 64px

    return (
        <div className="min-h-screen flex flex-col">
            
            {/* Navbar - Fixed at the top */}
            <div className={`navbar flex pl-4 pr-4 w-full justify-between items-center fixed top-0 left-0 right-0 bg-white z-40 ${navbarHeight} border-b`}>
                <div className='nav-left flex items-center'>
                    {/* Hamburger Menu for Small Screens */}
                    <button
                        className="lg:hidden p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar
                    >
                        <MenuIcon size={20} />
                    </button>
                    <Image src="/assets/logo2.png" className='m-1' alt='logo' width={40} height={40}/>
                    <h1 className='text-3xl font-bold p-2 text-blue-700' style={{ fontFamily: 'Metal Mania, sans-serif' }}>Forge Fit</h1>
                </div>
                <div className='nav-right flex'>
                    <Bell className="mr-4 rounded-2xl align-middle p-2 w-[32px] h-[32px] bg-blue-100"/>
                    <a href="https://github.com/Trupal25/ForgeFit" target="_blank" rel="noopener noreferrer">
                        <Image src="/assets/github-mark.svg" alt='github' width={30} height={30}/>
                    </a>
                </div>
            </div>

            {/* Content Area below Navbar */}
            <div className="flex flex-1 pt-16"> {/* pt-16 to offset the fixed navbar */}
                {/* Sidebar */}
                <Sidebar
                    activePage={activePage}
                    setActivePage={setActivePage}
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