import { NextRequest, NextResponse } from 'next/server';
import * as exerciseService from '@/lib/exercises';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filter parameters
    const muscleGroups = searchParams.get('muscleGroups')?.split(',') || [];
    const equipment = searchParams.get('equipment')?.split(',') || [];
    const difficultyLevel = searchParams.get('difficultyLevel') || undefined;
    
    // Check if there's a search query
    const searchQuery = searchParams.get('search');
    
    let exercises;
    
    if (searchQuery) {
      exercises = await exerciseService.searchExercisesByName(searchQuery);
    } else {
      exercises = await exerciseService.getExercises(
        muscleGroups.length > 0 ? muscleGroups : undefined,
        equipment.length > 0 ? equipment : undefined,
        difficultyLevel
      );
    }
    
    return NextResponse.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.instructions || !body.difficultyLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newExercise = await exerciseService.createExercise(body);
    
    return NextResponse.json(newExercise, { status: 201 });
  } catch (error) {
    console.error('Error creating exercise:', error);
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    );
  }
} 