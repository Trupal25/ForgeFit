import React from 'react';
import { Bell } from 'lucide-react';
import Image from "next/image"
import { MenuIcon  } from "lucide-react"
import SignOutButton from '../auth/SignOutButton';

interface NavbarProps {
   setIsSidebarOpen: (isSidebarOpen: boolean) => void;
   isSidebarOpen: boolean;
   navbarHeight: string;
}

export default function Navbar({setIsSidebarOpen,isSidebarOpen,navbarHeight}:NavbarProps){

    return(
        <div className={`navbar flex px-3 sm:px-4 w-full justify-between items-center fixed top-0 left-0 right-0 bg-white z-40 ${navbarHeight} border-b`}>
            {/* Left side - Logo and brand */}
            <div className='nav-left flex items-center min-w-0 flex-1'>
                {/* Hamburger Menu for Small Screens */}
                <button
                    className="lg:hidden p-2 -ml-2 mr-1 sm:mr-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Toggle sidebar"
                >
                    <MenuIcon size={20} />
                </button>
                
                {/* Logo and Title */}
                <div className="flex items-center min-w-0">
                    <link href="https://fonts.googleapis.com/css2?family=Metal+Mania&display=swap" rel="stylesheet" />
                    <Image 
                        src="/assets/logo2.png" 
                        className='flex-shrink-0' 
                        alt='ForgeFit logo' 
                        width={32} 
                        height={32}
                        priority
                    />
                    <h1 className='text-lg sm:text-2xl lg:text-3xl font-bold pl-2 text-blue-700 truncate' 
                        style={{ fontFamily: '"Metal Mania", cursive' }}>
                        Forge Fit
                    </h1>
                </div>
            </div>
            
            {/* Right side - Actions */}
            <div className='nav-right flex items-center gap-2 sm:gap-3 flex-shrink-0'>
                {/* Bell notification - Hidden on small screens */}
                <button
                    className="hidden sm:flex rounded-lg p-2 bg-blue-100 hover:bg-blue-200 transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5 text-blue-600"/>
                </button>
                
                {/* GitHub link - Hidden on small screens */}
                <a 
                    href="https://github.com/Trupal25/ForgeFit" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="View on GitHub"
                >
                    <Image 
                        src="/assets/github-mark.svg" 
                        alt='GitHub repository' 
                        width={20} 
                        height={20}
                        className="w-5 h-5"
                    />
                </a>
                
                {/* Sign out button - Always visible */}
                <SignOutButton variant="icon" className="p-1.5 sm:p-2" />
            </div>
        </div>
    )
}