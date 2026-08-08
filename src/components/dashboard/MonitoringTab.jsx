import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

const SensorDetail = ({ label, value, status, color, isConnected }) => (
  <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10 shadow-xl backdrop-blur-2xl">
    <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">{label}</span>
    <h3 className={`text-3xl font-black font-mono tracking-tight mt-2 ${isConnected ? color : 'text-amber-400'}`}>
      {isConnected ? value : 'Not Connected'}
    </h3>
    <span className={`inline-block mt-3 px-3 py-1 border rounded-full text-[10px] font-bold uppercase font-mono tracking-wider ${
      isConnected ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
    }`}>
      {isConnected ? status : 'Sensor Offline'}
    </span>
  </div>
);

export const MonitoringTab = ({ profileData, toggleIotConnection }) => {
  const isConnected = profileData.isIotConnected;

  return (
    <motion.div 
      key="monitoring"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="space-y-6 text-white font-sans"
    >
      {/* Banner */}
      <div className={`p-6 rounded-3xl border backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl ${
        isConnected ? 'bg-emerald-950/20 border-emerald-500/30 glow-emerald' : 'bg-amber-950/20 border-amber-500/30 glow-amber'
      }`}>
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {isConnected ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-amber-400" />}
            {isConnected ? 'IoT Telemetry Stream Active' : 'No Active IoT Telemetry Sensor Stream'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isConnected ? 'Real-time 3-second tick synchronization with field sensor nodes' : 'Connect hardware telemetry probes via sidebar or button to view live soil, air & NPK readings'}
          </p>
        </div>
        <button
          onClick={toggleIotConnection}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            isConnected ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20' : 'bg-amber-500/15 border-amber-500/30 text-amber-200 hover:bg-amber-500/25'
          }`}
        >
          {isConnected ? 'Disconnect Sensor Stream' : 'Connect IoT Telemetry Hardware'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorDetail label="Soil Moisture" value={`${profileData.iotData.soilMoisture}`} status="Optimal Range" color="text-blue-400" isConnected={isConnected} />
        <SensorDetail label="Air Temp" value={`${profileData.iotData.temperature}`} status="Nominal" color="text-emerald-400" isConnected={isConnected} />
        <SensorDetail label="Relative Humidity" value={`${profileData.iotData.humidity}`} status="Good" color="text-purple-400" isConnected={isConnected} />
        <SensorDetail label="Soil pH" value={profileData.iotData.ph ? profileData.iotData.ph : 'Not Connected'} status="Optimal" color="text-emerald-400" isConnected={isConnected} />
      </div>
    </motion.div>
  );
};
