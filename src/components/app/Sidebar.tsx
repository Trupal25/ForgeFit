import React from 'react'
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
  const navItems = [
    {
      name: 'dashboard',
      icon: <HomeIcon size={20} />,
      label: 'Dashboard',
    },
    {
      name: 'workouts',
      icon: <DumbbellIcon size={20} />,
      label: 'Workouts',
    },
    {
      name: 'nutrition',
      icon: <UtensilsIcon size={20} />,
      label: 'Nutrition',
    },
    {
      name: 'blogs',
      icon: <FileTextIcon size={20} />,
      label: 'Blogs',
    },
    {
      name: 'calendar',
      icon: <CalendarIcon size={20} />,
      label: 'Calendar',
    },
    {
      name: 'profile',
      icon: <UserIcon size={20} />,
      label: 'Profile',
    },
  ]
  const secondaryNavItems = [
    {
      name: 'settings',
      icon: <SettingsIcon size={20} />,
      label: 'Settings',
    },
    {
      name: 'help',
      icon: <HelpCircleIcon size={20} />,
      label: 'Help',
    },
  ]
  return (
    <>
      {/* {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )} */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-full w-64 bg-white shadow-lg lg:shadow-none flex flex-col z-30 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between  border-b border-gray-200">
          <button
            className="lg:hidden display:none p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <XIcon size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActivePage(item.name)
                  setIsOpen(false)
                }}
                className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${activePage === item.name ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="min-w-[20px]">{item.icon}</span>
                <span className="font-medium ml-3">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">
              Account
            </p>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActivePage(item.name)
                    setIsOpen(false)
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${activePage === item.name ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span className="min-w-[20px]">{item.icon}</span>
                  <span className="font-medium ml-3">{item.label}</span>
                </button>
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
