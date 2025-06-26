import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWorkoutStreak } from '@/lib/db/models/calendarService';

// GET - Fetch workout streak data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const streakData = await getWorkoutStreak(session.user.id);

    if (!streakData) {
      // Return default values if no streak data exists
      return NextResponse.json({
        success: true,
        data: {
          currentStreak: 0,
          longestStreak: 0,
          totalWorkouts: 0,
          weeklyGoal: 5, // Default weekly goal
          thisWeeksWorkouts: 0,
          weeklyProgress: 0
        }
      });
    }

    // Calculate this week's workouts and progress
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week
    startOfWeek.setHours(0, 0, 0, 0);

    // For simplicity, we'll use the current streak as this week's workouts
    // In a real app, you'd query workouts for this specific week
    const thisWeeksWorkouts = streakData.currentStreak > 7 ? 7 : streakData.currentStreak;
    const weeklyProgress = streakData.weeklyGoal > 0 
      ? Math.min(100, Math.round((thisWeeksWorkouts / streakData.weeklyGoal) * 100))
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        totalWorkouts: streakData.totalWorkouts,
        weeklyGoal: streakData.weeklyGoal || 5,
        thisWeeksWorkouts,
        weeklyProgress
      }
    });

  } catch (error) {
    console.error('Error fetching workout streak:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workout streak' },
      { status: 500 }
    );
  }
} 