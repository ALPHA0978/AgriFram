import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import AIAnalytics from './pages/AIAnalytics';
import Analysis from './pages/Analysis';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import FarmingTool from './components/FarmingTool';
import SoilAnalysis from './pages/SoilAnalysis';
import CropHealth from './pages/CropHealth';
import Monitoring from './pages/Monitoring';
import MarketIntel from './pages/MarketIntel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/ai-analytics" element={<AIAnalytics />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/farming-tool" element={<FarmingTool />} />
        <Route path="/soil-analysis" element={<SoilAnalysis />} />
        <Route path="/crop-health" element={<CropHealth />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/market-intel" element={<MarketIntel />} />
      </Routes>
    </Router>
  );
}

export default App;
