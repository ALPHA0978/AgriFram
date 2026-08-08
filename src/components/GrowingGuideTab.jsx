import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, CheckCircle2, AlertTriangle, Lightbulb, Clock, Calendar, ArrowRight } from 'lucide-react';

const GrowingGuideTab = ({ recommendations, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mr-3"></div>
        <span>Generating AI Agronomic Recommendations...</span>
      </div>
    );
  }

  const immediateActions = recommendations?.immediateActions || [];
  const seasonalCalendar = recommendations?.seasonalCalendar || [];
  const generalTips = recommendations?.generalTips || [];

  return (
    <motion.div
      key="guide"
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
      className="space-y-6 text-white font-sans"
    >
      {/* Banner */}
      <div className="glass-card-pro p-8 relative overflow-hidden shadow-2xl glow-emerald border-emerald-500/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest font-mono">AWS Bedrock AI Agronomist</span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1">Smart Agronomic Growing Guide</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">Personalized field prescriptions based on weather, NPK chemistry, and PAU benchmarks</p>
          </div>
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-400">
            <Sprout size={28} />
          </div>
        </div>
      </div>

      {/* Immediate Actions Checklist */}
      {immediateActions.length > 0 && (
        <div className="bg-[#0f172a]/80 p-7 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Immediate Field Action Protocol
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {immediateActions.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    item.priority === 'High' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}>
                    {item.priority || 'Action Required'}
                  </span>
                  <p className="text-xs text-white font-bold mt-2">{item.action || item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Calendar */}
      {seasonalCalendar.length > 0 && (
        <div className="bg-[#0f172a]/80 p-7 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" /> Seasonal Agronomic Timeline
          </h3>
          <div className="space-y-3">
            {seasonalCalendar.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">{item.month || item.stage}</span>
                </div>
                <span className="text-xs text-slate-300 font-medium">{item.task || item.activity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GrowingGuideTab;
