'use client';
import { useState } from 'react';
import Link from 'next/link';
import ContactTab from './ContactTab';
import AboutTab from './AboutTab';

export default function TabContainer() {
  const [activeTab, setActiveTab] = useState<'contact' | 'about'>('contact');

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex flex-wrap space-x-2 mb-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded ${
            activeTab === 'contact' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Contact
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded ${
            activeTab === 'about' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          About
        </button>
        <Link
          href="/cache-showcase"
          className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white transition-colors"
        >
          🚀 Cache Showcase
        </Link>
      </div>

      {activeTab === 'contact' && <ContactTab />}
      {activeTab === 'about' && <AboutTab />}
    </div>
  );
}
