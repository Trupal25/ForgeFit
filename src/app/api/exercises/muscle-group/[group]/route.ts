import { NextRequest, NextResponse } from 'next/server';
import * as exerciseService from '@/lib/db/models/exercises';

export async function GET(
  request: NextRequest,
  { params }: { params: { group: string } }
) {
  try {
    const muscleGroup = params.group;
    
    if (!muscleGroup) {
      return NextResponse.json(
        { error: 'Muscle group is required' },
        { status: 400 }
      );
    }
    
    const exercises = await exerciseService.getExercisesByMuscleGroup(muscleGroup);
    
    return NextResponse.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises by muscle group:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
} 