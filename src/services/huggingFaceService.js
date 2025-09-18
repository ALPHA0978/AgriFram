import { BaseAI } from './baseAI.js';

export class FarmerAI extends BaseAI {
  static async analyzeCrop(cropData) {
    try {
      console.log('FarmerAI: Starting crop analysis for:', cropData);
      
      const systemPrompt = `You are a crop health expert. Return ONLY valid JSON with no additional text:
{
  "cropHealth": "Excellent|Good|Fair|Poor|Critical",
  "healthScore": 85,
  "growthStage": "current growth analysis",
  "yieldPrediction": {"expected": "yield estimate", "factors": ["affecting factors"], "quality": "High|Medium|Low"},
  "diseases": [
    {"name": "disease name", "severity": "Low|Medium|High|Critical", "symptoms": ["symptoms"], "treatment": "treatment method", "cost": "₹500-1000", "urgency": "Immediate|Within week|Monitor"}
  ],
  "pests": [
    {"name": "pest name", "damage": "damage description", "severity": "Low|Medium|High", "control": "control method", "cost": "₹300-800"}
  ],
  "nutritionDeficiency": [
    {"nutrient": "N|P|K|Mg|Fe", "symptoms": ["deficiency signs"], "solution": "fertilizer recommendation", "dosage": "application rate"}
  ],
  "fertilizers": [
    {"name": "fertilizer name", "quantity": "kg per acre", "timing": "when to apply", "cost": "₹1000-2000", "purpose": "growth|flowering|fruiting"}
  ],
  "irrigation": {"schedule": "watering frequency", "method": "best irrigation type", "waterNeeded": "liters per day", "efficiency": "current vs optimal"},
  "harvest": {"optimalTime": "harvest date estimate", "indicators": ["ripeness signs"], "expectedYield": "quintals per acre", "marketTiming": "best selling time"},
  "recommendations": {
    "immediate": ["urgent actions needed"],
    "weekly": ["actions for next week"],
    "monthly": ["long-term care"]
  },
  "riskFactors": ["weather risks", "disease risks", "market risks"],
  "costAnalysis": {"totalCare": "₹5000-8000", "expectedRevenue": "₹25000-35000", "profitMargin": "60-70%"}
}`;

      const response = await this.callAPI(`Analyze crop: ${cropData.cropType} (${cropData.variety || 'standard variety'}), Growth: ${cropData.growthStage || 'unknown'}, Planted: ${cropData.plantingDate}, Size: ${cropData.fieldSize} acres, Symptoms: ${cropData.symptoms}, Fertilizer: ${cropData.fertilizer || 'none'}, Pesticide: ${cropData.pesticide || 'none'}, Irrigation: ${cropData.irrigationMethod || 'unknown'}, Location: ${cropData.location}, Weather: ${cropData.weatherConditions}`, systemPrompt);
      console.log('FarmerAI: Raw crop response:', response);
      
      const parsed = this.parseJSON(response);
      console.log('FarmerAI: Parsed crop result:', parsed);
      
      return parsed || this.getDefaultCropAnalysis();
    } catch (error) {
      console.error('FarmerAI: Crop analysis error:', error);
      return this.getDefaultCropAnalysis();
    }
  }

  static async analyzeSoil(soilSample) {
    try {
      console.log('FarmerAI: Starting soil analysis for:', soilSample);
      
      const systemPrompt = `You are a soil analysis expert. You MUST return exactly 5 crops in suitableCrops array. Return ONLY valid JSON with no additional text:
{
  "soilType": "soil classification",
  "pH": "pH level and recommendations",
  "healthScore": 85,
  "nutrients": {"nitrogen": "High|Medium|Low", "phosphorus": "High|Medium|Low", "potassium": "High|Medium|Low"},
  "organicMatter": "organic content percentage",
  "improvements": ["soil improvement methods"],
  "fertilizers": ["recommended fertilizers"],
  "suitableCrops": [
    {
      "name": "crop name 1",
      "profitLevel": "High Profit|Medium Profit|Good Profit|Stable Profit",
      "season": "Kharif|Rabi|Zaid",
      "duration": "3-6 months",
      "investment": "15-25k per acre",
      "roi": "120-180%",
      "marketDemand": "High|Medium|Low",
      "riskLevel": "Low|Medium|High"
    },
    {
      "name": "crop name 2",
      "profitLevel": "High Profit|Medium Profit|Good Profit|Stable Profit",
      "season": "Kharif|Rabi|Zaid",
      "duration": "3-6 months",
      "investment": "15-25k per acre",
      "roi": "120-180%",
      "marketDemand": "High|Medium|Low",
      "riskLevel": "Low|Medium|High"
    },
    {
      "name": "crop name 3",
      "profitLevel": "High Profit|Medium Profit|Good Profit|Stable Profit",
      "season": "Kharif|Rabi|Zaid",
      "duration": "3-6 months",
      "investment": "15-25k per acre",
      "roi": "120-180%",
      "marketDemand": "High|Medium|Low",
      "riskLevel": "Low|Medium|High"
    },
    {
      "name": "crop name 4",
      "profitLevel": "High Profit|Medium Profit|Good Profit|Stable Profit",
      "season": "Kharif|Rabi|Zaid",
      "duration": "3-6 months",
      "investment": "15-25k per acre",
      "roi": "120-180%",
      "marketDemand": "High|Medium|Low",
      "riskLevel": "Low|Medium|High"
    },
    {
      "name": "crop name 5",
      "profitLevel": "High Profit|Medium Profit|Good Profit|Stable Profit",
      "season": "Kharif|Rabi|Zaid",
      "duration": "3-6 months",
      "investment": "15-25k per acre",
      "roi": "120-180%",
      "marketDemand": "High|Medium|Low",
      "riskLevel": "Low|Medium|High"
    }
  ]
}`;

      const response = await this.callAPI(`Analyze soil with pH:${soilSample.ph}, N:${soilSample.nitrogen}ppm, P:${soilSample.phosphorus}ppm, K:${soilSample.potassium}ppm, Moisture:${soilSample.moisture}%, Organic:${soilSample.organicMatter}%. IMPORTANT: You MUST provide exactly 5 different crops in the suitableCrops array. Do not provide less than 5 crops.`, systemPrompt);
      console.log('FarmerAI: Raw API response:', response);
      
      const parsed = this.parseJSON(response);
      console.log('FarmerAI: Parsed result:', parsed);
      
      return parsed || this.getDefaultSoilAnalysis();
    } catch (error) {
      console.error('FarmerAI: Soil analysis error:', error);
      return this.getDefaultSoilAnalysis();
    }
  }

  static async optimizeIrrigation(farmData) {
    const systemPrompt = `You are an IoT farming specialist. Return ONLY valid JSON with no additional text:
{
  "overallStatus": "Optimal|Good|Warning|Critical",
  "alerts": [
    {
      "type": "alert type",
      "severity": "Low|Medium|High|Critical",
      "message": "detailed alert message",
      "action": "recommended immediate action"
    }
  ],
  "sensorAnalysis": {
    "soilMoisture": {"status": "Optimal|Low|High", "recommendation": "action needed"},
    "temperature": {"status": "Optimal|Low|High", "recommendation": "action needed"},
    "humidity": {"status": "Optimal|Low|High", "recommendation": "action needed"},
    "lightIntensity": {"status": "Optimal|Low|High", "recommendation": "action needed"}
  },
  "recommendations": {
    "irrigation": "detailed irrigation schedule",
    "climate": "climate control suggestions",
    "timing": "optimal timing for farm activities",
    "fertilization": "nutrient application timing"
  },
  "predictions": {
    "nextIrrigation": "when to irrigate next with timing",
    "weatherImpact": "weather impact on crops",
    "growthStage": "current crop growth analysis",
    "yieldImpact": "expected yield impact"
  },
  "optimization": {
    "waterUsage": "water optimization strategies",
    "energyEfficiency": "energy saving methods",
    "costReduction": "cost reduction opportunities",
    "automationTips": ["IoT automation suggestions"]
  },
  "trends": {
    "soilMoisture": "moisture trend analysis",
    "temperature": "temperature pattern analysis",
    "growth": "crop growth trend prediction",
    "efficiency": "current vs optimal efficiency"
  },
  "actionPlan": {
    "immediate": ["urgent actions needed now"],
    "today": ["actions needed today"],
    "thisWeek": ["weekly monitoring tasks"]
  }
}`;

    const response = await this.callAPI(`IoT sensor analysis: Soil Moisture: ${farmData.soilMoisture}%, Air Temperature: ${farmData.airTemperature}°C, Humidity: ${farmData.humidity}%, Light: ${farmData.lightIntensity} lux, Rainfall: ${farmData.rainfall}mm. Provide comprehensive monitoring insights and optimization recommendations.`, systemPrompt);
    return this.parseJSON(response) || this.getDefaultIrrigation();
  }

  static async analyzeMarketConditions(location, season, soilType) {
    const systemPrompt = `You are a market analyst. Return ONLY valid JSON:
{
  "shortages": ["crop1", "crop2"],
  "corporateDemand": [{"company": "name", "crops": ["crop1"], "increase": "25%"}],
  "priceRising": ["crop1", "crop2"],
  "nutritionNeeds": ["protein", "iron"]
}`;

    const response = await this.callAPI(`Analyze current market conditions for ${location}, ${season} season, ${soilType} soil. Focus on supply shortages, corporate procurement increases, rising prices, and nutrition gaps.`, systemPrompt);
    return this.parseJSON(response) || {shortages: ['Turmeric', 'Coriander'], priceRising: ['Chili', 'Millets'], nutritionNeeds: ['protein', 'iron']};
  }

  static async suggestCropsBasedOnMarket(marketConditions, location, soilType, budget, season, farmSize, waterAvailability) {
    const systemPrompt = `You are an agricultural expert specializing in soil-crop compatibility and market analysis. Return ONLY valid JSON:
[{
  "name": "crop name",
  "profit": "high|medium|low",
  "reason": "why profitable based on market",
  "marketAlignment": "how it aligns with market needs",
  "soilSuitability": "why this crop is suitable for the specified soil type"
}]`;

    const marketInfo = `Market shortages: ${marketConditions.shortages?.join(',')}, Corporate demand: ${JSON.stringify(marketConditions.corporateDemand)}, Rising prices: ${marketConditions.priceRising?.join(',')}, Nutrition needs: ${marketConditions.nutritionNeeds?.join(',')}`;
    const response = await this.callAPI(`${marketInfo}. Location: ${location}, Season: ${season}, Soil: ${soilType}, Farm Size: ${farmSize} acres, Budget: ${budget}, Water: ${waterAvailability}. Suggest exactly 5 most profitable crops that are suitable for ${soilType} soil in ${season} season with ${waterAvailability} water availability, within ${budget} budget for ${farmSize} acres in ${location}. Consider: 1) Soil-crop compatibility 2) Season suitability 3) Water requirements 4) Budget constraints 5) Regional climate 6) Market profitability.`, systemPrompt);
    
    const parsed = this.parseJSON(response);
    return parsed || [
      {name: 'Groundnut', profit: 'high', reason: 'High market demand', soilSuitability: 'Well-suited for red soil with good drainage'}, 
      {name: 'Cotton', profit: 'high', reason: 'Export potential', soilSuitability: 'Thrives in red soil with moderate fertility'}, 
      {name: 'Sorghum', profit: 'medium', reason: 'Drought tolerance', soilSuitability: 'Excellent for red soil, drought-resistant'},
      {name: 'Sunflower', profit: 'high', reason: 'Oil industry demand', soilSuitability: 'Adapts well to red soil conditions'},
      {name: 'Millets', profit: 'medium', reason: 'Health food trend', soilSuitability: 'Perfect for red soil, low water requirement'}
    ];
  }

  static async analyzeCorporateProcurement(crops, location) {
    const systemPrompt = `You are a corporate procurement analyst. Return ONLY valid JSON:
[{
  "company": "company name",
  "crops": ["crop1", "crop2"],
  "increasePercentage": "X%",
  "reason": "why increasing procurement",
  "contractOpportunity": "direct contract potential"
}]`;

    const response = await this.callAPI(`Analyze which companies are increasing procurement for ${crops.join(', ')} in ${location}. Focus on food processing companies, FMCG brands, and export companies. Provide at least 5-7 companies with their procurement increases.`, systemPrompt);
    return this.parseJSON(response) || [
      {company: 'Food Corp Ltd', crops: crops.slice(0,2), increasePercentage: '30%', reason: 'Export demand'},
      {company: 'ITC Limited', crops: [crops[0]], increasePercentage: '25%', reason: 'Processing expansion'},
      {company: 'Adani Wilmar', crops: crops.slice(1,3), increasePercentage: '20%', reason: 'Supply chain growth'},
      {company: 'Britannia Industries', crops: [crops[0], crops[2]], increasePercentage: '35%', reason: 'Product diversification'},
      {company: 'Nestle India', crops: crops.slice(0,2), increasePercentage: '15%', reason: 'Raw material sourcing'}
    ];
  }

  static async analyzeRegionalGaps(crops, location) {
    const systemPrompt = `You are a regional supply gap analyst. Return ONLY valid JSON:
[{
  "region": "region name",
  "shortage": "crop with shortage",
  "opportunity": "market opportunity",
  "demandLevel": "High|Medium|Low",
  "transportCost": "logistics consideration"
}]`;

    const response = await this.callAPI(`Identify regional supply gaps for ${crops.join(', ')} around ${location}. Which regions have shortages and high demand for these crops?`, systemPrompt);
    return this.parseJSON(response) || [{region: 'North India', shortage: crops[0], opportunity: 'Supply gap', demandLevel: 'High'}];
  }

  static async getFutureValueProjections(crops, timelineData, location) {
    const systemPrompt = `You are a market value projection analyst. Return ONLY valid JSON:
[{
  "crop": "crop name",
  "currentPrice": "₹X per quintal",
  "futureValueIncrease": "+X-Y%",
  "demandGrowth": "X% growth",
  "reason": "why value will increase",
  "marketDrivers": ["demand factors"]
}]`;

    const timelineInfo = Array.isArray(timelineData) ? timelineData.map(t => `${t.crop}: ${t.growthPeriod}`).join(', ') : 'Standard timeline';
    const response = await this.callAPI(`Based on growth timeline (${timelineInfo}) for crops ${crops.join(', ')} in ${location}, project future value increases considering market trends, demand growth, and supply constraints.`, systemPrompt);
    return this.parseJSON(response) || crops.map(crop => ({crop, futureValueIncrease: '+25%', reason: 'Market growth'}));
  }

  static async analyzeGrowthTimeline(crops, season) {
    const systemPrompt = `You are a crop timeline specialist. Return ONLY valid JSON:
[{
  "crop": "crop name",
  "growthPeriod": "X-Y days",
  "season": "best season",
  "stages": ["germination", "vegetative", "flowering", "harvest"],
  "criticalPeriods": ["water-sensitive periods"]
}]`;

    const response = await this.callAPI(`Analyze growth timeline for ${crops.join(', ')} in ${season} season. Provide detailed growth periods and critical stages.`, systemPrompt);
    return this.parseJSON(response) || crops.map(crop => ({crop, growthPeriod: '90-120 days', season: 'Kharif'}));
  }

  static getDefaultCropAnalysis() {
    return {
      cropHealth: 'Good',
      healthScore: 78,
      growthStage: 'Vegetative stage - healthy development',
      yieldPrediction: {expected: '25-30 quintals per acre', factors: ['Weather conditions', 'Nutrient management'], quality: 'High'},
      diseases: [{name: 'Leaf spot (minor)', severity: 'Low', symptoms: ['Small brown spots'], treatment: 'Copper fungicide spray', cost: '₹800-1200', urgency: 'Within week'}],
      pests: [{name: 'Aphids', damage: 'Minimal leaf damage', severity: 'Low', control: 'Neem oil spray', cost: '₹400-600'}],
      nutritionDeficiency: [{nutrient: 'Nitrogen', symptoms: ['Yellowing lower leaves'], solution: 'Urea application', dosage: '25kg per acre'}],
      fertilizers: [{name: 'NPK 19:19:19', quantity: '50kg per acre', timing: 'Every 20 days', cost: '₹1500-2000', purpose: 'growth'}],
      irrigation: {schedule: 'Every 3 days', method: 'Drip irrigation', waterNeeded: '150L per day', efficiency: '75% current vs 90% optimal'},
      harvest: {optimalTime: '45-50 days from now', indicators: ['Golden color', '85% grain filling'], expectedYield: '28 quintals per acre', marketTiming: 'Post-harvest season for better prices'},
      recommendations: {
        immediate: ['Apply nitrogen fertilizer', 'Check for pest damage'],
        weekly: ['Monitor irrigation schedule', 'Spray preventive fungicide'],
        monthly: ['Soil health assessment', 'Market price monitoring']
      },
      riskFactors: ['Monsoon delay risk', 'Pest outbreak possibility', 'Price volatility'],
      costAnalysis: {totalCare: '₹6000-8000', expectedRevenue: '₹28000-35000', profitMargin: '65-75%'}
    };
  }

  static getDefaultSoilAnalysis() {
    return {
      soilType: 'Loamy soil - well-balanced for most crops',
      pH: '6.8 - Slightly acidic, good for most crops',
      healthScore: 82,
      nutrients: {nitrogen: 'Medium', phosphorus: 'High', potassium: 'Medium'},
      organicMatter: '3.2% - Good organic content',
      improvements: ['Add compost', 'Crop rotation', 'Cover cropping'],
      fertilizers: ['NPK 19:19:19', 'Organic compost', 'Micronutrient mix'],
      suitableCrops: [
        {name: 'Wheat', profitLevel: 'High Profit', season: 'Rabi', duration: '4-5 months', investment: '20-25k per acre', roi: '150-180%', marketDemand: 'High', riskLevel: 'Low'},
        {name: 'Rice', profitLevel: 'Medium Profit', season: 'Kharif', duration: '3-4 months', investment: '18-22k per acre', roi: '120-150%', marketDemand: 'High', riskLevel: 'Medium'},
        {name: 'Sugarcane', profitLevel: 'High Profit', season: 'Kharif', duration: '12-18 months', investment: '35-45k per acre', roi: '180-220%', marketDemand: 'High', riskLevel: 'Medium'},
        {name: 'Cotton', profitLevel: 'Good Profit', season: 'Kharif', duration: '5-6 months', investment: '25-30k per acre', roi: '140-170%', marketDemand: 'Medium', riskLevel: 'Medium'},
        {name: 'Maize', profitLevel: 'Stable Profit', season: 'Kharif', duration: '3-4 months', investment: '15-20k per acre', roi: '110-140%', marketDemand: 'Medium', riskLevel: 'Low'}
      ]
    };
  }

  static getDefaultIrrigation() {
    return {
      overallStatus: 'Good',
      alerts: [
        {type: 'Soil Moisture', severity: 'Medium', message: 'Soil moisture slightly below optimal', action: 'Schedule irrigation within 6 hours'}
      ],
      sensorAnalysis: {
        soilMoisture: {status: 'Low', recommendation: 'Increase irrigation frequency'},
        temperature: {status: 'Optimal', recommendation: 'Continue current monitoring'},
        humidity: {status: 'Good', recommendation: 'Maintain current levels'},
        lightIntensity: {status: 'Optimal', recommendation: 'Good sunlight exposure'}
      },
      recommendations: {
        irrigation: 'Water every 2 days in early morning (6-8 AM)',
        climate: 'Provide shade during peak afternoon hours',
        timing: 'Best time for fertilization: early morning',
        fertilization: 'Apply liquid fertilizer after next irrigation'
      },
      predictions: {
        nextIrrigation: 'Tomorrow morning at 6 AM',
        weatherImpact: 'Clear weather expected, normal irrigation needed',
        growthStage: 'Vegetative stage progressing well',
        yieldImpact: 'Current conditions support 85% of optimal yield'
      },
      optimization: {
        waterUsage: 'Switch to drip irrigation for 30% water savings',
        energyEfficiency: 'Use solar-powered pumps during day hours',
        costReduction: 'Automated scheduling can save ₹3000/month',
        automationTips: ['Install soil moisture sensors', 'Use timer-based irrigation']
      },
      trends: {
        soilMoisture: 'Declining trend, needs attention',
        temperature: 'Stable within optimal range',
        growth: 'Steady growth rate observed',
        efficiency: '70% current vs 90% optimal efficiency'
      },
      actionPlan: {
        immediate: ['Check irrigation system', 'Monitor soil moisture'],
        today: ['Schedule irrigation', 'Check weather forecast'],
        thisWeek: ['Install moisture sensors', 'Optimize irrigation timing']
      }
    };
  }
}