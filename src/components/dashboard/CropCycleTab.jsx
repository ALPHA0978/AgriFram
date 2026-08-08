import React from 'react';
import { Sun, Droplets, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const CropCycleTab = ({ profileData, cropCycleData }) => {
  const pct = profileData.daysToHarvest > 0 
    ? Math.min(Math.round((profileData.daysPlanted / profileData.daysToHarvest) * 100), 100) 
    : 0;

  return (
    <motion.div 
      key="plant"
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
      className="space-y-6 text-white font-sans"
    >
      {/* Primary Crop Timeline Card */}
      <div className="glass-card-pro p-8 relative overflow-hidden shadow-2xl glow-emerald border-emerald-500/30">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Active Crop Phenology</span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1">{profileData.primaryCrop}</h2>
            <p className="text-emerald-400 font-bold text-sm mt-0.5">{profileData.cropStatus} Growth Stage</p>
            {profileData.plantingDate && (
              <p className="text-xs text-slate-400 font-medium mt-1">Planted: {new Date(profileData.plantingDate).toLocaleDateString()}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-white font-mono">{profileData.daysPlanted}<span className="text-lg text-slate-500 font-normal"> / {profileData.daysToHarvest} days</span></p>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Timeline to Harvest ({pct}%)</p>
          </div>
        </div>

        {/* Timeline Visual Progress Bar */}
        <div className="relative pt-6 pb-2">
          <div className="h-3 bg-slate-900/80 rounded-full w-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${pct}%` }} 
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded-full relative shadow-[0_0_15px_#10b981]"
            />
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            <span className="text-emerald-400">Seedling</span>
            <span className={pct >= 30 ? 'text-emerald-400' : 'text-slate-500'}>Vegetative</span>
            <span className={pct >= 60 ? 'text-emerald-400' : 'text-slate-500'}>Flowering</span>
            <span className={pct >= 90 ? 'text-emerald-400' : 'text-slate-500'}>Harvest</span>
          </div>
        </div>
      </div>

      {/* Lighting & Irrigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10 shadow-xl glow-amber">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm"><Sun size={18} className="text-amber-400"/> Lighting Photoperiod</h3>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-200 font-medium">Photoperiod Schedule</p>
              <p className="text-lg font-bold text-white font-mono">{cropCycleData?.lightingSchedule || '14 hrs On / 10 hrs Off'}</p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono border border-amber-500/30">
              {cropCycleData?.lightingPercentage || 75}%
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10 shadow-xl glow-cyan">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm"><Droplets size={18} className="text-blue-400"/> Irrigation Strategy</h3>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-200 font-medium">Solenoid Method</p>
              <p className="text-lg font-bold text-white">{cropCycleData?.irrigationMethod || 'Sub-surface Drip'}</p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 animate-pulse border border-blue-500/30">
              <Droplets size={20} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
