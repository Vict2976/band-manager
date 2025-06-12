'use client';

import { useState } from 'react';
import { createUser, initialBandMembers } from '../../lib/userService';
import { initializeDefaultBand } from '../../lib/bandService';

export default function QuickSetupPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const createTestData = async () => {
    setIsCreating(true);
    setResults([]);
    
    try {
      // First, initialize the default band
      const bandId = await initializeDefaultBand();
      setResults(prev => [...prev, `✅ Created/found band: Olis Orkester (${bandId})`]);
      
      const defaultPassword = 'bandmanager2025';
      
      for (const member of initialBandMembers) {
        try {
          const user = await createUser({
            ...member,
            bandId // Associate user with the band
          }, defaultPassword);
          setResults(prev => [...prev, `✅ Created user: ${user.name} (${user.email})`]);
        } catch (error: any) {
          if (error.message.includes('auth/email-already-in-use')) {
            setResults(prev => [...prev, `ℹ️ User already exists: ${member.name} (${member.email})`]);
          } else {
            setResults(prev => [...prev, `❌ Failed to create ${member.name}: ${error.message}`]);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error: any) {
      setResults(prev => [...prev, `❌ Failed to initialize: ${error.message}`]);
    }
    
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <span style={{color: 'var(--gold)'}}>Quick Setup</span>
        </h1>
        
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <p className="text-gray-400 mb-4">
            This will create "Olis Orkester" and initialize band members.
          </p>
          
          <button
            onClick={createTestData}
            disabled={isCreating}
            className="w-full px-6 py-3 text-lg text-black rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50"
            style={{background: isCreating ? '#666' : 'var(--gold)'}}
          >
            {isCreating ? 'Creating...' : 'Initialize Band & Members'}
          </button>
        </div>
        
        {results.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Results:</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center mt-6">
          <a 
            href="/users" 
            className="inline-block px-6 py-3 border border-gray-600 rounded-lg hover:border-yellow-400 transition-colors mr-4"
          >
            View Band Page
          </a>
          <a 
            href="/calendar" 
            className="inline-block px-6 py-3 border border-gray-600 rounded-lg hover:border-yellow-400 transition-colors"
          >
            Calendar
          </a>
        </div>
      </div>
    </div>
  );
}
