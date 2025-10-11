'use client';
import { useState } from 'react';
import ContactTab from './ContactTab';
import AboutTab from './AboutTab';

export default function TabContainer() {
  const [activeTab, setActiveTab] = useState<'contact' | 'about'>('contact');

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded ${
            activeTab === 'contact' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Contact
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded ${
            activeTab === 'about' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          About
        </button>
      </div>

      {activeTab === 'contact' && <ContactTab />}
      {activeTab === 'about' && <AboutTab />}
    </div>
  );
}
