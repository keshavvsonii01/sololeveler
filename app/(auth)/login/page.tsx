'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Alert } from '../../components/alert';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Login failed. Please try again.');
      } else {
        setError('Login failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      {/* Background grid pattern */}
      <div className="fixed inset-0 grid-pattern opacity-10"></div>

      {/* Decorative corner bracket */}
      <div className="absolute top-20 right-20 w-20 h-20 border-t-2 border-r-2 border-primary opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-20 h-20 border-b-2 border-l-2 border-primary opacity-30"></div>

      {/* Main form container */}
      <div className="w-full max-w-md relative z-10">
        <div className="surface-card p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-system text-display-sm text-primary mb-2 animate-pulse-glow">
              SYSTEM_LOGIN
            </h1>
            <p className="text-on-surface-variant font-functional text-body-sm">
              Verifying biometric clearance...
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert
                type="error"
                title="Authentication Failed"
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="••••••••"
              required
              value={formData.password}
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
              {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE_SESSION'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 space-y-4 text-center">
            <p className="text-on-surface-variant text-body-sm">
              No access yet?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Initialize new profile
              </Link>
            </p>
          </div>

          {/* System info footer */}
          <div className="mt-12 pt-8 border-t border-outline-variant border-opacity-15 text-on-surface-variant text-label-sm space-y-1">
            <p>LOG_REF: SHADOW_SERVER_01</p>
            <p>STATUS: READY_TO_AUTHENTICATE</p>
          </div>
        </div>
      </div>
    </div>
  );
}