"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Headphones
} from 'lucide-react';
import MeditationCard, { MeditationSession } from '@/components/meditation/MeditationCard';

// Mock data for meditation sessions
const MEDITATION_DATA: MeditationSession[] = [
  {
    id: 1,
    title: "Morning Mindfulness",
    category: "Mindfulness",
    duration: 10,
    level: "Beginner",
    instructor: "Sarah Johnson",
    description: "Start your day with clarity and intention through this guided mindfulness practice.",
    isFavorite: true,
    rating: 4.8,
    imageUrl: "/assets/meditations/morning-mindfulness.jpg",
    audioUrl: "/assets/audio/morning-mindfulness.mp3"
  },
  {
    id: 2,
    title: "Stress Relief Meditation",
    category: "Stress Reduction",
    duration: 15,
    level: "All Levels",
    instructor: "Michael Chen",
    description: "Release tension and calm your nervous system with this stress-reducing guided meditation.",
    isFavorite: false,
    rating: 4.7,
    imageUrl: "/assets/meditations/stress-relief.jpg",
    audioUrl: "/assets/audio/stress-relief.mp3"
  },
  {
    id: 3,
    title: "Deep Sleep Relaxation",
    category: "Sleep",
    duration: 20,
    level: "All Levels",
    instructor: "Emma Wilson",
    description: "Prepare your mind and body for restful sleep with this calming bedtime meditation.",
    isFavorite: true,
    rating: 4.9,
    imageUrl: "/assets/meditations/deep-sleep.jpg",
    audioUrl: "/assets/audio/deep-sleep.mp3"
  },
  {
    id: 4,
    title: "Focused Attention Practice",
    category: "Focus",
    duration: 12,
    level: "Intermediate",
    instructor: "David Park",
    description: "Improve your concentration and mental clarity with this focused attention meditation.",
    isFavorite: false,
    rating: 4.6,
    imageUrl: "/assets/meditations/focused-attention.jpg",
    audioUrl: "/assets/audio/focused-attention.mp3"
  },
  {
    id: 5,
    title: "Loving-Kindness Meditation",
    category: "Compassion",
    duration: 15,
    level: "All Levels",
    instructor: "Olivia Martinez",
    description: "Cultivate feelings of goodwill, kindness, and warmth towards yourself and others.",
    isFavorite: false,
    rating: 4.8,
    imageUrl: "/assets/meditations/loving-kindness.jpg",
    audioUrl: "/assets/audio/loving-kindness.mp3"
  },
  {
    id: 6,
    title: "Body Scan Relaxation",
    category: "Relaxation",
    duration: 18,
    level: "Beginner",
    instructor: "James Wilson",
    description: "Release tension throughout your body with this progressive relaxation technique.",
    isFavorite: true,
    rating: 4.7,
    imageUrl: "/assets/meditations/body-scan.jpg",
    audioUrl: "/assets/audio/body-scan.mp3"
  }
];
// TODO: make thos dynamic

// Available filters
const CATEGORIES = ["All", "Mindfulness", "Stress Reduction", "Sleep", "Focus", "Compassion", "Relaxation"];
const DURATIONS = ["All", "Under 10 min", "10-15 min", "Over 15 min"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

export default function MeditationPage() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sessions, setSessions] = useState(MEDITATION_DATA);
  const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null);
  const [setCurrentlyPlaying] = useState<number | null>(null);

  // Filter sessions based on criteria
  useEffect(() => {
    let filteredSessions = [...MEDITATION_DATA];
    
    // Apply search filter
    if (searchTerm) {
      filteredSessions = filteredSessions.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        session.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "All") {
      filteredSessions = filteredSessions.filter(session =>
        session.category === selectedCategory
      );
    }
    
    // Apply duration filter
    if (selectedDuration !== "All") {
      filteredSessions = filteredSessions.filter(session => {
        if (selectedDuration === "Under 10 min") return session.duration < 10;
        if (selectedDuration === "10-15 min") return session.duration >= 10 && session.duration <= 15;
        if (selectedDuration === "Over 15 min") return session.duration > 15;
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
  }, [searchTerm, selectedCategory, selectedDuration, selectedLevel]);

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

  // Handle play meditation
  const handlePlayMeditation = (session: MeditationSession) => {
    setCurrentlyPlaying(session.id);
    // In a real app, this would trigger audio playback
    console.log(`Playing meditation: ${session.title}`);
    alert(`Now playing: ${session.title}`);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Meditation</h1>
        <p className="text-gray-600">Practice mindfulness and reduce stress with guided meditation sessions.</p>
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
              placeholder="Search meditations..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
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
      
      {/* Meditation Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            <Headphones size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No meditation sessions found</h3>
            <p className="text-gray-500 text-center">
              Try adjusting your filters or search terms to find what you&apos;re looking for.
            </p>
          </div>
        ) : (
          sessions.map(session => (
            <MeditationCard
              key={session.id}
              session={session}
              isExpanded={expandedSessionId === session.id}
              onToggleExpand={handleToggleExpand}
              onToggleFavorite={handleToggleFavorite}
              onPlay={handlePlayMeditation}
            />
          ))
        )}
      </div>
    </div>
  );
} 