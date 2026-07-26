import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Leaf, ArrowRight, CheckCircle, Loader, Navigation, Radio, Sprout, ClipboardList, Droplets, Thermometer, Sun, Droplet, Calendar } from 'lucide-react';
import { auth } from '../services/firebase';
import { saveProfile } from '../services/profileService';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [farmType, setFarmType] = useState('');
  const [iotSensors, setIotSensors] = useState([]);
  const [iotDeviceId, setIotDeviceId] = useState('');
  const [cropStatus, setCropStatus] = useState('');
  const [subStep, setSubStep] = useState(0); // Track sub-steps within step 3
  const [showIotAnimation, setShowIotAnimation] = useState(false);
  const [isAnalyzingCrop, setIsAnalyzingCrop] = useState(false);
  const [cropRequirements, setCropRequirements] = useState(null);
  const [profileData, setProfileData] = useState({
    farmerName: '',
    farmName: '',
    location: '',
    state: '',
    district: '',
    pincode: '',
    fieldLength: '',
    fieldWidth: '',
    primaryCrop: '',
    irrigationType: '',
    soilType: '',
    experience: ''
  });

  const calculateIotPoints = (length, width, type) => {
    if (type === 'vask') return [];
    
    const lengthM = parseFloat(length);
    const widthM = parseFloat(width);
    const sensorRange = 25; // 25m radius coverage
    const edgeMargin = 10; // 10m margin from edges to avoid neighbor's land
    
    // Calculate effective area (excluding margins)
    const effectiveLength = lengthM - (2 * edgeMargin);
    const effectiveWidth = widthM - (2 * edgeMargin);
    
    if (effectiveLength <= 0 || effectiveWidth <= 0) return [];
    
    const spacing = sensorRange * 1.8; // Optimal spacing for coverage
    const cols = Math.max(1, Math.ceil(effectiveLength / spacing));
    const rows = Math.max(1, Math.ceil(effectiveWidth / spacing));
    
    const points = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = edgeMargin + (j * effectiveLength / (cols - 1 || 1));
        const y = edgeMargin + (i * effectiveWidth / (rows - 1 || 1));
        points.push({
          id: `sensor-${i}-${j}`,
          x: (x / lengthM) * 100,
          y: (y / widthM) * 100,
          actualX: x.toFixed(1),
          actualY: y.toFixed(1)
        });
      }
    }
    return points;
  };

  const analyzeCropRequirements = async (cropName) => {
    setIsAnalyzingCrop(true);
    try {
      const { FarmerAI } = await import('../services/huggingFaceService');
      const requirements = await FarmerAI.analyzeCropRequirements(cropName);
      setCropRequirements(requirements);
      setSubStep(6);
    } catch (error) {
      console.error('Error analyzing crop:', error);
      alert('Failed to analyze crop requirements. Please try again.');
    } finally {
      setIsAnalyzingCrop(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAcres = farmType === 'vask' ? 0.001 : ((parseFloat(profileData.fieldLength) * parseFloat(profileData.fieldWidth)) / 4047).toFixed(2);
    const fullProfile = { ...profileData, totalLand: totalAcres, farmType, iotDeviceId, cropStatus, sensorCount: iotSensors.length, cropRequirements };
    
    try {
      const userId = auth.currentUser?.uid || 'guest';
      await saveProfile(userId, fullProfile);
      
      // Clear dashboard cache when profile is updated
      const cacheKey = `dashboard_${userId}`;
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}_time`);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const nextStep = () => { if (step < 3) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const getLocationFromCoords = async (lat, lon) => {
    setIsGettingLocation(true);
    try {
      const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=6c61d6b7404941f69fb49e16f47efc84`);
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
      alert('Failed to get location details. Please enter manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => getLocationFromCoords(position.coords.latitude, position.coords.longitude),
        () => { alert('Unable to get location.'); setIsGettingLocation(false); }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#05080a] text-white font-inter relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `radial-gradient(#10b981 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">AgriFarm<span className="text-emerald-400">AI</span></span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-200">Setup Your Farm Profile</span>
          </h1>
          <p className="text-gray-400 text-lg">AI-powered farm configuration</p>
        </div>

        <div className="flex justify-center items-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-1 mx-2 rounded-full transition-all ${step > s ? 'bg-emerald-500' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center"><User className="w-6 h-6 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Farmer Name *</label>
                    <input type="text" required value={profileData.farmerName} onChange={(e) => setProfileData({...profileData, farmerName: e.target.value})} placeholder="Enter your name" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Farm Name</label>
                    <input type="text" value={profileData.farmName} onChange={(e) => setProfileData({...profileData, farmName: e.target.value})} placeholder="Enter farm name" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Years of Experience *</label>
                    <input type="number" required value={profileData.experience} onChange={(e) => setProfileData({...profileData, experience: e.target.value})} placeholder="Years" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center"><MapPin className="w-6 h-6 text-emerald-400" /></div>
                    <h2 className="text-2xl font-bold">Farm Location</h2>
                  </div>
                  <button type="button" onClick={getCurrentLocation} disabled={isGettingLocation} className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg transition-all border border-emerald-500/30 disabled:opacity-50">
                    {isGettingLocation ? <><Loader className="w-4 h-4 animate-spin" /><span className="text-sm font-medium">Getting...</span></> : <><Navigation className="w-4 h-4" /><span className="text-sm font-medium">Auto-Detect</span></>}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">State *</label><input type="text" required value={profileData.state} onChange={(e) => setProfileData({...profileData, state: e.target.value})} placeholder="Enter state" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">District *</label><input type="text" required value={profileData.district} onChange={(e) => setProfileData({...profileData, district: e.target.value})} placeholder="Enter district" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">Village/Town *</label><input type="text" required value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} placeholder="Enter location" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">Pincode *</label><input type="text" required value={profileData.pincode} onChange={(e) => setProfileData({...profileData, pincode: e.target.value})} placeholder="Enter pincode" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center"><Leaf className="w-6 h-6 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold">Smart Farm Setup</h2>
                </div>

                {!farmType && (
                  <div>
                    <label className="block text-lg font-medium text-white mb-4">Select Farm Type</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: 'vask', label: 'Vask (Planter)', desc: 'Small container farming', icon: '🪴' },
                        { value: 'plot', label: 'Plot', desc: 'Medium plot', icon: '🌾' },
                        { value: 'custom', label: 'Custom Field', desc: 'Large field', icon: '🚜' }
                      ].map((type) => (
                        <button key={type.value} type="button" onClick={() => setFarmType(type.value)} className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-emerald-500/50 transition-all text-left">
                          <div className="text-4xl mb-3">{type.icon}</div>
                          <div className="text-lg font-bold text-white mb-1">{type.label}</div>
                          <div className="text-sm text-gray-400">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {farmType === 'vask' && !iotDeviceId && !showIotAnimation && (
                  <div>
                    <button type="button" onClick={() => { setFarmType(''); setSubStep(0); }} className="text-sm text-emerald-400 mb-4 hover:underline">← Change farm type</button>
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🪴</div>
                      <h3 className="text-xl font-bold text-white mb-2">Vask Setup</h3>
                      <p className="text-gray-400 mb-6">Small container farming - connect your IoT sensor</p>
                      <button type="button" onClick={() => { setShowIotAnimation(true); setSubStep(1); }} className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-xl font-bold transition-all">Setup IoT Sensor</button>
                    </div>
                  </div>
                )}

                {farmType === 'vask' && showIotAnimation && !iotDeviceId && (
                  <div>
                    <button type="button" onClick={() => { setShowIotAnimation(false); setSubStep(0); }} className="text-sm text-emerald-400 mb-4 hover:underline">← Back</button>
                    <div className="text-center py-8">
                      <h3 className="text-xl font-bold text-white mb-6">Setting up IoT Sensor...</h3>
                      <div className="relative w-64 h-64 mx-auto mb-6">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-8 bg-emerald-500/30 rounded-full animate-pulse" />
                        <div className="absolute inset-16 bg-emerald-500 rounded-full flex items-center justify-center">
                          <div className="text-5xl">📡</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-400 mb-6">
                        <p className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Connecting to sensor...</p>
                        <p className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Calibrating readings...</p>
                        <p className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Syncing data...</p>
                      </div>
                      <button type="button" onClick={() => {
                        const fakeIotData = {
                          deviceId: 'VASK-IOT-' + Date.now(),
                          soilData: {
                            nitrogen: '45 ppm',
                            phosphorus: '30 ppm', 
                            potassium: '35 ppm',
                            moisture: '65%',
                            temperature: '24°C',
                            pH: '6.5'
                          }
                        };
                        setIotDeviceId(fakeIotData.deviceId);
                        setProfileData({...profileData, iotData: fakeIotData.soilData});
                        setCropStatus('pending');
                        setSubStep(3);
                      }} className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-xl font-bold transition-all">Complete Setup</button>
                    </div>
                  </div>
                )}

                {farmType && farmType !== 'vask' && !iotSensors.length && subStep === 0 && (
                  <div>
                    <button type="button" onClick={() => { setFarmType(''); setProfileData({...profileData, fieldLength: '', fieldWidth: ''}); setSubStep(0); }} className="text-sm text-emerald-400 mb-4 hover:underline">← Change farm type</button>
                    <label className="block text-lg font-medium text-white mb-4">Enter Field Dimensions (meters)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Length (m)</label>
                        <input type="number" step="0.1" placeholder="e.g., 100" value={profileData.fieldLength} onChange={(e) => setProfileData({...profileData, fieldLength: e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Width (m)</label>
                        <input type="number" step="0.1" placeholder="e.g., 80" value={profileData.fieldWidth} onChange={(e) => setProfileData({...profileData, fieldWidth: e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                    </div>
                    {profileData.fieldLength && profileData.fieldWidth && (
                      <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                        <p className="text-sm text-emerald-300">📐 Total Area: {((parseFloat(profileData.fieldLength) * parseFloat(profileData.fieldWidth)) / 4047).toFixed(2)} acres</p>
                      </div>
                    )}
                    <button type="button" onClick={() => {
                      console.log('Button clicked');
                      console.log('Length:', profileData.fieldLength, 'Width:', profileData.fieldWidth, 'Type:', farmType);
                      if (profileData.fieldLength && profileData.fieldWidth) {
                        if (farmType !== 'vask') {
                          const sensors = calculateIotPoints(profileData.fieldLength, profileData.fieldWidth, farmType);
                          console.log('Calculated sensors:', sensors);
                          setIotSensors(sensors);
                          setSubStep(1);
                        } else {
                          setIotDeviceId('pending');
                        }
                      }
                    }} disabled={!profileData.fieldLength || !profileData.fieldWidth} className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50">{farmType === 'vask' ? 'Continue' : 'Calculate Sensor Placement'}</button>
                  </div>
                )}

                {iotSensors.length > 0 && !iotDeviceId && subStep === 1 && (
                  <div>
                    <button type="button" onClick={() => { setIotSensors([]); setSubStep(0); }} className="text-sm text-emerald-400 mb-4 hover:underline">← Change dimensions</button>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-2">IoT Sensor Placement</h3>
                      <p className="text-sm text-gray-400">{iotSensors.length} sensors for {profileData.fieldLength}m × {profileData.fieldWidth}m field</p>
                      <p className="text-xs text-amber-400 mt-1">⚠️ 10m margin from edges to avoid neighbor data interference</p>
                    </div>
                    <div className="relative bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-2 border-emerald-500/30 rounded-xl p-4 max-w-lg mx-auto" style={{aspectRatio: `${profileData.fieldLength}/${profileData.fieldWidth}`, maxHeight: '400px'}}>
                      {/* Edge margin visualization */}
                      <div className="absolute inset-0 border-4 border-dashed border-red-500/20 m-[10%]" />
                      <div className="absolute top-2 left-2 text-xs text-red-400">10m margin</div>
                      
                      <div className="absolute inset-0 opacity-20">
                        {[...Array(5)].map((_, i) => (<div key={`h-${i}`} className="absolute w-full border-t border-emerald-500" style={{top: `${i * 25}%`}} />))}
                        {[...Array(5)].map((_, i) => (<div key={`v-${i}`} className="absolute h-full border-l border-emerald-500" style={{left: `${i * 25}%`}} />))}
                      </div>
                      {iotSensors.map((sensor) => (
                        <div key={sensor.id} className="absolute w-8 h-8 -ml-4 -mt-4 group" style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}>
                          <div className="absolute inset-0 w-16 h-16 -ml-4 -mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full animate-pulse" />
                          <div className="relative w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"><div className="w-3 h-3 bg-white rounded-full" /></div>
                          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{sensor.actualX}m, {sensor.actualY}m</div>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => { setIotDeviceId('pending'); setSubStep(2); }} className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all">Continue to IoT Setup</button>
                  </div>
                )}

                {farmType !== 'vask' && iotDeviceId && !cropStatus && subStep === 2 && (
                  <div>
                    <button type="button" onClick={() => { setIotDeviceId(''); setSubStep(farmType === 'vask' ? 1 : 1); }} className="text-sm text-emerald-400 mb-4 hover:underline">← Back</button>
                    <h3 className="text-lg font-bold text-white mb-4">Connect IoT Device</h3>
                    <input type="text" placeholder="Device ID (e.g., IOT-2024-001)" onChange={(e) => setIotDeviceId(e.target.value)} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4" />
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-4"><p className="text-sm text-blue-300">💡 Real-time data: soil moisture, temp, pH, NPK</p></div>
                    <button type="button" onClick={() => { setCropStatus('pending'); setSubStep(3); }} disabled={!iotDeviceId || iotDeviceId === 'pending'} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50">Continue</button>
                  </div>
                )}

                {cropStatus && !profileData.primaryCrop && subStep === 3 && (
                  <div>
                    <button type="button" onClick={() => { setCropStatus(''); setSubStep(2); }} className="text-sm text-emerald-400 mb-4 hover:underline">← Back</button>
                    <label className="block text-lg font-medium text-white mb-4">Crop Status</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button type="button" onClick={() => { setCropStatus('planted'); setSubStep(4); }} className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-emerald-500/50 hover:bg-gray-800/70 transition-all text-left group">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-all">
                          <Sprout className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div className="text-lg font-bold text-white">Already Planted</div>
                      </button>
                      <button type="button" onClick={() => { setCropStatus('planning'); setSubStep(4); }} className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-emerald-500/50 hover:bg-gray-800/70 transition-all text-left group">
                        <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-500/20 transition-all">
                          <ClipboardList className="w-7 h-7 text-amber-400" />
                        </div>
                        <div className="text-lg font-bold text-white">Planning to Plant</div>
                      </button>
                    </div>
                  </div>
                )}

                {cropStatus && cropStatus !== 'pending' && subStep === 4 && (
                  <div>
                    <button type="button" onClick={() => { setCropStatus('pending'); setProfileData({...profileData, primaryCrop: '', plantingDate: ''}); setSubStep(3); }} className="text-sm text-emerald-400 mb-4 hover:underline">← Back</button>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Plant Name *</label>
                        <input type="text" required value={profileData.primaryCrop} onChange={(e) => setProfileData({...profileData, primaryCrop: e.target.value})} placeholder="e.g., Rose, Tomato, Basil, Wheat" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      {cropStatus === 'planted' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            Planting Date *
                          </label>
                          <input type="date" required value={profileData.plantingDate || ''} onChange={(e) => setProfileData({...profileData, plantingDate: e.target.value})} max={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => analyzeCropRequirements(profileData.primaryCrop)} disabled={!profileData.primaryCrop || (cropStatus === 'planted' && !profileData.plantingDate) || isAnalyzingCrop} className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isAnalyzingCrop ? <><Loader className="w-5 h-5 animate-spin" />Analyzing Plant...</> : <>Analyze Plant Requirements<ArrowRight className="w-5 h-5" /></>}
                    </button>
                  </div>
                )}

                {cropRequirements && subStep === 6 && (
                  <div>
                    <button type="button" onClick={() => setSubStep(5)} className="text-sm text-emerald-400 mb-3 hover:underline">← Back</button>
                    <div className="space-y-3">
                      <div className="text-center mb-3">
                        <h3 className="text-lg font-bold text-white">NPK Requirements</h3>
                        <p className="text-xs text-gray-400">Essential nutrients for {profileData.primaryCrop}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 ">
                        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-4 rounded-lg border border-emerald-500/20">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2">
                              <span className="text-2xl font-black text-emerald-400">N</span>
                            </div>
                            <div className="text-xs text-emerald-300 font-medium mb-2">Nitrogen</div>
                            <div className="text-lg font-bold text-white mb-1">{cropRequirements.npk?.nitrogen?.match(/\d+[-–]?\d*/)?.[0] || 'N/A'}</div>
                            <div className="text-[10px] text-gray-400 mb-2">ppm</div>
                            <div className="text-[10px] text-gray-300 leading-tight">{cropRequirements.npk?.nitrogen?.replace(/\d+[-–]?\d*\s*(ppm)?\s*/i, '').trim() || 'For leaf growth'}</div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-4 rounded-lg border border-blue-500/20">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                              <span className="text-2xl font-black text-blue-400">P</span>
                            </div>
                            <div className="text-xs text-blue-300 font-medium mb-2">Phosphorus</div>
                            <div className="text-lg font-bold text-white mb-1">{cropRequirements.npk?.phosphorus?.match(/\d+[-–]?\d*/)?.[0] || 'N/A'}</div>
                            <div className="text-[10px] text-gray-400 mb-2">ppm</div>
                            <div className="text-[10px] text-gray-300 leading-tight">{cropRequirements.npk?.phosphorus?.replace(/\d+[-–]?\d*\s*(ppm)?\s*/i, '').trim() || 'For root development'}</div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-4 rounded-lg border border-purple-500/20">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                              <span className="text-2xl font-black text-purple-400">K</span>
                            </div>
                            <div className="text-xs text-purple-300 font-medium mb-2">Potassium</div>
                            <div className="text-lg font-bold text-white mb-1">{cropRequirements.npk?.potassium?.match(/\d+[-–]?\d*/)?.[0] || 'N/A'}</div>
                            <div className="text-[10px] text-gray-400 mb-2">ppm</div>
                            <div className="text-[10px] text-gray-300 leading-tight">{cropRequirements.npk?.potassium?.replace(/\d+[-–]?\d*\s*(ppm)?\s*/i, '').trim() || 'For fruit quality'}</div>
                          </div>
                        </div>
                      </div>

                      <button type="button" onClick={() => setSubStep(7)} className="w-full mt-8 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {cropRequirements && subStep === 7 && (
                  <div>
                    <button type="button" onClick={() => setSubStep(6)} className="text-sm text-emerald-400 mb-3 hover:underline">← Back</button>
                    <div className="space-y-3">
                      <div className="text-center mb-3">
                        <h3 className="text-lg font-bold text-white">Environmental Conditions</h3>
                        <p className="text-xs text-gray-400">Optimal conditions for {profileData.primaryCrop}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <Droplets className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="text-xs text-blue-300 font-semibold">Soil Moisture</div>
                          </div>
                          <div className="text-xs text-white leading-snug pl-9">{cropRequirements.moisture || 'N/A'}</div>
                        </div>

                        <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 bg-orange-500/10 rounded-lg flex items-center justify-center">
                              <Thermometer className="w-4 h-4 text-orange-400" />
                            </div>
                            <div className="text-xs text-orange-300 font-semibold">Temperature</div>
                          </div>
                          <div className="text-xs text-white leading-snug pl-9">{cropRequirements.temperature || 'N/A'}</div>
                        </div>

                        <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                              <Sun className="w-4 h-4 text-yellow-400" />
                            </div>
                            <div className="text-xs text-yellow-300 font-semibold">Light Intensity</div>
                          </div>
                          <div className="text-xs text-white leading-snug pl-9">{cropRequirements.lightIntensity || 'N/A'}</div>
                        </div>

                        <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                              <Droplet className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="text-xs text-cyan-300 font-semibold">Water Requirements</div>
                          </div>
                          <div className="text-xs text-white leading-snug pl-9">{cropRequirements.waterRequirement || 'N/A'}</div>
                        </div>
                      </div>

                      <button type="button" onClick={() => setSubStep(8)} className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {cropRequirements && subStep === 8 && (
                  <div>
                    <button type="button" onClick={() => setSubStep(7)} className="text-sm text-emerald-400 mb-3 hover:underline">← Back</button>
                    <div className="space-y-3">
                      <div className="text-center mb-3">
                        <h3 className="text-lg font-bold text-white">Growth Tips</h3>
                        <p className="text-xs text-gray-400">Expert recommendations for {profileData.primaryCrop}</p>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-lg p-3 border border-emerald-500/30">
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Sprout className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-white leading-relaxed">{cropRequirements.growthTips || 'Follow standard growing practices for best results.'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 3) {
                      if (subStep > 0) {
                        // Navigate within step 3 sub-steps
                        if (subStep === 4) { setCropStatus('pending'); setProfileData({...profileData, primaryCrop: ''}); setSubStep(3); }
                        else if (subStep === 3) { setCropStatus(''); setSubStep(2); }
                        else if (subStep === 2) { setIotDeviceId(''); setSubStep(farmType === 'vask' ? 1 : 1); }
                        else if (subStep === 1 && farmType === 'vask') { setShowIotAnimation(false); setSubStep(0); }
                        else if (subStep === 1 && farmType !== 'vask') { setIotSensors([]); setSubStep(0); }
                        else { setFarmType(''); setSubStep(0); }
                      } else {
                        // Go back to step 2
                        setFarmType('');
                        setIotSensors([]);
                        setIotDeviceId('');
                        setCropStatus('');
                        setShowIotAnimation(false);
                        setSubStep(0);
                        setProfileData({...profileData, fieldLength: '', fieldWidth: '', primaryCrop: ''});
                        prevStep();
                      }
                    } else {
                      prevStep();
                    }
                  }}
                  className="px-6 py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="ml-auto flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all">Next<ArrowRight className="w-5 h-5" /></button>
              ) : (
                subStep === 8 && cropRequirements ? (
                  <button type="submit" className="ml-auto flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all">Complete Profile<CheckCircle className="w-5 h-5" /></button>
                ) : null
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
