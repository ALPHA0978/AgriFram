# FarmAI - AI-Powered Smart Farming Platform

A comprehensive AI-driven platform designed to revolutionize agriculture by providing farmers with intelligent insights for soil health, crop monitoring, irrigation optimization, and market analysis.

## 🌱 Features

### 🔬 Soil Analysis
- AI-powered soil health assessment
- Nutrient level analysis (NPK)
- pH and organic matter evaluation
- Crop suitability recommendations
- Fertilizer and amendment suggestions

### 🌾 Crop Health Monitoring
- Disease detection and diagnosis
- Pest identification and control
- Treatment recommendations (organic & chemical)
- Growth stage monitoring
- Yield prediction

### 💧 Smart Irrigation & IoT Monitoring
- Real-time sensor data analysis
- Irrigation optimization
- Weather impact assessment
- Resource usage optimization
- Automated alerts and recommendations

### 📈 Market Intelligence
- Crop profitability analysis
- Market demand forecasting
- Price trend analysis
- Investment and ROI calculations
- Risk assessment

## 🚀 Technology Stack

- **Frontend**: React 19, Tailwind CSS, Lucide React Icons
- **AI Integration**: Hugging Face API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with PostCSS

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd harsh_hackthon_project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your API keys:
```env
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## 🔧 Configuration

### API Keys Setup
1. **Hugging Face API**: Get your API key from [Hugging Face](https://huggingface.co/settings/tokens)
2. Add the key to your `.env` file as shown above

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

## 🎯 Usage

1. **Home Page**: Modern landing page showcasing platform features
2. **Soil Analysis**: Input soil test data for AI-powered recommendations
3. **Crop Health**: Monitor crop conditions and get disease detection
4. **IoT Monitoring**: Analyze sensor data for irrigation optimization
5. **Market Intelligence**: Get market insights and profitability analysis

## 🌍 SDG Alignment

This platform directly contributes to **SDG 2 - Zero Hunger** by:
- Increasing agricultural productivity
- Improving food security
- Supporting sustainable farming practices
- Empowering farmers with AI technology

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/
│   └── FarmingTool.jsx
├── pages/
│   └── Home.jsx
├── services/
│   └── huggingFaceService.js
├── App.jsx
└── main.jsx
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Hugging Face for AI model APIs
- Tailwind CSS for styling framework
- Lucide React for beautiful icons
- Vite for fast development experience

---

**Built with ❤️ for farmers and sustainable agriculture**