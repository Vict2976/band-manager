'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import AuthNav from '../../lib/AuthNav';
import ProtectedRoute from '../../lib/ProtectedRoute';
import { 
  getGearByBandId, 
  createGear, 
  updateGear, 
  deleteGear,
  Gear, 
  GEAR_CATEGORIES,
  searchGear,
  getGearByType,
  getGearByCondition,
  getOwnedGear,
  getWishlistGear,
  getGearByWishlistStatus,
  getGearByPriority
} from '../../lib/gearService';
import { getBandById, getCurrentUserBand } from '../../lib/bandService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface GearFormData {
  name: string;
  type: 'microphone' | 'cable' | 'instrument' | 'amplifier' | 'percussion' | 'accessory' | 'audio-equipment' | 'lighting' | 'other';
  category: string;
  brand: string;
  model: string;
  description: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs-repair';
  location: string;
  isWishlist: boolean;
  wishlistStatus: 'wanted' | 'researching' | 'saving-for' | 'ready-to-buy' | 'ordered' | 'purchased';
  estimatedCost: string; // Keep as string for form input, convert to number when saving
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
}

const initialFormData: GearFormData = {
  name: '',
  type: 'microphone',
  category: '',
  brand: '',
  model: '',
  description: '',
  condition: 'good',
  location: '',
  isWishlist: false,
  wishlistStatus: 'wanted',
  estimatedCost: '',
  priority: 'medium',
  notes: ''
};

export default function GearPage() {
  const { user, sessionUser } = useAuth();
  const currentUser = user || sessionUser;

  const [gear, setGear] = useState<Gear[]>([]);
  const [filteredGear, setFilteredGear] = useState<Gear[]>([]);
  const [loading, setLoading] = useState(true);
  const [bandName, setBandName] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGear, setEditingGear] = useState<Gear | null>(null);
  const [formData, setFormData] = useState<GearFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  
  // New state for tabs and wishlist functionality
  const [activeTab, setActiveTab] = useState<'owned' | 'wishlist'>('owned');
  const [wishlistStatusFilter, setWishlistStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        
        // Get current user's band
        const bandId = await getCurrentUserBand(currentUser.uid);
        
        // Fetch band info
        const band = await getBandById(bandId);
        if (band) {
          setBandName(band.name);
        }

        // Fetch gear
        const gearData = await getGearByBandId(bandId);
        setGear(gearData);
        setFilteredGear(gearData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Apply filters whenever gear, search term, or filters change
  useEffect(() => {
    let filtered = [...gear];

    // First filter by tab (owned vs wishlist)
    if (activeTab === 'owned') {
      filtered = getOwnedGear(filtered);
    } else {
      filtered = getWishlistGear(filtered);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = searchGear(filtered, searchTerm);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = getGearByType(filtered, typeFilter);
    }

    // Apply condition filter for owned gear
    if (activeTab === 'owned' && conditionFilter !== 'all') {
      filtered = getGearByCondition(filtered, conditionFilter);
    }

    // Apply wishlist-specific filters
    if (activeTab === 'wishlist') {
      if (wishlistStatusFilter !== 'all') {
        filtered = getGearByWishlistStatus(filtered, wishlistStatusFilter);
      }
      if (priorityFilter !== 'all') {
        filtered = getGearByPriority(filtered, priorityFilter);
      }
    }

    setFilteredGear(filtered);
  }, [gear, searchTerm, typeFilter, conditionFilter, activeTab, wishlistStatusFilter, priorityFilter]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      // Get the band ID
      const bandId = await getCurrentUserBand(currentUser.uid);
      
      // Convert form data to proper types
      const gearData: any = {
        ...formData,
        bandId: bandId,
        createdBy: currentUser.uid
      };
      
      // Only include estimatedCost if it has a value
      if (formData.estimatedCost) {
        gearData.estimatedCost = parseFloat(formData.estimatedCost);
      }
      
      if (editingGear) {
        // Update existing gear
        const updateData: any = {
          ...formData
        };
        
        // Only include estimatedCost if it has a value
        if (formData.estimatedCost) {
          updateData.estimatedCost = parseFloat(formData.estimatedCost);
        }
        
        await updateGear(editingGear.id!, updateData);
        const updatedGear = gear.map(item => 
          item.id === editingGear.id 
            ? { ...item, ...updateData }
            : item
        );
        setGear(updatedGear);
      } else {
        // Create new gear
        const newGearId = await createGear(gearData);
        const newGear = { ...gearData, id: newGearId };
        setGear([...gear, newGear]);
      }

      // Reset form
      setFormData(initialFormData);
      setShowAddForm(false);
      setEditingGear(null);
    } catch (error) {
      console.error('Error saving gear:', error);
    }
  };

  const handleEditGear = (gearItem: Gear) => {
    setEditingGear(gearItem);
    setFormData({
      name: gearItem.name,
      type: gearItem.type,
      category: gearItem.category,
      brand: gearItem.brand || '',
      model: gearItem.model || '',
      description: gearItem.description || '',
      condition: gearItem.condition,
      location: gearItem.location || '',
      isWishlist: gearItem.isWishlist || false,
      wishlistStatus: gearItem.wishlistStatus || 'wanted',
      estimatedCost: gearItem.estimatedCost ? gearItem.estimatedCost.toString() : '',
      priority: gearItem.priority || 'medium',
      notes: gearItem.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDeleteGear = async (gearId: string) => {
    if (!confirm('Are you sure you want to delete this gear item? This will also remove it from all events.')) {
      return;
    }

    try {
      await deleteGear(gearId);
      setGear(gear.filter(item => item.id !== gearId));
    } catch (error) {
      console.error('Error deleting gear:', error);
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setShowAddForm(false);
    setEditingGear(null);
  };

  const handleAddNew = (isWishlist: boolean = false) => {
    setFormData({
      ...initialFormData,
      isWishlist
    });
    setShowAddForm(true);
    setEditingGear(null);
  };

  const handleConvertToOwned = async (gearItem: Gear) => {
    if (!currentUser || !gearItem.id) return;

    // Confirm the conversion
    const confirmed = confirm(
      `Convert "${gearItem.name}" from wishlist to owned gear?\n\n` +
      `This will:\n` +
      `• Remove it from your wishlist\n` +
      `• Add it to your owned gear\n` +
      `• Set condition to "Good" (you can edit this later)\n` +
      `• Remove wishlist-specific fields (status, priority, estimated cost)`
    );

    if (!confirmed) return;

    try {
      // Convert wishlist item to owned gear
      const updatedData = {
        isWishlist: false,
        condition: 'good' as const,
        description: gearItem.notes || gearItem.description,
        location: '' // User can update this later
      };

      // Update in database
      await updateGear(gearItem.id, updatedData);

      // Update local state - remove wishlist-specific fields
      const updatedGear = gear.map(item => 
        item.id === gearItem.id 
          ? { 
              ...item, 
              ...updatedData,
              // Remove wishlist-specific fields from local state
              wishlistStatus: undefined,
              priority: undefined,
              estimatedCost: undefined,
              notes: undefined
            }
          : item
      );
      setGear(updatedGear);

      // If we're currently on the wishlist tab, the item will disappear
      // Show a brief success message
      alert(`✅ "${gearItem.name}" has been moved to your owned gear!`);
    } catch (error) {
      console.error('Error converting wishlist item to owned gear:', error);
      alert('❌ Failed to mark item as owned. Please try again.');
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-green-300';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-orange-400';
      case 'needs-repair': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getWishlistStatusColor = (status: string) => {
    switch (status) {
      case 'wanted': return 'text-blue-400';
      case 'researching': return 'text-yellow-400';
      case 'saving-for': return 'text-orange-400';
      case 'ready-to-buy': return 'text-green-400';
      case 'ordered': return 'text-purple-400';
      case 'purchased': return 'text-green-300';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'urgent': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'microphone': return '🎤';
      case 'cable': return '🔌';
      case 'instrument': return '🎸';
      case 'amplifier': return '🔊';
      case 'percussion': return '🥁';
      case 'audio-equipment': return '🎚️';
      case 'accessory': return '🎵';
      case 'lighting': return '💡';
      case 'other': return '📦';
      default: return '📦';
    }
  };

  const getCategoryIcon = (category: string, fallbackType: string) => {
    // Microphones
    if (category.includes('Vocal') || category.includes('Dynamic')) return '🎤';
    if (category.includes('Condenser') || category.includes('USB')) return '🎙️';
    if (category.includes('Wireless') || category.includes('Lavalier')) return '📡';
    
    // Cables
    if (category.includes('XLR') || category.includes('TRS') || category.includes('TS')) return '🔌';
    if (category.includes('Power') || category.includes('Extension')) return '⚡';
    if (category.includes('MIDI') || category.includes('USB')) return '🔗';
    if (category.includes('Optical') || category.includes('Ethernet')) return '🌐';
    
    // Instruments - Strings
    if (category.includes('Guitar') && !category.includes('Amplifier')) return '🎸';
    if (category.includes('Bass') && !category.includes('Amplifier')) return '🎸';
    if (category.includes('Violin') || category.includes('Viola')) return '🎻';
    if (category.includes('Cello') || category.includes('Double Bass')) return '🎻';
    if (category.includes('Harp')) return '🪈';
    if (category.includes('Banjo') || category.includes('Mandolin') || category.includes('Ukulele')) return '🪕';
    
    // Instruments - Keyboards
    if (category.includes('Piano') || category.includes('Keyboard')) return '🎹';
    if (category.includes('Synthesizer')) return '🎹';
    if (category.includes('Accordion')) return '🪗';
    
    // Instruments - Brass
    if (category.includes('Trumpet')) return '🎺';
    if (category.includes('Trombone') || category.includes('Tuba')) return '🎺';
    if (category.includes('French Horn')) return '🎺';
    
    // Instruments - Woodwinds
    if (category.includes('Saxophone')) return '🎷';
    if (category.includes('Clarinet') || category.includes('Oboe') || category.includes('Bassoon')) return '🎷';
    if (category.includes('Flute')) return '🪈';
    if (category.includes('Harmonica')) return '🎵';
    
    // Amplifiers & Speakers
    if (category.includes('Amplifier') || category.includes('PA System')) return '🔊';
    if (category.includes('Monitor') || category.includes('Speaker')) return '🔈';
    if (category.includes('Subwoofer')) return '🔊';
    if (category.includes('Preamp')) return '🎚️';
    
    // Percussion
    if (category.includes('Drum Kit') || category.includes('Snare') || category.includes('Bass Drum') || category.includes('Tom')) return '🥁';
    if (category.includes('Cymbal') || category.includes('Hi-Hat')) return '🥁';
    if (category.includes('Tambourine') || category.includes('Shaker') || category.includes('Maracas')) return '🪇';
    if (category.includes('Cajon') || category.includes('Bongos') || category.includes('Congas')) return '🪘';
    if (category.includes('Triangle') || category.includes('Cowbell') || category.includes('Wood Block')) return '🔔';
    if (category.includes('Xylophone') || category.includes('Vibraphone') || category.includes('Marimba')) return '🎵';
    if (category.includes('Gong') || category.includes('Chimes')) return '🎵';
    
    // Audio Equipment
    if (category.includes('Mixing') || category.includes('Mixer')) return '🎚️';
    if (category.includes('Interface') || category.includes('Controller')) return '🎛️';
    if (category.includes('Direct Box') || category.includes('DI')) return '📦';
    if (category.includes('Compressor') || category.includes('Equalizer')) return '🎛️';
    if (category.includes('Reverb') || category.includes('Delay') || category.includes('Effects')) return '🎶';
    if (category.includes('Wireless') || category.includes('In-Ear')) return '📡';
    if (category.includes('Headphone')) return '🎧';
    
    // Accessories - Stands & Support
    if (category.includes('Stand') || category.includes('Boom')) return '🎤';
    if (category.includes('Stool') || category.includes('Bench')) return '🪑';
    if (category.includes('Case') || category.includes('Bag')) return '💼';
    if (category.includes('Rack') || category.includes('Flight Case')) return '📦';
    
    // Accessories - Tools & Utilities
    if (category.includes('Tuner')) return '🎵';
    if (category.includes('Metronome')) return '⏱️';
    if (category.includes('Pick') || category.includes('Capo')) return '🎸';
    if (category.includes('Drumsticks') || category.includes('Mallets') || category.includes('Brushes')) return '🥁';
    if (category.includes('Strap')) return '🎸';
    if (category.includes('Pedalboard') || category.includes('Effects Pedal')) return '🎛️';
    if (category.includes('Pop Filter') || category.includes('Windscreen') || category.includes('Shock Mount')) return '🎤';
    if (category.includes('Acoustic Panel') || category.includes('Isolation')) return '🔇';
    if (category.includes('Cable') && (category.includes('Organizer') || category.includes('Tie'))) return '🔗';
    if (category.includes('Gaffer Tape')) return '🎬';
    
    // Lighting
    if (category.includes('LED') || category.includes('Par')) return '💡';
    if (category.includes('Moving Head') || category.includes('Laser')) return '🔦';
    if (category.includes('Strobe')) return '⚡';
    if (category.includes('Fog') || category.includes('Haze')) return '🌫️';
    if (category.includes('Light Controller') || category.includes('DMX')) return '🎛️';
    if (category.includes('Light Stand') || category.includes('Truss') || category.includes('Clamp')) return '🔧';
    if (category.includes('Color Filter') || category.includes('Gobo')) return '🎨';
    
    // Other/Utility
    if (category.includes('Power') && (category.includes('Strip') || category.includes('Conditioner') || category.includes('UPS'))) return '⚡';
    if (category.includes('Extension Cord')) return '🔌';
    if (category.includes('Tool') || category.includes('Soldering')) return '🔧';
    if (category.includes('Cable Tester') || category.includes('Sound Level Meter')) return '📊';
    if (category.includes('Recording') || category.includes('Click Track')) return '🎵';
    if (category.includes('Sheet Music') || category.includes('Software')) return '🎼';
    if (category.includes('Laptop') || category.includes('Tablet')) return '💻';
    if (category.includes('Backup Drive')) return '💾';
    if (category.includes('Fan')) return '🌀';
    if (category.includes('Stage Box')) return '📦';
    
    // Default fallback based on type
    return getTypeIcon(fallbackType);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <AuthNav currentPage="gear" />
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Loading gear...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <AuthNav currentPage="gear" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Band Gear</h1>
            <p className="text-gray-400">
              Manage equipment for {bandName}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setActiveTab('owned')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'owned'
                    ? 'bg-yellow-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Owned Gear ({getOwnedGear(gear).length})
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'wishlist'
                    ? 'bg-yellow-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Wishlist ({getWishlistGear(gear).length})
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddNew(activeTab === 'wishlist')}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>+</span>
                  {activeTab === 'owned' ? 'Add Gear' : 'Add to Wishlist'}
                </button>
                
                {activeTab === 'owned' && (
                  <button
                    onClick={() => handleAddNew(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>💫</span>
                    Add to Wishlist
                  </button>
                )}
                
                {activeTab === 'wishlist' && (
                  <button
                    onClick={() => handleAddNew(false)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>✅</span>
                    Add Owned Gear
                  </button>
                )}
              </div>

              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Search gear..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="all">All Types</option>
                  <option value="microphone">Microphones</option>
                  <option value="cable">Cables</option>
                  <option value="instrument">Instruments</option>
                  <option value="amplifier">Amplifiers</option>
                  <option value="percussion">Percussion</option>
                  <option value="audio-equipment">Audio Equipment</option>
                  <option value="accessory">Accessories</option>
                  <option value="lighting">Lighting</option>
                  <option value="other">Other</option>
                </select>

                {activeTab === 'owned' && (
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="all">All Conditions</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="needs-repair">Needs Repair</option>
                  </select>
                )}

                {activeTab === 'wishlist' && (
                  <>
                    <select
                      value={wishlistStatusFilter}
                      onChange={(e) => setWishlistStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="all">All Status</option>
                      <option value="wanted">Wanted</option>
                      <option value="researching">Researching</option>
                      <option value="saving-for">Saving For</option>
                      <option value="ready-to-buy">Ready to Buy</option>
                      <option value="ordered">Ordered</option>
                      <option value="purchased">Purchased</option>
                    </select>

                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="all">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              Showing {filteredGear.length} of {activeTab === 'owned' ? getOwnedGear(gear).length : getWishlistGear(gear).length} {activeTab === 'owned' ? 'owned' : 'wishlist'} item{filteredGear.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-4">
                  {editingGear ? 'Edit Gear' : 'Add New Gear'}
                </h2>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Gear Type Toggle */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gearType"
                          checked={!formData.isWishlist}
                          onChange={() => setFormData({ ...formData, isWishlist: false })}
                          className="text-yellow-600"
                        />
                        <span className="text-white">Owned Gear</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gearType"
                          checked={formData.isWishlist}
                          onChange={() => setFormData({ ...formData, isWishlist: true })}
                          className="text-blue-600"
                        />
                        <span className="text-white">Wishlist Item</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        placeholder="e.g., Shure SM58"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Type *
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => {
                          const type = e.target.value as GearFormData['type'];
                          setFormData({ 
                            ...formData, 
                            type,
                            category: GEAR_CATEGORIES[type]?.[0] || ''
                          });
                        }}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      >
                        <option value="microphone">Microphone</option>
                        <option value="cable">Cable</option>
                        <option value="instrument">Instrument</option>
                        <option value="amplifier">Amplifier</option>
                        <option value="percussion">Percussion</option>
                        <option value="audio-equipment">Audio Equipment</option>
                        <option value="accessory">Accessory</option>
                        <option value="lighting">Lighting</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      >
                        <option value="">Select category</option>
                        {GEAR_CATEGORIES[formData.type]?.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {!formData.isWishlist && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Condition *
                        </label>
                        <select
                          required={!formData.isWishlist}
                          value={formData.condition}
                          onChange={(e) => setFormData({ ...formData, condition: e.target.value as GearFormData['condition'] })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        >
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                          <option value="needs-repair">Needs Repair</option>
                        </select>
                      </div>
                    )}

                    {formData.isWishlist && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Status *
                          </label>
                          <select
                            required={formData.isWishlist}
                            value={formData.wishlistStatus}
                            onChange={(e) => setFormData({ ...formData, wishlistStatus: e.target.value as GearFormData['wishlistStatus'] })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                          >
                            <option value="wanted">Wanted</option>
                            <option value="researching">Researching</option>
                            <option value="saving-for">Saving For</option>
                            <option value="ready-to-buy">Ready to Buy</option>
                            <option value="ordered">Ordered</option>
                            <option value="purchased">Purchased</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Priority
                          </label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as GearFormData['priority'] })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Estimated Cost
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.estimatedCost}
                            onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                            placeholder="0.00"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        placeholder="e.g., Shure, Yamaha"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Model
                      </label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        placeholder="e.g., SM58, P-125"
                      />
                    </div>

                    {!formData.isWishlist && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                          placeholder="e.g., Storage Room A, John's House"
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {formData.isWishlist ? 'Notes' : 'Description'}
                      </label>
                      <textarea
                        value={formData.isWishlist ? formData.notes : formData.description}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          [formData.isWishlist ? 'notes' : 'description']: e.target.value 
                        })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        rows={3}
                        placeholder={formData.isWishlist ? "Why you want this item, research notes, etc..." : "Additional notes about this item..."}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                    >
                      {editingGear ? 'Update Gear' : 'Add Gear'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Gear Grid */}
          {filteredGear.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {gear.length === 0 ? (
                  activeTab === 'owned' 
                    ? 'No gear items yet.' 
                    : 'No wishlist items yet.'
                ) : (
                  activeTab === 'owned'
                    ? 'No owned gear matches your filters.'
                    : 'No wishlist items match your filters.'
                )}
              </div>
              {((activeTab === 'owned' && getOwnedGear(gear).length === 0) || 
                (activeTab === 'wishlist' && getWishlistGear(gear).length === 0)) && (
                <button
                  onClick={() => handleAddNew(activeTab === 'wishlist')}
                  className={`px-6 py-3 rounded-lg transition-colors text-white ${
                    activeTab === 'owned' 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {activeTab === 'owned' ? 'Add Your First Gear Item' : 'Add Your First Wishlist Item'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGear.map(gearItem => (
                <div key={gearItem.id} className={`rounded-lg p-4 hover:bg-gray-750 transition-colors ${
                  gearItem.isWishlist ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-gray-800'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(gearItem.category || '', gearItem.type)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white truncate">{gearItem.name}</h3>
                        <p className="text-sm text-gray-400">{gearItem.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditGear(gearItem)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteGear(gearItem.id!)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {gearItem.brand && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Brand:</span>
                        <span className="text-white">{gearItem.brand}</span>
                      </div>
                    )}
                    {gearItem.model && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Model:</span>
                        <span className="text-white">{gearItem.model}</span>
                      </div>
                    )}
                    
                    {gearItem.isWishlist ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={`capitalize ${getWishlistStatusColor(gearItem.wishlistStatus || 'wanted')}`}>
                            {(gearItem.wishlistStatus || 'wanted').replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Priority:</span>
                          <span className={`capitalize ${getPriorityColor(gearItem.priority || 'medium')}`}>
                            {gearItem.priority || 'medium'}
                          </span>
                        </div>
                        {gearItem.estimatedCost && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Est. Cost:</span>
                            <span className="text-green-400">${gearItem.estimatedCost.toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Condition:</span>
                          <span className={`capitalize ${getConditionColor(gearItem.condition)}`}>
                            {gearItem.condition.replace('-', ' ')}
                          </span>
                        </div>
                        {gearItem.location && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Location:</span>
                            <span className="text-white truncate">{gearItem.location}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {(gearItem.description || gearItem.notes) && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {gearItem.isWishlist ? gearItem.notes : gearItem.description}
                      </p>
                    </div>
                  )}

                  {gearItem.isWishlist && (
                    <div className="mt-3 pt-3 border-t border-blue-800/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-blue-400">Wishlist Item</span>
                        {gearItem.wishlistStatus === 'purchased' && (
                          <button
                            onClick={() => handleConvertToOwned(gearItem)}
                            className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                          >
                            Mark as Owned
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
