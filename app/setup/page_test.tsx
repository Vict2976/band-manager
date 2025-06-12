'use client';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            <span style={{color: 'var(--gold)'}}>Band Manager</span> Setup
          </h1>
          
          <div className="bg-gray-900 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Test Page</h2>
            <p className="text-gray-400 mb-6">
              This is a minimal test page to check if the setup route works.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
