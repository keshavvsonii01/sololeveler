'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '../app/components/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl opacity-5"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-5"></div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-outline-variant border-opacity-15">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-system text-title-lg text-primary">SHADOW_HUD</h1>
          <Link href="/login">
            <Button variant="primary" size="md">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Hero Text */}
          <div>
            <h2 className="font-system text-display-lg text-primary mb-6 animate-pulse-glow">
              LEVEL UP YOUR REAL LIFE
            </h2>
            <p className="font-functional text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              Track every workout. Earn XP. Climb ranks from E-Rank to S-Rank supremacy. Transform your fitness journey into an epic solo leveling adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Already Awakened?
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div className="space-y-4">
            <div className="surface-card p-6 border-l-4 border-primary hover:border-secondary transition-all">
              <p className="font-system text-title-md text-primary mb-2">🎖️ 6 RANK TIERS</p>
              <p className="text-on-surface-variant font-functional text-body-sm">
                Progress from E-Rank to S-Rank. Each tier brings new challenges and rewards.
              </p>
            </div>

            <div className="surface-card p-6 border-l-4 border-secondary hover:border-primary transition-all">
              <p className="font-system text-title-md text-secondary mb-2">⚡ REAL-TIME XP</p>
              <p className="text-on-surface-variant font-functional text-body-sm">
                Log workouts and instantly earn XP. See your progression in real-time.
              </p>
            </div>

            <div className="surface-card p-6 border-l-4 border-primary hover:border-secondary transition-all">
              <p className="font-system text-title-md text-primary mb-2">🔥 STREAK SYSTEM</p>
              <p className="text-on-surface-variant font-functional text-body-sm">
                Build workout streaks. Stay consistent. Compete globally on leaderboards.
              </p>
            </div>

            <div className="surface-card p-6 border-l-4 border-secondary hover:border-primary transition-all">
              <p className="font-system text-title-md text-secondary mb-2">🏆 GLOBAL RANKINGS</p>
              <p className="text-on-surface-variant font-functional text-body-sm">
                Compete with hunters worldwide. Climb the leaderboards. Become a legend.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-surface-low py-32">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="font-system text-display-sm text-on-surface text-center mb-16">
            COMPLETE SYSTEM
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '💪', title: 'Detailed Logging', desc: 'Track sets, reps, weight, and notes. Your complete workout data.' },
              { icon: '📊', title: 'Personal Stats', desc: 'Monitor personal bests, averages, and progress per exercise.' },
              { icon: '🧘', title: 'Exercise Library', desc: '9 default exercises. Create custom ones. Full flexibility.' },
              { icon: '📅', title: 'Schedule Builder', desc: 'Set workout days. Track streaks. Stay accountable.' },
              { icon: '🎯', title: 'XP System', desc: 'Calculated by difficulty. Multipliers. Rank up progression.' },
              { icon: '🌍', title: 'Global Community', desc: '3 leaderboards. View profiles. Compete fairly.' },
            ].map((feature, idx) => (
              <div key={idx} className="surface-card p-6">
                <p className="text-4xl mb-4">{feature.icon}</p>
                <h4 className="font-system text-title-md text-on-surface mb-2">
                  {feature.title}
                </h4>
                <p className="text-on-surface-variant font-functional text-body-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-32">
        <div className="surface-card p-12 text-center border-l-4 border-primary">
          <h3 className="font-system text-display-sm text-primary mb-6">
            YOUR AWAKENING AWAITS
          </h3>
          <p className="font-functional text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
            Join hunters from around the world. Track your progress. Build your strength. Become the strongest version of yourself.
          </p>
          <Link href="/register">
            <Button variant="primary" size="lg">
              Start Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-outline-variant border-opacity-15 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-system text-title-md text-primary mb-4">Shadow HUD</h4>
              <p className="text-on-surface-variant text-body-sm">
                A solo leveling inspired fitness tracking system.
              </p>
            </div>
            <div>
              <h4 className="font-system text-title-md text-on-surface mb-4">Navigation</h4>
              <ul className="space-y-2 text-body-sm text-on-surface-variant">
                <li><Link href="/login" className="hover:text-primary transition">Login</Link></li>
                <li><Link href="/register" className="hover:text-primary transition">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-system text-title-md text-on-surface mb-4">Status</h4>
              <p className="text-body-sm text-on-surface-variant">
                All systems operational ✓
              </p>
            </div>
          </div>

          <div className="border-t border-outline-variant border-opacity-15 pt-8 text-center">
            <p className="text-on-surface-variant text-label-sm">
              SYSTEM_STATUS: LIVE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}