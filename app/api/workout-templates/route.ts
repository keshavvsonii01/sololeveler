import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { connectDB } from '../../lib/db';
import { WorkoutTemplate } from '../../models/workouttemplate';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get('difficulty');
    const muscleGroup = searchParams.get('muscleGroup');
    const includeDefault = searchParams.get('includeDefault') === 'true';
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Build query
    const query: any = {
      $or: [
        { userId: session.user.id },
        { isDefault: true },
      ],
    };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (muscleGroup) {
      query.muscleGroups = muscleGroup;
    }

    const templates = await WorkoutTemplate.find(query)
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error: any) {
    console.error('Template fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, difficulty, muscleGroups, exercises } = body;

    if (!name || !difficulty || !exercises) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const template = new WorkoutTemplate({
      userId: session.user.id,
      name,
      description,
      difficulty,
      muscleGroups: muscleGroups || [],
      exercises,
      isDefault: false,
    });

    await template.save();

    return NextResponse.json({ template }, { status: 201 });
  } catch (error: any) {
    console.error('Template creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create template' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { templateId, name, description, difficulty, muscleGroups, exercises } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID required' },
        { status: 400 }
      );
    }

    await connectDB();

    const template = await WorkoutTemplate.findOne({
      _id: templateId,
      userId: session.user.id,
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    if (name) template.name = name;
    if (description) template.description = description;
    if (difficulty) template.difficulty = difficulty;
    if (muscleGroups) template.muscleGroups = muscleGroups;
    if (exercises) template.exercises = exercises;

    await template.save();

    return NextResponse.json({ template }, { status: 200 });
  } catch (error: any) {
    console.error('Template update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update template' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const templateId = searchParams.get('id');

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await WorkoutTemplate.deleteOne({
      _id: templateId,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Template deletion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete template' },
      { status: 500 }
    );
  }
}