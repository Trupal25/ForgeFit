import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Dashboard API Endpoint
 * 
 * GET /api/dashboard
 * Fetches comprehensive dashboard data including:
 * - User goals and progress
 * - Today's daily stats
 * - Recent workout history
 * - Scheduled workouts
 * - Weight progress
 * - Weekly/monthly summaries
 */

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Fetch all dashboard data in parallel
        const [
            userGoals,
            todayStats,
            recentWorkouts,
            upcomingWorkouts,
            recentWeightHistory,
            weeklyProgress,
            userProfile
        ] = await Promise.all([
            // Active user goals
            prisma.userGoal.findMany({
                where: { 
                    userId,
                    status: "Active"
                },
                orderBy: { priority: "desc" }
            }),

            // Today's daily stats
            prisma.dailyStats.findFirst({
                where: {
                    userId,
                    date: {
                        gte: today,
                        lt: tomorrow
                    }
                }
            }),

            // Recent completed workouts (last 7 days)
            prisma.workoutHistory.findMany({
                where: {
                    userId,
                    completedAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                },
                include: {
                    workout: true
                },
                orderBy: { completedAt: "desc" },
                take: 5
            }),

            // Upcoming scheduled workouts
            prisma.scheduledEvent.findMany({
                where: {
                    userId,
                    date: {
                        gte: today
                    },
                    completed: false,
                    eventType: "Workout"
                },
                include: {
                    workout: true
                },
                orderBy: { date: "asc" },
                take: 3
            }),

            // Recent weight history (last 30 days)
            prisma.weightHistory.findMany({
                where: {
                    userId,
                    date: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                },
                orderBy: { date: "asc" }
            }),

            // This week's progress summary
            prisma.progressSummary.findFirst({
                where: {
                    userId,
                    periodType: "weekly",
                    periodStart: {
                        lte: today
                    },
                    periodEnd: {
                        gte: today
                    }
                }
            }),

            // User profile for goal context
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    weight: true,
                    goalWeight: true,
                    height: true,
                    fitnessLevel: true
                }
            })
        ]);

        // Create default daily stats if none exist for today
        const dailyStats = todayStats || {
            steps: 0,
            stepsGoal: 10000,
            caloriesBurned: 0,
            caloriesGoal: 2000,
            waterIntake: 0,
            waterGoal: 2.5,
            sleepHours: 0,
            sleepGoal: 8,
            workoutsCompleted: 0,
            energyLevel: 3,
            moodRating: 3
        };

        // Calculate goal progress
        const goalsWithProgress = userGoals.map(goal => {
            const progressPercentage = goal.targetValue > 0 
                ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
                : 0;
            
            const daysRemaining = Math.ceil(
                (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            return {
                ...goal,
                progressPercentage,
                daysRemaining: Math.max(0, daysRemaining)
            };
        });

        // Prepare weight progress data for chart
        const weightProgress = recentWeightHistory.map((entry, index) => ({
            day: index + 1,
            weight: entry.weight,
            date: entry.date
        }));

        // Calculate workout streak
        const workoutStreak = await calculateWorkoutStreak(userId);

        return NextResponse.json({
            success: true,
            data: {
                goals: goalsWithProgress,
                dailyStats,
                recentWorkouts,
                upcomingWorkouts,
                weightProgress,
                weeklyProgress,
                userProfile,
                workoutStreak,
                summary: {
                    totalGoals: userGoals.length,
                    completedGoals: userGoals.filter(g => g.status === "Completed").length,
                    workoutsThisWeek: weeklyProgress?.totalWorkouts || 0,
                    currentWeight: userProfile?.weight,
                    goalWeight: userProfile?.goalWeight,
                    weightToLose: userProfile?.weight && userProfile?.goalWeight 
                        ? userProfile.weight - userProfile.goalWeight 
                        : null
                }
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}

// Helper function to calculate workout streak
async function calculateWorkoutStreak(userId: string): Promise<number> {
    try {
        const workouts = await prisma.workoutHistory.findMany({
            where: { userId },
            orderBy: { completedAt: "desc" },
            take: 30 // Check last 30 days
        });

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            
            const hasWorkout = workouts.some(workout => {
                const workoutDate = new Date(workout.completedAt);
                workoutDate.setHours(0, 0, 0, 0);
                return workoutDate.getTime() === checkDate.getTime();
            });

            if (hasWorkout) {
                streak++;
            } else if (i > 0) { // Don't break streak if no workout today
                break;
            }
        }

        return streak;
    } catch (error) {
        console.error("Error calculating workout streak:", error);
        return 0;
    }
} 