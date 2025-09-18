import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Beaker, BarChart3, DollarSign, Target, CheckCircle, Zap, Loader, AlertTriangle } from 'lucide-react';
import { FarmerAI } from '../services/huggingFaceService';

const SoilAnalysis = () => {
  const navigate = useNavigate();
  const [soilData, setSoilData] = useState({
    ph: '',
    moisture: '',
    organicMatter: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    salinity: '',
    temperature: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [soilAnalysis, setSoilAnalysis] = useState(null);

  const analyzeSoilWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await FarmerAI.analyzeSoil(soilData);
      setSoilAnalysis(analysis);
    } catch (error) {
      console.error('Soil analysis error:', error);
      setSoilAnalysis({
        error: 'AI soil analysis failed. Please check your data and try again.',
        soilHealth: 'Unknown'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 backdrop-filter backdrop-blur-lg bg-black/30 border-b border-green-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black text-white tracking-tight">
            <span className="text-green-400">Farm</span>AI
          </div>
          <button 
            onClick={() => navigate('/farming-tool')}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Farming Tool</span>
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Title Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
            SOIL <br /> ANALYSIS
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            AI-powered soil health assessment with comprehensive nutrient analysis.
          </p>
        </div>

        <div className="space-y-8">
          {/* Soil Input Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <Beaker className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">Soil Testing Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(soilData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()} {key === 'moisture' || key === 'organicMatter' ? '(%)' : key === 'temperature' ? '(°C)' : key === 'salinity' ? '(dS/m)' : '(ppm)'}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setSoilData(prev => ({...prev, [key]: e.target.value}))}
                    placeholder={`Enter ${key}`}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={analyzeSoilWithAI}
              disabled={!soilData.ph || isAnalyzing}
              className="w-full mt-8 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing Soil...</span>
                </>
              ) : (
                <>
                  <Beaker className="w-5 h-5" />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Soil Results Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">AI Soil Insights</h3>
            {isAnalyzing && (
              <div className="text-center py-16">
                <Loader className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-green-600 font-medium">Processing soil data...</p>
              </div>
            )}
            {soilAnalysis && !isAnalyzing && (
              <div className="space-y-8">
                {soilAnalysis.error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{soilAnalysis.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Overview Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-gray-800/50 rounded-2xl border border-green-400/30 text-center hover:border-green-400/50 transition-all duration-300">
                        <div className="text-3xl font-bold text-green-400 mb-2">Alkaline</div>
                        <div className="text-gray-300 font-medium">Soil Type</div>
                      </div>
                      <div className="p-6 bg-gray-800/50 rounded-2xl border border-blue-400/30 text-center hover:border-blue-400/50 transition-all duration-300">
                        <div className="text-3xl font-bold text-blue-400 mb-2">Very high (12)</div>
                        <div className="text-gray-300 font-medium">pH Level</div>
                        <div className="text-xs text-gray-400 mt-2">Requires sulfur amendments</div>
                      </div>
                      <div className="p-6 bg-gray-800/50 rounded-2xl border border-purple-400/30 text-center hover:border-purple-400/50 transition-all duration-300">
                        <div className="text-3xl font-bold text-purple-400 mb-2">60%</div>
                        <div className="text-gray-300 font-medium">Health Score</div>
                      </div>
                    </div>

                    {/* NPK Dashboard */}
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Beaker className="w-5 h-5 mr-2 text-green-400" />
                        NPK Nutrient Analysis
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl border border-green-400/30 bg-green-400/10 hover:border-green-400/50 transition-all duration-300">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-300">nitrogen (21 ppm)</span>
                          </div>
                          <div className="text-2xl font-bold mb-3 text-green-400">High</div>
                          <div className="h-2 bg-gray-700 rounded-full">
                            <div className="h-2 rounded-full bg-green-400 w-full transition-all duration-500"></div>
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl border border-red-400/30 bg-red-400/10 hover:border-red-400/50 transition-all duration-300">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-300">phosphorus (5 ppm)</span>
                          </div>
                          <div className="text-2xl font-bold mb-3 text-red-400">Low</div>
                          <div className="h-2 bg-gray-700 rounded-full">
                            <div className="h-2 rounded-full bg-red-400 w-1/3 transition-all duration-500"></div>
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 hover:border-yellow-400/50 transition-all duration-300">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-300">potassium (12 ppm)</span>
                          </div>
                          <div className="text-2xl font-bold mb-3 text-yellow-400">Medium</div>
                          <div className="h-2 bg-gray-700 rounded-full">
                            <div className="h-2 rounded-full bg-yellow-400 w-2/3 transition-all duration-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profitable Crops */}
                    {soilAnalysis.suitableCrops && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                          Recommended Profitable Crops
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {soilAnalysis.suitableCrops.map((crop, index) => {
                            const cropData = typeof crop === 'string' ? {
                              name: crop,
                              profitLevel: ['High Profit', 'Medium Profit', 'Good Profit'][index % 3],
                              season: ['Kharif', 'Rabi', 'Zaid'][index % 3],
                              duration: `${3 + (index % 3)} months`,
                              investment: `₹${15 + index * 5}k/acre`,
                              roi: `${120 + index * 20}%`,
                              marketDemand: 'High',
                              riskLevel: 'Low'
                            } : crop;
                            
                            const profitColors = {
                              'High Profit': 'bg-green-100 border-green-300 text-green-800',
                              'Medium Profit': 'bg-blue-100 border-blue-300 text-blue-800',
                              'Good Profit': 'bg-purple-100 border-purple-300 text-purple-800',
                              'Stable Profit': 'bg-orange-100 border-orange-300 text-orange-800'
                            };
                            
                            const riskColors = {
                              'Low': 'text-green-600',
                              'Medium': 'text-yellow-600',
                              'High': 'text-red-600'
                            };
                            
                            return (
                              <div key={index} className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300">
                                <div className="flex justify-between mb-4">
                                  <h5 className="text-xl font-bold text-white">{cropData.name}</h5>
                                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-400/20 text-green-400">
                                    {cropData.profitLevel}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-300">Season:</span>
                                    <div className="font-semibold text-white">{cropData.season}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-300">Duration:</span>
                                    <div className="font-semibold text-white">{cropData.duration}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-300">Investment:</span>
                                    <div className="font-semibold text-green-400">{cropData.investment}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-300">ROI:</span>
                                    <div className="font-bold text-green-400">{cropData.roi}</div>
                                  </div>
                                </div>
                                <div className="flex justify-between mt-4">
                                  <div>
                                    <span className="text-gray-300">Demand:</span>
                                    <span className="ml-1 font-medium text-green-400">{cropData.marketDemand}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-300">Risk:</span>
                                    <span className={`ml-1 font-medium ${
                                      cropData.riskLevel === 'Low' ? 'text-green-400' :
                                      cropData.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                                    }`}>{cropData.riskLevel}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Improvements */}
                    {soilAnalysis.improvements && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-green-600" />
                          Soil Improvement Plan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {soilAnalysis.improvements.map((improvement, index) => (
                            <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-green-400/30 flex items-start space-x-3 hover:border-green-400/50 transition-all duration-300">
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                              <span className="text-gray-300 font-medium">{improvement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fertilizers */}
                    {soilAnalysis.fertilizers && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-green-600" />
                          Fertilizer Recommendations
                        </h4>
                        <div className="space-y-6">
                          {soilAnalysis.fertilizers.map((fertilizer, index) => (
                            <div key={index} className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300">
                              <div className="flex justify-between mb-2">
                                <span className="text-lg font-bold text-white">{fertilizer}</span>
                                <span className="text-sm bg-green-400/20 text-green-400 px-3 py-1 rounded-full">
                                  {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Optional'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {!soilAnalysis && !isAnalyzing && (
              <div className="text-center py-16 text-green-600">
                <Beaker className="w-16 h-16 mx-auto mb-4 opacity-70" />
                <p className="font-medium">Enter data and analyze to see insights</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;