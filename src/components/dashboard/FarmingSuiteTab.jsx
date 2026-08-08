import React from 'react';
import { Sprout, Droplets, TrendingUp, Cpu, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const FarmingSuiteTab = ({ onLaunchTool }) => {
  const tools = [
    { id: 'iot-manager', name: 'IoT Hardware Manager', desc: 'Firebase root iot/{iot_id}: battery health, status, soil & air sensors', icon: Cpu, badge: 'Hardware Pairing' },
    { id: 'crop-health', name: 'Crop Health AI', desc: 'Plant pathology, leaf vision diagnosis, and treatment dosing', icon: Sprout, badge: 'Dashboard View' },
    { id: 'soil-analysis', name: 'Soil Analysis AI', desc: 'NPK stoichiometry, pH conditioning, and compost calculation', icon: Droplets, badge: 'Dashboard View' },
    { id: 'market-intel', name: 'Market Intelligence AI', desc: 'CACP C2 margins, mandi price trends, and corporate procurement', icon: TrendingUp, badge: 'Dashboard View' },
  ];

  return (
    <motion.div
      key="tools"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="space-y-6 font-sans text-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.name}
              onClick={() => onLaunchTool(tool.id)}
              className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10 cursor-pointer group hover:border-emerald-500/50 hover:bg-[#0f172a] transition-all shadow-xl flex flex-col justify-between backdrop-blur-2xl"
            >
              <div>
                <div className="w-12 h-12 bg-emerald-500/15 rounded-2xl flex items-center justify-center mb-5 border border-emerald-500/30 group-hover:scale-110 transition-transform text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                  {tool.name}
                </h3>
                
                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                  {tool.desc}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5 font-mono">
                  Launch <ArrowUpRight className="w-4 h-4" />
                </span>
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {tool.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
