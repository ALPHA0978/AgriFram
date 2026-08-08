import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Leaf, Droplets, TrendingUp, Settings, 
  Sprout, Activity, Shield, VolumeX, ArrowLeft, Cpu, Wifi, WifiOff
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FarmerAI } from '../services/farmerAI';
import { auth } from '../services/firebase';
import { getProfile } from '../services/profileService';
import { IoTService } from '../services/iotService';

// Modular Layout Components
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { CropCycleTab } from '../components/dashboard/CropCycleTab';
import { MonitoringTab } from '../components/dashboard/MonitoringTab';
import { AnalyticsTab } from '../components/dashboard/AnalyticsTab';
import { FarmingSuiteTab } from '../components/dashboard/FarmingSuiteTab';
import { RiskAlertModal } from '../components/dashboard/RiskAlertModal';
import { IrrigationDialog } from '../components/dashboard/IrrigationDialog';
import GrowingGuideTab from '../components/GrowingGuideTab';

// Dedicated Clean Dashboard Tool Views
import { EmbeddedCropHealth } from '../components/dashboard/tools/EmbeddedCropHealth';
import { EmbeddedSoilAnalysis } from '../components/dashboard/tools/EmbeddedSoilAnalysis';
import { EmbeddedMarketIntel } from '../components/dashboard/tools/EmbeddedMarketIntel';
import { EmbeddedIoTManager } from '../components/dashboard/tools/EmbeddedIoTManager';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeEmbeddedTool, setActiveEmbeddedTool] = useState(null);
  const [cropCycleData, setCropCycleData] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [pairedDeviceId, setPairedDeviceId] = useState(null);
  const [realtimeTelemetry, setRealtimeTelemetry] = useState(null);
  const [showRiskAlert, setShowRiskAlert] = useState(false);
  const [riskMessage, setRiskMessage] = useState('');
  const [buzzerToast, setBuzzerToast] = useState('');
  const [showIrrigationDialog, setShowIrrigationDialog] = useState(false);
  const [audioRef] = useState(new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsKGGS56+mjUhELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsKGGS56+mjUhELTKXh8bllHAU2jdXzzn0vBQ=='));

  // Initialize Firebase Auth & Profile
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        const profileData = await getProfile(user.uid);
        if (!profileData) {
          navigate('/profile-setup');
          return;
        }
        setProfile(profileData);
        
        // Check for paired IoT device ID from local storage or Firebase profile
        const activeId = IoTService.getPairedDeviceId() || profileData.iotDeviceId;
        if (activeId) {
          setPairedDeviceId(activeId);
        }
        
        if (profileData.plantingDate && profileData.primaryCrop) {
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
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [navigate, audioRef]);

  // Subscribe to real-time telemetry from Firebase root `iot/{pairedDeviceId}`
  useEffect(() => {
    if (!pairedDeviceId) {
      setRealtimeTelemetry(null);
      return;
    }

    const unsub = IoTService.subscribeToTelemetry(pairedDeviceId, (update) => {
      setRealtimeTelemetry(update);
    });

    return () => unsub();
  }, [pairedDeviceId]);

  const isIotConnected = Boolean(
    pairedDeviceId && realtimeTelemetry && realtimeTelemetry.status === 'Online'
  );

  const calculateHealthScore = () => {
    if (!isIotConnected || !realtimeTelemetry?.data) return null;
    const data = realtimeTelemetry.data;
    const n = parseFloat(data.nitrogen) || 0;
    const p = parseFloat(data.phosphorus) || 0;
    const k = parseFloat(data.potassium) || 0;
    const ph = parseFloat(data.ph || data.soilPh) || 6.5;
    const moisture = parseFloat(data.moisture) || 65;

    const npkScore = (Math.min(n / 150, 1) * 100 + Math.min(p / 50, 1) * 100 + Math.min(k / 200, 1) * 100) / 3;
    const phScore = (ph >= 6.0 && ph <= 7.0) ? 100 : 70;
    const moistureScore = (moisture >= 50 && moisture <= 70) ? 100 : 80;
    return Math.round(npkScore * 0.5 + phScore * 0.25 + moistureScore * 0.25);
  };

  const sensorData = realtimeTelemetry?.data || {};

  const profileData = {
    farmerName: profile.farmerName || 'Farmer',
    primaryCrop: profile.primaryCrop || 'Hybrid Maize',
    farmType: profile.farmType || 'Commercial Farm',
    location: `${profile.location || 'Punjab'}, ${profile.district || 'India'}`.trim().replace(/^,\s*|,\s*$/g, ''),
    cropStatus: cropCycleData?.currentStage || profile.cropStatus || 'Vegetative',
    daysPlanted: cropCycleData?.daysPlanted || 32,
    daysToHarvest: cropCycleData?.daysToHarvest || 95,
    plantingDate: profile.plantingDate,
    healthScore: calculateHealthScore(),
    isIotConnected: isIotConnected,
    alerts: recommendations?.immediateActions?.filter(a => a.priority === 'High').length || 0,
    issues: recommendations?.immediateActions?.filter(a => a.priority === 'High').slice(0, 2) || [],
    iotData: {
      temperature: isIotConnected && sensorData.airTemperature != null ? `${sensorData.airTemperature}°C` : 'Not Connected',
      humidity: isIotConnected && sensorData.humidity != null ? `${sensorData.humidity}%` : 'Not Connected',
      soilMoisture: isIotConnected && sensorData.moisture != null ? `${sensorData.moisture}%` : 'Not Connected',
      nitrogen: isIotConnected ? sensorData.nitrogen : null,
      phosphorus: isIotConnected ? sensorData.phosphorus : null,
      potassium: isIotConnected ? sensorData.potassium : null,
      sulphur: isIotConnected ? sensorData.sulphur : null,
      lightIntensity: isIotConnected ? sensorData.lightIntensity : null,
      windSpeed: isIotConnected ? sensorData.windSpeed : null,
      soilTemperature: isIotConnected ? sensorData.soilTemperature : null,
      ph: isIotConnected ? (sensorData.ph || 6.8) : null
    },
    npkTargets: {
      nitrogen: parseInt(profile.cropRequirements?.npk?.nitrogen?.match(/\d+/)?.[0]) || 150,
      phosphorus: parseInt(profile.cropRequirements?.npk?.phosphorus?.match(/\d+/)?.[0]) || 50,
      potassium: parseInt(profile.cropRequirements?.npk?.potassium?.match(/\d+/)?.[0]) || 200
    }
  };

  const toggleIotConnection = () => {
    if (pairedDeviceId) {
      IoTService.unpairDevice();
      setPairedDeviceId(null);
      setRealtimeTelemetry(null);
      setBuzzerToast('IoT Hardware Unpaired');
    } else {
      setActiveTab('iot-manager');
      setActiveEmbeddedTool(null);
    }
    setTimeout(() => setBuzzerToast(''), 4000);
  };

  const getValidMetric = (val, fallback) => {
    if (!val || typeof val !== 'string' || val.toLowerCase().includes('insufficient') || val.toLowerCase().includes('n/a')) {
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
    setBuzzerToast('Buzzer Forcefully Muted & Alarm Siren Stopped');
    setTimeout(() => setBuzzerToast(''), 4500);
  };

  const handleTestBuzzer = () => {
    setRiskMessage('Crop Risk Siren: Soil Moisture & NPK Level Out of Range (Simulated Telemetry Alert)');
    setShowRiskAlert(true);
    try {
      audioRef.loop = true;
      audioRef.play().catch(e => console.log('Audio test error:', e));
    } catch (e) {
      console.log(e);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setActiveEmbeddedTool(null);
  };

  const handleLaunchTool = (toolId) => {
    if (toolId === 'iot-manager') {
      setActiveTab('iot-manager');
      setActiveEmbeddedTool(null);
    } else {
      setActiveEmbeddedTool(toolId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03060a] text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium tracking-wide">Initializing Telemetry Engine...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Home },
    { id: 'iot-manager', label: 'IoT Hardware', icon: Cpu },
    { id: 'plant', label: 'Crop Cycle & Growth', icon: Leaf },
    { id: 'guide', label: 'AI Growing Guide', icon: Sprout },
    { id: 'monitoring', label: 'Live IoT Telemetry', icon: Activity },
    { id: 'analytics', label: 'Yield Analytics', icon: TrendingUp },
    { id: 'tools', label: 'Farming Suite', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const activeTabLabel = activeEmbeddedTool
    ? `${activeEmbeddedTool === 'crop-health' ? 'Crop Health AI' : activeEmbeddedTool === 'soil-analysis' ? 'Soil Analysis AI' : 'Market Intelligence AI'} (Dashboard View)`
    : menuItems.find(m => m.id === activeTab)?.label || 'Dashboard Overview';

  return (
    <div className="min-h-screen bg-[#03060d] text-white font-sans flex h-screen overflow-hidden selection:bg-emerald-500/30">
      
      {/* Irrigation Solenoid Dialog */}
      {showIrrigationDialog && (
        <IrrigationDialog setShowIrrigationDialog={setShowIrrigationDialog} />
      )}
      
      {/* Risk Alert Siren Modal */}
      {showRiskAlert && (
        <RiskAlertModal 
          riskMessage={riskMessage} 
          handleForceStopBuzzer={handleForceStopBuzzer} 
          handleStopAlert={handleStopAlert} 
        />
      )}

      {/* Floating Toast Notification */}
      {buzzerToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#07130c] border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2.5 backdrop-blur-xl">
          <VolumeX className="w-4 h-4 text-emerald-400" />
          <span>{buzzerToast}</span>
        </div>
      )}

      {/* Sidebar Navigation Component */}
      <DashboardSidebar 
        sidebarOpen={sidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        menuItems={menuItems} 
        farmerName={profileData.farmerName} 
      />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto h-screen bg-transparent">
        {/* Sticky Header Component */}
        <DashboardHeader 
          activeTabLabel={activeTabLabel} 
          location={profileData.location} 
          handleForceStopBuzzer={handleForceStopBuzzer} 
          handleTestBuzzer={handleTestBuzzer} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          isIotConnected={isIotConnected}
          toggleIotConnection={toggleIotConnection}
        />

        <div className="p-8 max-w-7xl mx-auto pb-24">
          <AnimatePresence mode="wait">
            {/* Embedded Active Tool View */}
            {activeEmbeddedTool ? (
              <motion.div
                key="embedded-tool"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Embedded Return Header */}
                <div className="flex items-center justify-between bg-[#080d16] p-4 rounded-2xl border border-emerald-500/30">
                  <button
                    onClick={() => setActiveEmbeddedTool(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold transition-all border border-emerald-500/30"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Dashboard Farming Suite</span>
                  </button>
                  <span className="text-xs text-gray-400 font-medium">Dashboard Integrated Workspace</span>
                </div>

                {/* Dedicated Clean Tool Components */}
                <div className="bg-[#05080e] rounded-3xl border border-white/10 p-4 shadow-2xl">
                  {activeEmbeddedTool === 'crop-health' && <EmbeddedCropHealth />}
                  {activeEmbeddedTool === 'soil-analysis' && <EmbeddedSoilAnalysis />}
                  {activeEmbeddedTool === 'market-intel' && <EmbeddedMarketIntel />}
                </div>
              </motion.div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <OverviewTab 
                    profileData={profileData} 
                    setShowIrrigationDialog={setShowIrrigationDialog} 
                    toggleIotConnection={toggleIotConnection}
                  />
                )}
                {activeTab === 'iot-manager' && (
                  <EmbeddedIoTManager />
                )}
                {activeTab === 'plant' && (
                  <CropCycleTab profileData={profileData} cropCycleData={cropCycleData} />
                )}
                {activeTab === 'guide' && (
                  <GrowingGuideTab recommendations={recommendations} loading={loading} />
                )}
                {activeTab === 'monitoring' && (
                  <MonitoringTab profileData={profileData} toggleIotConnection={toggleIotConnection} />
                )}
                {activeTab === 'analytics' && (
                  <AnalyticsTab yieldData={yieldData} getValidMetric={getValidMetric} />
                )}
                {activeTab === 'tools' && (
                  <FarmingSuiteTab onLaunchTool={handleLaunchTool} />
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;