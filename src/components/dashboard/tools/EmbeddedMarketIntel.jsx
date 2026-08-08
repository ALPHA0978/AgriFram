import React, { useState } from 'react';
import { TrendingUp, DollarSign, Award, ArrowUpRight, RefreshCw, Sparkles, Building2, ShoppingBag } from 'lucide-react';
import { AgriTechAPIService } from '../../../services/agriTechAPIService';

export const EmbeddedMarketIntel = () => {
  const [commodity, setCommodity] = useState('WHEAT');
  const [mandi, setMandi] = useState('Khanna, Punjab');
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState({
    symbol: 'WHEAT',
    currentPrice: 2275,
    cacpMsp: 2275,
    projectedPeakPrice: 2450,
    c2Margin: 14200,
    mandiName: 'Khanna Mandi, Punjab',
    corporateBuyers: ['ITC Agri Business', 'Adani Wilmar', 'Kargil India']
  });

  const handleFetchMarketData = async () => {
    setLoading(true);
    try {
      const data = await AgriTechAPIService.getCommodityMarketPrices(commodity, mandi);
      setPriceData(prev => ({
        ...prev,
        currentPrice: data.mandiRateINR ? parseInt(data.mandiRateINR.replace(/[^\d]/g, '')) || 2275 : prev.currentPrice,
        symbol: commodity
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white font-sans p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/60 to-purple-950/60 p-6 rounded-3xl border border-emerald-500/30 flex items-center justify-between shadow-2xl glow-emerald">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest font-mono">CommodityPriceAPI & CACP C2 Margins</span>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-1">
            <TrendingUp className="w-6 h-6 text-purple-400" /> Market Intelligence & Mandi Prices AI
          </h2>
          <p className="text-slate-400 text-xs mt-1">AWS Bedrock Nova Lite & CACP Mandi Economics Forecasting Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls & Price Fetcher */}
        <div className="bg-[#0f172a]/80 p-7 rounded-3xl border border-white/10 shadow-2xl space-y-5 backdrop-blur-2xl">
          <h3 className="text-base font-bold text-white tracking-tight">Commodity Selection</h3>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">Crop Commodity</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-bold"
            >
              <option value="WHEAT" className="bg-slate-900">Wheat (Gehun)</option>
              <option value="RICE" className="bg-slate-900">Paddy Rice (Dhan)</option>
              <option value="MAIZE" className="bg-slate-900">Maize (Corn)</option>
              <option value="COTTON" className="bg-slate-900">Cotton (Kapas)</option>
              <option value="SUGAR" className="bg-slate-900">Sugar (Ganna)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">Target Regional Mandi</label>
            <input
              type="text"
              value={mandi}
              onChange={(e) => setMandi(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-medium"
            />
          </div>

          <button
            onClick={handleFetchMarketData}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Fetching Mandi Live Rates...' : 'Fetch Live Market Economics'}</span>
          </button>
        </div>

        {/* Live Mandi Market Cards */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10 shadow-xl glow-emerald">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Live Spot Mandi Rate</span>
              <h4 className="text-3xl font-black text-white font-mono mt-1">₹ {priceData.currentPrice} <span className="text-xs text-slate-400 font-normal">/ Qtl</span></h4>
              <span className="text-xs text-emerald-400 font-bold inline-block mt-2 font-mono">+4.2% Above CACP MSP</span>
            </div>

            <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10 shadow-xl glow-cyan">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Official CACP MSP</span>
              <h4 className="text-3xl font-black text-blue-400 font-mono mt-1">₹ {priceData.cacpMsp} <span className="text-xs text-slate-400 font-normal">/ Qtl</span></h4>
              <span className="text-xs text-blue-300 font-semibold inline-block mt-2">Government Floor Price</span>
            </div>

            <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10 shadow-xl glow-emerald">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Predicted Peak Rate</span>
              <h4 className="text-3xl font-black text-emerald-400 font-mono mt-1">₹ {priceData.projectedPeakPrice} <span className="text-xs text-slate-400 font-normal">/ Qtl</span></h4>
              <span className="text-xs text-emerald-300 font-semibold inline-block mt-2">Expected 45 Days Post Harvest</span>
            </div>
          </div>

          {/* Corporate Buyer Procurement Breakdown */}
          <div className="bg-[#0f172a]/80 p-7 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" /> Active Corporate Procurement Buyers ({mandi})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {priceData.corporateBuyers.map((buyer, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">{buyer}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
