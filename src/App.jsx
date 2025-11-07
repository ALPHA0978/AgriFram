import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import AIAnalytics from './pages/AIAnalytics';
import Analysis from './pages/Analysis';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import Login from './pages/Login';
import FarmingTool from './components/FarmingTool';
import SoilAnalysis from './pages/SoilAnalysis';
import CropHealth from './pages/CropHealth';
import Monitoring from './pages/Monitoring';
import MarketIntel from './pages/MarketIntel';
import MedicalDashboard from './pages/MedicalDashboard';
import MedicalDiagnosis from './pages/MedicalDiagnosis';
import MedicalVitals from './pages/MedicalVitals';
import MedicalPredictor from './pages/MedicalPredictor';
import MedicalAnalytics from './pages/MedicalAnalytics';
import ProtectedRoute from './components/ProtectedRoute';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <div className="fixed top-3 right-3 z-[9999]">
            <LanguageSwitcher />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-analytics" element={<AIAnalytics />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/farming-tool" element={<FarmingTool />} />
            <Route path="/soil-analysis" element={<SoilAnalysis />} />
            <Route path="/crop-health" element={<CropHealth />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/market-intel" element={<MarketIntel />} />
            <Route path="/medical-dashboard" element={<ProtectedRoute><MedicalDashboard /></ProtectedRoute>} />
            <Route path="/medical-diagnosis" element={<ProtectedRoute><MedicalDiagnosis /></ProtectedRoute>} />
            <Route path="/medical-vitals" element={<ProtectedRoute><MedicalVitals /></ProtectedRoute>} />
            <Route path="/medical-predictor" element={<ProtectedRoute><MedicalPredictor /></ProtectedRoute>} />
            <Route path="/medical-analytics" element={<ProtectedRoute><MedicalAnalytics /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
