import React from 'react';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardSidebar = ({ sidebarOpen, activeTab, setActiveTab, menuItems, farmerName }) => {
  return (
    <motion.aside 
      animate={{ width: sidebarOpen ? 270 : 80 }}
      className="relative z-20 bg-[#060a12]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-all duration-300 h-screen overflow-y-auto"
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 text-emerald-400">
          <div className="p-2.5 bg-emerald-500/15 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <Leaf size={22} className="text-emerald-400" />
          </div>
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="font-black text-xl tracking-tight text-white"
            >
              AgriFarm<span className="text-emerald-400">AI</span>
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group overflow-hidden ${
              activeTab === item.id 
                ? 'text-white bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/30 shadow-lg shadow-emerald-500/5' 
                : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
            }`}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1.5 h-7 bg-emerald-400 rounded-r-full shadow-[0_0_12px_#10b981]" 
              />
            )}
            <item.icon size={20} className={activeTab === item.id ? 'text-emerald-400' : 'group-hover:text-emerald-300 transition-colors'} />
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="font-semibold text-sm whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </button>
        ))}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-white/5">
        <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 ${!sidebarOpen && 'justify-center'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-black text-black shadow-lg">
            {farmerName?.charAt(0) || 'F'}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{farmerName}</p>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Verified Pro Plan</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
