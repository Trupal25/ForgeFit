"use client";

import React from 'react';
import { Play, Clock, Heart, Star, UserCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';

export interface YogaSession {
  id: number;
  title: string;
  style: string;
  duration: number;
  level: string;
  instructor: string;
  description: string;
  benefits: string[];
  isFavorite: boolean;
  rating: number;
  imageUrl?: string;
  videoUrl?: string;
}

interface YogaCardProps {
  session: YogaSession;
  isExpanded?: boolean;
  onToggleExpand: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onStart: (session: YogaSession) => void;
}

const YogaCard: React.FC<YogaCardProps> = ({
  session,
  isExpanded = false,
  onToggleExpand,
  onToggleFavorite,
  onStart,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(session.id);
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStart(session);
  };

  return (
    <Card className="h-full">
      <div 
        className="p-5 cursor-pointer"
        onClick={() => onToggleExpand(session.id)}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{session.title}</h3>
            <span className="text-sm text-gray-500">{session.style} • {session.level}</span>
          </div>
          <button 
            className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
            onClick={handleFavoriteClick}
            aria-label={session.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              size={20} 
              fill={session.isFavorite ? "#ef4444" : "none"} 
              stroke={session.isFavorite ? "#ef4444" : "currentColor"} 
            />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{session.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock size={16} />
              <span className="text-sm">{session.duration} min</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <UserCircle2 size={16} />
              <span className="text-sm">{session.instructor}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{session.rating}</span>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-5 border-t border-gray-100">
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Benefits</h4>
            <ul className="list-disc list-inside space-y-1">
              {session.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-600 text-sm">{benefit}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleStartClick}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-1"
            >
              <Play size={16} />
              <span>Start Practice</span>
            </button>
            <button 
              onClick={handleFavoriteClick}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1"
            >
              <Heart 
                size={16} 
                fill={session.isFavorite ? "#ef4444" : "none"} 
                stroke={session.isFavorite ? "#ef4444" : "currentColor"} 
              />
              <span>{session.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default YogaCard; 