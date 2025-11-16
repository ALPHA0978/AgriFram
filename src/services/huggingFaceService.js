import { BaseAI } from './baseAI.js';
import { sanitizeObject } from '../utils/sanitize.js';

export class FarmerAI extends BaseAI {
  static sanitizeInputData(data) {
    return sanitizeObject(data);
  }
  static async analyzeCrop(cropData, onStepUpdate = null) {
    try {
      const sanitizedData = this.sanitizeInputData(cropData);
      
      // Step 1: Symptom Classification
      onStepUpdate?.(1, 'Analyzing symptoms and classifying problem type...');
      const symptomAnalysis = await this.analyzeSymptoms(sanitizedData);
      
      // Step 2: Disease/Pest Identification
      onStepUpdate?.(2, 'Identifying specific disease, pest, or deficiency...');
      const identification = await this.identifyIssue(sanitizedData, symptomAnalysis);
      
      // Step 3: Severity Assessment
      onStepUpdate?.(3, 'Assessing severity and potential impact...');
      const severityAssessment = await this.assessSeverity(sanitizedData, identification);
      
      // Step 4: Treatment Selection
      onStepUpdate?.(4, 'Selecting optimal treatment strategy...');
      const treatmentPlan = await this.selectTreatment(sanitizedData, identification, severityAssessment);
      
      // Step 5: Final Recommendations
      onStepUpdate?.(5, 'Generating final recommendations and outcomes...');
      const finalAnalysis = await this.generateFinalRecommendations(sanitizedData, {
        symptoms: symptomAnalysis,
        identification,
        severity: severityAssessment,
        treatment: treatmentPlan
      });
      
      return finalAnalysis || this.getDefaultCropAnalysis();
    } catch (error) {
      console.error('FarmerAI: Crop analysis error:', error);
      return this.getDefaultCropAnalysis();
    }
  }

  static async analyzeSymptoms(cropData) {
    const systemPrompt = `You are a plant pathologist. Analyze symptoms and classify the problem type. Return ONLY valid JSON:
{
  "problemType": "Bacterial Disease|Fungal Disease|Pest Infestation|Nutrient Deficiency|Viral Disease|Environmental Stress|Healthy",
  "confidence": 85,
  "keySymptoms": ["primary symptoms observed"],
  "affectedParts": ["leaves|stems|roots|fruits"],
  "pattern": "localized|widespread|progressive|random",
  "urgency": "Immediate|Within week|Monitor|Routine"
}`;

    const response = await this.callAPI(`SYMPTOM ANALYSIS:
Crop: ${cropData.cropType}
Symptoms: ${cropData.symptoms || 'No specific symptoms'}
Growth Stage: ${cropData.growthStage}
Weather: ${cropData.weatherConditions}

Classify the problem type based on symptoms.`, systemPrompt);
    
    return this.parseJSON(response) || {problemType: 'Healthy', confidence: 50};
  }

  static async identifyIssue(cropData, symptomAnalysis) {
    const systemPrompt = `You are a crop disease specialist. Identify the specific issue. Return ONLY valid JSON:
{
  "specificIssue": "exact disease/pest name",
  "scientificName": "scientific name if applicable",
  "commonNames": ["alternative names"],
  "causativeAgent": "bacteria|fungus|virus|insect|mite|deficiency",
  "transmissionMode": "airborne|soilborne|insect-vector|contact",
  "riskFactors": ["conditions that worsen the problem"]
}`;

    const response = await this.callAPI(`ISSUE IDENTIFICATION:
Crop: ${cropData.cropType}
Problem Type: ${symptomAnalysis.problemType}
Symptoms: ${symptomAnalysis.keySymptoms?.join(', ')}
Location: ${cropData.location}
Weather: ${cropData.weatherConditions}

Identify the specific disease, pest, or deficiency.`, systemPrompt);
    
    return this.parseJSON(response) || {specificIssue: 'Unknown', causativeAgent: 'unknown'};
  }

  static async assessSeverity(cropData, identification) {
    const systemPrompt = `You are a crop damage assessor. Evaluate severity and impact. Return ONLY valid JSON:
{
  "severityLevel": "Low|Medium|High|Critical",
  "affectedPercentage": 25,
  "spreadRate": "Slow|Moderate|Fast|Very Fast",
  "yieldImpact": "5-15%|15-30%|30-60%|60%+",
  "economicLoss": "₹2000-5000|₹5000-15000|₹15000-30000|₹30000+",
  "timeToAction": "24 hours|3-7 days|1-2 weeks|Monitor"
}`;

    const response = await this.callAPI(`SEVERITY ASSESSMENT:
Crop: ${cropData.cropType}
Field Size: ${cropData.fieldSize} acres
Issue: ${identification.specificIssue}
Symptoms Pattern: ${cropData.symptoms}
Current Treatments: ${cropData.fertilizer || 'none'}, ${cropData.pesticide || 'none'}

Assess the severity and potential impact.`, systemPrompt);
    
    return this.parseJSON(response) || {severityLevel: 'Medium', affectedPercentage: 20};
  }

  static async selectTreatment(cropData, identification, severity) {
    const systemPrompt = `You are a crop treatment specialist. Select optimal treatment. Return ONLY valid JSON:
{
  "primaryTreatment": "specific treatment method",
  "activeIngredient": "chemical/biological agent",
  "dosage": "application rate",
  "applicationMethod": "spray|drench|granular|injection",
  "frequency": "application schedule",
  "alternativeTreatment": "organic/biological option",
  "cost": "₹800-1500",
  "effectiveness": "85-95%|70-85%|60-75%|<60%"
}`;

    const response = await this.callAPI(`TREATMENT SELECTION:
Issue: ${identification.specificIssue}
Causative Agent: ${identification.causativeAgent}
Severity: ${severity.severityLevel}
Field Size: ${cropData.fieldSize} acres
Urgency: ${severity.timeToAction}

Select the most effective treatment for this specific issue.`, systemPrompt);
    
    return this.parseJSON(response) || {primaryTreatment: 'General fungicide', cost: '₹1000'};
  }

  static async generateFinalRecommendations(cropData, analysisSteps) {
    const systemPrompt = `You are a senior agricultural consultant. Provide final recommendations. Return ONLY valid JSON:
{
  "cropHealth": "Excellent|Good|Fair|Poor|Critical",
  "healthScore": 75,
  "primaryIssue": "${analysisSteps.identification.specificIssue}",
  "confidence": 90,
  "diseases": [{
    "name": "${analysisSteps.identification.specificIssue}",
    "type": "${analysisSteps.identification.causativeAgent}",
    "severity": "${analysisSteps.severity.severityLevel}",
    "symptoms": ${JSON.stringify(analysisSteps.symptoms.keySymptoms || [])},
    "treatment": "${analysisSteps.treatment.primaryTreatment}",
    "cost": "${analysisSteps.treatment.cost}",
    "urgency": "${analysisSteps.symptoms.urgency}"
  }],
  "treatmentPlan": {
    "chemical": "${analysisSteps.treatment.activeIngredient} @ ${analysisSteps.treatment.dosage}",
    "organic": "${analysisSteps.treatment.alternativeTreatment}",
    "frequency": "${analysisSteps.treatment.frequency}"
  },
  "recommendations": {
    "immediate": ["Apply ${analysisSteps.treatment.primaryTreatment}", "Monitor spread", "Improve conditions"],
    "weekly": ["Check treatment effectiveness", "Repeat if needed"],
    "prevention": ["Use resistant varieties", "Improve field hygiene"]
  },
  "expectedOutcome": {
    "recoveryTime": "1-3 weeks|3-6 weeks|6-12 weeks",
    "successRate": "${analysisSteps.treatment.effectiveness}",
    "yieldRecovery": "Full recovery|80-90%|60-80%|<60%"
  }
}`;

    const response = await this.callAPI(`FINAL RECOMMENDATIONS:
Crop: ${cropData.cropType}
Analysis Summary:
- Problem: ${analysisSteps.identification.specificIssue}
- Severity: ${analysisSteps.severity.severityLevel}
- Treatment: ${analysisSteps.treatment.primaryTreatment}
- Confidence: ${analysisSteps.symptoms.confidence}%

Provide comprehensive final recommendations.`, systemPrompt);
    
    return this.parseJSON(response) || this.getDefaultCropAnalysis();
  }

  static determineAnalysisType(symptoms) {
    if (!symptoms) return 'general';
    
    const symptomText = symptoms.toLowerCase();
    
    if (symptomText.includes('bacterial') || symptomText.includes('blight') || 
        symptomText.includes('canker') || symptomText.includes('soft rot') ||
        symptomText.includes('water-soaked') || symptomText.includes('ooze')) {
      return 'bacterial';
    }
    
    if (symptomText.includes('fungal') || symptomText.includes('mold') || 
        symptomText.includes('rust') || symptomText.includes('mildew') ||
        symptomText.includes('spot') || symptomText.includes('wilt')) {
      return 'fungal';
    }
    
    if (symptomText.includes('pest') || symptomText.includes('insect') || 
        symptomText.includes('caterpillar') || symptomText.includes('aphid') ||
        symptomText.includes('holes') || symptomText.includes('chewed')) {
      return 'pest';
    }
    
    if (symptomText.includes('yellow') || symptomText.includes('chlorosis') || 
        symptomText.includes('deficiency') || symptomText.includes('stunted') ||
        symptomText.includes('purple') || symptomText.includes('pale')) {
      return 'nutrient';
    }
    
    return 'general';
  }

  static getSystemPromptForType(type) {
    switch (type) {
      case 'bacterial':
        return `{
  "cropHealth": "Poor|Critical",
  "healthScore": 40,
  "primaryIssue": "Bacterial Disease",
  "diseases": [{
    "name": "specific bacterial disease",
    "type": "Bacterial",
    "severity": "Medium|High|Critical",
    "symptoms": ["observed symptoms"],
    "treatment": "copper-based bactericide or antibiotic spray",
    "cost": "₹800-1500",
    "urgency": "Immediate"
  }],
  "recommendations": {
    "immediate": ["Apply copper sulfate spray", "Remove infected plants", "Improve drainage"],
    "weekly": ["Monitor spread", "Repeat treatment if needed"],
    "prevention": ["Use disease-free seeds", "Crop rotation"]
  },
  "treatmentPlan": {
    "chemical": "Copper oxychloride 50% WP @ 3g/L",
    "organic": "Neem oil + copper sulfate",
    "frequency": "Every 7-10 days until controlled"
  }
}`;
      
      case 'fungal':
        return `{
  "cropHealth": "Fair|Poor",
  "healthScore": 50,
  "primaryIssue": "Fungal Disease",
  "diseases": [{
    "name": "specific fungal disease",
    "type": "Fungal",
    "severity": "Low|Medium|High",
    "symptoms": ["observed symptoms"],
    "treatment": "systemic fungicide spray",
    "cost": "₹600-1200",
    "urgency": "Within week"
  }],
  "recommendations": {
    "immediate": ["Apply fungicide", "Improve air circulation", "Reduce humidity"],
    "weekly": ["Monitor disease progress", "Adjust irrigation"],
    "prevention": ["Resistant varieties", "Proper spacing"]
  },
  "treatmentPlan": {
    "chemical": "Propiconazole 25% EC @ 1ml/L",
    "organic": "Trichoderma + neem oil",
    "frequency": "Every 10-14 days"
  }
}`;
      
      case 'pest':
        return `{
  "cropHealth": "Good|Fair",
  "healthScore": 65,
  "primaryIssue": "Pest Infestation",
  "pests": [{
    "name": "specific pest",
    "type": "Insect|Mite|Nematode",
    "damage": "damage description",
    "severity": "Low|Medium|High",
    "control": "targeted pesticide or biological control",
    "cost": "₹400-800"
  }],
  "recommendations": {
    "immediate": ["Apply targeted pesticide", "Remove affected parts", "Install traps"],
    "weekly": ["Monitor pest population", "Check trap catches"],
    "prevention": ["Beneficial insects", "Crop rotation"]
  },
  "treatmentPlan": {
    "chemical": "Specific insecticide based on pest",
    "biological": "Predatory insects or parasites",
    "frequency": "As needed based on threshold"
  }
}`;
      
      case 'nutrient':
        return `{
  "cropHealth": "Fair|Good",
  "healthScore": 60,
  "primaryIssue": "Nutrient Deficiency",
  "nutritionDeficiency": [{
    "nutrient": "N|P|K|Mg|Fe|Zn",
    "symptoms": ["deficiency symptoms"],
    "solution": "specific fertilizer recommendation",
    "dosage": "application rate per acre"
  }],
  "fertilizers": [{
    "name": "specific fertilizer",
    "quantity": "kg per acre",
    "timing": "application timing",
    "cost": "₹1000-2000",
    "purpose": "nutrient correction"
  }],
  "recommendations": {
    "immediate": ["Apply deficient nutrient", "Soil test", "Foliar spray"],
    "weekly": ["Monitor plant response", "Adjust fertilization"],
    "longterm": ["Soil amendment", "Organic matter addition"]
  }
}`;
      
      default:
        return `{
  "cropHealth": "Good|Fair|Poor",
  "healthScore": 75,
  "growthStage": "current stage analysis",
  "yieldPrediction": {"expected": "yield estimate", "quality": "High|Medium|Low"},
  "diseases": [],
  "pests": [],
  "nutritionDeficiency": [],
  "recommendations": {
    "immediate": ["general care actions"],
    "weekly": ["monitoring tasks"],
    "monthly": ["long-term care"]
  },
  "overallAssessment": "comprehensive health status"
}`;
    }
  }

  static async analyzeSoil(soilSample) {
    try {
      // Sanitize input data to prevent XSS
      const sanitizedSample = this.sanitizeInputData(soilSample);
      console.log('FarmerAI: Starting soil analysis for:', sanitizedSample);
      
      const systemPrompt = `You are an expert agricultural soil scientist with 20+ years of experience. Analyze soil data scientifically.

SOIL ANALYSIS RULES:
- pH 0-5.5: Acidic (add lime, grow tea, potatoes)
- pH 5.5-6.5: Slightly acidic (ideal for most crops)
- pH 6.5-7.5: Neutral (excellent for vegetables, grains)
- pH 7.5-8.5: Alkaline (add sulfur, grow barley)
- pH >8.5: Highly alkaline (major amendments needed)

NUTRIENT LEVELS (ppm):
- Nitrogen: <20=Low, 20-40=Medium, >40=High
- Phosphorus: <15=Low, 15-30=Medium, >30=High
- Potassium: <100=Low, 100-200=Medium, >200=High

Return ONLY valid JSON:
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

      const response = await this.callAPI(`SOIL ANALYSIS:
PH: ${sanitizedSample.ph}
Nitrogen: ${sanitizedSample.nitrogen} ppm
Phosphorus: ${sanitizedSample.phosphorus} ppm
Potassium: ${sanitizedSample.potassium} ppm
Moisture: ${sanitizedSample.moisture}%
Organic Matter: ${sanitizedSample.organicMatter}%
Temperature: ${sanitizedSample.temperature}°C
Salinity: ${sanitizedSample.salinity} dS/m

Provide scientific analysis with exactly 5 crops suitable for these conditions.`, systemPrompt);
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
    // Sanitize input data to prevent XSS
    const sanitizedData = this.sanitizeInputData(farmData);
    
    const systemPrompt = `You are an expert precision agriculture specialist with IoT and sensor technology expertise.

SENSOR ANALYSIS RULES:
- Soil Moisture: <30%=Low, 30-60%=Optimal, >60%=High
- Air Temperature: <15°C=Low, 15-30°C=Optimal, >30°C=High
- Humidity: <40%=Low, 40-70%=Optimal, >70%=High
- Light Intensity: <20000 lux=Low, 20000-50000=Good, >50000=High

IRRIGATION SCHEDULING:
- Morning irrigation (6-8 AM) most efficient
- Avoid midday watering (water loss)
- Evening watering can cause fungal issues

Return ONLY valid JSON:
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

    const response = await this.callAPI(`IOT SENSOR MONITORING:
Soil Moisture: ${sanitizedData.soilMoisture}%
Air Temperature: ${sanitizedData.airTemperature}°C
Humidity: ${sanitizedData.humidity}%
Light Intensity: ${sanitizedData.lightIntensity} lux
Recent Rainfall: ${sanitizedData.rainfall}mm

Analyze sensor data scientifically and provide precise irrigation scheduling, climate optimization, and actionable farming recommendations based on current conditions.`, systemPrompt);
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
      primaryIssue: 'General Health Check',
      confidence: 75,
      diseases: [],
      treatmentPlan: {
        chemical: 'Preventive spray as needed',
        organic: 'Neem oil application',
        frequency: 'Monthly monitoring'
      },
      recommendations: {
        immediate: ['Monitor plant health', 'Check irrigation system'],
        weekly: ['Regular field inspection', 'Weather monitoring'],
        prevention: ['Maintain field hygiene', 'Use quality seeds']
      },
      expectedOutcome: {
        recoveryTime: '1-2 weeks',
        successRate: '90-95%',
        yieldRecovery: 'Full recovery'
      }
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