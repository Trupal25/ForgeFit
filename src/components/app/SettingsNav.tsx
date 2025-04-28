import { Bell, Lock, User, Globe, Moon, Sun, LifeBuoy, LogOut } from 'lucide-react';


export default function SettingsNav(){

    return (
        <nav className="p-4">
              <ul className="space-y-1">
                {[
                  { icon: <User size={18} />, label: "Account" },
                  { icon: <Lock size={18} />, label: "Privacy & Security" },
                  { icon: <Bell size={18} />, label: "Notifications" },
                  { icon: <Globe size={18} />, label: "Language" },
                  { icon: <Moon size={18} />, label: "Appearance" },
                  { icon: <LifeBuoy size={18} />, label: "Help & Support" },
                ].map((item, i) => (
                  <li key={i}>
                    <button
                      className={`flex items-center w-full py-2 px-3 rounded-lg ${i === 0 ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
                <li className="mt-4 pt-4 border-t border-gray-100">
                  <button className="flex items-center w-full py-2 px-3 rounded-lg text-red-500 hover:bg-red-50">
                    <span className="mr-3"><LogOut size={18} /></span>
                    <span>Log Out</span>
                  </button>
                </li>
              </ul>
            </nav>
    )
}