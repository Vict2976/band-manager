'use client';

import { useState } from 'react';
import { createUser, initialBandMembers } from '../../lib/userService';
import { initializeDefaultBand } from '../../lib/bandService';
import { useAuth } from '../../lib/auth';
import ProtectedRoute from '../../lib/ProtectedRoute';
import AuthNav from '../../lib/AuthNav';

export default function SetupPage() {
  const { user, sessionUser } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const createAllUsers = async () => {
    setIsCreating(true);
    setError('');
    setResults([]);
    
    try {
      // First, initialize the default band
      const bandId = await initializeDefaultBand();
      setResults(prev => [...prev, `✅ Created/found band: Olis Orkester`]);
      
      const defaultPassword = 'bandmanager2025';
      
      for (const member of initialBandMembers) {
        try {
          const user = await createUser({
            ...member,
            bandId // Associate user with the band
          }, defaultPassword);
          setResults(prev => [...prev, `✅ Created user: ${user.name} (${user.email})`]);
        } catch (error: any) {
          const errorMessage = `❌ Failed to create ${member.name}: ${error.message}`;
          setResults(prev => [...prev, errorMessage]);
          console.error(`Failed to create user ${member.name}:`, error);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error: any) {
      setError(`Failed to initialize band: ${error.message}`);
    }
    
    setIsCreating(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <AuthNav currentPage="setup" />

        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">
              <span style={{color: 'var(--gold)'}}>Band Manager</span> Setup
            </h1>
            
            <div className="bg-gray-900 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Initialize Olis Orkester</h2>
              <p className="text-gray-400 mb-6">
                This will create the band "Olis Orkester" and 7 band members in Firebase:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {initialBandMembers.map((member, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xl">{member.name[0]}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-gray-400">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={createAllUsers}
                disabled={isCreating}
                className="w-full px-6 py-3 text-lg text-black rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background: isCreating ? '#666' : 'var(--gold)'}}
              >
                {isCreating ? 'Creating Band & Members...' : 'Create Olis Orkester & Members'}
              </button>
            </div>
            
            {results.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-8">
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
            
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-semibold text-red-300 mb-2">Error:</h3>
                <p className="text-red-200">{error}</p>
              </div>
            )}
            
            <div className="text-center mt-8">
              <a 
                href="/users" 
                className="inline-block px-6 py-3 border border-gray-600 rounded-lg hover:border-yellow-400 transition-colors"
              >
                View Band Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
