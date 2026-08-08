import React from 'react';
import { Droplets } from 'lucide-react';

export const IrrigationDialog = ({ setShowIrrigationDialog }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0b121c] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-blue-500/15 border border-blue-500/30 rounded-2xl flex items-center justify-center">
            <Droplets className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Smart Irrigation Control</h2>
            <p className="text-gray-400 text-xs">IoT Controller Telemetry</p>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
          <p className="text-blue-200 text-xs leading-relaxed font-medium">
            No active IoT solenoid valves detected. Please connect your automated drip controller or trigger manual solenoid override.
          </p>
        </div>
        <button
          onClick={() => setShowIrrigationDialog(false)}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-lg text-sm"
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  );
};
