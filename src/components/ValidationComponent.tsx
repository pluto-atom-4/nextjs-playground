'use client';

import { userSchema } from '@/lib/schema';

export default function ValidationComponent() {
  const result = userSchema.safeParse({ name: 'Alice', age: 25 });

  return (
    <div>
      {result.success ? (
        <p>Valid: {result.data.name}, {result.data.age}</p>
      ) : (
        <p>Error: {result.error.message}</p>
      )}
    </div>
  );
}