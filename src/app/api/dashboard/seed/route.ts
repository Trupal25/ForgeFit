import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Dashboard Seed API - Creates sample data for testing
 * POST /api/dashboard/seed
 * 
 * This endpoint creates sample goals, daily stats, and progress data
 * for the current user to demonstrate the dashboard functionality
 */

export async function POST(request: NextRequest) {
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

        // Create sample goals
        const sampleGoals = [
            {
                userId,
                goalType: "Weight_Loss",
                title: "Lose 15 pounds",
                description: "Healthy weight loss through diet and exercise",
                targetValue: 15,
                currentValue: 6,
                unit: "lbs",
                targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
                priority: "High"
            },
            {
                userId,
                goalType: "Cardio_Improvement",
                title: "Run 5K in under 25 minutes",
                description: "Improve cardiovascular endurance",
                targetValue: 25,
                currentValue: 28,
                unit: "minutes",
                targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months
                priority: "Medium"
            },
            {
                userId,
                goalType: "Strength",
                title: "Bench press bodyweight",
                description: "Build upper body strength",
                targetValue: 175,
                currentValue: 135,
                unit: "lbs",
                targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 4 months
                priority: "Medium"
            }
        ];

        // Create sample daily stats for the last 7 days
        const dailyStatsPromises = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            dailyStatsPromises.push(
                prisma.dailyStats.upsert({
                    where: {
                        userId_date: {
                            userId,
                            date
                        }
                    },
                    update: {},
                    create: {
                        userId,
                        date,
                        steps: Math.floor(Math.random() * 5000) + 6000, // 6k-11k steps
                        stepsGoal: 10000,
                        caloriesBurned: Math.floor(Math.random() * 300) + 400, // 400-700 calories
                        caloriesGoal: 2000,
                        waterIntake: Math.round((Math.random() * 1.5 + 1.5) * 10) / 10, // 1.5-3L, rounded to 1 decimal
                        waterGoal: 2.5,
                        sleepHours: Math.random() * 2 + 6.5, // 6.5-8.5 hours
                        sleepGoal: 8,
                        workoutsCompleted: i < 4 ? 1 : 0, // Workouts on some days
                        workoutMinutes: i < 4 ? Math.floor(Math.random() * 30) + 30 : 0, // 30-60 min
                        energyLevel: Math.floor(Math.random() * 2) + 3, // 3-5
                        moodRating: Math.floor(Math.random() * 2) + 4, // 4-5
                        stressLevel: Math.floor(Math.random() * 3) + 2, // 2-4
                        mealsLogged: Math.floor(Math.random() * 2) + 2, // 2-3 meals
                        proteinGrams: Math.floor(Math.random() * 50) + 100, // 100-150g
                        proteinGoal: 150
                    }
                })
            );
        }

        // Create sample weight history for the last 30 days
        const weightHistoryPromises = [];
        const startWeight = 180; // Starting weight
        for (let i = 0; i < 30; i += 3) { // Every 3 days
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const weight = startWeight - (i * 0.2) + (Math.random() * 2 - 1); // Gradual loss with variation
            
            weightHistoryPromises.push(
                prisma.weightHistory.create({
                    data: {
                        userId,
                        weight: Math.round(weight * 10) / 10, // Round to 1 decimal
                        date,
                        notes: i === 0 ? "Current weight" : undefined
                    }
                })
            );
        }

        // Create weekly progress summary
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of this week
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weeklyProgressPromise = prisma.progressSummary.upsert({
            where: {
                userId_periodType_periodStart: {
                    userId,
                    periodType: "weekly",
                    periodStart: weekStart
                }
            },
            update: {},
            create: {
                userId,
                periodType: "weekly",
                periodStart: weekStart,
                periodEnd: weekEnd,
                totalWorkouts: 4,
                totalMinutes: 180,
                totalCaloriesBurned: 2100,
                avgStepsPerDay: 8500,
                avgWaterPerDay: 2.2,
                avgSleepPerDay: 7.5,
                avgEnergyLevel: 4.2,
                avgMoodRating: 4.5,
                startingWeight: 180,
                endingWeight: 178.5,
                weightChange: -1.5,
                goalsActive: 3,
                goalsCompleted: 0
            }
        });

        // Create sample scheduled workouts
        const scheduledWorkouts = [
            {
                userId,
                title: "Morning Cardio",
                date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                time: "07:00",
                duration: 30,
                eventType: "Workout",
                completed: false,
                workoutId: 1, // Assuming workout with ID 1 exists
                notes: "High intensity interval training"
            },
            {
                userId,
                title: "Strength Training",
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
                time: "18:00",
                duration: 45,
                eventType: "Workout",
                completed: false,
                workoutId: 2, // Assuming workout with ID 2 exists
                notes: "Upper body focus"
            },
            {
                userId,
                title: "Yoga Session",
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                time: "19:30",
                duration: 60,
                eventType: "Workout",
                completed: false,
                notes: "Relaxing evening yoga"
            }
        ];

        // Execute all operations
        await Promise.all([
            // Clear existing data first
            prisma.userGoal.deleteMany({ where: { userId } }),
            prisma.scheduledEvent.deleteMany({ where: { userId } }),
            ...dailyStatsPromises,
            ...weightHistoryPromises,
            weeklyProgressPromise
        ]);

        // Create goals and scheduled workouts after clearing
        await Promise.all([
            prisma.userGoal.createMany({ data: sampleGoals }),
            prisma.scheduledEvent.createMany({ data: scheduledWorkouts })
        ]);

        return NextResponse.json({
            success: true,
            message: "Sample dashboard data created successfully",
            data: {
                goalsCreated: sampleGoals.length,
                dailyStatsCreated: 7,
                weightEntriesCreated: weightHistoryPromises.length,
                weeklyProgressCreated: 1,
                scheduledWorkoutsCreated: scheduledWorkouts.length
            }
        });

    } catch (error) {
        console.error("Error seeding dashboard data:", error);
        return NextResponse.json(
            { error: "Failed to seed dashboard data" },
            { status: 500 }
        );
    }
} 