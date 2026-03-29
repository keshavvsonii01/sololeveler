'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Alert } from '../../components/alert';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Client-side validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      // Show success message
      setSuccess(true);

      // Auto-login after successful registration
      setTimeout(async () => {
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push('/');
        } else {
          // If auto-login fails, redirect to login page
          router.push('/login');
        }
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-md relative z-10">
          <div className="surface-card p-8 md:p-12 text-center">
            <h1 className="font-system text-display-sm text-primary mb-4 animate-pulse-glow">
              AWAKENING...
            </h1>
            <p className="text-on-surface font-functional text-body-md mb-2">
              Your profile has been initialized
            </p>
            <p className="text-on-surface-variant text-body-sm">
              Redirecting to dashboard...
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      {/* Background grid pattern */}
      <div className="fixed inset-0 grid-pattern opacity-10"></div>

      {/* Decorative corner brackets */}
      <div className="absolute top-20 right-20 w-20 h-20 border-t-2 border-r-2 border-secondary opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-20 h-20 border-b-2 border-l-2 border-secondary opacity-30"></div>

      {/* Main form container */}
      <div className="w-full max-w-md relative z-10">
        <div className="surface-card p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-system text-display-sm text-secondary mb-2 animate-pulse-glow">
              INITIALIZE_LINK
            </h1>
            <p className="text-on-surface-variant font-functional text-body-sm">
              System access pending: Enter credentials
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert
                type="error"
                title="System Alert"
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              name="username"
              label="System Alias"
              placeholder="Enter unique identifier"
              required
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Input
              type="email"
              name="email"
              label="Identifier"
              placeholder="user@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Input
              type="password"
              name="password"
              label="Access Code"
              placeholder="Min. 6 characters"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Access Code"
              placeholder="Re-enter password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'INITIALIZING...' : 'INITIALIZE_AWAKENING'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 space-y-4 text-center">
            <p className="text-on-surface-variant text-body-sm">
              Already awakened?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Return to login
              </Link>
            </p>
          </div>

          {/* System info footer */}
          <div className="mt-12 pt-8 border-t border-outline-variant border-opacity-15 text-on-surface-variant text-label-sm space-y-1">
            <p>SYS_STATUS: INITIALIZATION_PROTOCOL_V4.0.2</p>
            <p>MODE: NEW_PROFILE_CREATION</p>
          </div>
        </div>
      </div>
    </div>
  );
}