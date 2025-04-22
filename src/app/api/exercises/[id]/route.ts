import { NextRequest, NextResponse } from 'next/server';
import * as exerciseService from '@/lib/exercises';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid exercise ID' },
        { status: 400 }
      );
    }
    
    const exercise = await exerciseService.getExerciseById(id);
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercise' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid exercise ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.instructions || !body.difficultyLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if exercise exists
    const existingExercise = await exerciseService.getExerciseById(id);
    
    if (!existingExercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }
    
    const updatedExercise = await exerciseService.updateExercise(id, body);
    
    return NextResponse.json(updatedExercise);
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json(
      { error: 'Failed to update exercise' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid exercise ID' },
        { status: 400 }
      );
    }
    
    // Check if exercise exists
    const existingExercise = await exerciseService.getExerciseById(id);
    
    if (!existingExercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }
    
    await exerciseService.deleteExercise(id);
    
    return NextResponse.json(
      { message: 'Exercise deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json(
      { error: 'Failed to delete exercise' },
      { status: 500 }
    );
  }
} 