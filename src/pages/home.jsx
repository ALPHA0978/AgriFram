import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, ArrowRight, Droplet, Wind, Thermometer, 
  TrendingUp, Menu, X, ArrowUpRight, 
  Activity, BarChart3, Sparkles,
  Beaker, Satellite, DollarSign, MapPin, CheckCircle2, ShieldCheck, Zap, Cpu, Layers, Scan
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Home = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  // Live telemetry ticker
  const [heroTemp, setHeroTemp] = useState(24.5);
  const [heroHum, setHeroHum] = useState(64);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroTemp(t => +(t + (Math.random() * 0.4 - 0.2)).toFixed(1));
      setHeroHum(h => Math.min(90, Math.max(40, h + Math.floor(Math.random() * 3 - 1))));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const modules = [
    {
      id: 'crop-health',
      path: '/crop-health',
      icon: Leaf,
      title: 'Crop Pathologist AI',
      desc: 'Computer vision diagnostics for 50+ plant diseases with instant organic and chemical cure plans.',
      badge: 'Vision Pathologist'
    },
    {
      id: 'soil-analysis',
      path: '/soil-analysis',
      icon: Beaker,
      title: 'Soil NPK Tuning AI',
      desc: 'Chemical soil balance calculation, pH drift tracking, and custom fertilizer recommendations.',
      badge: 'Soil Chemist'
    },
    {
      id: 'monitoring',
      path: '/monitoring',
      icon: Satellite,
      title: 'IoT Telemetry Stream',
      desc: 'Real-time soil moisture monitoring, VPD atmospheric calculation, and automated drip irrigation.',
      badge: 'Telemetry Engine'
    },
    {
      id: 'market-intel',
      path: '/market-intel',
      icon: DollarSign,
      title: 'Market Intelligence AI',
      desc: 'Commodity price risk forecasting, optimal harvesting windows, and regional crop profit analytics.',
      badge: 'Market Analyst'
    },
    {
      id: 'geo-soil-analysis',
      path: '/geo-soil-analysis',
      icon: MapPin,
      title: 'Geo Soil Location AI',
      desc: 'GPS spatial soil mapping with micro-climate field data within a 1km hyper-local radius.',
      badge: 'Spatial Agronomy'
    }
  ];

  return (
    <div className="min-h-screen bg-[#030609] text-white font-sans relative selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* --- SUBTLE BACKGROUND GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: `radial-gradient(#10b981 0.7px, transparent 0.7px)`, 
            backgroundSize: '32px 32px' 
          }}
        />
        <div className="absolute top-[-15%] left-1/3 w-[650px] h-[650px] bg-emerald-500/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] bg-teal-500/5 blur-[150px] rounded-full" />
      </div>

      {/* --- ENTERPRISE NAVBAR --- */}
      <nav className={`fixed top-0 z-50 w-full px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-[#030609]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-emerald-500 p-2 rounded-xl text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Leaf className="w-5 h-5 font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                AgriFarm<span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">Enterprise Precision Ag</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center bg-white/[0.03] border border-white/5 rounded-full px-3 py-1.5 backdrop-blur-md">
            {[
              { name: 'Home', path: '/' },
              { name: 'Crop Health', path: '/crop-health' },
              { name: 'Soil Analysis', path: '/soil-analysis' },
              { name: 'IoT Monitoring', path: '/monitoring' },
              { name: 'Market Intel', path: '/market-intel' },
              { name: 'Geo Soil', path: '/geo-soil-analysis' },
            ].map((item) => (
              <button 
                key={item.path}
                onClick={() => navigate(item.path)}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-emerald-400 hover:bg-emerald-300 text-black px-6 py-2 rounded-full font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:scale-105"
            >
              Open Dashboard
            </button>
          </div>

          <button className="lg:hidden p-2 bg-white/5 rounded-xl text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE DRAWER --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#030609]/95 backdrop-blur-2xl flex flex-col p-8 pt-24 space-y-4 lg:hidden">
          {[
            { name: 'Home', path: '/' },
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Crop Health', path: '/crop-health' },
            { name: 'Soil Analysis', path: '/soil-analysis' },
            { name: 'IoT Monitoring', path: '/monitoring' },
            { name: 'Market Intel', path: '/market-intel' },
            { name: 'Geo Soil', path: '/geo-soil-analysis' },
          ].map((item) => (
            <button 
              key={item.path}
              onClick={() => { setIsMobileMenuOpen(false); navigate(item.path); }}
              className="text-left text-base font-bold text-gray-300 hover:text-emerald-400 py-3 border-b border-white/5"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      {/* --- HERO SECTION WITH VISUAL ASSET --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 lg:pt-40 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Hero Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Production Multi-Agent Consensus Platform
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight mb-6 text-white">
              Autonomous AI for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Precision Agriculture.
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg max-w-xl mb-8 leading-relaxed font-normal">
              Empowering farmers, agronomists, and agricultural enterprises with multi-agent consensus diagnostics, chemical NPK balancing, and real-time IoT field telemetry.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-105"
              >
                Launch AI Farm Suite
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/crop-health')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-sm text-gray-300 bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all hover:border-emerald-500/30"
              >
                <Leaf className="w-4 h-4 text-emerald-400" />
                Scan Crop Health
              </button>
            </div>

            {/* Enterprise SLA Stats */}
            <div className="grid grid-cols-4 gap-4 mt-12 pt-6 border-t border-white/5">
              {[
                { label: 'Diagnostic SLA', val: '99.2%' },
                { label: 'Swarm Speed', val: '< 14s' },
                { label: 'Water Saved', val: '35%' },
                { label: 'Live IoT Nodes', val: '1,250+' },
              ].map((stat, i) => (
                <div key={i} className="text-left">
                  <div className="text-lg sm:text-xl font-bold text-white">{stat.val}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right - Generated Futuristic Smart Farm Hero Visual */}
          <div className="flex-1 w-full relative">
            <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] group">
              <img 
                src="/images/hero_farm_ai.png" 
                alt="AgriFarm AI Precision Agriculture" 
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030609] via-transparent to-transparent opacity-80" />
              
              {/* High-Visibility Overlay Glassmorphic Live Telemetry Card */}
              <div className="absolute bottom-5 left-5 right-5 bg-[#040910]/95 backdrop-blur-2xl p-5 rounded-2xl border-2 border-emerald-500/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                <div className="flex items-center gap-4">
                  <div className="relative p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Activity className="w-6 h-6 animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        Agra Field Station <span className="text-emerald-400 font-black">#104</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 uppercase animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                        LIVE TELEMETRY
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 font-mono text-xs font-bold text-emerald-300">
                      <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-emerald-400">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400" /> {heroTemp}°C
                      </span>
                      <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-emerald-400">
                        <Droplet className="w-3.5 h-3.5 text-blue-400" /> {heroHum}% Soil Moisture
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black text-xs font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105 uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span>View Stream</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- BRAND PARTNERS & TRUSTED COOPERATIVES LOGO BAR --- */}
      <section className="relative z-10 border-y border-white/5 bg-[#05090e]/60 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
            TRUSTED BY PRECISION AG LEADERS
          </span>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-70">
            {['AgriCorp Global', 'GeoField Labs', 'BioSoil Systems', 'PrecisionAg Networks', 'NovaSwarm Ag'].map((brand, i) => (
              <span key={i} className="text-sm font-black tracking-wider text-gray-400 uppercase font-mono hover:text-emerald-400 transition-colors cursor-default">
                ⚡ {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURE SPOTLIGHT WITH CROP SCAN IMAGE --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-[#080d14] border border-white/5 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-2">AI Vision Diagnostics</span>
            <h2 className="text-3xl font-black text-white mb-4">Spot Leaf Pathogens Before Yield Loss Occurs</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Our Vision Pathologist agent analyzes leaf margins, chlorosis patterns, and fungal pustules with 99.2% accuracy, generating instant organic and chemical recovery schedules.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/crop-health')} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2">
                <Scan className="w-4 h-4" /> Try Leaf Scanner
              </button>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl">
              <img src="/images/crop_scan.png" alt="AI Crop Diagnostic Vision Scanner" className="w-full h-[280px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* --- MULTI-AGENT SWARM ARCHITECTURE --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="bg-[#080d14]/70 border border-white/5 rounded-3xl p-8 backdrop-blur-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-white/5">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">Architecture</span>
              <h2 className="text-2xl font-bold text-white">Round-Table Multi-Agent Swarm Protocol</h2>
            </div>
            <span className="text-xs text-gray-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              4 Agents • Consensus Execution
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: 'Vision Pathologist', task: 'Analyzes leaf symptoms & disease patterns', status: 'Active' },
              { role: 'Soil Chemist', task: 'Validates NPK balances & pH drift targets', status: 'Active' },
              { role: 'Market Analyst', task: 'Tracks regional crop pricing & harvest windows', status: 'Active' },
              { role: 'Master Agronomist', task: 'Synthesizes master treatment action plans', status: 'Active' },
            ].map((agent, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400">{agent.role}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">● {agent.status}</span>
                </div>
                <p className="text-xs text-gray-400">{agent.task}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5 ENTERPRISE AI MODULES --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-end">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">AI Tools</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">5 Specialized Agricultural AI Modules</h2>
          </div>
          <button onClick={() => navigate('/dashboard')} className="mt-4 sm:mt-0 text-emerald-400 text-xs font-bold flex items-center gap-1 hover:text-emerald-300">
            Open Full Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => (
            <div 
              key={mod.id}
              onClick={() => navigate(mod.path)}
              className="group cursor-pointer bg-[#080d14]/80 border border-white/5 hover:border-emerald-500/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                    <mod.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-gray-400 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 font-medium">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  {mod.desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 pt-3 border-t border-white/5">
                <span>Launch AI Tool</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}

          {/* Full Dashboard Launcher Card */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="cursor-pointer bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-[#080d14] border border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] rounded-2xl p-6 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-black flex items-center justify-center font-bold mb-4 shadow-lg shadow-emerald-500/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Full AI Farm Dashboard
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed mb-4">
                Unified telemetry stream, crop cycle projections, yield analytics, and diagnostic alerts.
              </p>
            </div>
            <button className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5">
              Launch Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* --- ENTERPRISE FOOTER --- */}
      <footer className="relative z-10 border-t border-white/5 bg-[#020407] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">AgriFarm AI</span>
            <span>© 2026. Enterprise Precision Agriculture Platform.</span>
          </div>
          <div className="flex items-center gap-6 text-gray-400 text-[11px]">
            <span className="text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              System Operational (99.9% Uptime)
            </span>
            <span onClick={() => navigate('/dashboard')} className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
            <span onClick={() => navigate('/crop-health')} className="hover:text-white cursor-pointer transition-colors">Crop Health</span>
            <span onClick={() => navigate('/soil-analysis')} className="hover:text-white cursor-pointer transition-colors">Soil Analysis</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;