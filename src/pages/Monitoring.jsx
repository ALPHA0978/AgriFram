import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Satellite, BarChart3, Droplets, Thermometer, AlertTriangle, CheckCircle, Target, TrendingUp, Loader } from 'lucide-react';
import { FarmerAI } from '../services/huggingFaceService';

const Monitoring = () => {
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState({
    soilMoisture: '',
    airTemperature: '',
    humidity: '',
    lightIntensity: '',
    rainfall: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [monitoringResults, setMonitoringResults] = useState(null);

  const analyzeMonitoringData = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await FarmerAI.optimizeIrrigation(sensorData);
      console.log('Monitoring analysis result:', analysis);
      setMonitoringResults(analysis);
    } catch (error) {
      console.error('Monitoring analysis error:', error);
      setMonitoringResults({
        error: 'AI monitoring analysis failed. Please check your data and try again.',
        overallStatus: 'Unknown'
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
            <span className="text-green-400">AgriFarm</span>AI
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
            IOT <br /> MONITORING
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Real-time sensor data analysis for smart irrigation and farm optimization.
          </p>
        </div>

        <div className="space-y-8">
          {/* Sensor Input Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <Satellite className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">IoT Sensor Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Droplets className="w-4 h-4 inline mr-1" />
                  Soil Moisture (%)
                </label>
                <input
                  type="text"
                  value={sensorData.soilMoisture}
                  onChange={(e) => setSensorData(prev => ({...prev, soilMoisture: e.target.value}))}
                  placeholder="35"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Thermometer className="w-4 h-4 inline mr-1" />
                  Air Temperature (°C)
                </label>
                <input
                  type="text"
                  value={sensorData.airTemperature}
                  onChange={(e) => setSensorData(prev => ({...prev, airTemperature: e.target.value}))}
                  placeholder="28"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Humidity (%)</label>
                <input
                  type="text"
                  value={sensorData.humidity}
                  onChange={(e) => setSensorData(prev => ({...prev, humidity: e.target.value}))}
                  placeholder="65"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Light Intensity (lux)</label>
                <input
                  type="text"
                  value={sensorData.lightIntensity}
                  onChange={(e) => setSensorData(prev => ({...prev, lightIntensity: e.target.value}))}
                  placeholder="45000"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Recent Rainfall (mm)</label>
                <input
                  type="text"
                  value={sensorData.rainfall}
                  onChange={(e) => setSensorData(prev => ({...prev, rainfall: e.target.value}))}
                  placeholder="12"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
            </div>
            <button
              onClick={analyzeMonitoringData}
              disabled={!sensorData.soilMoisture || isAnalyzing}
              className="w-full mt-8 flex items-center justify-center space-x-2 bg-green-400 text-black py-4 rounded-lg hover:bg-green-300 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing Data...</span>
                </>
              ) : (
                <>
                  <Satellite className="w-5 h-5" />
                  <span>Analyze Monitoring</span>
                </>
              )}
            </button>
          </div>

          {/* Monitoring Results Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">AI Monitoring Insights</h3>
            {isAnalyzing && (
              <div className="text-center py-16">
                <Loader className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-green-400 font-medium">Processing sensor data...</p>
              </div>
            )}
            {monitoringResults && !isAnalyzing && (
              <div className="space-y-8">
                {monitoringResults.error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{monitoringResults.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Overall Status */}
                    <div className="text-center p-6 bg-gray-800/50 border border-green-400/30 rounded-[20px] hover:border-green-400/50 transition-all duration-300">
                      <div className={`text-4xl font-bold mb-2 ${
                        monitoringResults.overallStatus === 'Optimal' ? 'text-green-400' :
                        monitoringResults.overallStatus === 'Good' ? 'text-green-300' :
                        monitoringResults.overallStatus === 'Warning' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {monitoringResults.overallStatus || 'Optimal'}
                      </div>
                      <div className="text-gray-300 font-medium">Overall Farm Status</div>
                    </div>

                    {/* Sensor Analysis Grid */}
                    {monitoringResults.sensorAnalysis && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Satellite className="w-5 h-5 mr-2 text-blue-400" />
                          Sensor Analysis
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {Object.entries(monitoringResults.sensorAnalysis || {
                            soilMoisture: { status: 'Optimal', recommendation: 'Moisture levels are perfect' },
                            temperature: { status: 'Good', recommendation: 'Temperature within range' },
                            humidity: { status: 'Optimal', recommendation: 'Humidity levels ideal' },
                            lightIntensity: { status: 'Good', recommendation: 'Light exposure adequate' }
                          }).map(([sensor, data]) => (
                            <div key={sensor} className={`p-6 bg-gray-800/50 border rounded-[20px] hover:border-opacity-50 transition-all duration-300 ${
                              data.status === 'Optimal' ? 'border-green-400/30 hover:border-green-400/50' :
                              data.status === 'Good' ? 'border-blue-400/30 hover:border-blue-400/50' :
                              data.status === 'Low' ? 'border-yellow-400/30 hover:border-yellow-400/50' : 'border-red-400/30 hover:border-red-400/50'
                            }`}>
                              <div className="font-medium capitalize text-white mb-2">{sensor.replace(/([A-Z])/g, ' $1').trim()}</div>
                              <div className={`text-2xl font-bold mb-2 ${
                                data.status === 'Optimal' ? 'text-green-400' :
                                data.status === 'Good' ? 'text-blue-400' :
                                data.status === 'Low' ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {data.status}
                              </div>
                              <div className="text-sm text-gray-300">{data.recommendation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Alerts Section */}
                    {monitoringResults.alerts && monitoringResults.alerts.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                          Active Alerts
                        </h4>
                        <div className="space-y-4">
                          {monitoringResults.alerts.map((alert, index) => (
                            <div key={index} className={`p-6 rounded-xl border hover:border-opacity-50 transition-all duration-300 bg-gray-800/50 ${
                              alert.severity === 'Critical' ? 'border-red-400/30' :
                              alert.severity === 'High' ? 'border-orange-400/30' :
                              alert.severity === 'Medium' ? 'border-yellow-400/30' : 'border-blue-400/30'
                            }`}>
                              <div className="flex justify-between mb-3">
                                <h5 className={`font-bold text-lg ${
                                  alert.severity === 'Critical' ? 'text-red-400' :
                                  alert.severity === 'High' ? 'text-orange-400' :
                                  alert.severity === 'Medium' ? 'text-yellow-400' : 'text-blue-400'
                                }`}>
                                  {alert.type}
                                </h5>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  alert.severity === 'Critical' ? 'bg-red-400/20 text-red-400' :
                                  alert.severity === 'High' ? 'bg-orange-400/20 text-orange-400' :
                                  alert.severity === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-blue-400/20 text-blue-400'
                                }`}>
                                  {alert.severity}
                                </span>
                              </div>
                              <p className="text-sm mb-3 text-gray-300">
                                {alert.message}
                              </p>
                              <div className="p-3 rounded text-sm font-medium bg-gray-700/50 text-white">
                                Action: {alert.action}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations Grid */}
                    {monitoringResults.recommendations && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                          AI Recommendations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(monitoringResults.recommendations).map(([key, value]) => (
                            <div key={key} className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300">
                              <h5 className="font-medium text-green-400 mb-3 capitalize flex items-center">
                                {key === 'irrigation' && <Droplets className="w-4 h-4 mr-1" />}
                                {key === 'climate' && <Thermometer className="w-4 h-4 mr-1" />}
                                {key === 'timing' && <Target className="w-4 h-4 mr-1" />}
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h5>
                              <p className="text-gray-300">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Predictions Grid */}
                    {monitoringResults.predictions && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                          AI Predictions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(monitoringResults.predictions).map(([key, value]) => (
                            <div key={key} className="p-6 bg-gray-800/50 rounded-xl border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300">
                              <h5 className="font-medium text-purple-400 mb-3 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h5>
                              <p className="text-gray-300">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Plan */}
                    {monitoringResults.actionPlan && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-green-400" />
                          Action Plan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {monitoringResults.actionPlan.immediate && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-red-400/30">
                              <h5 className="font-medium text-red-400 mb-3">Immediate</h5>
                              <ul className="space-y-2 text-gray-300">
                                {monitoringResults.actionPlan.immediate.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {monitoringResults.actionPlan.today && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-orange-400/30">
                              <h5 className="font-medium text-orange-400 mb-3">Today</h5>
                              <ul className="space-y-2 text-gray-300">
                                {monitoringResults.actionPlan.today.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {monitoringResults.actionPlan.thisWeek && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-blue-400/30">
                              <h5 className="font-medium text-blue-400 mb-3">This Week</h5>
                              <ul className="space-y-2 text-gray-300">
                                {monitoringResults.actionPlan.thisWeek.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Optimization */}
                    {monitoringResults.optimization && (
                      <div className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30">
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                          Optimization Opportunities
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(monitoringResults.optimization).map(([key, value]) => (
                            <div key={key}>
                              <h5 className="font-medium text-green-400 mb-2 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h5>
                              {Array.isArray(value) ? (
                                <ul className="list-disc ml-5 text-gray-300">
                                  {value.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-300">{value}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {!monitoringResults && !isAnalyzing && (
              <div className="text-center py-16 text-green-600">
                <Satellite className="w-16 h-16 mx-auto mb-4 opacity-70" />
                <p className="font-medium text-gray-300">Enter sensor data to monitor</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;