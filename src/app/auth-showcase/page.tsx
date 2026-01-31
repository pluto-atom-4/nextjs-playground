'use client';

export const dynamic = 'force-dynamic';

import { useAuth, useUser } from '@clerk/nextjs';
import { AuthStatus, ProtectedContent } from '@/components/AuthStatus';

export default function AuthShowcasePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Clerk Authentication Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Experience secure authentication with Clerk
          </p>
        </div>

        {/* Authentication Status */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Authentication Status
          </h2>
          {isLoaded ? (
            <AuthStatus />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>
          )}
        </div>

        {/* User Information */}
        {isSignedIn && user && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">User ID</p>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all">
                  {user.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Created At</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Protected Content Example */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Protected Content Example
          </h2>
          <ProtectedContent />
        </div>

        {/* Feature Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Clerk Features
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Sign In / Sign Up</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Modal-based authentication in the header
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">User Profile Management</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built-in UserButton for account management
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Session Management</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatic session handling with middleware
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Route Protection</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optional middleware-based route protection
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Multi-factor Authentication</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enhanced security with MFA support
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href="https://clerk.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Clerk Docs
            </a>
            <a
              href="https://clerk.com/docs/nextjs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Next.js Integration
            </a>
            <a
              href="https://dashboard.clerk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Clerk Dashboard
            </a>
            <a
              href="/generated/docs-copilot/CLERK_SETUP.md"
              className="inline-block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors"
            >
              Setup Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
