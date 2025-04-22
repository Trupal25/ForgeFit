'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  DumbbellIcon,
  UtensilsIcon,
  FileTextIcon,
  CalendarIcon,
  UserIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  XIcon,
  Headphones,
  Sparkle,
} from 'lucide-react'

interface SidebarProps {
  activePage: string
  setActivePage: (page: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isOpen,
  setIsOpen,
}) => {
  const pathname = usePathname();
  
  // Map route paths to their corresponding pages
  const routeMap = {
    'dashboard': '/home',
    'workouts': '/workouts',
    'nutrition': '/nutrition',
    'blogs': '/blogs',
    'calendar': '/calendar',
    'profile': '/profile',
    'settings': '/settings',
    'help': '/help',
    'recipes': '/recipes',
    'meditation': '/meditation',
    'yoga': '/yoga',
  };
  
  const navItems = [
    {
      name: 'dashboard',
      path: '/home',
      icon: <HomeIcon size={20} />,
      label: 'Dashboard',
    },
    {
      name: 'workouts',
      path: '/workouts',
      icon: <DumbbellIcon size={20} />,
      label: 'Workouts',
    },
    {
      name: 'nutrition',
      path: '/nutrition',
      icon: <UtensilsIcon size={20} />,
      label: 'Nutrition',
    },
    {
      name: 'recipes',
      path: '/recipes',
      icon: <UtensilsIcon size={20} />,
      label: 'Recipes',
    },
    {
      name: 'meditation',
      path: '/meditation',
      icon: <Headphones size={20} />,
      label: 'Meditation',
    },
    {
      name: 'yoga',
      path: '/yoga',
      icon: <Sparkle />,
      label: 'Yoga',
    },
    {
      name: 'blogs',
      path: '/blogs',
      icon: <FileTextIcon size={20} />,
      label: 'Blogs',
    },
    {
      name: 'calendar',
      path: '/calendar',
      icon: <CalendarIcon size={20} />,
      label: 'Calendar',
    },
    {
      name: 'profile',
      path: '/profile',
      icon: <UserIcon size={20} />,
      label: 'Profile',
    },
  ]
  
  const secondaryNavItems = [
    {
      name: 'settings',
      path: '/settings',
      icon: <SettingsIcon size={20} />,
      label: 'Settings',
    },
    {
      name: 'help',
      path: '/help',
      icon: <HelpCircleIcon size={20} />,
      label: 'Help',
    },
  ]
  
  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return pathname === path || pathname === path + '/';
  };
  
  return (
    <>
      {/* {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )} */}
      <aside
        className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg lg:shadow-none flex flex-col z-30 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-end p-2 lg:hidden border-b border-gray-200">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <XIcon size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${isActive(item.path) ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => {
                  setActivePage(item.name);
                  setIsOpen(false);
                }}
              >
                <span className="min-w-[20px]">{item.icon}</span>
                <span className="font-medium ml-3">{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">
              Account
            </p>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${isActive(item.path) ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => {
                    setActivePage(item.name);
                    setIsOpen(false);
                  }}
                >
                  <span className="min-w-[20px]">{item.icon}</span>
                  <span className="font-medium ml-3">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="px-3 py-4 border-t border-gray-200">
          <button className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="min-w-[20px]">
              <LogOutIcon size={20} />
            </span>
            <span className="font-medium ml-3">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
export default Sidebar
