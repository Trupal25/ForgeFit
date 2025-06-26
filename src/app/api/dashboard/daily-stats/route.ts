import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Daily Stats API Endpoint
 * 
 * POST /api/dashboard/daily-stats
 * Updates today's daily stats (energy, mood, etc.)
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
        const body = await request.json();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update or create today's daily stats
        const updatedStats = await prisma.dailyStats.upsert({
            where: {
                userId_date: {
                    userId,
                    date: today
                }
            },
            update: {
                ...body,
                updatedAt: new Date()
            },
            create: {
                userId,
                date: today,
                ...body
            }
        });

        return NextResponse.json({
            success: true,
            message: "Daily stats updated successfully",
            data: updatedStats
        });

    } catch (error) {
        console.error("Error updating daily stats:", error);
        return NextResponse.json(
            { error: "Failed to update daily stats" },
            { status: 500 }
        );
    }
} 