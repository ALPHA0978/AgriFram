import { Leaf, Users, Target, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter overflow-hidden relative">

      {/* Background Gradient & Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-[30%] right-[-30%] w-[60%] h-[60%] bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 backdrop-filter backdrop-blur-lg bg-black/30 border-b border-green-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black text-white tracking-tight">
            <span className="text-green-400">Farm</span>AI 
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-5 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
          
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
              ABOUT <br /> FARMAI
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
              Revolutionizing agriculture through **AI-powered insights** and sustainable farming solutions. Our mission is to empower farmers worldwide.
            </p>
          </div>

          <div className="relative w-full md:w-1/2 flex justify-center md:justify-end">
            <div 
              className="w-full h-80 md:w-[450px] md:h-[450px] relative rounded-[50px] overflow-hidden shadow-2xl shadow-green-500/20"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                background: `url('https://images.unsplash.com/photo-1579601626017-d249f3e6918d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: 'rotate(-5deg)'
              }}
            >
              {/* Image is placed using background property for unique shape */}
            </div>
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <span className="text-8xl md:text-9xl text-green-400 opacity-10 animate-pulse-slow">🌿</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <Card 
            icon={<Target className="w-8 h-8 text-green-400" />} 
            title="Our Mission" 
            text="To empower farmers with AI-driven insights that increase productivity, reduce waste, and promote sustainable agriculture practices." 
          />
          <Card 
            icon={<Users className="w-8 h-8 text-green-400" />} 
            title="Our Team" 
            text="A diverse group of agricultural experts, AI researchers, and sustainability advocates working together for a better future." 
          />
          <Card 
            icon={<Shield className="w-8 h-8 text-green-400" />} 
            title="Our Values" 
            text="Innovation, sustainability, and farmer empowerment drive everything we do. We believe in technology that serves humanity." 
          />
        </div>

        {/* Impact & Tech Section */}
        <div className="bg-gray-900/50 rounded-[40px] p-8 md:p-12 border border-green-400/30 shadow-2xl shadow-green-500/10 backdrop-filter backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500">
            Contributing to SDG 2: Zero Hunger
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
                Our Impact 
              </h3>
              <ul className="space-y-4 text-gray-300">
                <ListItem text="Increasing crop yields by up to 85%" />
                <ListItem text="Reducing water usage through smart irrigation" />
                <ListItem text="Minimizing pesticide use with AI disease detection" />
                <ListItem text="Supporting 10,000+ farmers globally" />
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
                Technology Stack 
              </h3>
              <ul className="space-y-4 text-gray-300">
                <ListItem text="Machine Learning for crop analysis" />
                <ListItem text="IoT sensors for real-time monitoring" />
                <ListItem text="Satellite imagery for field mapping" />
                <ListItem text="Mobile-first design for accessibility" />
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer or Bottom Section */}
      <footer className="relative z-10 py-8 text-center text-gray-500 text-sm">
        <p>© 2024 FarmAI. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

const Card = ({ icon, title, text }) => (
  <div className="bg-gray-900/50 rounded-[40px] p-8 border border-gray-800/50 transition-all duration-500 transform hover:scale-105 hover:border-green-400/50 shadow-lg hover:shadow-green-500/20 backdrop-filter backdrop-blur-sm">
    <div className="bg-green-400/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 shadow-md shadow-green-500/20">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{text}</p>
  </div>
);

const ListItem = ({ text }) => (
  <li className="flex items-center space-x-3 group">
    <div className="w-2 h-2 bg-green-400 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-green-300 shadow-sm shadow-green-400"></div>
    <span>{text}</span>
  </li>
);

export default About;