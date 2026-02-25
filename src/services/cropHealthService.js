import { BaseAI } from './baseAI.js';

export class CropHealthService extends BaseAI {
  
  static async analyzeCropHealth(cropData, onStepUpdate = null) {
    try {
      // Validate input data
      if (!cropData.symptoms || cropData.symptoms.trim().length < 10) {
        return this.getNoSymptomsResponse(cropData);
      }

      // Step 1: Symptom Analysis
      onStepUpdate?.(1, 'Analyzing leaf yellowing patterns and symptoms...');
      const symptomAnalysis = await this.analyzeSymptoms(cropData);
      
      // Step 2: Disease/Deficiency Identification
      onStepUpdate?.(2, 'Identifying specific nutrient deficiency or disease...');
      const diagnosis = await this.identifyIssue(cropData, symptomAnalysis);
      
      // Step 3: Severity Assessment
      onStepUpdate?.(3, 'Assessing severity and yield impact...');
      const severity = await this.assessSeverity(cropData, diagnosis);
      
      // Step 4: Treatment Calculation
      onStepUpdate?.(4, 'Calculating precise fertilizer and treatment doses...');
      const treatment = await this.calculateTreatment(cropData, diagnosis, severity);
      
      // Step 5: Final Recommendations
      onStepUpdate?.(5, 'Generating comprehensive treatment plan...');
      const finalReport = await this.generateFinalReport(cropData, {
        symptoms: symptomAnalysis,
        diagnosis,
        severity,
        treatment
      });
      
      return finalReport;
    } catch (error) {
      console.error('Crop Health Service Error:', error);
      return this.getErrorResponse();
    }
  }

  static async analyzeSymptoms(cropData) {
    const systemPrompt = `You are a plant pathologist specializing in rice diseases. Analyze symptoms scientifically. Return ONLY valid JSON:
{
  "symptomType": "Chlorosis|Necrosis|Wilting|Stunting|Discoloration",
  "pattern": "Uniform|Patchy|Progressive|Marginal|Interveinal",
  "affectedParts": ["older leaves|younger leaves|all leaves|stems|roots"],
  "progression": "Slow|Moderate|Fast|Very Fast",
  "likelyDeficiency": "Nitrogen|Phosphorus|Potassium|Iron|Magnesium|Sulfur|None",
  "diseaseIndicators": ["fungal|bacterial|viral|physiological"],
  "urgency": "Low|Medium|High|Critical",
  "confidence": 85
}`;

    const prompt = `CROP SYMPTOM ANALYSIS:
Crop: ${cropData.cropType} (${cropData.variety || 'Unknown variety'})
Growth Stage: ${cropData.growthStage}
Symptoms: ${cropData.symptoms}
Field Size: ${cropData.fieldSize} acres
Location: ${cropData.location}
Weather: ${cropData.weatherConditions || 'Not specified'}
Current Fertilizer: ${cropData.fertilizer || 'None applied'}

Analyze these symptoms scientifically for ${cropData.cropType} crop.`;

    const response = await this.callAPI(prompt, systemPrompt);
    return this.parseJSON(response) || {
      symptomType: 'Chlorosis',
      likelyDeficiency: 'Nitrogen',
      urgency: 'Medium',
      confidence: 70
    };
  }

  static async identifyIssue(cropData, symptoms) {
    const systemPrompt = `You are a crop disease specialist. Identify the specific issue for ${cropData.cropType}. Return ONLY valid JSON:
{
  "primaryIssue": "specific disease or deficiency name",
  "scientificName": "scientific name if disease",
  "category": "Nutrient Deficiency|Fungal Disease|Bacterial Disease|Viral Disease|Pest Damage",
  "causativeAgent": "specific cause",
  "riskFactors": ["environmental factors contributing"],
  "spreadRate": "None|Slow|Moderate|Fast",
  "yieldLoss": "5-10%|10-25%|25-50%|50%+",
  "confidence": 90
}`;

    const prompt = `${cropData.cropType.toUpperCase()} ISSUE IDENTIFICATION:
Symptoms: ${symptoms.symptomType} - ${symptoms.pattern}
Likely Deficiency: ${symptoms.likelyDeficiency}
Affected Parts: ${symptoms.affectedParts?.join(', ')}
Growth Stage: ${cropData.growthStage}
Weather: ${cropData.weatherConditions}
Irrigation: ${cropData.irrigationMethod}

Based on ${cropData.cropType}-specific knowledge, identify the exact issue.`;

    const response = await this.callAPI(prompt, systemPrompt);
    return this.parseJSON(response) || {
      primaryIssue: 'Nitrogen Deficiency',
      category: 'Nutrient Deficiency',
      yieldLoss: '10-25%',
      confidence: 80
    };
  }

  static async assessSeverity(cropData, diagnosis) {
    const systemPrompt = `You are a crop damage assessor for rice. Assess severity scientifically. Return ONLY valid JSON:
{
  "severityLevel": "Mild|Moderate|Severe|Critical",
  "affectedPercentage": 30,
  "yieldImpact": "5-15%|15-30%|30-50%|50%+",
  "economicLoss": "₹2000-5000|₹5000-15000|₹15000-30000|₹30000+",
  "timeToAction": "1-2 days|3-7 days|1-2 weeks|Immediate",
  "spreadRisk": "Low|Medium|High|Very High",
  "recoverability": "Full|Good|Partial|Poor"
}`;

    const fieldSizeMultiplier = parseFloat(cropData.fieldSize) || 1;
    const prompt = `${cropData.cropType.toUpperCase()} SEVERITY ASSESSMENT:
Issue: ${diagnosis.primaryIssue}
Category: ${diagnosis.category}
Field Size: ${fieldSizeMultiplier} acres
Growth Stage: ${cropData.growthStage}
Symptoms Description: ${cropData.symptoms}
Current Treatments: ${cropData.fertilizer || 'None'}, ${cropData.pesticide || 'None'}

Calculate severity and economic impact for ${fieldSizeMultiplier} acres of ${cropData.cropType}.`;

    const response = await this.callAPI(prompt, systemPrompt);
    return this.parseJSON(response) || {
      severityLevel: 'Moderate',
      affectedPercentage: 25,
      yieldImpact: '15-30%',
      timeToAction: '3-7 days'
    };
  }

  static async calculateTreatment(cropData, diagnosis, severity) {
    const fieldSize = parseFloat(cropData.fieldSize) || 1;
    
    const systemPrompt = `You are a ${cropData.cropType} nutrition specialist. Calculate precise treatments for ${fieldSize} acres. Return ONLY valid JSON:
{
  "primaryTreatment": "specific treatment name",
  "fertilizers": [
    {
      "name": "NPK 20-10-10|Urea|DAP|MOP",
      "quantity": "${fieldSize * 50} kg total (${50} kg/acre)",
      "timing": "Immediate|Split dose|After 15 days",
      "method": "Broadcasting|Side dressing|Foliar spray",
      "cost": "₹${Math.round(fieldSize * 800)}-${Math.round(fieldSize * 1200)}"
    }
  ],
  "organicOptions": [
    {
      "type": "Vermicompost|FYM|Neem Cake",
      "quantity": "${fieldSize * 5} tons total (5 tons/acre)",
      "application": "specific method",
      "benefits": "soil health improvement",
      "cost": "₹${Math.round(fieldSize * 1500)}-${Math.round(fieldSize * 2500)}"
    }
  ],
  "micronutrients": [
    {
      "name": "Iron Sulfate|Zinc Sulfate|Magnesium Sulfate",
      "dosage": "specific amount per acre",
      "method": "Foliar spray|Soil application"
    }
  ],
  "totalCost": "₹${Math.round(fieldSize * 2500)}-${Math.round(fieldSize * 4000)}",
  "applicationSchedule": "detailed timing"
}`;

    const prompt = `${cropData.cropType.toUpperCase()} TREATMENT CALCULATION:
Issue: ${diagnosis.primaryIssue}
Severity: ${severity.severityLevel}
Field Size: ${fieldSize} acres
Growth Stage: ${cropData.growthStage}
Current Fertilizer: ${cropData.fertilizer || 'None'}
Irrigation: ${cropData.irrigationMethod}

Calculate precise fertilizer doses for ${fieldSize} acres of ${cropData.cropType} with ${diagnosis.primaryIssue}.`;

    const response = await this.callAPI(prompt, systemPrompt);
    return this.parseJSON(response) || this.getDefaultTreatment(fieldSize);
  }

  static async generateFinalReport(cropData, analysis) {
    const systemPrompt = `You are a senior ${cropData.cropType} agronomist. Generate comprehensive report. Return ONLY valid JSON:
{
  "cropHealth": "Poor|Fair|Good|Excellent",
  "healthScore": 75,
  "primaryIssue": "${analysis.diagnosis.primaryIssue}",
  "confidence": 90,
  "diseases": [
    {
      "name": "${analysis.diagnosis.primaryIssue}",
      "type": "${analysis.diagnosis.category}",
      "severity": "${analysis.severity.severityLevel}",
      "symptoms": ["${analysis.symptoms.symptomType}", "progressive yellowing"],
      "treatment": "${analysis.treatment.primaryTreatment}",
      "cost": "${analysis.treatment.totalCost}",
      "urgency": "${analysis.severity.timeToAction}"
    }
  ],
  "treatmentPlan": {
    "chemical": "${analysis.treatment.fertilizers?.[0]?.name} @ ${analysis.treatment.fertilizers?.[0]?.quantity}",
    "organic": "${analysis.treatment.organicOptions?.[0]?.type} Application",
    "frequency": "${analysis.treatment.applicationSchedule}",
    "fertilizers": ${JSON.stringify(analysis.treatment.fertilizers || [])},
    "manures": ${JSON.stringify(analysis.treatment.organicOptions || [])}
  },
  "recommendations": {
    "immediate": [
      "Apply ${analysis.treatment.fertilizers?.[0]?.name} immediately",
      "Monitor leaf color changes daily",
      "Ensure proper drainage"
    ],
    "weekly": [
      "Check treatment response",
      "Apply second dose if needed",
      "Monitor new growth"
    ],
    "prevention": [
      "Split fertilizer applications",
      "Regular soil testing",
      "Balanced nutrition program"
    ]
  },
  "expectedOutcome": {
    "recoveryTime": "1-3 weeks|3-6 weeks",
    "successRate": "85-95%|70-85%",
    "yieldRecovery": "80-90%|60-80%"
  }
}`;

    const prompt = `RICE FINAL REPORT:
Crop: ${cropData.cropType} (${cropData.variety})
Issue: ${analysis.diagnosis.primaryIssue}
Severity: ${analysis.severity.severityLevel}
Field: ${cropData.fieldSize} acres
Treatment: ${analysis.treatment.primaryTreatment}

Generate comprehensive treatment report for rice farmer.`;

    const response = await this.callAPI(prompt, systemPrompt);
    return this.parseJSON(response) || this.getDefaultReport(cropData, analysis);
  }

  static getNoSymptomsResponse(cropData) {
    return {
      cropHealth: 'Good',
      healthScore: 85,
      primaryIssue: 'No Specific Issues Detected',
      confidence: 75,
      generalAdvice: {
        message: 'No specific symptoms detected. For accurate diagnosis, please describe detailed symptoms like leaf color changes, spots, wilting, or growth issues.',
        nextSteps: [
          'Monitor crop daily for any symptoms',
          'Follow standard rice care practices',
          'Report any unusual changes immediately'
        ]
      },
      treatmentPlan: {
        chemical: 'No specific treatment needed - crop appears healthy',
        organic: 'Continue regular care practices',
        frequency: 'Monitor regularly for changes'
      },
      recommendations: {
        immediate: ['Continue current care routine', 'Monitor for symptoms'],
        weekly: ['Regular field inspection', 'Check irrigation'],
        prevention: ['Balanced nutrition', 'Proper water management']
      }
    };
  }

  static getDefaultTreatment(fieldSize) {
    return {
      primaryTreatment: 'Balanced NPK Application',
      fertilizers: [
        {
          name: 'NPK 20-10-10',
          quantity: `${fieldSize * 60} kg total (60 kg/acre)`,
          timing: 'Immediate application',
          method: 'Broadcasting',
          cost: `₹${Math.round(fieldSize * 1000)}-${Math.round(fieldSize * 1500)}`
        }
      ],
      organicOptions: [
        {
          type: 'Vermicompost',
          quantity: `${fieldSize * 5} tons total (5 tons/acre)`,
          application: 'Mix with soil',
          benefits: 'Soil health improvement',
          cost: `₹${Math.round(fieldSize * 2000)}-${Math.round(fieldSize * 3000)}`
        }
      ],
      totalCost: `₹${Math.round(fieldSize * 3000)}-${Math.round(fieldSize * 4500)}`
    };
  }

  static getDefaultReport(cropData, analysis) {
    return {
      cropHealth: 'Fair',
      healthScore: 70,
      primaryIssue: analysis.diagnosis.primaryIssue || 'Nutrient Deficiency',
      confidence: 80,
      diseases: [
        {
          name: analysis.diagnosis.primaryIssue || 'Nutrient Deficiency',
          type: 'Nutrient Deficiency',
          severity: 'Moderate',
          symptoms: ['Leaf yellowing'],
          treatment: 'NPK Application',
          cost: '₹2000-3000',
          urgency: 'Within week'
        }
      ],
      treatmentPlan: analysis.treatment,
      recommendations: {
        immediate: ['Apply fertilizer', 'Monitor symptoms'],
        weekly: ['Check response', 'Adjust treatment'],
        prevention: ['Regular nutrition', 'Soil testing']
      },
      expectedOutcome: {
        recoveryTime: '2-4 weeks',
        successRate: '80-90%',
        yieldRecovery: '75-85%'
      }
    };
  }

  static getErrorResponse() {
    return {
      error: 'Crop health analysis failed. Please check your data and try again.',
      cropHealth: 'Unknown'
    };
  }
}