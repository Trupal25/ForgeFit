"use client";
// import Image from 'next/image'; 
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
} from 'lucide-react';
import YogaCard, { YogaSession } from '@/components/yoga/YogaCard';

// Mock data for yoga sessions
const YOGA_DATA: YogaSession[] = [
  {
    id: 1,
    title: "Morning Flow",
    style: "Vinyasa",
    duration: 20,
    level: "Beginner",
    instructor: "Lily Patel",
    description: "Start your day with this energizing morning flow to awaken your body and mind.",
    benefits: [
      "Increases energy and alertness",
      "Improves circulation",
      "Reduces morning stiffness"
    ],
    isFavorite: true,
    rating: 4.8,
    imageUrl: "/assets/yoga/morning-flow.jpg",
    videoUrl: "/assets/videos/morning-flow.mp4"
  },
  {
    id: 2,
    title: "Gentle Hatha",
    style: "Hatha",
    duration: 30,
    level: "All Levels",
    instructor: "Robert Chen",
    description: "A gentle practice focusing on basic postures and alignment, perfect for beginners or those seeking a slower pace.",
    benefits: [
      "Improves flexibility",
      "Builds strength gradually",
      "Reduces stress"
    ],
    isFavorite: false,
    rating: 4.6,
    imageUrl: "/assets/yoga/gentle-hatha.jpg",
    videoUrl: "/assets/videos/gentle-hatha.mp4"
  },
  {
    id: 3,
    title: "Power Yoga",
    style: "Power",
    duration: 45,
    level: "Intermediate",
    instructor: "Marcus Johnson",
    description: "A dynamic, fitness-based approach to vinyasa-style yoga, emphasizing strength and flexibility.",
    benefits: [
      "Builds core strength",
      "Increases cardiovascular endurance",
      "Improves balance and flexibility"
    ],
    isFavorite: true,
    rating: 4.9,
    imageUrl: "/assets/yoga/power-yoga.jpg",
    videoUrl: "/assets/videos/power-yoga.mp4"
  },
  {
    id: 4,
    title: "Yin Yoga for Recovery",
    style: "Yin",
    duration: 40,
    level: "All Levels",
    instructor: "Sophia Kim",
    description: "A slow-paced style of yoga with postures that are held for longer periods of time to target deep connective tissues.",
    benefits: [
      "Releases fascial tension",
      "Improves joint mobility",
      "Promotes relaxation and recovery"
    ],
    isFavorite: false,
    rating: 4.7,
    imageUrl: "/assets/yoga/yin-yoga.jpg",
    videoUrl: "/assets/videos/yin-yoga.mp4"
  },
  {
    id: 5,
    title: "Yoga for Strength",
    style: "Ashtanga",
    duration: 50,
    level: "Intermediate",
    instructor: "David Miller",
    description: "Build strength throughout your entire body with this challenging Ashtanga-inspired practice.",
    benefits: [
      "Builds muscular strength",
      "Improves core stability",
      "Enhances body awareness"
    ],
    isFavorite: true,
    rating: 4.8,
    imageUrl: "/assets/yoga/yoga-strength.jpg",
    videoUrl: "/assets/videos/yoga-strength.mp4"
  },
  {
    id: 6,
    title: "Restorative Yoga",
    style: "Restorative",
    duration: 35,
    level: "Beginner",
    instructor: "Emma Thompson",
    description: "A therapeutic style of yoga that uses props to support the body in passive poses, allowing for deep relaxation.",
    benefits: [
      "Reduces stress and anxiety",
      "Improves sleep quality",
      "Promotes nervous system regulation"
    ],
    isFavorite: false,
    rating: 4.9,
    imageUrl: "/assets/yoga/restorative-yoga.jpg",
    videoUrl: "/assets/videos/restorative-yoga.mp4"
  }
];

// Available filters
const STYLES = ["All", "Vinyasa", "Hatha", "Power", "Yin", "Ashtanga", "Restorative"];
const DURATIONS = ["All", "Under 30 min", "30-45 min", "Over 45 min"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

export default function YogaPage() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sessions, setSessions] = useState(YOGA_DATA);
  const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null);

  // Filter sessions based on criteria
  useEffect(() => {
    let filteredSessions = [...YOGA_DATA];
    
    // Apply search filter
    if (searchTerm) {
      filteredSessions = filteredSessions.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        session.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply style filter
    if (selectedStyle !== "All") {
      filteredSessions = filteredSessions.filter(session =>
        session.style === selectedStyle
      );
    }
    
    // Apply duration filter
    if (selectedDuration !== "All") {
      filteredSessions = filteredSessions.filter(session => {
        if (selectedDuration === "Under 30 min") return session.duration < 30;
        if (selectedDuration === "30-45 min") return session.duration >= 30 && session.duration <= 45;
        if (selectedDuration === "Over 45 min") return session.duration > 45;
        return true;
      });
    }
    
    // Apply level filter
    if (selectedLevel !== "All") {
      filteredSessions = filteredSessions.filter(session =>
        session.level === selectedLevel
      );
    }
    
    setSessions(filteredSessions);
  }, [searchTerm, selectedStyle, selectedDuration, selectedLevel]);

  // Toggle favorite status
  const handleToggleFavorite = (id: number) => {
    setSessions(sessions.map(session => 
      session.id === id 
        ? {...session, isFavorite: !session.isFavorite} 
        : session
    ));
  };

  // Handle session selection
  const handleToggleExpand = (id: number) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  // Handle start yoga practice
  const handleStartYoga = (session: YogaSession) => {
    // In a real app, this would navigate to a video player or start a guided practice
    console.log(`Starting yoga practice: ${session.title}`);
    alert(`Starting yoga practice: ${session.title}`);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Yoga</h1>
        <p className="text-gray-600">Improve flexibility, strength and mental clarity with guided yoga practices.</p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search yoga practices..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
              >
                {STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                {DURATIONS.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Yoga Practice Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No yoga practices found</h3>
            <p className="text-gray-500 text-center">
              Try adjusting your filters or search terms to find what you&apos;re looking for.
            </p>
          </div>
        ) : (
          sessions.map(session => (
            <YogaCard
              key={session.id}
              session={session}
              isExpanded={expandedSessionId === session.id}
              onToggleExpand={handleToggleExpand}
              onToggleFavorite={handleToggleFavorite}
              onStart={handleStartYoga}
            />
          ))
        )}
      </div>
    </div>
  );
} 