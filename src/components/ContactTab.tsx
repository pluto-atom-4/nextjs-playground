'use client';
import { useState } from 'react';

export default function ContactTab() {
  const [email, setEmail] = useState('');

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="border p-2 w-full"
      />
      <p className="mt-2 text-sm text-gray-600">We&#39;ll get back to you soon!</p>
    </div>
  );
}
