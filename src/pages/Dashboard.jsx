import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Leaf, Droplets, TrendingUp, Settings, LogOut, 
  Menu, X, User, Sun, Wind, Thermometer, Sprout, 
  AlertCircle, Calendar, ChevronRight, Bell, Shield, Activity, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FarmerAI } from '../services/huggingFaceService';
import { auth } from '../services/firebase';
import { getProfile } from '../services/profileService';
import GrowingGuideTab from '../components/GrowingGuideTab';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [cropCycleData, setCropCycleData] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [showRiskAlert, setShowRiskAlert] = useState(false);
  const [riskMessage, setRiskMessage] = useState('');
  const [showIrrigationDialog, setShowIrrigationDialog] = useState(false);
  const [audioRef] = useState(new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsKGGS56+mjUhELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsKGGS56+mjUhELTKXh8bllHAU2jdXzzn0vBQ=='));

  // Fetch profile from Firebase and generate AI analytics (with caching)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        // Check cache first
        const cacheKey = `dashboard_${user.uid}`;
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
        
        if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < CACHE_DURATION) {
          const cachedData = JSON.parse(cached);
          setProfile(cachedData.profile);
          setCropCycleData(cachedData.cropCycleData);
          setYieldData(cachedData.yieldData);
          setRecommendations(cachedData.recommendations);
          setLoading(false);
          console.log('✅ Loaded from cache (30min valid)');
          return;
        }
        
        // Fetch from Firebase
        const profileData = await getProfile(user.uid);
        if (!profileData) {
          navigate('/profile-setup');
          return;
        }
        
        setProfile(profileData);
        
        // Generate AI analytics if crop is planted
        if (profileData.plantingDate && profileData.primaryCrop) {
          console.log('🤖 Generating fresh AI analytics...');
          const [cycleData, yieldProjection, growingRecs] = await Promise.all([
            FarmerAI.analyzeCropCycle(profileData.primaryCrop, profileData.plantingDate),
            FarmerAI.analyzeYieldProjection(
              profileData.primaryCrop, 
              profileData.plantingDate, 
              parseFloat(profileData.totalLand) || 1, 
              profileData.iotData
            ),
            FarmerAI.analyzeGrowingRecommendations(profileData)
          ]);
          
          setCropCycleData(cycleData);
          setYieldData(yieldProjection);
          setRecommendations(growingRecs);
          
          // Save to cache
          localStorage.setItem(cacheKey, JSON.stringify({
            profile: profileData,
            cropCycleData: cycleData,
            yieldData: yieldProjection,
            recommendations: growingRecs
          }));
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
          console.log('💾 Cached for 30 minutes');
          
          // Check for high-risk conditions
          if (growingRecs?.immediateActions?.some(action => action.priority === 'High')) {
            const highRiskActions = growingRecs.immediateActions.filter(a => a.priority === 'High');
            setRiskMessage(highRiskActions.map(a => a.action).join(', '));
            setShowRiskAlert(true);
            audioRef.loop = true;
            audioRef.play().catch(e => console.log('Audio play failed:', e));
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [navigate, audioRef]);

  const calculateHealthScore = () => {
    if (!profile.iotData || !profile.cropRequirements) return 85;
    
    const nitrogen = parseFloat(profile.iotData.nitrogen) || 0;
    const phosphorus = parseFloat(profile.iotData.phosphorus) || 0;
    const potassium = parseFloat(profile.iotData.potassium) || 0;
    const ph = parseFloat(profile.iotData.ph || profile.iotData.pH) || 6.5;
    const moisture = parseFloat(profile.iotData.soilMoisture || profile.iotData.moisture) || 65;
    
    const nTarget = parseInt(profile.cropRequirements?.npk?.nitrogen?.match(/\d+/)?.[0]) || 150;
    const pTarget = parseInt(profile.cropRequirements?.npk?.phosphorus?.match(/\d+/)?.[0]) || 50;
    const kTarget = parseInt(profile.cropRequirements?.npk?.potassium?.match(/\d+/)?.[0]) || 200;
    
    const npkScore = ((Math.min(nitrogen / nTarget, 1) * 100 + Math.min(phosphorus / pTarget, 1) * 100 + Math.min(potassium / kTarget, 1) * 100) / 3);
    const phScore = (ph >= 6.0 && ph <= 7.0) ? 100 : 70;
    const moistureScore = (moisture >= 50 && moisture <= 70) ? 100 : 80;
    
    return Math.round((npkScore * 0.5 + phScore * 0.25 + moistureScore * 0.25));
  };

  const profileData = {
    farmerName: profile.farmerName || 'Farmer',
    primaryCrop: profile.primaryCrop || 'Not Set',
    farmType: profile.farmType || 'Not Set',
    location: `${profile.location || ''}, ${profile.district || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'Not Set',
    cropStatus: cropCycleData?.currentStage || profile.cropStatus || 'Not Set',
    daysPlanted: cropCycleData?.daysPlanted || 0,
    daysToHarvest: cropCycleData?.daysToHarvest || 0,
    plantingDate: profile.plantingDate,
    healthScore: calculateHealthScore(),
    alerts: recommendations?.immediateActions?.filter(a => a.priority === 'High').length || 0,
    issues: recommendations?.immediateActions?.filter(a => a.priority === 'High').slice(0, 2) || [],
    iotData: {
      temperature: profile.iotData?.temperature || parseFloat(profile.iotData?.temp) || 22,
      humidity: profile.iotData?.humidity || 65,
      soilMoisture: profile.iotData?.soilMoisture || profile.iotData?.moisture || 65,
      nitrogen: profile.iotData?.nitrogen || 140,
      phosphorus: profile.iotData?.phosphorus || 45,
      potassium: profile.iotData?.potassium || 190,
      ph: profile.iotData?.ph || profile.iotData?.pH || 6.5
    },
    npkTargets: {
      nitrogen: parseInt(profile.cropRequirements?.npk?.nitrogen?.match(/\d+/)?.[0]) || 150,
      phosphorus: parseInt(profile.cropRequirements?.npk?.phosphorus?.match(/\d+/)?.[0]) || 50,
      potassium: parseInt(profile.cropRequirements?.npk?.potassium?.match(/\d+/)?.[0]) || 200
    }
  };

  const handleStopAlert = () => {
    audioRef.pause();
    audioRef.currentTime = 0;
    setShowRiskAlert(false);
  };

  const handleRefreshData = () => {
    const cacheKey = `dashboard_${auth.currentUser?.uid}`;
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(`${cacheKey}_time`);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020408] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'plant', label: 'Crop Cycle', icon: Leaf },
    { id: 'guide', label: 'Growing Guide', icon: Sprout },
    { id: 'monitoring', label: 'Live Sensors', icon: Activity },
    { id: 'analytics', label: 'Yield Analytics', icon: TrendingUp },
    { id: 'tools', label: 'Farming Tools', icon: Shield },
    { id: 'settings', label: 'Configuration', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-white font-sans flex h-screen overflow-hidden selection:bg-emerald-500/30">
      
      {/* Irrigation Dialog */}
      {showIrrigationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Droplets className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">No Irrigation Device</h2>
                <p className="text-gray-400 text-sm">Device not connected</p>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-sm">No irrigation device has been found. Please connect your IoT irrigation system to enable smart watering.</p>
            </div>
            <button
              onClick={() => setShowIrrigationDialog(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Risk Alert Dialog */}
      {showRiskAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-red-900/90 border-2 border-red-500 rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">⚠️ PLANT AT RISK!</h2>
                <p className="text-red-200 text-sm">Immediate action required</p>
              </div>
            </div>
            <div className="bg-red-950/50 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-white font-medium">{riskMessage}</p>
            </div>
            <button
              onClick={handleStopAlert}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform active:scale-95"
            >
              Confirm & Stop Alert
            </button>
          </div>
        </div>
      )}
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      {/* --- SIDEBAR --- */}
      <motion.aside 
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="relative z-20 bg-[#0a0f16]/80 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300 h-screen overflow-y-auto"
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3 text-emerald-400">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Leaf size={20} />
            </div>
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="font-bold text-xl tracking-tight text-white"
              >
                AgriFarm<span className="text-emerald-400">AI</span>
              </motion.span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group overflow-hidden ${
                activeTab === item.id 
                  ? 'text-white bg-gradient-to-r from-emerald-600/20 to-transparent border border-emerald-500/20' 
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" 
                />
              )}
              <item.icon size={20} className={activeTab === item.id ? 'text-emerald-400' : 'group-hover:text-emerald-200'} />
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-black shadow-lg">
              {profileData.farmerName.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{profileData.farmerName}</p>
                <p className="text-[10px] text-emerald-400 uppercase tracking-wider">Pro Plan</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>


      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 relative overflow-y-auto h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-10 px-8 py-5 bg-[#020408]/80 backdrop-blur-md flex items-center justify-between border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
               System Operational • {profileData.location}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/5">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button className="relative p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/5">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-black" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto pb-20">
          <AnimatePresence mode="wait">
            
            {/* 1. OVERVIEW SECTION */}
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Health & Status Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Health Score Card */}
                  <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all" />
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium">Overall Plant Health</h3>
                        <p className="text-emerald-400 text-xs mt-1">AI Diagnostics: Optimal</p>
                      </div>
                      <Activity className="text-emerald-500" size={20} />
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                          <circle cx="64" cy="64" r="56" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray="351" strokeDashoffset={351 - (351 * profileData.healthScore) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-bold text-white">{profileData.healthScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issues Card */}
                  <div className="col-span-1 lg:col-span-2 bg-[#0b1219] p-6 rounded-2xl border border-white/5">
                    <h3 className="text-gray-400 text-sm font-medium mb-4">Issues Detected</h3>
                    {profileData.issues.length > 0 ? (
                      <div className="space-y-2">
                        {profileData.issues.map((issue, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-red-400 leading-relaxed">{issue.action}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-emerald-400">No Issues Detected</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Environment Quick Stats */}
                  <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={Thermometer} label="Avg Temp" value={`${profileData.iotData.temperature}°C`} trend="+0.5%" color="orange" />
                    <StatCard icon={Droplets} label="Humidity" value={`${profileData.iotData.humidity}%`} trend="-2%" color="blue" />
                    <StatCard icon={Sun} label="Daily Light" value="12.5 hrs" trend="On Target" color="yellow" />
                    
                    {/* Action Bar */}
                    <div className="sm:col-span-3 bg-[#0b1219] rounded-2xl border border-white/5 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Wind size={20} /></div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Smart Irrigation</h4>
                          <p className="text-xs text-gray-500">Next cycle in 45 mins</p>
                        </div>
                      </div>
                      <button onClick={() => setShowIrrigationDialog(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/50">
                        Trigger Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Growth Projection Area */}
                <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Nutrient Composition (PPM)</h3>
                    <div className="flex gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-xs text-gray-400 mr-3">Target</span>
                      <span className="w-3 h-3 rounded-full bg-emerald-800"></span><span className="text-xs text-gray-400">Current</span>
                    </div>
                  </div>
                  {/* Custom Progress Bars for NPK */}
                  <div className="space-y-6">
                     <NPKBar label="Nitrogen (N)" current={profileData.iotData.nitrogen} target={profileData.npkTargets.nitrogen} color="bg-emerald-500" />
                     <NPKBar label="Phosphorus (P)" current={profileData.iotData.phosphorus} target={profileData.npkTargets.phosphorus} color="bg-blue-500" />
                     <NPKBar label="Potassium (K)" current={profileData.iotData.potassium} target={profileData.npkTargets.potassium} color="bg-purple-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. CROP CYCLE SECTION */}
            {activeTab === 'plant' && (
              <motion.div 
                key="plant"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Growth Stage Tracker */}
                <div className="bg-[#0b1219] p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-50"></div>
                   <div className="flex justify-between items-end mb-8">
                      <div>
                         <h2 className="text-2xl font-bold text-white mb-1">{profileData.primaryCrop}</h2>
                         <p className="text-emerald-400 font-medium">{profileData.cropStatus}</p>
                         {profileData.plantingDate && (
                           <p className="text-xs text-gray-500 mt-1">Planted: {new Date(profileData.plantingDate).toLocaleDateString()}</p>
                         )}
                      </div>
                      <div className="text-right">
                         <p className="text-4xl font-bold text-white">{profileData.daysPlanted}<span className="text-lg text-gray-500 font-normal"> / {profileData.daysToHarvest} days</span></p>
                         <p className="text-xs text-gray-500 uppercase tracking-wider">Time to Harvest</p>
                         {cropCycleData?.stageTimeline && (
                           <p className="text-xs text-emerald-400 mt-1">
                             Current: {cropCycleData.stageTimeline[profileData.cropStatus?.toLowerCase()] || 'N/A'}
                           </p>
                         )}
                      </div>
                   </div>

                   {/* Timeline Visual */}
                   <div className="relative pt-6 pb-2">
                      <div className="h-2 bg-gray-800 rounded-full w-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${profileData.daysToHarvest > 0 ? (profileData.daysPlanted / profileData.daysToHarvest) * 100 : 0}%` }} 
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 relative"
                        >
                           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                        </motion.div>
                      </div>
                      <div className="flex justify-between mt-4 text-xs font-medium text-gray-500 uppercase">
                         <span>Seedling</span>
                         <span className="text-emerald-400">Vegetative</span>
                         <span>Flowering</span>
                         <span>Harvest</span>
                      </div>
                   </div>
                </div>

                {/* Detailed Specs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Sun size={18} className="text-yellow-400"/> Lighting Schedule</h3>
                      <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex items-center justify-between">
                         <div>
                            <p className="text-xs text-yellow-200">Current Phase</p>
                            <p className="text-lg font-bold text-white">{cropCycleData?.lightingSchedule || '18 hrs On / 6 hrs Off'}</p>
                         </div>
                         <div className="h-10 w-10 rounded-full border-2 border-yellow-500/30 flex items-center justify-center">
                            <span className="text-[10px] text-yellow-500">{cropCycleData?.lightingPercentage || 75}%</span>
                         </div>
                      </div>
                   </div>
                   <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Droplets size={18} className="text-blue-400"/> Watering Plan</h3>
                      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center justify-between">
                         <div>
                            <p className="text-xs text-blue-200">Irrigation Method</p>
                            <p className="text-lg font-bold text-white">{cropCycleData?.irrigationMethod || 'Ebb and Flow'}</p>
                         </div>
                         <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                            <Droplets size={16} className="text-blue-400" />
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* 3. GROWING GUIDE SECTION */}
            {activeTab === 'guide' && (
              <GrowingGuideTab recommendations={recommendations} loading={loading} />
            )}

            {/* 4. MONITORING SECTION */}
            {activeTab === 'monitoring' && (
              <motion.div 
                key="monitoring"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Real-time Graph Card */}
                <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-8">
                     <div>
                        <h2 className="text-xl font-bold text-white">Environmental Trends</h2>
                        <p className="text-sm text-gray-500">Live 24h Sensor Data Stream</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs bg-emerald-500 text-white rounded-md">Temp</button>
                        <button className="px-3 py-1 text-xs bg-gray-800 text-gray-400 rounded-md hover:text-white">Humidity</button>
                     </div>
                  </div>
                  
                  {/* SVG Area Chart */}
                  <div className="h-64 w-full relative">
                     <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                        {/* Grid Lines */}
                        <line x1="0" y1="10" x2="100" y2="10" stroke="#334155" strokeWidth="0.1" strokeDasharray="2" />
                        <line x1="0" y1="25" x2="100" y2="25" stroke="#334155" strokeWidth="0.1" strokeDasharray="2" />
                        <line x1="0" y1="40" x2="100" y2="40" stroke="#334155" strokeWidth="0.1" strokeDasharray="2" />
                        
                        {/* The Graph Line */}
                        <defs>
                          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0 40 C 20 35, 40 45, 50 25 S 80 10, 100 20 L 100 50 L 0 50 Z" fill="url(#gradient)" />
                        <path d="M0 40 C 20 35, 40 45, 50 25 S 80 10, 100 20" fill="none" stroke="#10b981" strokeWidth="0.5" />
                        
                        {/* Interactive Point */}
                        <circle cx="50" cy="25" r="1.5" fill="#fff" stroke="#10b981" strokeWidth="0.5" className="animate-pulse" />
                     </svg>
                     <div className="absolute top-[40%] left-[48%] bg-gray-900 text-xs px-2 py-1 rounded border border-emerald-500/50 text-emerald-400 transform -translate-y-full">
                        24.5°C
                     </div>
                  </div>
                </div>

                {/* Sensor Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SensorDetail label="Soil Moisture" value="62%" status="Optimal" color="text-blue-400" />
                  <SensorDetail label="CO2 Level" value="1200 ppm" status="High" color="text-gray-400" />
                  <SensorDetail label="VPD" value="0.85 kPa" status="Good" color="text-purple-400" />
                  <SensorDetail label="Solution pH" value="6.2" status="Perfect" color="text-emerald-400" />
                </div>
              </motion.div>
            )}

            {/* 4. ANALYTICS SECTION */}
            {activeTab === 'analytics' && (
              <motion.div 
                key="analytics"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-500/20 p-8 rounded-2xl flex items-center justify-between">
                   <div>
                      <h2 className="text-2xl font-bold text-white">Projected Yield</h2>
                      <p className="text-gray-400 mt-2 max-w-md">Based on current growth rates and environmental stability, your harvest is on track.</p>
                      {loading && <p className="text-xs text-emerald-400 mt-2">🤖 AI calculating yield projection...</p>}
                   </div>
                   <div className="text-right">
                      <div className="text-4xl font-bold text-emerald-400">{yieldData?.projectedYield || '1,250 kg'}</div>
                      <div className="text-sm text-emerald-200">{yieldData?.yieldChange || '+12%'} vs last cycle</div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   <div className="col-span-2 bg-[#0b1219] p-6 rounded-2xl border border-white/5">
                      <h3 className="text-lg font-bold text-white mb-6">Resource Consumption</h3>
                      <div className="space-y-4">
                         <div className="flex items-center gap-4">
                            <span className="w-24 text-sm text-gray-400">Water</span>
                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 w-[45%]"></div>
                            </div>
                            <span className="text-sm font-mono text-white">{yieldData?.resourceConsumption?.water || '450L'}</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="w-24 text-sm text-gray-400">Energy</span>
                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                               <div className="h-full bg-yellow-500 w-[72%]"></div>
                            </div>
                            <span className="text-sm font-mono text-white">{yieldData?.resourceConsumption?.energy || '124kWh'}</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="w-24 text-sm text-gray-400">Nutrients</span>
                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                               <div className="h-full bg-purple-500 w-[30%]"></div>
                            </div>
                            <span className="text-sm font-mono text-white">{yieldData?.resourceConsumption?.nutrients || '12kg'}</span>
                         </div>
                      </div>
                   </div>

                   <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Cost Efficiency</h3>
                      <div className="flex items-center justify-center h-40">
                         <div className="text-center">
                            <span className="text-3xl font-bold text-white">{yieldData?.costEfficiency?.costPerKg || '$0.42'}</span>
                            <p className="text-xs text-gray-500">Cost per kg</p>
                            <p className="text-xs text-emerald-400 mt-1">{yieldData?.costEfficiency?.comparison || '↓ 5% lower than average'}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* 5. FARMING TOOLS SECTION */}
            {activeTab === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Crop Health', path: '/crop-health', icon: Sprout, color: 'emerald' },
                    { name: 'Soil Analysis', path: '/soil-analysis', icon: Droplets, color: 'teal' },
                    { name: 'Market Intel', path: '/market-intel', icon: TrendingUp, color: 'amber' },
                  ].map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <div
                        key={tool.name}
                        onClick={() => navigate(tool.path)}
                        className="bg-[#0b1219] p-6 rounded-2xl border border-white/5 cursor-pointer group hover:border-emerald-500/30 transition-all"
                      >
                        <div className={`w-12 h-12 bg-${tool.color}-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-6 h-6 text-${tool.color}-400`} />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">
                          {tool.name}
                        </h3>
                        
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                          Click to access tool
                        </p>
                        
                        <div className="flex items-center gap-2 mb-6">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Ready</span>
                          </div>
                          <div className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Real-time</span>
                          </div>
                        </div>
                        
                        <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 group/btn">
                          <span>Launch Tool</span>
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 6. SETTINGS SECTION */}
            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="max-w-3xl mx-auto space-y-8"
              >
                 <div className="bg-[#0b1219] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-r from-emerald-900/20 to-transparent">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-emerald-500/20">
                             {profile.farmerName.charAt(0)}
                          </div>
                          <div>
                             <h2 className="text-2xl font-bold text-white">{profile.farmerName}</h2>
                             <p className="text-gray-400">{profile.email || 'alex.farmer@agri.ai'}</p>
                          </div>
                          <button className="ml-auto px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-sm transition-colors">
                             Edit Profile
                          </button>
                       </div>
                    </div>
                    
                    <div className="p-8 space-y-6">
                       <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">System Preferences</h3>
                       
                       <div className="flex items-center justify-between py-3 border-b border-white/5">
                          <div>
                             <p className="text-white font-medium">Push Notifications</p>
                             <p className="text-xs text-gray-500">Receive alerts about critical sensor data</p>
                          </div>
                          <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer">
                             <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between py-3 border-b border-white/5">
                          <div>
                             <p className="text-white font-medium">Auto-Irrigation</p>
                             <p className="text-xs text-gray-500">Allow AI to control water valves</p>
                          </div>
                          <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer">
                             <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                          </div>
                       </div>

                       <div className="flex items-center justify-between py-3">
                          <div>
                             <p className="text-white font-medium">Data Export</p>
                             <p className="text-xs text-gray-500">Download monthly reports (CSV/PDF)</p>
                          </div>
                          <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">Download</button>
                       </div>

                       <div className="flex items-center justify-between py-3 pt-6 border-t border-white/5">
                          <div>
                             <p className="text-white font-medium">Refresh Dashboard Data</p>
                             <p className="text-xs text-gray-500">Clear cache and reload AI analytics</p>
                          </div>
                          <button onClick={handleRefreshData} className="text-sm text-blue-400 hover:text-blue-300 font-medium">Refresh</button>
                       </div>
                    </div>
                 </div>
                 
                 <button onClick={() => navigate('/login')} className="w-full py-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
                    <LogOut size={18} /> Sign Out
                 </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- Sub-Components for Clean Code ---

const StatCard = ({ icon: Icon, label, value, trend, color }) => {
   const colors = {
      orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
      blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
      emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
   }
   return (
      <motion.div 
         whileHover={{ y: -5 }}
         className="bg-[#0b1219] p-4 rounded-2xl border border-white/5 flex flex-col justify-between"
      >
         <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${colors[color]}`}>
               <Icon size={18} />
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${trend.includes('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-400'}`}>
               {trend}
            </span>
         </div>
         <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
         </div>
      </motion.div>
   )
}

const NPKBar = ({ label, current, target, color }) => {
   const percentage = Math.min((current / target) * 100, 100);
   const status = percentage >= 90 ? 'Optimal' : percentage >= 70 ? 'Good' : percentage >= 50 ? 'Low' : 'Critical';
   const statusColor = percentage >= 90 ? 'text-emerald-400' : percentage >= 70 ? 'text-blue-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400';
   
   return (
      <div>
         <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 font-medium text-sm">{label}</span>
            <div className="flex items-center gap-3">
               <span className="text-white font-bold">{current} ppm</span>
               <span className="text-gray-500">/</span>
               <span className="text-emerald-400 font-bold">{target} ppm</span>
               <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor} bg-white/5`}>{status}</span>
            </div>
         </div>
         <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${percentage}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className={`h-full ${color} rounded-full relative`}
            >
               <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/20 to-transparent"></div>
            </motion.div>
         </div>
      </div>
   )
}

const SensorDetail = ({ label, value, status, color }) => (
   <div className="bg-[#0b1219] p-4 rounded-xl border border-white/5 flex items-center justify-between">
      <div>
         <p className="text-xs text-gray-500">{label}</p>
         <p className={`text-lg font-bold ${color}`}>{value}</p>
      </div>
      <div className="text-right">
         <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-white">{status}</span>
      </div>
   </div>
)

export default Dashboard;