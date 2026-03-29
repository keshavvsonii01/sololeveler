import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { User } from '../../../models/user';
import { Progression } from '../../../models/progression';

export async function POST(req: NextRequest) {
  try {
    const { email, username, password, confirmPassword } = await req.json();

    // Validation
    if (!email || !username || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 30 characters' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, underscores, and hyphens' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new User({
      email,
      username,
      password,
      isVerified: true, // For MVP, auto-verify
    });

    await newUser.save();

    // Create progression document for new user
    const progression = new Progression({
      userId: newUser._id,
      currentRank: 'E',
      currentXP: 0,
      totalXPEarned: 0,
      workoutStreak: 0,
      longestStreak: 0,
      xpMultiplier: 1.0,
      rankUpHistory: [],
    });

    await progression.save();

    // Return success (without password)
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          email: newUser.email,
          username: newUser.username,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}