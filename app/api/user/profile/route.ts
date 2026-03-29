import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { connectDB } from '../../../lib/db';
import { User } from '../../../models/user';
import { Progression } from '../../../models/progression';

// GET user profile with progression data
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const progression = await Progression.findOne({ userId: user._id });

    return NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          profilePicture: user.profilePicture,
          bio: user.bio,
          theme: user.theme,
          isPublicProfile: user.isPublicProfile,
          createdAt: user.createdAt,
        },
        progression: progression || null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { username, bio, profilePicture, theme, isPublicProfile } = await req.json();

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if new username is already taken (if changed)
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
      user.username = username;
    }

    // Update other fields
    if (bio !== undefined) user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (theme !== undefined) user.theme = theme;
    if (isPublicProfile !== undefined) user.isPublicProfile = isPublicProfile;

    await user.save();

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          profilePicture: user.profilePicture,
          bio: user.bio,
          theme: user.theme,
          isPublicProfile: user.isPublicProfile,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 500 }
    );
  }
}