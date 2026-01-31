'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

/**
 * ClerkProviderWrapper
 * Wraps ClerkProvider as a client component to prevent issues during SSR/build
 * This allows Clerk initialization to happen only in the browser
 *
 * IMPORTANT: This component always renders ClerkProvider because:
 * - Client-side Clerk components and hooks require it
 * - Auth-requiring pages are marked as dynamic (not pre-rendered)
 * - SKIP_ENV_VALIDATION env var prevents API validation in CI
 */
export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
