import React from 'react';
import { VolumeX, BellRing, X, Menu, Wifi, WifiOff } from 'lucide-react';

export const DashboardHeader = ({ 
  activeTabLabel, 
  location, 
  handleForceStopBuzzer, 
  handleTestBuzzer, 
  sidebarOpen, 
  setSidebarOpen,
  isIotConnected,
  toggleIotConnection
}) => {
  return (
    <header className="sticky top-0 z-10 px-8 py-4 bg-[#03060d]/85 backdrop-blur-2xl flex items-center justify-between border-b border-white/5">
      <div>
        <h1 className="text-xl font-black text-white tracking-tight">
          {activeTabLabel}
        </h1>
        <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5 font-medium">
           <span className={`w-2 h-2 rounded-full ${isIotConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`}/>
           {isIotConnected ? 'IoT Telemetry Active' : 'IoT Sensor Disconnected'} • {location}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* IoT Hardware Connection Toggle */}
        <button
          onClick={toggleIotConnection}
          className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all ${
            isIotConnected 
              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
          }`}
          title="Connect or disconnect hardware IoT sensor stream"
        >
          {isIotConnected ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isIotConnected ? 'IoT Connected' : 'Connect IoT Hardware'}</span>
        </button>

        <button
          onClick={handleForceStopBuzzer}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all hover:scale-105"
          title="Forcefully turn off alarm buzzer tone"
        >
          <VolumeX className="w-3.5 h-3.5 text-red-400" />
          <span>Turn Off Alarm</span>
        </button>

        <button
          onClick={handleTestBuzzer}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-semibold transition-all"
          title="Simulate crop risk siren alert"
        >
          <BellRing className="w-3.5 h-3.5 text-emerald-400" />
          <span>Test Alarm Siren</span>
        </button>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/10 transition-colors">
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </header>
  );
};
