'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Alert } from '../../components/alert';

interface UserProfile {
  user: {
    email?: string;
    username: string;
    bio?: string;
    isPublicProfile: boolean;
    createdAt: string;
  };
  progression: {
    currentRank: string;
    totalXPEarned: number;
    workoutStreak: number;
  };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    isPublicProfile: true,
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setUserData(data);
        setFormData({
          username: data.user.username,
          bio: data.user.bio || '',
          isPublicProfile: data.user.isPublicProfile,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target as unknown as { name: string; type: string; value: string };
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? !prev[name as keyof typeof formData] : value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-functional">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="surface-card p-8">
        <h1 className="font-system text-display-sm text-primary mb-8">USER_PROFILE</h1>

        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Error"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        {success && (
          <div className="mb-6">
            <Alert
              type="success"
              title="Success"
              message="Profile updated successfully"
              onClose={() => setSuccess(false)}
            />
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* User Info Section */}
          <div>
            <h2 className="font-system text-title-lg text-on-surface mb-6">ACCOUNT INFORMATION</h2>
            <div className="space-y-6">
              <div>
                <p className="text-label-md text-on-surface-variant mb-2">EMAIL</p>
                <p className="text-body-md text-on-surface font-functional">{userData?.user?.email}</p>
              </div>

              <Input
                type="text"
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                disabled={isSaving}
              />
              <div>
                <label className="block text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">
                  Profile Picture
                </label>
                {/* profile picture upload functionality */}
                <p className="text-on-surface-variant text-label-sm mt-1">
                  (Profile picture upload coming soon)
                </p>
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)] placeholder:text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Tell us about yourself"
                  maxLength={200}
                  rows={4}
                />
                <p className="text-on-surface-variant text-label-sm mt-1">
                  {formData.bio.length}/200 characters
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="border-t border-outline-variant border-opacity-15 pt-8">
            <h2 className="font-system text-title-lg text-on-surface mb-6">PRIVACY SETTINGS</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPublicProfile"
                checked={formData.isPublicProfile}
                onChange={handleChange}
                disabled={isSaving}
                className="w-5 h-5 cursor-pointer"
              />
              <span className="text-body-md text-on-surface font-functional">
                Make my profile public
              </span>
            </label>
            <p className="text-on-surface-variant text-body-sm mt-2">
              Public profiles can be viewed by other users on leaderboards
            </p>
          </div>

          {/* Progression Info Section */}
          <div className="border-t border-outline-variant border-opacity-15 pt-8 bg-surface-high bg-opacity-50 p-6">
            <h2 className="font-system text-title-lg text-on-surface mb-6">PROGRESSION STATUS</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-label-md text-on-surface-variant mb-2">CURRENT RANK</p>
                <p className="text-headline-md text-primary font-system">
                  {userData?.progression?.currentRank}-RANK
                </p>
              </div>
              <div>
                <p className="text-label-md text-on-surface-variant mb-2">TOTAL XP</p>
                <p className="text-headline-md text-secondary font-system">
                  {(userData?.progression?.totalXPEarned ?? 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-label-md text-on-surface-variant mb-2">CURRENT STREAK</p>
                <p className="text-headline-md text-success font-system">
                  {userData?.progression?.workoutStreak || 0} DAYS
                </p>
              </div>
              <div>
                <p className="text-label-md text-on-surface-variant mb-2">MEMBER SINCE</p>
                <p className="text-body-md text-on-surface font-functional">
                  {new Date(userData?.user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-outline-variant border-opacity-15 pt-8 flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
              disabled={isSaving}
            >
              Save Changes
            </Button>
            {/* <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => {
                setFormData({
                  username: userData?.user?.username || '',
                  bio: userData?.user?.bio || '',
                  isPublicProfile: userData?.user?.isPublicProfile,
                });
              }}
              disabled={isSaving}
            >
              Reset
            </Button> */}
          </div>
        </form>
      </div>
    </div>
  );
}