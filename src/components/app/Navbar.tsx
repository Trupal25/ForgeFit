import React from 'react';
import { Bell } from 'lucide-react';
import Image from "next/image"
import { MenuIcon  } from "lucide-react"

interface NavbarProps {
   setIsSidebarOpen: (isSidebarOpen: boolean) => void;
   isSidebarOpen: boolean;
   navbarHeight: string;
}

export default function Navbar({setIsSidebarOpen,isSidebarOpen,navbarHeight}:NavbarProps){

    return(
        <div className={`navbar flex pl-4 pr-4 w-full justify-between items-center fixed top-0 left-0 right-0 bg-white z-40 ${navbarHeight} border-b`}>
        <div className='nav-left flex items-center'>
            {/* Hamburger Menu for Small Screens */}
            <button
                className="lg:hidden p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar
            >
                <MenuIcon size={20} />
            </button>
            <link href="https://fonts.googleapis.com/css2?family=Metal+Mania&display=swap" rel="stylesheet" />
            <Image src="/assets/logo2.png" className='m-1' alt='logo' width={40} height={40}/>
            <h1 className='text-3xl font-bold p-2 text-blue-700' style={{ fontFamily: '"Metal Mania", cursive' }}>Forge Fit</h1>
        </div>
        <div className='nav-right flex'>
            <Bell className="mr-4 rounded-2xl align-middle p-2 w-[32px] h-[32px] bg-blue-100"/>
            <a href="https://github.com/Trupal25/ForgeFit" target="_blank" rel="noopener noreferrer">
                <Image src="/assets/github-mark.svg" alt='github' width={30} height={30}/>
            </a>
        </div>
    </div>
    )
}