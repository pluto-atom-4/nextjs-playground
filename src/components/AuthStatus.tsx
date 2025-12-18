import { useAuth, useUser } from "@clerk/nextjs";

/**
 * AuthStatus Component
 * Displays the current authentication status and user information
 * Demonstrates Clerk hooks for authentication checks
 */
export function AuthStatus() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return <p className="text-gray-500">Loading authentication...</p>;
  }

  if (!isSignedIn) {
    return <p className="text-orange-600">Not signed in</p>;
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
      <p className="text-green-700 dark:text-green-300 font-semibold">✓ Signed in as</p>
      <p className="text-gray-700 dark:text-gray-300">{user?.emailAddresses[0]?.emailAddress}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {user?.firstName} {user?.lastName}
      </p>
    </div>
  );
}

/**
 * ProtectedContent Component
 * Example of protecting content based on authentication status
 */
export function ProtectedContent() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
        <p className="text-red-700 dark:text-red-300">
          This content is only visible to signed-in users. Please sign in to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
        Protected Content
      </h3>
      <p className="text-gray-700 dark:text-gray-300">
        You have access to this protected section because you are authenticated with Clerk.
      </p>
    </div>
  );
}

