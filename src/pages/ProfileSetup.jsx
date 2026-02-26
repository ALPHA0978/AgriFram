import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Leaf, Droplets, ArrowRight, CheckCircle, Loader, Navigation } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [profileData, setProfileData] = useState({
    farmerName: '',
    farmName: '',
    location: '',
    state: '',
    district: '',
    pincode: '',
    totalLand: '',
    primaryCrop: '',
    secondaryCrops: '',
    irrigationType: '',
    soilType: '',
    experience: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save profile data to localStorage
    localStorage.setItem('farmerProfile', JSON.stringify(profileData));
    localStorage.setItem('profileCompleted', 'true');
    // Navigate to farming tool
    navigate('/farming-tool');
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getLocationFromCoords = async (lat, lon) => {
    setIsGettingLocation(true);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=6c61d6b7404941f69fb49e16f47efc84`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const address = data.features[0].properties;
        setProfileData(prev => ({
          ...prev,
          state: address.state || '',
          district: address.county || address.city || '',
          location: address.village || address.town || address.suburb || '',
          pincode: address.postcode || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Failed to get location details. Please enter manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getLocationFromCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get location. Please enable location services or enter manually.');
          setIsGettingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="min-h-screen bg-[#05080a] text-white font-inter relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: `radial-gradient(#10b981 0.5px, transparent 0.5px)`, 
            backgroundSize: '30px 30px' 
          }}
        />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              AgriFarm<span className="text-emerald-400">AI</span>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-200">
              Setup Your Farm Profile
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Help us personalize your farming experience</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center items-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-500'
              }`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 rounded-full transition-all ${
                  step > s ? 'bg-emerald-500' : 'bg-gray-800'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />
          
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Farmer Name *</label>
                    <input
                      type="text"
                      required
                      value={profileData.farmerName}
                      onChange={(e) => setProfileData({...profileData, farmerName: e.target.value})}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Farm Name</label>
                    <input
                      type="text"
                      value={profileData.farmName}
                      onChange={(e) => setProfileData({...profileData, farmName: e.target.value})}
                      placeholder="Enter farm name"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Years of Experience *</label>
                    <input
                      type="number"
                      required
                      value={profileData.experience}
                      onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                      placeholder="Years"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Farm Location</h2>
                  </div>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg transition-all border border-emerald-500/30 disabled:opacity-50"
                  >
                    {isGettingLocation ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Getting...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" />
                        <span className="text-sm font-medium">Auto-Detect</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                    <input
                      type="text"
                      required
                      value={profileData.state}
                      onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                      placeholder="Enter state"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">District *</label>
                    <input
                      type="text"
                      required
                      value={profileData.district}
                      onChange={(e) => setProfileData({...profileData, district: e.target.value})}
                      placeholder="Enter district"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Village/Town *</label>
                    <input
                      type="text"
                      required
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      placeholder="Enter location"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={profileData.pincode}
                      onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                      placeholder="Enter pincode"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Farm Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Farm Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Total Land (acres) *</label>
                    <input
                      type="number"
                      required
                      value={profileData.totalLand}
                      onChange={(e) => setProfileData({...profileData, totalLand: e.target.value})}
                      placeholder="Enter land size"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Primary Crop *</label>
                    <input
                      type="text"
                      required
                      value={profileData.primaryCrop}
                      onChange={(e) => setProfileData({...profileData, primaryCrop: e.target.value})}
                      placeholder="e.g., Wheat, Rice"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Crops</label>
                    <input
                      type="text"
                      value={profileData.secondaryCrops}
                      onChange={(e) => setProfileData({...profileData, secondaryCrops: e.target.value})}
                      placeholder="e.g., Vegetables, Pulses"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Irrigation Type *</label>
                    <select
                      required
                      value={profileData.irrigationType}
                      onChange={(e) => setProfileData({...profileData, irrigationType: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select type</option>
                      <option value="Drip">Drip Irrigation</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Flood">Flood Irrigation</option>
                      <option value="Rainfed">Rainfed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Soil Type *</label>
                    <select
                      required
                      value={profileData.soilType}
                      onChange={(e) => setProfileData({...profileData, soilType: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select soil type</option>
                      <option value="Alluvial">Alluvial Soil</option>
                      <option value="Black">Black Soil</option>
                      <option value="Red">Red Soil</option>
                      <option value="Laterite">Laterite Soil</option>
                      <option value="Desert">Desert Soil</option>
                      <option value="Mountain">Mountain Soil</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Complete Setup
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
