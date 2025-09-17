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
      
      const systemPrompt = `You are a soil analysis expert. Return ONLY valid JSON with no additional text:
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
      "name": "crop name",
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

      const response = await this.callAPI(`Analyze soil with pH:${soilSample.ph}, N:${soilSample.nitrogen}ppm, P:${soilSample.phosphorus}ppm, K:${soilSample.potassium}ppm, Moisture:${soilSample.moisture}%, Organic:${soilSample.organicMatter}%. Provide profitable crop recommendations with investment and ROI details.`, systemPrompt);
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

  static async suggestCropsBasedOnMarket(marketConditions, location, soilType, budget) {
    const systemPrompt = `You are an agricultural expert. Return ONLY valid JSON:
[{
  "name": "crop name",
  "profit": "high|medium|low",
  "reason": "why profitable based on market",
  "marketAlignment": "how it aligns with market needs"
}]`;

    const marketInfo = `Market shortages: ${marketConditions.shortages?.join(',')}, Corporate demand: ${JSON.stringify(marketConditions.corporateDemand)}, Rising prices: ${marketConditions.priceRising?.join(',')}, Nutrition needs: ${marketConditions.nutritionNeeds?.join(',')}`;
    const response = await this.callAPI(`${marketInfo}. Location: ${location}, Soil: ${soilType}, Budget: ${budget}. Suggest 3 most profitable crops that align with market conditions.`, systemPrompt);
    
    const parsed = this.parseJSON(response);
    return parsed || [{name: 'Turmeric', profit: 'high', reason: 'High market demand'}, {name: 'Coriander', profit: 'medium', reason: 'Stable prices'}, {name: 'Chili', profit: 'high', reason: 'Export potential'}];
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

    const response = await this.callAPI(`Analyze which companies are increasing procurement for ${crops.join(', ')} in ${location}. Focus on food processing companies, FMCG brands, and export companies.`, systemPrompt);
    return this.parseJSON(response) || [{company: 'Food Corp Ltd', crops: crops.slice(0,2), increasePercentage: '30%', reason: 'Export demand'}];
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

  static getDefaultSoilAnalysis() {
    return {
      soilType: 'Loamy',
      pH: '6.5',
      healthScore: 85,
      nutrients: {nitrogen: 'Medium', phosphorus: 'Medium', potassium: 'High'},
      improvements: ['Add organic compost', 'Balance pH levels'],
      fertilizers: ['NPK 10:26:26', 'Organic manure'],
      suitableCrops: [
        {name: 'Turmeric', profitLevel: 'High Profit', season: 'Kharif', duration: '8-10 months', investment: '₹20k/acre', roi: '150%', marketDemand: 'High', riskLevel: 'Low'},
        {name: 'Coriander', profitLevel: 'Medium Profit', season: 'Rabi', duration: '3-4 months', investment: '₹15k/acre', roi: '120%', marketDemand: 'High', riskLevel: 'Low'}
      ]
    };
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