import React from 'react';
import Image from "next/image"
import { MenuIcon  } from "lucide-react"

interface NavbarProps {
    onMenuClick: () => void;
    navbarHeightClass: string;
}

export default function Navbar({onMenuClick, navbarHeightClass}: NavbarProps){

    return(
        <header className={`navbar flex pl-4 pr-4 w-full justify-between items-center fixed top-0 left-0 right-0 bg-white z-10 ${navbarHeightClass} border-b`}>
        <div className='nav-left flex items-center'>
            {/* Hamburger Menu for Small Screens */}
            <button
                className="lg:hidden p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-lg"
                onClick={onMenuClick}
                aria-label="Toggle sidebar"
            >
                <MenuIcon size={20} />
            </button>
            <Image src="/assets/logo.png" className='m-1' alt='logo' width={40} height={40}/>
            <h1 className='text-xl font-bold p-2 text-blue-700'>Forge Fit</h1>
        </div>
        <div className='nav-right'>
            {/* Consider making this a link */}
            <a href="https://github.com/Trupal25/ForgeFit" target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub">
                <Image src="/assets/github-mark.svg" alt='github' width={30} height={30}/>
            </a>
        </div>
    </header>
    )
}