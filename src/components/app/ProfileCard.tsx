import { Award, Camera, Edit, User } from "lucide-react";

export default function ProfileCard(){

    return(
        <div className="lg:w-1/3">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-blue-600 h-32 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                <User size={40} className="text-gray-400" />
              </div>
            </div>
            <button className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
              <Camera size={18} />
            </button>
          </div>
          
          <div className="pt-14 pb-6 px-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">Neet Patel</h2>
                <p className="text-gray-500">@Neet</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Edit size={18} className="text-gray-400" />
              </button>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p>neet@example.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p>April 2025</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-4">
              <div>
                <p className="text-2xl font-bold text-blue-600">24</p>
                <p className="text-sm text-gray-500">Workouts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-500">Days Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">8</p>
                <p className="text-sm text-gray-500">Badges</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Achievements</h2>
            <button className="text-sm text-blue-600">View All</button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {["Early Bird", "Consistency", "Strength"].map((badge, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Award size={24} className="text-blue-600" />
                </div>
                <p className="text-xs text-center">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      </div>        
    )
}