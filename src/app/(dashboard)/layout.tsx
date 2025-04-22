"use client"
import { Bell } from "lucide-react"
import Image from 'next/image';
import { GithubIcon, MenuIcon, } from 'lucide-react';
import  { useState } from 'react';
import Sidebar from '@/components/app/Sidebar';

export default function DashboardLayout({children}: { children: React.ReactNode }){
    
    const [isSidebarOpen,setIsSidebarOpen] = useState(false)
    const [activePage,setActivePage] = useState("dashboard")

    // Define navbar height for consistent spacing
    const navbarHeight = 'h-16'; // Example: 16 * 4px = 64px

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <div className={`navbar flex pl-4 pr-4 w-full justify-between items-center fixed top-0 left-0 right-0 bg-white z-10 ${navbarHeight} border-b`}>
                <div className='nav-left flex items-center'>
                    {/* Hamburger Menu for Small Screens */}
                    <button
                        className="lg:hidden p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar
                    >
                        <MenuIcon size={20} />
                    </button>
                    <Image src="/assets/logo2.png" className='m-1' alt='logo' width={40} height={40}/>
                    <h1 className='text-xl font-bold p-2 text-blue-700'>Forge Fit</h1>
                </div>
                <div className='nav-right flex '>
                    {/* Consider making this a link */}
                    <Bell className="mr-4 rounded-2xl align-middle p-2 w-[32px] h-[32px] bg-blue-100"/>
                    <a href="https://github.com/Trupal" target="_blank" rel="noopener noreferrer">
                        <Image src="/assets/github-mark.svg" alt='github' width={30} height={30}/>
                    </a>
                </div>
            </div>

            {/* Content Area below Navbar */}
            <div className={`flex flex-1 pt-16 `}> {/* Add padding-top equal to navbar height */}
                {/* Sidebar */}
                <div className='sidebar-container'> {/* Wrapper for sidebar */}
                    <Sidebar
                        activePage={activePage}
                        setActivePage={setActivePage}
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                    />
                </div>

                {/* Main Content */}
                <main className="flex-1 p-4 overflow-y-auto"> {/* Allow content to scroll if needed */}
                    {children}
                </main>
            </div>
        </div>
    );
}