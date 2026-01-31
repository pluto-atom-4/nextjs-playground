'use client';

import { ClerkProvider } from '@clerk/nextjs';

/**
 * ClerkProviderWrapper
 * Wraps ClerkProvider as a client component to prevent issues during SSR/build
 * This allows Clerk initialization to happen only in the browser
 */
export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
