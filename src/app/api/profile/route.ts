import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        goals: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get workout history count
    const workoutCount = await prisma.workoutHistory.count({
      where: { userId }
    });

    // Get current streak
    const workoutStreak = await prisma.workoutStreak.findUnique({
      where: { userId }
    });

    // Get recent activity (last 10 activities)
    const [recentWorkouts, recentGoals, recentStats] = await Promise.all([
      // Recent workout completions
      prisma.workoutHistory.findMany({
        where: { userId },
        include: { workout: true },
        orderBy: { completedAt: 'desc' },
        take: 5
      }),
      
      // Recent goal updates
      prisma.userGoal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 3
      }),

      // Recent daily stats
      prisma.dailyStats.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 5
      })
    ]);

    // Calculate this month's active days
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const activeDaysThisMonth = await prisma.dailyStats.count({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Calculate average calories (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const weeklyStats = await prisma.dailyStats.findMany({
      where: {
        userId,
        date: { gte: lastWeek },
        caloriesBurned: { not: null }
      }
    });

    const avgCalories = weeklyStats.length > 0 
      ? Math.round(weeklyStats.reduce((sum, stat) => sum + (stat.caloriesBurned || 0), 0) / weeklyStats.length)
      : 0;

    // Get latest weight from WeightHistory
    const latestWeight = await prisma.weightHistory.findFirst({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    // Calculate weight change (30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldWeight = await prisma.weightHistory.findFirst({
      where: {
        userId,
        date: { lte: thirtyDaysAgo }
      },
      orderBy: { date: 'desc' }
    });

    const weightChange = (latestWeight?.weight && oldWeight?.weight) 
      ? latestWeight.weight - oldWeight.weight
      : 0;

    // Combine and format recent activity
    const recentActivity = [
      ...recentWorkouts.map(workout => ({
        type: 'workout',
        name: workout.workout.title,
        date: workout.completedAt,
        id: workout.id
      })),
      ...recentGoals.map(goal => ({
        type: 'goal',
        name: `${goal.goalType} Goal Updated`,
        date: goal.createdAt,
        id: goal.id,
        value: goal.targetValue
      })),
      // Weight updates will come from WeightHistory, not DailyStats
      ...(latestWeight ? [{
        type: 'weight',
        value: `${latestWeight.weight} lbs`,
        date: latestWeight.date,
        id: latestWeight.id
      }] : [])
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    const profileData = {
      user: {
        id: user.id,
        name: user.name || 'User',
        email: user.email,
        username: user.username || user.email?.split('@')[0],
        image: user.image,
        createdAt: user.createdAt
      },
      stats: {
        currentWeight: latestWeight?.weight || 0,
        weightChange,
        avgCalories,
        activeDaysThisMonth,
        totalDaysInMonth: endOfMonth.getDate(),
        totalWorkouts: workoutCount,
        currentStreak: workoutStreak?.currentStreak || 0,
        longestStreak: workoutStreak?.longestStreak || 0
      },
      recentActivity,
      currentGoal: user.goals[0] || null
    };

    return NextResponse.json({ 
      success: true, 
      data: profileData 
    });

  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, username } = await request.json();
    const userId = session.user.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        username: username || undefined
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedUser 
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' }, 
      { status: 500 }
    );
  }
} 