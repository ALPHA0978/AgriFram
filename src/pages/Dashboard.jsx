import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Leaf, Droplets, TrendingUp, Settings, LogOut, 
  Menu, X, User, Sun, Wind, Thermometer, Sprout, 
  AlertCircle, Calendar, ChevronRight, Bell, Shield, Activity, CheckCircle,
  VolumeX, BellRing, AlertTriangle, ShieldAlert, Zap, DollarSign, BarChart3
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
  const [activeGraphMetric, setActiveGraphMetric] = useState('temp');
  const [cropCycleData, setCropCycleData] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [showRiskAlert, setShowRiskAlert] = useState(false);
  const [riskMessage, setRiskMessage] = useState('');
  const [isBuzzerMuted, setIsBuzzerMuted] = useState(false);
  const [buzzerToast, setBuzzerToast] = useState('');
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

  // Live IoT telemetry simulation loop (3-second tick)
  const [telemetryTick, setTelemetryTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getLiveMetric = (baseVal, amplitude = 0.5) => {
    const base = parseFloat(String(baseVal).replace(/[^\d.-]/g, '')) || 24;
    const offset = Math.sin(telemetryTick * 0.5 + base) * amplitude;
    return (base + offset).toFixed(1);
  };

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

  const rawTemp = profile.iotData?.temperature || profile.iotData?.temp || 24;
  const liveTemp = getLiveMetric(rawTemp, 0.3);
  const rawHum = profile.iotData?.humidity || 65;
  const liveHum = Math.round(parseFloat(getLiveMetric(rawHum, 1.2)));
  const rawMoisture = profile.iotData?.soilMoisture || profile.iotData?.moisture || 65;
  const liveMoisture = Math.round(parseFloat(getLiveMetric(rawMoisture, 1.0)));
  const rawN = profile.iotData?.nitrogen || 140;
  const liveN = Math.round(parseFloat(getLiveMetric(rawN, 2.5)));
  const rawP = profile.iotData?.phosphorus || 45;
  const liveP = Math.round(parseFloat(getLiveMetric(rawP, 1.2)));
  const rawK = profile.iotData?.potassium || 190;
  const liveK = Math.round(parseFloat(getLiveMetric(rawK, 3.0)));

  const graphPoints = {
    temp: [
      { time: '00:00', val: 21.8 },
      { time: '04:00', val: 20.5 },
      { time: '08:00', val: 22.8 },
      { time: '12:00', val: 25.4 },
      { time: '16:00', val: 26.1 },
      { time: '20:00', val: 24.3 },
      { time: 'Now', val: parseFloat(liveTemp) }
    ],
    humidity: [
      { time: '00:00', val: 72 },
      { time: '04:00', val: 78 },
      { time: '08:00', val: 68 },
      { time: '12:00', val: 58 },
      { time: '16:00', val: 61 },
      { time: '20:00', val: 64 },
      { time: 'Now', val: liveHum }
    ],
    moisture: [
      { time: '00:00', val: 58 },
      { time: '04:00', val: 60 },
      { time: '08:00', val: 65 },
      { time: '12:00', val: 62 },
      { time: '16:00', val: 63 },
      { time: '20:00', val: 65 },
      { time: 'Now', val: liveMoisture }
    ],
    npk: [
      { time: '00:00', val: 135 },
      { time: '04:00', val: 138 },
      { time: '08:00', val: 142 },
      { time: '12:00', val: 140 },
      { time: '16:00', val: 139 },
      { time: '20:00', val: 141 },
      { time: 'Now', val: liveN }
    ]
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
      temperature: liveTemp,
      humidity: liveHum,
      soilMoisture: liveMoisture,
      nitrogen: liveN,
      phosphorus: liveP,
      potassium: liveK,
      ph: profile.iotData?.ph || profile.iotData?.pH || 6.5
    },
    npkTargets: {
      nitrogen: parseInt(profile.cropRequirements?.npk?.nitrogen?.match(/\d+/)?.[0]) || 150,
      phosphorus: parseInt(profile.cropRequirements?.npk?.phosphorus?.match(/\d+/)?.[0]) || 50,
      potassium: parseInt(profile.cropRequirements?.npk?.potassium?.match(/\d+/)?.[0]) || 200
    }
  };

  const getValidMetric = (val, fallback) => {
    if (!val || typeof val !== 'string' || val.toLowerCase().includes('data insufficient') || val.toLowerCase().includes('insufficient') || val.toLowerCase().includes('n/a')) {
      return fallback;
    }
    return val;
  };

  const handleStopAlert = () => {
    try {
      audioRef.pause();
      audioRef.currentTime = 0;
    } catch (err) {
      console.log(err);
    }
    setShowRiskAlert(false);
  };

  const handleForceStopBuzzer = () => {
    try {
      audioRef.pause();
      audioRef.currentTime = 0;
    } catch (err) {
      console.log(err);
    }
    setShowRiskAlert(false);
    setIsBuzzerMuted(true);
    setBuzzerToast('Buzzer Forcefully Muted & Alarm Siren Stopped');
    setTimeout(() => setBuzzerToast(''), 4500);
  };

  const handleTestBuzzer = () => {
    setIsBuzzerMuted(false);
    setRiskMessage('Crop Risk Siren: Soil Moisture & NPK Level Out of Range (Simulated Telemetry Alert)');
    setShowRiskAlert(true);
    try {
      audioRef.loop = true;
      audioRef.play().catch(e => console.log('Audio test error:', e));
    } catch (e) {
      console.log(e);
    }
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
      
      {/* Risk Alert Dialog with Force Stop Buzzer Button */}
      {showRiskAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0709] border border-red-500/50 rounded-2xl p-8 max-w-md mx-4 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center justify-center text-red-400">
                <AlertTriangle className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">ALARM SIREN ACTIVE</h2>
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Crop Risk Telemetry Triggered</p>
              </div>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-200 text-xs font-medium leading-relaxed">{riskMessage}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleForceStopBuzzer}
                className="w-full bg-red-500 hover:bg-red-400 text-black font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <VolumeX className="w-4 h-4" />
                <span>FORCE SILENCE & TURN OFF BUZZER</span>
              </button>
              <button
                onClick={handleStopAlert}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-semibold py-2.5 rounded-xl border border-white/5 transition-colors"
              >
                Dismiss Alert Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {buzzerToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#07130c] border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2.5 backdrop-blur-xl">
          <VolumeX className="w-4 h-4 text-emerald-400" />
          <span>{buzzerToast}</span>
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
        <header className="sticky top-0 z-10 px-8 py-4 bg-[#04070a]/90 backdrop-blur-xl flex items-center justify-between border-b border-white/5">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5 font-medium">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
               Live Telemetry • {profileData.location}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* FORCE SILENCE BUZZER BUTTON IN HEADER */}
            <button
              onClick={handleForceStopBuzzer}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold transition-all hover:scale-105"
              title="Forcefully turn off alarm buzzer tone"
            >
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
              <span>Turn Off Buzzer</span>
            </button>

            {/* SIREN AUDIT SIMULATOR BUTTON */}
            <button
              onClick={handleTestBuzzer}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 rounded-lg text-xs font-medium transition-all"
              title="Simulate crop risk siren alert"
            >
              <BellRing className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Risk Siren</span>
            </button>

            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/5 transition-colors">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button className="relative p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/5 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full" />
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
                {/* Live Real-time Status Banner */}
                <div className="flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-gray-900/60 to-cyan-950/40 p-4 rounded-2xl border border-emerald-500/30 backdrop-blur-xl shadow-lg shadow-emerald-500/5">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-semibold text-emerald-400 tracking-wide uppercase">
                      Live Telemetry Stream Active
                    </span>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                      ⚡ Round-Table Multi-Agent AI
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Updated just now</span>
                  </div>
                </div>

                {/* Health & Status Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Health Score Card */}
                  <div className="bg-[#0b1219]/90 p-6 rounded-2xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 shadow-xl">
                    <div className="absolute top-0 right-0 p-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-gray-300 text-sm font-medium">Overall Plant Health</h3>
                        <p className="text-emerald-400 text-xs mt-1 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> AI Diagnostics: Optimal
                        </p>
                      </div>
                      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                        <Activity size={20} className="animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="72" cy="72" r="62" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
                          <circle cx="72" cy="72" r="62" stroke="#10b981" strokeWidth="10" fill="none" strokeDasharray="389" strokeDashoffset={389 - (389 * profileData.healthScore) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out shadow-[0_0_15px_#10b981]" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-4xl font-black text-white tracking-tight">{profileData.healthScore}%</span>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Optimal Range</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issues Card */}
                  <div className="col-span-1 lg:col-span-2 bg-[#0b1219]/90 p-6 rounded-2xl border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-gray-300 text-sm font-medium">Issues Detected</h3>
                      <span className="text-xs text-gray-500">Real-time Monitor</span>
                    </div>
                    {profileData.issues.length > 0 ? (
                      <div className="space-y-3">
                        {profileData.issues.map((issue, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-amber-200 font-medium leading-relaxed">{issue.action}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <div>
                            <p className="text-sm font-semibold text-emerald-300">All Systems Nominal</p>
                            <p className="text-xs text-emerald-400/80">No active leaf, soil, or nutrient deficiencies detected by Multi-Agent Swarm AI.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Environment Quick Stats */}
                  <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={Thermometer} label="Avg Temp" value={`${profileData.iotData.temperature}°C`} trend="Live" color="orange" />
                    <StatCard icon={Droplets} label="Humidity" value={`${profileData.iotData.humidity}%`} trend="Live" color="blue" />
                    <StatCard icon={Sun} label="Daily Light" value="12.5 hrs" trend="On Target" color="yellow" />
                    
                    {/* Action Bar */}
                    <div className="sm:col-span-3 bg-[#0b1219]/90 rounded-2xl border border-white/5 p-4 flex items-center justify-between shadow-xl">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/30">
                          <Wind size={22} className="animate-spin-slow" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            Smart Irrigation System
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                          </h4>
                          <p className="text-xs text-gray-400">Automated moisture-based cycle • Next in 45 mins</p>
                        </div>
                      </div>
                      <button onClick={() => setShowIrrigationDialog(true)} className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/50 hover:scale-105 active:scale-95">
                        Trigger Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Growth Projection Area */}
                <div className="bg-[#0b1219]/90 p-6 rounded-2xl border border-white/5 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">Nutrient Composition (PPM)</h3>
                      <p className="text-xs text-gray-400">Live NPK telemetry vs ideal crop targets</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-xs text-gray-300">Ideal Target</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-700"></span><span className="text-xs text-gray-300">Live Reading</span></div>
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
                {/* Real-time Custom Spline Graph Card */}
                <CustomGraph
                  data={graphPoints}
                  activeMetric={activeGraphMetric}
                  setActiveMetric={setActiveGraphMetric}
                  title="Live Telemetry Sensor Graph"
                  subtitle="Real-time 24-hour stream for Soil, Temp, Humidity & NPK balance"
                />

                {/* Sensor Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SensorDetail label="Soil Moisture" value={`${profileData.iotData.soilMoisture}%`} status="Optimal" color="text-blue-400" />
                  <SensorDetail label="Air Temp" value={`${profileData.iotData.temperature}°C`} status="Normal" color="text-emerald-400" />
                  <SensorDetail label="Humidity" value={`${profileData.iotData.humidity}%`} status="Good" color="text-purple-400" />
                  <SensorDetail label="Solution pH" value={`${profileData.iotData.ph}`} status="Perfect" color="text-emerald-400" />
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
                {/* Executive Yield Projection Banner */}
                <div className="bg-[#080d14]/90 border border-emerald-500/20 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                   <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-xl font-bold text-white tracking-tight">AI Harvest Yield Analytics</h2>
                      </div>
                      <p className="text-gray-400 text-xs max-w-lg leading-relaxed">
                        Continuous telemetry projection modeling optimal harvest capacity based on real-time NPK absorption, solar radiation, and soil moisture stability.
                      </p>
                      {loading && <p className="text-xs text-emerald-400 mt-2 font-medium">Calculating AI projection model...</p>}
                   </div>
                   <div className="text-left md:text-right bg-white/[0.03] p-5 rounded-2xl border border-white/5 min-w-[200px]">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Projected Yield</div>
                      <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                        {getValidMetric(yieldData?.projectedYield, '1,450 kg / acre')}
                      </div>
                      <div className="text-xs font-bold text-emerald-300 mt-1 flex items-center md:justify-end gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {getValidMetric(yieldData?.yieldChange, '+14.2% vs last cycle')}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   {/* Resource Consumption Card */}
                   <div className="col-span-2 bg-[#080d14]/90 p-7 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-2xl">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-400" /> Resource Consumption
                        </h3>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                          Automated Telemetry Stream
                        </span>
                      </div>
                      
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-gray-300 flex items-center gap-2">
                                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Water Utilization
                              </span>
                              <span className="font-mono text-white font-bold">
                                {getValidMetric(yieldData?.resourceConsumption?.water, '450 L / cycle')}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-gray-800/80 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 rounded-full w-[48%]"></div>
                            </div>
                         </div>

                         <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-gray-300 flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 text-amber-400" /> Energy Consumption
                              </span>
                              <span className="font-mono text-white font-bold">
                                {getValidMetric(yieldData?.resourceConsumption?.energy, '124 kWh / month')}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-gray-800/80 rounded-full overflow-hidden">
                               <div className="h-full bg-amber-400 rounded-full w-[65%]"></div>
                            </div>
                         </div>

                         <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-gray-300 flex items-center gap-2">
                                <Sprout className="w-3.5 h-3.5 text-teal-400" /> Nutrients & Fertilizer
                              </span>
                              <span className="font-mono text-white font-bold">
                                {getValidMetric(yieldData?.resourceConsumption?.nutrients, '18.5 kg (NPK Balanced)')}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-gray-800/80 rounded-full overflow-hidden">
                               <div className="h-full bg-teal-400 rounded-full w-[38%]"></div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Cost Efficiency Card */}
                   <div className="bg-[#080d14]/90 p-7 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
                      <div>
                         <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                           <DollarSign className="w-4 h-4 text-emerald-400" /> Cost Efficiency
                         </h3>
                         <p className="text-xs text-gray-400">Unit production expenditure breakdown</p>
                      </div>

                      <div className="my-6 p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                         <div className="text-3xl font-black text-white font-mono tracking-tight">
                           {getValidMetric(yieldData?.costEfficiency?.costPerKg, '$0.42 / kg')}
                         </div>
                         <p className="text-xs text-gray-400 mt-1 uppercase font-semibold tracking-wider">Production Cost / KG</p>
                         <div className="mt-3 inline-block text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                           {getValidMetric(yieldData?.costEfficiency?.comparison, '↓ 8.4% lower than regional average')}
                         </div>
                      </div>

                      <div className="text-[11px] text-gray-500 text-center font-medium">
                         Calculated against regional market benchmarks
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
   <div className="bg-[#080d14]/80 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3.5">
         <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-emerald-400">
            {label.includes('Moisture') ? <Droplets className="w-5 h-5" /> :
             label.includes('Temp') ? <Thermometer className="w-5 h-5 text-amber-400" /> :
             label.includes('Humidity') ? <Wind className="w-5 h-5 text-blue-400" /> :
             <Sprout className="w-5 h-5 text-teal-400" />}
         </div>
         <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className={`text-xl font-bold text-white mt-0.5`}>{value}</p>
         </div>
      </div>
      <div className="text-right">
         <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">{status}</span>
      </div>
   </div>
)

const CustomGraph = ({ data, activeMetric, setActiveMetric, title, subtitle }) => {
  const metrics = {
    temp: { label: 'Temperature (°C)', unit: '°C' },
    humidity: { label: 'Humidity (%)', unit: '%' },
    moisture: { label: 'Soil Moisture (%)', unit: '%' },
    npk: { label: 'NPK Balance (PPM)', unit: 'ppm' }
  };

  const themeColor = "#10b981"; // Executive clean emerald accent
  const current = metrics[activeMetric] || metrics.temp;
  const points = data[activeMetric] || [
    { time: '00:00', val: 22 },
    { time: '04:00', val: 21 },
    { time: '08:00', val: 23.5 },
    { time: '12:00', val: 26 },
    { time: '16:00', val: 25.2 },
    { time: '20:00', val: 23.8 },
    { time: 'Now', val: 24.5 }
  ];

  const currentVal = points[points.length - 1].val;
  const maxVal = Math.max(...points.map(p => p.val)) * 1.15 || 100;
  const minVal = Math.min(...points.map(p => p.val)) * 0.85 || 0;

  const getX = (idx) => (idx / (points.length - 1)) * 100;
  const getY = (val) => 50 - ((val - minVal) / (maxVal - minVal || 1)) * 40;

  let pathD = `M 0 ${getY(points[0].val)}`;
  points.forEach((pt, i) => {
    if (i === 0) return;
    const prevX = getX(i - 1);
    const prevY = getY(points[i - 1].val);
    const currX = getX(i);
    const currY = getY(pt.val);
    const cp1x = prevX + (currX - prevX) / 2;
    const cp2x = prevX + (currX - prevX) / 2;
    pathD += ` C ${cp1x} ${prevY}, ${cp2x} ${currY}, ${currX} ${currY}`;
  });

  const areaD = `${pathD} L 100 50 L 0 50 Z`;

  return (
    <div className="bg-[#080d14]/90 p-7 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              {title || 'Real-Time Telemetry Stream'}
            </h3>
          </div>
          <p className="text-xs text-gray-400">{subtitle || 'Continuous 24-hour stream for Soil, Temp, Humidity & NPK balance'}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-emerald-400 font-mono text-xs font-bold">
            Live: {currentVal}{current.unit}
          </div>
          <div className="flex flex-wrap gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/5">
            {Object.entries(metrics).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeMetric === key
                    ? 'bg-emerald-400 text-black font-bold shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-64 w-full relative pt-2">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
          <defs>
            <linearGradient id="cleanGraphGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={themeColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={themeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Clean Axis Gridlines */}
          <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" strokeDasharray="2,2" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" strokeDasharray="2,2" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" strokeDasharray="2,2" />

          {/* Area Gradient & Curved Spline */}
          <path d={areaD} fill="url(#cleanGraphGrad)" />
          <path d={pathD} fill="none" stroke={themeColor} strokeWidth="1.4" strokeLinecap="round" />

          {/* Interactive Target Dot */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={getX(idx)}
              cy={getY(pt.val)}
              r={idx === points.length - 1 ? "2.2" : "1.2"}
              fill="#ffffff"
              stroke={themeColor}
              strokeWidth="1.0"
              className={idx === points.length - 1 ? "animate-pulse" : ""}
            />
          ))}
        </svg>

        {/* Live Floating Reading Badge */}
        <div 
          className="absolute text-[11px] px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-[#07110a] text-emerald-300 font-mono font-bold shadow-xl transform -translate-x-1/2 -translate-y-full transition-all"
          style={{
            left: `${getX(points.length - 1)}%`,
            top: `${Math.max(10, Math.min(80, getY(points[points.length - 1].val) * 1.8))}%`
          }}
        >
          {points[points.length - 1].val}{current.unit}
        </div>
      </div>

      <div className="flex justify-between mt-4 text-[11px] font-mono text-gray-500 uppercase tracking-wider pt-2 border-t border-white/5">
        {points.map((pt, i) => (
          <span key={i}>{pt.time}</span>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;