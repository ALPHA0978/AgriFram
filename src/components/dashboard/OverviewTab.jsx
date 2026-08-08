import React from 'react';
import { 
  Activity, CheckCircle, Droplets, Thermometer, Sun, 
  Sprout, Calendar, AlertCircle, WifiOff, Wifi, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const NPKBar = ({ label, current, target, color, isIotConnected }) => {
  const pct = isIotConnected && current ? Math.min(Math.round((current / (target || 1)) * 100), 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-bold">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono text-white font-semibold">
          {isIotConnected && current ? `${current} PPM` : 'Not Connected'} 
          <span className="text-slate-500 font-normal"> / target {target} PPM</span>
        </span>
      </div>
      <div className="h-3 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
        {isIotConnected ? (
          <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-sm`} style={{ width: `${pct}%` }}></div>
        ) : (
          <div className="h-full bg-amber-500/20 rounded-full w-full flex items-center justify-center text-[9px] text-amber-300 uppercase font-mono font-bold tracking-wider">
            Probe Offline
          </div>
        )}
      </div>
    </div>
  );
};

export const OverviewTab = ({ profileData, setShowIrrigationDialog, toggleIotConnection }) => {
  const isConnected = profileData.isIotConnected;

  return (
    <motion.div 
      key="overview"
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      {/* Real-time Telemetry Operations Banner */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-3xl border backdrop-blur-2xl transition-all duration-300 shadow-2xl gap-4 ${
        isConnected 
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/40 border-emerald-500/30 glow-emerald' 
          : 'bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-orange-950/40 border-amber-500/30 glow-amber'
      }`}>
        <div className="flex items-center gap-3.5">
          <span className="relative flex h-3.5 w-3.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <div>
            <span className={`text-xs font-black tracking-wider uppercase font-mono ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isConnected ? '⚡ Real-Time Telemetry Stream Active' : '⚠️ IoT Telemetry Probe Disconnected'}
            </span>
            <p className="text-[11px] text-slate-400 font-medium">
              {isConnected ? 'Firebase Path: iot/{iot_id}/data • 3-Second Tick Sync' : 'Pair hardware sensors via sidebar to enable live telemetry'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleIotConnection}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl border transition-all ${
            isConnected ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25' : 'bg-amber-500/20 border-amber-500/40 text-amber-200 hover:bg-amber-500/30'
          }`}
        >
          {isConnected ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
          <span>{isConnected ? 'Hardware Online' : 'Connect IoT Hardware'}</span>
        </button>
      </div>

      {/* 4 KPI Executive Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Plant Health Vigor */}
        <div className={`p-6 rounded-3xl border relative overflow-hidden shadow-2xl transition-all duration-300 group ${
          isConnected ? 'bg-[#0f172a]/80 border-emerald-500/30 hover:border-emerald-500/60 glow-emerald' : 'bg-[#0f172a]/80 border-slate-800'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Crop Vigor Index</span>
              <h3 className="text-3xl font-black text-white font-mono tracking-tight mt-1">
                {isConnected && profileData.healthScore ? `${profileData.healthScore}%` : 'Not Connected'}
              </h3>
            </div>
            <div className={`p-3 rounded-2xl border ${isConnected ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
              <Activity size={22} className={isConnected ? 'animate-pulse' : ''} />
            </div>
          </div>
          <div className={`flex items-center gap-2 text-xs font-semibold ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isConnected ? <CheckCircle className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>{isConnected ? 'Optimal Agronomic Balance' : 'Probe Stream Offline'}</span>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className={`p-6 rounded-3xl border relative overflow-hidden shadow-2xl transition-all duration-300 group ${
          isConnected ? 'bg-[#0f172a]/80 border-blue-500/30 hover:border-blue-500/60 glow-cyan' : 'bg-[#0f172a]/80 border-slate-800'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Field Soil Moisture</span>
              <h3 className="text-3xl font-black text-white font-mono tracking-tight mt-1">
                {isConnected ? `${profileData.iotData.soilMoisture}%` : 'Not Connected'}
              </h3>
            </div>
            <div className={`p-3 rounded-2xl border ${isConnected ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
              <Droplets size={22} />
            </div>
          </div>
          <div className={`flex items-center gap-2 text-xs font-semibold ${isConnected ? 'text-blue-400' : 'text-amber-400'}`}>
            <Droplets className="w-4 h-4" />
            <span>{isConnected ? 'Optimal Field Capacity (65%)' : 'Moisture Probe Disconnected'}</span>
          </div>
        </div>

        {/* Temperature */}
        <div className={`p-6 rounded-3xl border relative overflow-hidden shadow-2xl transition-all duration-300 group ${
          isConnected ? 'bg-[#0f172a]/80 border-amber-500/30 hover:border-amber-500/60 glow-amber' : 'bg-[#0f172a]/80 border-slate-800'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Air Temperature</span>
              <h3 className="text-3xl font-black text-white font-mono tracking-tight mt-1">
                {isConnected ? `${profileData.iotData.temperature}` : 'Not Connected'}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/15 rounded-2xl text-amber-400 border border-amber-500/30">
              <Thermometer size={22} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Sun className="w-4 h-4" />
            <span>{isConnected ? 'Daylight Optimal' : 'Air Temp Sensor Offline'}</span>
          </div>
        </div>

        {/* Crop Status */}
        <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-purple-500/30 relative overflow-hidden shadow-2xl group hover:border-purple-500/60 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Growth Stage</span>
              <h3 className="text-2xl font-black text-white tracking-tight mt-1 truncate">{profileData.cropStatus}</h3>
            </div>
            <div className="p-3 bg-purple-500/15 rounded-2xl text-purple-400 border border-purple-500/30">
              <Sprout size={22} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
            <Calendar className="w-4 h-4" />
            <span>{profileData.daysPlanted} Days Planted</span>
          </div>
        </div>
      </div>

      {/* SVG Ring Gauge & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Ring Gauge */}
        <div className="bg-[#0f172a]/90 p-7 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <h3 className="text-slate-300 text-xs font-bold tracking-widest uppercase mb-6 font-mono">AI Diagnostic Ring</h3>
          {isConnected && profileData.healthScore ? (
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="88" cy="88" r="76" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
                <circle 
                  cx="88" 
                  cy="88" 
                  r="76" 
                  stroke="#10b981" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray="477" 
                  strokeDashoffset={477 - (477 * profileData.healthScore) / 100} 
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out shadow-[0_0_20px_#10b981]" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-white font-mono tracking-tighter">{profileData.healthScore}%</span>
                <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider mt-1">Health Index</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center space-y-3 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
              <WifiOff className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs font-bold text-amber-300">IoT Hardware Not Connected</p>
              <p className="text-[11px] text-slate-400 font-medium">Connect hardware probes to calculate diagnostic health ring</p>
            </div>
          )}
        </div>

        {/* Active Diagnostics & Trigger Bar */}
        <div className="col-span-1 lg:col-span-2 bg-[#0f172a]/90 p-7 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
              <h3 className="text-white text-base font-bold tracking-tight">Active Telemetry Diagnostic</h3>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
                AWS Bedrock Swarm
              </span>
            </div>

            {profileData.issues.length > 0 ? (
              <div className="space-y-3">
                {profileData.issues.map((issue, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-amber-200 font-semibold leading-relaxed">{issue.action}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-300">All Field Metrics Nominal</p>
                    <p className="text-xs text-emerald-400/80 font-medium">No active crop risk alerts detected by Multi-Agent Swarm AI.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Solenoid Bar */}
          <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/15 rounded-2xl text-blue-400 border border-blue-500/30">
                <Droplets size={22} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Smart Solenoid Valve Controller</h4>
                <p className="text-xs text-slate-400 font-medium">
                  {isConnected ? 'Automated drip moisture cycle • Target: 65%' : 'Controller Offline'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowIrrigationDialog(true)} 
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black rounded-xl transition-all shadow-lg shadow-emerald-950/50"
            >
              Override Solenoid Valve
            </button>
          </div>
        </div>
      </div>

      {/* NPK Composition */}
      <div className="bg-[#0f172a]/90 p-7 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Soil NPK Stoichiometry (PPM)</h3>
            <p className="text-xs text-slate-400 font-medium">Real-time nutrient sensors vs CACP ideal benchmarks</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 font-mono">
              <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="text-slate-300">{isConnected ? 'Live Hardware Stream' : 'Not Connected'}</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
           <NPKBar label="Nitrogen (N)" current={profileData.iotData.nitrogen} target={profileData.npkTargets.nitrogen} color="bg-emerald-500" isIotConnected={isConnected} />
           <NPKBar label="Phosphorus (P)" current={profileData.iotData.phosphorus} target={profileData.npkTargets.phosphorus} color="bg-blue-500" isIotConnected={isConnected} />
           <NPKBar label="Potassium (K)" current={profileData.iotData.potassium} target={profileData.npkTargets.potassium} color="bg-purple-500" isIotConnected={isConnected} />
        </div>
      </div>
    </motion.div>
  );
};
