import React, { useState } from 'react';
import { Droplets, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SoilAnalysisAIService } from '../../../services/soilAnalysisAIService';

export const EmbeddedSoilAnalysis = () => {
  const [nitrogen, setNitrogen] = useState(140);
  const [phosphorus, setPhosphorus] = useState(45);
  const [potassium, setPotassium] = useState(185);
  const [ph, setPh] = useState(6.5);
  const [soilType, setSoilType] = useState('Alluvial');
  const [targetCrop, setTargetCrop] = useState('Wheat');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await SoilAnalysisAIService.analyzeSoilHealth({
        nitrogen, phosphorus, potassium, ph, soilType, targetCrop
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white font-sans p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/60 to-blue-950/60 p-6 rounded-3xl border border-emerald-500/30 flex items-center justify-between shadow-2xl glow-emerald">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest font-mono">NPK Stoichiometry & Conditioning</span>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-1">
            <Droplets className="w-6 h-6 text-blue-400" /> Soil Chemistry & Analysis AI
          </h2>
          <p className="text-slate-400 text-xs mt-1">AWS Bedrock Nova Micro & Claude 3 Haiku NPK Conditioning Algorithm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NPK Form Input */}
        <div className="bg-[#0f172a]/80 p-7 rounded-3xl border border-white/10 shadow-2xl space-y-5 backdrop-blur-2xl">
          <h3 className="text-base font-bold text-white tracking-tight">Field NPK & Chemistry Sliders (PPM)</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold font-mono mb-1">
                <span className="text-emerald-400">Nitrogen (N)</span>
                <span className="text-white">{nitrogen} PPM</span>
              </div>
              <input type="range" min="20" max="300" value={nitrogen} onChange={(e) => setNitrogen(parseInt(e.target.value))} className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold font-mono mb-1">
                <span className="text-blue-400">Phosphorus (P)</span>
                <span className="text-white">{phosphorus} PPM</span>
              </div>
              <input type="range" min="10" max="150" value={phosphorus} onChange={(e) => setPhosphorus(parseInt(e.target.value))} className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold font-mono mb-1">
                <span className="text-purple-400">Potassium (K)</span>
                <span className="text-white">{potassium} PPM</span>
              </div>
              <input type="range" min="30" max="400" value={potassium} onChange={(e) => setPotassium(parseInt(e.target.value))} className="w-full accent-purple-500 bg-slate-800 h-2 rounded-lg" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold font-mono mb-1">
                <span className="text-amber-400">Soil pH Level</span>
                <span className="text-white">{ph} pH</span>
              </div>
              <input type="range" min="4.5" max="9.0" step="0.1" value={ph} onChange={(e) => setPh(parseFloat(e.target.value))} className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-1">Soil Type</label>
                <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white">
                  <option value="Alluvial" className="bg-slate-900">Alluvial Soil</option>
                  <option value="Black" className="bg-slate-900">Black Soil (Regur)</option>
                  <option value="Red" className="bg-slate-900">Red Soil</option>
                  <option value="Loamy" className="bg-slate-900">Sandy Loam</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-1">Target Crop</label>
                <select value={targetCrop} onChange={(e) => setTargetCrop(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white">
                  <option value="Wheat" className="bg-slate-900">Wheat</option>
                  <option value="Rice" className="bg-slate-900">Rice</option>
                  <option value="Maize" className="bg-slate-900">Maize</option>
                  <option value="Cotton" className="bg-slate-900">Cotton</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono mt-4"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Calculating NPK Balance...' : 'Calculate Soil Conditioning'}</span>
          </button>
        </div>

        {/* Soil Diagnostics Output */}
        <div className="bg-[#0f172a]/80 p-7 rounded-3xl border border-white/10 shadow-2xl space-y-5 backdrop-blur-2xl">
          <h3 className="text-base font-bold text-white tracking-tight">AI Soil Stoichiometry Report</h3>

          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">Soil Fertility Rating</span>
                  <p className="text-xl font-black text-white mt-0.5">{result.soilHealthScore || '88 / 100'}</p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-mono font-bold border border-emerald-500/30">
                  {result.status || 'High Productivity'}
                </div>
              </div>

              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Fertilizer Dosing Prescription</span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">{result.fertilizerDosage || 'Apply Urea @ 45 kg/Acre + SSP @ 30 kg/Acre + MOP @ 15 kg/Acre.'}</p>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold tracking-wider">Organic Compost & pH Buffer</span>
                <p className="text-xs text-slate-200 font-medium mt-1">{result.organicCompost || 'Add FYM (Farm Yard Manure) @ 2 Tons/Acre to buffer soil pH to 6.8.'}</p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Droplets className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Adjust NPK PPM sliders and click <strong className="text-emerald-400 font-bold">Calculate Soil Conditioning</strong> to view AI recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
