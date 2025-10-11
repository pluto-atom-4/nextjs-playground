import { userSchema } from '@/lib/schema';

const result = userSchema.safeParse({ name: 'Alice', age: 25 });
console.log(result.success); // true

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to Your Playground!</h1>
    </main>
  );
}
