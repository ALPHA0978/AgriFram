import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, ArrowRight, Cloud, Droplet, Wind, Thermometer, 
  TrendingUp, Cpu, Wrench, Menu, X, ArrowUpRight, 
  ShieldCheck, Activity, BarChart3, Radio
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Home = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  // Handle navbar transparency on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const GlassCard = ({ children, extraClasses = '' }) => (
    <div className={`
      relative overflow-hidden
      bg-gray-900/40 backdrop-blur-xl 
      rounded-[2rem] p-8 
      border border-white/10 
      hover:border-emerald-500/50 
      shadow-2xl transition-all duration-500 
      group ${extraClasses}`}
    >
      {/* Subtle inner glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05080a] text-white font-inter relative selection:bg-emerald-500/30">
      
      {/* --- ADVANCED AGRI-TECH BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated Topographic Grid */}
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: `radial-gradient(#10b981 0.5px, transparent 0.5px)`, 
            backgroundSize: '30px 30px' 
          }}
        />
        
        {/* Dynamic Light Rays */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/5 blur-[100px] rounded-full" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 z-50 w-full px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-black/60 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              AgriFarm<span className="text-emerald-400">AI</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-1.5 py-1 backdrop-blur-md">
            {[
              { name: t('nav.home'), path: '/' },
              { name: t('nav.analysis'), path: '/analysis' },
              { name: t('nav.insights'), path: '/insights' },
              { name: t('nav.ai_analytics'), path: '/ai-analytics' }
            ].map((item) => (
              <button 
                key={item.path}
                onClick={() => navigate(item.path)}
                className="px-5 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <button 
              onClick={() => navigate('/farming-tool')}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95"
            >
              Get Started
            </button>
          </div>

          <button className="md:hidden p-2 bg-white/5 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 lg:pt-48 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Radio className="w-3 h-3 animate-pulse" /> Precision Agriculture 4.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8">
              Harvest the Power of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-200">
                Artificial Intelligence
              </span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Transform your soil data into high-yield strategies. Our AI monitors crop health in real-time to prevent disease before it spreads.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button 
                onClick={() => navigate('/farming-tool')}
                className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl font-bold transition-all"
              >
                Launch AI Farm Tool
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="px-8 py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all"
              >
                See Case Studies
              </button>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/5">
              {[
                { label: 'Prediction Accuracy', val: '99.2%' },
                { label: 'Water Saved', val: '30%' },
                { label: 'Yield Increase', val: '+24%' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white">{stat.val}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual - Live Dashboard Card */}
          <div className="flex-1 w-full relative">
            {/* Decorative Sensor Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-emerald-500/5 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-emerald-500/5 rounded-full pointer-events-none opacity-50" />
            
            <GlassCard extraClasses="relative z-10 !p-0 overflow-hidden">
              <div className="bg-emerald-500/10 p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Field Data</span>
                </div>
                <BarChart3 className="w-4 h-4 text-gray-500" />
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Current Soil Temp</span>
                    <span className="text-5xl font-black text-white">24.5°C</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> Optimal
                    </span>
                    <span className="text-gray-500 text-xs uppercase">Conditions</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Droplet, label: 'Humidity', val: '64%', color: 'text-blue-400' },
                    { icon: Wind, label: 'Wind Speed', val: '12km/h', color: 'text-slate-400' },
                    { icon: Thermometer, label: 'Nitrogen', val: 'Low', color: 'text-amber-400' },
                    { icon: Activity, label: 'Photosynth', val: 'High', color: 'text-emerald-400' },
                  ].map((item, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-4">
                      <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
                      <div className="text-gray-500 text-[10px] uppercase font-bold">{item.label}</div>
                      <div className="text-lg font-bold">{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
            
            {/* Floating Mini-Badge */}
            <div className="absolute -bottom-6 -right-6 bg-amber-500 text-black p-4 rounded-2xl shadow-xl z-20 animate-bounce transition-all duration-1000">
               <ShieldCheck className="w-6 h-6 mb-1" />
               <div className="text-[10px] font-black uppercase leading-none">Pest Alert<br/>Prevented</div>
            </div>
          </div>

        </div>
      </main>

      {/* --- FEATURE SECTION (Professional Grid) --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Leaf, title: 'Crop Diagnosis', desc: 'Scan leaves with AI to detect 50+ diseases instantly.' },
            { icon: BarChart3, title: 'Yield Analytics', desc: 'Historical data meets satellite imagery for precise forecasts.' },
            { icon: Cpu, title: 'Smart Irrigation', desc: 'Automated water management based on real-time soil moisture.' },
            { icon: Wrench, title: 'Farm Management', desc: 'Resource planning and maintenance logs in one cloud dashboard.' },
          ].map((feat, i) => (
            <div key={i} className="group p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feat.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- REFINED FOOTER --- */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
               <Leaf className="w-6 h-6 text-emerald-500" />
               <span className="text-2xl font-bold tracking-tighter">AgriFarmAI</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8">
              Empowering the next generation of farmers with space-grade analytics and artificial intelligence.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Documentation</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">API Reference</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Hardware Setup</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">About Mission</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Sustainability</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Contact Support</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-xs text-gray-600">
          <p>© 2026 AgriFarm AI. All rights reserved.</p>
          <div className="flex gap-6 uppercase tracking-widest font-bold">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;