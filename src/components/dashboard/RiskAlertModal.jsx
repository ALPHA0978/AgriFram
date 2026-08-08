import React from 'react';
import { AlertTriangle, VolumeX } from 'lucide-react';

export const RiskAlertModal = ({ riskMessage, handleForceStopBuzzer, handleStopAlert }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#11070a] border border-red-500/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(239,68,68,0.25)] relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center justify-center text-red-400">
            <AlertTriangle className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">TELEMETRY RISK ALARM</h2>
            <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Crop Stress Siren Triggered</p>
          </div>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
          <p className="text-red-200 text-xs font-medium leading-relaxed">{riskMessage}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleForceStopBuzzer}
            className="w-full bg-red-500 hover:bg-red-400 text-black font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
          >
            <VolumeX className="w-4 h-4" />
            <span>SILENCE SIREN & MUTE BUZZER</span>
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
  );
};
