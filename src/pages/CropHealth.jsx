import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, BarChart3, Bug, Beaker, Zap, Target, CheckCircle, DollarSign, Loader, AlertTriangle, X } from 'lucide-react';
import { FarmerAI } from '../services/huggingFaceService';
import CustomDropdown from '../components/CustomDropdown';

const CropHealth = () => {
  const navigate = useNavigate();
  const [cropData, setCropData] = useState({
    cropType: '',
    plantingDate: '',
    fieldSize: '',
    symptoms: '',
    location: '',
    weatherConditions: '',
    variety: '',
    growthStage: '',
    irrigationMethod: '',
    fertilizer: '',
    pesticide: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cropAnalysis, setCropAnalysis] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const analyzeCropWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await FarmerAI.analyzeCrop(cropData);
      setCropAnalysis(analysis);
    } catch (error) {
      console.error('Crop analysis error:', error);
      setCropAnalysis({
        error: 'AI crop analysis failed. Please check your data and try again.',
        cropHealth: 'Unknown'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      setCameraOpen(true);
      
      // Wait for next tick to ensure modal is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    } catch (error) {
      console.error('Camera access error:', error);
      // Try with user camera if environment camera fails
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        setCameraOpen(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
          }
        }, 100);
      } catch (fallbackError) {
        console.error('Fallback camera error:', fallbackError);
        alert('Camera access denied or not available. Please check permissions.');
      }
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraOpen(false);
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    try {
      const imageAnalysis = {
        ...cropData,
        imageData: capturedImage,
        analysisType: 'visual'
      };
      const analysis = await FarmerAI.analyzeCrop(imageAnalysis);
      setCropAnalysis(analysis);
    } catch (error) {
      console.error('Image analysis error:', error);
      setCropAnalysis({
        error: 'AI image analysis failed. Please try again.',
        cropHealth: 'Unknown'
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
            CROP <br /> HEALTH
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            AI-powered crop disease detection and health monitoring system.
          </p>
        </div>

        <div className="space-y-8">
          {/* Crop Input Card */}
          <div className={`bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm transition-all duration-300 ${dropdownOpen ? 'pb-32' : ''}`}>
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <Camera className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">Crop Health Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Crop Type</label>
                <input
                  type="text"
                  value={cropData.cropType}
                  onChange={(e) => setCropData(prev => ({...prev, cropType: e.target.value}))}
                  placeholder="e.g., Wheat, Rice, Tomato"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Crop Variety</label>
                <input
                  type="text"
                  value={cropData.variety || ''}
                  onChange={(e) => setCropData(prev => ({...prev, variety: e.target.value}))}
                  placeholder="e.g., Basmati, IR64, Cherry"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Planting Date</label>
                <input
                  type="date"
                  value={cropData.plantingDate}
                  onChange={(e) => setCropData(prev => ({...prev, plantingDate: e.target.value}))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Growth Stage</label>
                <CustomDropdown
                  value={cropData.growthStage || ''}
                  onChange={(value) => setCropData(prev => ({...prev, growthStage: value}))}
                  placeholder="Select Stage"
                  onToggle={setDropdownOpen}
                  options={[
                    { value: 'Seedling', label: 'Seedling' },
                    { value: 'Vegetative', label: 'Vegetative' },
                    { value: 'Flowering', label: 'Flowering' },
                    { value: 'Fruiting', label: 'Fruiting' },
                    { value: 'Maturity', label: 'Maturity' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Field Size (acres)</label>
                <input
                  type="text"
                  value={cropData.fieldSize}
                  onChange={(e) => setCropData(prev => ({...prev, fieldSize: e.target.value}))}
                  placeholder="5"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Irrigation Method</label>
                <CustomDropdown
                  value={cropData.irrigationMethod || ''}
                  onChange={(value) => setCropData(prev => ({...prev, irrigationMethod: value}))}
                  placeholder="Select Method"
                  onToggle={setDropdownOpen}
                  options={[
                    { value: 'Drip', label: 'Drip Irrigation' },
                    { value: 'Sprinkler', label: 'Sprinkler' },
                    { value: 'Flood', label: 'Flood Irrigation' },
                    { value: 'Rainfed', label: 'Rainfed' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fertilizer Used</label>
                <input
                  type="text"
                  value={cropData.fertilizer || ''}
                  onChange={(e) => setCropData(prev => ({...prev, fertilizer: e.target.value}))}
                  placeholder="e.g., NPK 10:26:26, Urea"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pesticide Applied</label>
                <input
                  type="text"
                  value={cropData.pesticide || ''}
                  onChange={(e) => setCropData(prev => ({...prev, pesticide: e.target.value}))}
                  placeholder="e.g., Neem oil, Chlorpyrifos"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={cropData.location}
                  onChange={(e) => setCropData(prev => ({...prev, location: e.target.value}))}
                  placeholder="City, State"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">Observed Symptoms</label>
                <textarea
                  value={cropData.symptoms}
                  onChange={(e) => setCropData(prev => ({...prev, symptoms: e.target.value}))}
                  placeholder="Describe symptoms..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">Weather Conditions</label>
                <input
                  type="text"
                  value={cropData.weatherConditions}
                  onChange={(e) => setCropData(prev => ({...prev, weatherConditions: e.target.value}))}
                  placeholder="Rainfall, temperature..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <button
                onClick={startCamera}
                disabled={isAnalyzing}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 font-semibold"
              >
                <Camera className="w-5 h-5" />
                <span>Camera Scan</span>
              </button>
              <button
                onClick={analyzeCropWithAI}
                disabled={!cropData.cropType || isAnalyzing}
                className="flex items-center justify-center space-x-2 bg-green-400 text-black py-4 rounded-lg hover:bg-green-300 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5" />
                    <span>Analyze Data</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Crop Results Card */}
          <div className="bg-gray-900/50 rounded-[40px] p-8 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
            <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">AI Crop Diagnosis</h3>
            {isAnalyzing && (
              <div className="text-center py-16">
                <Loader className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-green-400 font-medium">Processing crop data...</p>
              </div>
            )}
            {cropAnalysis && !isAnalyzing && (
              <div className="space-y-8">
                {cropAnalysis.error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{cropAnalysis.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Overview Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-gray-800/50 border border-red-400/30 rounded-[20px] text-center hover:border-red-400/50 transition-all duration-300">
                        <div className={`text-3xl font-bold mb-2 ${
                          cropAnalysis.cropHealth === 'Excellent' ? 'text-green-400' :
                          cropAnalysis.cropHealth === 'Good' ? 'text-green-300' :
                          cropAnalysis.cropHealth === 'Fair' ? 'text-yellow-400' :
                          cropAnalysis.cropHealth === 'Poor' ? 'text-red-400' : 'text-red-500'
                        }`}>
                          {cropAnalysis.cropHealth || 'Good'}
                        </div>
                        <div className="text-gray-300 font-medium">Crop Status</div>
                      </div>
                      <div className="p-6 bg-gray-800/50 border border-blue-400/30 rounded-[20px] text-center hover:border-blue-400/50 transition-all duration-300">
                        <div className="text-3xl font-bold text-blue-400 mb-2">
                          {cropAnalysis.healthScore || 85}%
                        </div>
                        <div className="text-gray-300 font-medium">Health Score</div>
                      </div>
                      <div className="p-6 bg-gray-800/50 border border-purple-400/30 rounded-[20px] text-center hover:border-purple-400/50 transition-all duration-300">
                        <div className="text-3xl font-bold text-purple-400 mb-2">
                          {cropAnalysis.growthStage || 'Vegetative'}
                        </div>
                        <div className="text-gray-300 font-medium">Growth Stage</div>
                      </div>
                    </div>

                    {/* Yield Prediction */}
                    {cropAnalysis.yieldPrediction && (
                      <div className="p-6 bg-gray-800/50 rounded-xl border border-blue-400/30">
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                          Yield Prediction
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <span className="text-gray-300">Expected Yield:</span>
                            <div className="font-bold text-blue-400">{cropAnalysis.yieldPrediction.expected}</div>
                          </div>
                          <div>
                            <span className="text-gray-300">Quality:</span>
                            <div className="font-bold text-blue-400">{cropAnalysis.yieldPrediction.quality}</div>
                          </div>
                          <div>
                            <span className="text-gray-300">Factors:</span>
                            <div className="text-gray-300">{cropAnalysis.yieldPrediction.factors?.join(', ')}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Diseases Section */}
                    {cropAnalysis.diseases && cropAnalysis.diseases.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Bug className="w-5 h-5 mr-2 text-red-400" />
                          Detected Diseases
                        </h4>
                        <div className="space-y-4">
                          {cropAnalysis.diseases.map((disease, index) => (
                            <div key={index} className="p-6 bg-gray-800/50 rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-300">
                              <div className="flex justify-between mb-4">
                                <h5 className="text-lg font-bold text-red-400">{disease.name}</h5>
                                <div className="space-x-2">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    disease.severity === 'Critical' ? 'bg-red-200 text-red-800' :
                                    disease.severity === 'High' ? 'bg-orange-200 text-orange-800' :
                                    disease.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                                  }`}>
                                    {disease.severity}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    disease.urgency === 'Immediate' ? 'bg-red-200 text-red-800' :
                                    disease.urgency === 'Within week' ? 'bg-orange-200 text-orange-800' : 'bg-blue-200 text-blue-800'
                                  }`}>
                                    {disease.urgency}
                                  </span>
                                </div>
                              </div>
                              {disease.symptoms && (
                                <div className="mb-3">
                                  <span className="font-medium text-red-400">Symptoms:</span>
                                  <ul className="list-disc ml-5 text-gray-300">
                                    {disease.symptoms.map((symptom, idx) => (
                                      <li key={idx}>{symptom}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div className="mb-3">
                                <span className="font-medium text-red-400">Treatment:</span>
                                <p className="text-gray-300">{disease.treatment}</p>
                              </div>
                              <div className="text-gray-300">
                                <span className="font-medium text-red-400">Cost:</span> {disease.cost}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nutrition Deficiency */}
                    {cropAnalysis.nutritionDeficiency && cropAnalysis.nutritionDeficiency.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Beaker className="w-5 h-5 mr-2 text-orange-400" />
                          Nutrition Deficiencies
                        </h4>
                        <div className="space-y-4">
                          {cropAnalysis.nutritionDeficiency.map((deficiency, index) => (
                            <div key={index} className="p-6 bg-gray-800/50 rounded-xl border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300">
                              <h5 className="font-bold text-orange-400 mb-3">{deficiency.nutrient} Deficiency</h5>
                              <div className="mb-3">
                                <span className="font-medium text-orange-400">Symptoms:</span>
                                <ul className="list-disc ml-5 text-gray-300">
                                  {deficiency.symptoms?.map((symptom, idx) => (
                                    <li key={idx}>{symptom}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="font-medium text-orange-400">Solution:</span>
                                  <p className="text-gray-300">{deficiency.solution}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-orange-400">Dosage:</span>
                                  <p className="text-gray-300">{deficiency.dosage}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fertilizer Recommendations */}
                    {cropAnalysis.fertilizers && cropAnalysis.fertilizers.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-green-400" />
                          Fertilizer Recommendations
                        </h4>
                        <div className="space-y-4">
                          {cropAnalysis.fertilizers.map((fertilizer, index) => (
                            <div key={index} className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300">
                              <div className="flex justify-between mb-3">
                                <h5 className="font-bold text-green-400">{fertilizer.name}</h5>
                                <span className="text-sm bg-green-400/20 text-green-400 px-3 py-1 rounded-full">
                                  {fertilizer.purpose}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-300">Quantity:</span>
                                  <div className="font-medium text-green-400">{fertilizer.quantity}</div>
                                </div>
                                <div>
                                  <span className="text-gray-300">Timing:</span>
                                  <div className="font-medium text-green-400">{fertilizer.timing}</div>
                                </div>
                                <div>
                                  <span className="text-gray-300">Cost:</span>
                                  <div className="font-medium text-green-400">{fertilizer.cost}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Plan */}
                    {cropAnalysis.recommendations && (
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-blue-400" />
                          Action Plan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {cropAnalysis.recommendations.immediate && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-red-400/30">
                              <h5 className="font-medium text-red-400 mb-3">Immediate Actions</h5>
                              <ul className="space-y-2 text-gray-300">
                                {cropAnalysis.recommendations.immediate.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {cropAnalysis.recommendations.weekly && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-yellow-400/30">
                              <h5 className="font-medium text-yellow-400 mb-3">Weekly Actions</h5>
                              <ul className="space-y-2 text-gray-300">
                                {cropAnalysis.recommendations.weekly.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {cropAnalysis.recommendations.monthly && (
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-blue-400/30">
                              <h5 className="font-medium text-blue-400 mb-3">Monthly Actions</h5>
                              <ul className="space-y-2 text-gray-300">
                                {cropAnalysis.recommendations.monthly.map((action, index) => (
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

                    {/* Cost Analysis */}
                    {cropAnalysis.costAnalysis && (
                      <div className="p-6 bg-gray-800/50 rounded-xl border border-green-400/30">
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                          Cost-Benefit Analysis
                        </h4>
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <div className="text-2xl font-bold text-red-400">{cropAnalysis.costAnalysis.totalCare}</div>
                            <div className="text-gray-300">Total Care Cost</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-400">{cropAnalysis.costAnalysis.expectedRevenue}</div>
                            <div className="text-gray-300">Expected Revenue</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-400">{cropAnalysis.costAnalysis.profitMargin}</div>
                            <div className="text-gray-300">Profit Margin</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {!cropAnalysis && !isAnalyzing && (
              <div className="text-center py-16 text-green-600">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-70" />
                <p className="font-medium text-gray-300">Enter crop details to diagnose</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-4">
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-gray-900 rounded-2xl p-6 border border-green-400/30">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Plant Disease Scanner</h3>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover rounded-lg bg-gray-800"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.play().catch(console.error);
                    }
                  }}
                />
                <div className="absolute inset-0 border-2 border-green-400/50 rounded-lg pointer-events-none">
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-green-400"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-green-400"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-green-400"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-green-400"></div>
                </div>
              </div>
              <button
                onClick={capturePhoto}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Capture Plant Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Captured Image Modal */}
      {capturedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-4">
            <button
              onClick={() => setCapturedImage(null)}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-gray-900 rounded-2xl p-6 border border-green-400/30">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Captured Plant Image</h3>
              <img
                src={capturedImage}
                alt="Captured plant"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => setCapturedImage(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Retake
                </button>
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors disabled:bg-gray-600 flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CropHealth;