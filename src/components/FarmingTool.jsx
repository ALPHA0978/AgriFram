import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Beaker, Camera, Satellite, TrendingUp, MapPin, Radio, ArrowRight, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SustainableFarmingTool = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const modules = [
    {
      id: 'crop',
      title: t('pages.farming_tool.modules.crop.title'),
      description: t('pages.farming_tool.modules.crop.desc'),
      icon: Camera,
      path: '/crop-health',
      color: 'emerald'
    },
    {
      id: 'soil',
      title: t('pages.farming_tool.modules.soil.title'),
      description: t('pages.farming_tool.modules.soil.desc'),
      icon: Beaker,
      path: '/soil-analysis',
      color: 'teal'
    },
    {
      id: 'monitoring',
      title: t('pages.farming_tool.modules.monitoring.title'),
      description: t('pages.farming_tool.modules.monitoring.desc'),
      icon: Satellite,
      path: '/monitoring',
      color: 'blue'
    },
    {
      id: 'market',
      title: t('pages.farming_tool.modules.market.title'),
      description: t('pages.farming_tool.modules.market.desc'),
      icon: TrendingUp,
      path: '/market-intel',
      color: 'amber'
    },
    {
      id: 'geo-soil',
      title: 'Geo Soil Analysis',
      description: 'Location-based soil data analysis with nearby field insights within 1km range',
      icon: MapPin,
      path: '/geo-soil-analysis',
      color: 'purple'
    }
  ];

  const GlassCard = ({ children, extraClasses = '' }) => (
    <div className={`relative overflow-hidden bg-gray-900/40 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 hover:border-emerald-500/50 shadow-2xl transition-all duration-500 group ${extraClasses}`}>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05080a] text-white font-inter relative selection:bg-emerald-500/30">
      
      {/* Advanced Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: `radial-gradient(#10b981 0.5px, transparent 0.5px)`, 
            backgroundSize: '30px 30px' 
          }}
        />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              AgriFarm<span className="text-emerald-400">AI</span>
            </span>
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Radio className="w-3 h-3 animate-pulse" /> AI-Powered Farm Management
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6">
            Smart Farming <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-200">
              Intelligence Suite
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Choose your AI-powered tool to optimize crop health, analyze soil, monitor fields, or explore market insights.
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {modules.slice(0, 4).map((module) => {
            const Icon = module.icon;
            return (
              <GlassCard key={module.id} extraClasses="!p-0 cursor-pointer group/card">
                <div 
                  onClick={() => navigate(module.path)}
                  className="relative p-6"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover/card:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-white group-hover/card:text-emerald-400 transition-colors">
                    {module.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {module.description}
                  </p>
                  
                  {/* Status Badges */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Ready</span>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Real-time</span>
                    </div>
                  </div>
                  
                  {/* Launch Button */}
                  <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 group/btn">
                    <span>Launch Tool</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
        
        {/* Additional Module - Geo Soil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {modules.slice(4).map((module) => {
            const Icon = module.icon;
            return (
              <GlassCard key={module.id} extraClasses="!p-0 cursor-pointer group/card">
                <div 
                  onClick={() => navigate(module.path)}
                  className="relative p-6"
                >
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover/card:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-white group-hover/card:text-purple-400 transition-colors">
                    {module.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                      <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider">Ready</span>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Location-based</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-purple-500 hover:bg-purple-400 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-[0.98] shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center justify-center gap-2 group/btn">
                    <span>Launch Tool</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Impact Section */}
        <GlassCard extraClasses="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Activity className="w-3 h-3" /> SDG 2 - Zero Hunger
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Our Impact on <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">Global Agriculture</span>
          </h2>
          
          <p className="text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Our AI-powered platform directly addresses global hunger by increasing agricultural productivity, 
            improving food security, and empowering farmers with technology-driven solutions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: '25%', label: 'Increase in Crop Yield', color: 'emerald' },
              { value: '40%', label: 'Reduction in Resource Waste', color: 'blue' },
              { value: '60%', label: 'Improvement in Farm Income', color: 'amber' }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group/stat">
                <div className={`text-4xl font-black mb-2 text-${stat.color}-400`}>{stat.value}</div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2026 AgriFarm AI. Empowering farmers with artificial intelligence.</p>
        </div>
      </footer>
    </div>
  );
};

export default SustainableFarmingTool;
