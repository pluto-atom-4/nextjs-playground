'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

/**
 * ClerkProviderWrapper
 * Wraps ClerkProvider as a client component to prevent issues during SSR/build
 *
 * Behavior:
 * - Production: Full Clerk initialization with API validation
 * - CI Build: Skips ClerkProvider to avoid API key validation errors
 * - Development: Full Clerk initialization
 */
export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  // Detect CI environment to skip Clerk validation during builds
  const isCIBuild = process.env.CI === 'true' || process.env.NEXT_PUBLIC_CI === 'true';

  // During CI builds, render children without ClerkProvider to prevent API validation errors
  if (isCIBuild) {
    return <>{children}</>;
  }

  // In production/dev, useful ClerkProvider
  return <ClerkProvider>{children}</ClerkProvider>;
}
