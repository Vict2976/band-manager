'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { createBand } from '../../../lib/bandService';
import { createUser, createUserProfile, updateUserProfile } from '../../../lib/userService';

interface BandMember {
  name: string;
  email: string;
  instrument: string;
  role: string;
}

export default function NewBandSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Band information
  const [bandForm, setBandForm] = useState({
    name: '',
    genre: '',
    description: '',
    location: ''
  });

  // Admin user (band creator)
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    instrument: '',
    role: ''
  });

  // Band members to invite
  const [members, setMembers] = useState<BandMember[]>([]);
  const [newMember, setNewMember] = useState<BandMember>({
    name: '',
    email: '',
    instrument: '',
    role: 'member'
  });

  const addMember = () => {
    if (newMember.name && newMember.email && newMember.instrument) {
      setMembers([...members, { ...newMember }]);
      setNewMember({ name: '', email: '', instrument: '', role: 'member' });
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleBandNext = () => {
    if (bandForm.name && bandForm.genre) {
      setCurrentStep(2);
      setError('');
    } else {
      setError('Please fill in band name and genre');
    }
  };

  const handleAdminNext = () => {
    if (adminForm.name && adminForm.email && adminForm.password && adminForm.confirmPassword && adminForm.instrument) {
      if (adminForm.password !== adminForm.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (adminForm.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setCurrentStep(3);
      setError('');
    } else {
      setError('Please fill in all admin details');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Step 1: Create the admin user account (this handles both auth and Firestore)
      const adminUser = await createUser({
        name: adminForm.name,
        email: adminForm.email,
        instrument: adminForm.instrument,
        role: adminForm.role || 'Band Leader',
        permission: 'admin',
        isActive: true,
        joinedAt: new Date()
      }, adminForm.password);

      // Step 2: Create the band
      const bandId = await createBand({
        name: bandForm.name,
        genre: bandForm.genre,
        description: bandForm.description,
        location: bandForm.location,
        createdBy: adminUser.uid!,
        updatedAt: new Date()
      });

      // Step 3: Update admin user with bandId (using updateUserProfile)
      await updateUserProfile(adminUser.uid!, { 
        bandId: bandId,
        updatedAt: new Date()
      });

      // Step 4: Create member profiles (they'll need to set passwords later)
      for (const member of members) {
        try {
          await createUserProfile({
            name: member.name,
            email: member.email,
            instrument: member.instrument,
            role: member.role,
            permission: 'member',
            bandId: bandId,
            isActive: false, // They need to activate their account
            joinedAt: new Date()
          });
        } catch (error) {
          console.error(`Failed to create member ${member.name}:`, error);
          // Continue with other members even if one fails
        }
      }

      // Step 5: Sign in the admin user
      await signInWithEmailAndPassword(auth, adminForm.email, adminForm.password);

      // Step 6: Redirect to dashboard
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Setup error:', error);
      setError(error.message || 'Failed to create band. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full" style={{background: 'var(--gold)'}}></div>
              <span className="text-xl font-bold">BandManager</span>
            </div>
            <div className="text-sm text-gray-400">
              Step {currentStep} of 3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'text-black'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                  style={step <= currentStep ? {background: 'var(--gold)'} : {}}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      step < currentStep ? 'bg-yellow-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={currentStep >= 1 ? 'text-yellow-400' : 'text-gray-400'}>Band Info</span>
            <span className={currentStep >= 2 ? 'text-yellow-400' : 'text-gray-400'}>Admin Account</span>
            <span className={currentStep >= 3 ? 'text-yellow-400' : 'text-gray-400'}>Add Members</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Step 1: Band Information */}
        {currentStep === 1 && (
          <div className="bg-gray-900 rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Band</h1>
            <p className="text-gray-400 mb-8">Let's start with some basic information about your band.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Band Name *
                </label>
                <input
                  type="text"
                  required
                  value={bandForm.name}
                  onChange={(e) => setBandForm({...bandForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g., The Rock Stars"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre *
                </label>
                <select
                  required
                  value={bandForm.genre}
                  onChange={(e) => setBandForm({...bandForm, genre: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="">Select a genre</option>
                  <option value="Rock">Rock</option>
                  <option value="Pop">Pop</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Blues">Blues</option>
                  <option value="Country">Country</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Classical">Classical</option>
                  <option value="Folk">Folk</option>
                  <option value="Punk">Punk</option>
                  <option value="Metal">Metal</option>
                  <option value="Alternative">Alternative</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={bandForm.location}
                  onChange={(e) => setBandForm({...bandForm, location: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g., Los Angeles, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={bandForm.description}
                  onChange={(e) => setBandForm({...bandForm, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  rows={3}
                  placeholder="Tell us about your band..."
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleBandNext}
                className="px-8 py-3 text-black rounded-lg font-medium transition-all hover:scale-105"
                style={{background: 'var(--gold)'}}
              >
                Next: Create Admin Account
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Admin Account */}
        {currentStep === 2 && (
          <div className="bg-gray-900 rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-2">Create Admin Account</h1>
            <p className="text-gray-400 mb-8">Set up your account as the band administrator.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="your@email.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    placeholder="Password (6+ characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminForm.confirmPassword}
                    onChange={(e) => setAdminForm({...adminForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Instrument *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminForm.instrument}
                    onChange={(e) => setAdminForm({...adminForm, instrument: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    placeholder="e.g., Guitar, Vocals, Drums"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={adminForm.role}
                    onChange={(e) => setAdminForm({...adminForm, role: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    placeholder="e.g., Band Leader, Songwriter"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleAdminNext}
                className="px-8 py-3 text-black rounded-lg font-medium transition-all hover:scale-105"
                style={{background: 'var(--gold)'}}
              >
                Next: Add Members
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Add Members */}
        {currentStep === 3 && (
          <div className="bg-gray-900 rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-2">Add Band Members</h1>
            <p className="text-gray-400 mb-8">
              Invite your band members by email. They'll receive instructions to set up their accounts.
            </p>

            {/* Add Member Form */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New Member</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={newMember.instrument}
                  onChange={(e) => setNewMember({...newMember, instrument: e.target.value})}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Instrument"
                />
                <button
                  onClick={addMember}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
                >
                  Add Member
                </button>
              </div>
            </div>

            {/* Members List */}
            {members.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Band Members ({members.length})</h3>
                <div className="space-y-3">
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email} • {member.instrument}</p>
                      </div>
                      <button
                        onClick={() => removeMember(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {members.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No members added yet. Add some members above or skip this step for now.</p>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 text-black rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background: loading ? '#666' : 'var(--gold)'}}
              >
                {loading ? 'Creating Band...' : 'Create Band & Finish'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
