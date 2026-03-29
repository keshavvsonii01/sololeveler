'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface NavbarProps {
  session: Session | null;
}

export const Navbar: React.FC<NavbarProps> = ({ session }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative top-0 left-0 right-0 bg-brown border-b border-outline-variant border-opacity-15 z-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-system text-title-md text-primary">SHADOW_HUD</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            href="/dashboard"
            className="text-on-surface-variant hover:text-primary transition-colors font-functional text-body-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/workouts"
            className="text-on-surface-variant hover:text-primary transition-colors font-functional text-body-sm"
          >
            Workouts
          </Link>
          <Link
            href="/exercises"
            className="text-on-surface-variant hover:text-primary transition-colors font-functional text-body-sm"
          >
            Exercises
          </Link>
          <Link
            href="/leaderboards"
            className="text-on-surface-variant hover:text-primary transition-colors font-functional text-body-sm"
          >
            Leaderboards
          </Link>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {session?.user && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-none hover:bg-surface-high transition-colors"
              >
                <span className="font-functional text-body-sm text-on-surface">
                  {session.user.username}
                </span>
                <span className="text-primary">▼</span>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-high border border-outline-variant border-opacity-15 rounded-none shadow-bloom">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-on-surface hover:bg-surface hover:text-primary font-functional text-body-sm border-b border-outline-variant border-opacity-15"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full text-left px-4 py-2 text-error hover:bg-surface font-functional text-body-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface-high border-t border-outline-variant border-opacity-15">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-on-surface hover:text-primary font-functional text-body-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/workouts"
            className="block px-4 py-2 text-on-surface hover:text-primary font-functional text-body-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            Workouts
          </Link>
          <Link
            href="/exercises"
            className="block px-4 py-2 text-on-surface hover:text-primary font-functional text-body-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            Exercises
          </Link>
          <Link
            href="/leaderboards"
            className="block px-4 py-2 text-on-surface hover:text-primary font-functional text-body-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            Leaderboards
          </Link>
        </div>
      )}
    </nav>
  );
};