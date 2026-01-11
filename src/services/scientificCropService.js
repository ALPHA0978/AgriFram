import { BaseAI } from './baseAI.js';

export class ScientificCropService extends BaseAI {
  
  static async analyzeCropHealth(cropData, onStepUpdate = null) {
    try {
      if (!cropData.symptoms || cropData.symptoms.trim().length < 10) {
        return this.getNoSymptomsResponse(cropData);
      }

      onStepUpdate?.(1, 'Analyzing symptoms scientifically...');
      const symptoms = this.analyzeSymptoms(cropData);
      
      onStepUpdate?.(2, 'Identifying issue using agricultural science...');
      const diagnosis = this.identifyIssue(cropData, symptoms);
      
      onStepUpdate?.(3, 'Calculating scientific treatment...');
      const treatment = this.calculateScientificTreatment(cropData, diagnosis);
      
      onStepUpdate?.(4, 'Generating accurate recommendations...');
      const report = this.generateScientificReport(cropData, diagnosis, treatment);
      
      onStepUpdate?.(5, 'Finalizing agricultural plan...');
      
      return report;
    } catch (error) {
      console.error('Scientific Crop Service Error:', error);
      return this.getErrorResponse();
    }
  }

  static analyzeSymptoms(cropData) {
    const symptoms = cropData.symptoms.toLowerCase();
    const cropType = cropData.cropType.toLowerCase();
    const growthStage = cropData.growthStage?.toLowerCase();
    const currentFertilizer = cropData.fertilizer?.toLowerCase() || 'none';
    const irrigation = cropData.irrigationMethod?.toLowerCase();
    
    let analysis = {
      symptomType: 'General',
      likelyDeficiency: 'Multiple',
      urgency: 'Medium',
      confidence: 70
    };
    
    if (symptoms.includes('yellow') || symptoms.includes('chlorosis')) {
      analysis.symptomType = 'Chlorosis';
      
      if ((cropType === 'rice' && growthStage === 'vegetative') ||
          (cropType === 'wheat' && growthStage === 'vegetative') ||
          (cropType === 'maize' && growthStage === 'vegetative')) {
        analysis.likelyDeficiency = 'Nitrogen';
        analysis.confidence = 95;
      } else if (cropType === 'tomato' || cropType === 'potato') {
        analysis.likelyDeficiency = 'Nitrogen';
        analysis.confidence = 90;
      } else {
        analysis.likelyDeficiency = 'Nitrogen';
        analysis.confidence = 85;
      }
      
      if (currentFertilizer === 'none') {
        analysis.urgency = 'High';
        analysis.confidence += 5;
      }
    }
    
    if (symptoms.includes('brown') || symptoms.includes('spot') || symptoms.includes('necrosis')) {
      analysis.symptomType = 'Necrosis';
      analysis.likelyDeficiency = 'Potassium';
      analysis.urgency = 'High';
      analysis.confidence = 85;
    }
    
    if (symptoms.includes('wilt') || symptoms.includes('droop')) {
      analysis.symptomType = 'Wilting';
      if (irrigation === 'flood' || irrigation === 'sprinkler') {
        analysis.likelyDeficiency = 'Root rot or overwatering';
      } else {
        analysis.likelyDeficiency = 'Water stress';
      }
      analysis.urgency = 'Critical';
      analysis.confidence = 90;
    }
    
    return analysis;
  }

  static identifyIssue(cropData, symptoms) {
    const cropType = cropData.cropType.toLowerCase();
    const growthStage = cropData.growthStage?.toLowerCase();
    const weather = cropData.weatherConditions?.toLowerCase();
    const irrigation = cropData.irrigationMethod?.toLowerCase();
    
    let diagnosis = {
      primaryIssue: 'General Health Issue',
      category: 'Unknown',
      confidence: 70,
      yieldLoss: '10-20%'
    };
    
    if (symptoms.likelyDeficiency === 'Nitrogen') {
      diagnosis.primaryIssue = 'Nitrogen Deficiency';
      diagnosis.category = 'Nutrient Deficiency';
      
      if (cropType === 'rice') {
        diagnosis.confidence = 95;
        diagnosis.yieldLoss = growthStage === 'vegetative' ? '15-25%' : '25-35%';
      } else if (cropType === 'wheat') {
        diagnosis.confidence = 92;
        diagnosis.yieldLoss = '20-30%';
      } else if (cropType === 'maize' || cropType === 'corn') {
        diagnosis.confidence = 90;
        diagnosis.yieldLoss = '15-25%';
      } else if (cropType === 'tomato') {
        diagnosis.confidence = 88;
        diagnosis.yieldLoss = '10-20%';
      } else {
        diagnosis.confidence = 85;
        diagnosis.yieldLoss = '15-25%';
      }
    }
    else if (symptoms.likelyDeficiency === 'Potassium') {
      diagnosis.primaryIssue = 'Potassium Deficiency';
      diagnosis.category = 'Nutrient Deficiency';
      diagnosis.confidence = 85;
      diagnosis.yieldLoss = '20-30%';
    }
    else if (symptoms.likelyDeficiency.includes('water') || symptoms.likelyDeficiency.includes('root')) {
      diagnosis.primaryIssue = 'Water Management Issue';
      diagnosis.category = 'Cultural Problem';
      diagnosis.confidence = 90;
      diagnosis.yieldLoss = '25-40%';
    }
    
    if (weather?.includes('rain') && irrigation === 'flood') {
      diagnosis.yieldLoss = '30-50%';
    }
    
    return diagnosis;
  }

  static calculateScientificTreatment(cropData, diagnosis) {
    const fieldSize = parseFloat(cropData.fieldSize) || 1;
    const cropType = cropData.cropType.toLowerCase();
    const growthStage = cropData.growthStage?.toLowerCase();
    const variety = cropData.variety?.toLowerCase();
    const currentFertilizer = cropData.fertilizer?.toLowerCase() || 'none';
    const irrigation = cropData.irrigationMethod?.toLowerCase();
    const issue = diagnosis.primaryIssue?.toLowerCase();
    const location = cropData.location?.toLowerCase();
    
    const treatmentContext = {
      fieldSize,
      cropType,
      growthStage,
      variety,
      currentFertilizer,
      irrigation,
      location,
      issue
    };

    if (issue.includes('nitrogen')) {
      if (cropType === 'rice') {
        return this.getRiceNitrogenTreatment(treatmentContext);
      } else if (cropType === 'wheat') {
        return this.getWheatNitrogenTreatment(treatmentContext);
      } else if (cropType === 'maize' || cropType === 'corn') {
        return this.getMaizeNitrogenTreatment(treatmentContext);
      } else if (cropType === 'tomato') {
        return this.getTomatoNitrogenTreatment(treatmentContext);
      } else if (cropType === 'cotton') {
        return this.getCottonNitrogenTreatment(treatmentContext);
      }
    }
    
    if (issue.includes('potassium')) {
      return this.getPotassiumTreatment(treatmentContext);
    }
    
    if (issue.includes('water')) {
      return this.getWaterManagementTreatment(treatmentContext);
    }

    return this.getDefaultScientificTreatment(treatmentContext);
  }

  static getRiceNitrogenTreatment(context) {
    const { fieldSize, growthStage, variety, irrigation } = context;
    
    let ureaPerAcre = 37.5;
    
    if (growthStage === 'flowering' || growthStage === 'fruiting') {
      ureaPerAcre = 25;
    } else if (growthStage === 'seedling') {
      ureaPerAcre = 20;
    }
    
    if (variety?.includes('ir64') || variety?.includes('basmati')) {
      ureaPerAcre += 5;
    }
    
    if (irrigation === 'drip') {
      ureaPerAcre *= 0.8;
    }
    
    const totalUrea = fieldSize * ureaPerAcre;
    const fymPerAcre = 1.5;
    const totalFym = fieldSize * fymPerAcre;

    return {
      primaryTreatment: 'Urea Application for Nitrogen Deficiency',
      fertilizers: [{
        name: 'Urea (46% N)',
        type: 'Chemical',
        quantity: `${totalUrea} kg total (${ureaPerAcre} kg/acre)`,
        timing: 'Immediate application',
        method: 'Broadcasting in standing water',
        purpose: 'Nitrogen correction',
        cost: `₹${Math.round(fieldSize * 600)}-${Math.round(fieldSize * 800)}`
      }],
      manures: [{
        type: 'Well-decomposed FYM',
        quantity: `${totalFym} tons total (${fymPerAcre} tons/acre)`,
        preparation: 'Apply in next season during land preparation',
        benefits: 'Long-term soil health and organic matter',
        cost: `₹${Math.round(fieldSize * 1200)}-${Math.round(fieldSize * 1800)}`
      }],
      recoveryTime: '4-7 days',
      totalCost: `₹${Math.round(fieldSize * 800)}-${Math.round(fieldSize * 1200)}`
    };
  }

  static getWheatNitrogenTreatment(context) {
    const { fieldSize } = context;
    const ureaPerAcre = 40;
    const totalUrea = fieldSize * ureaPerAcre;

    return {
      primaryTreatment: 'Urea Top-dressing for Wheat',
      fertilizers: [{
        name: 'Urea (46% N)',
        type: 'Chemical',
        quantity: `${totalUrea} kg total (${ureaPerAcre} kg/acre)`,
        timing: 'Immediate side-dressing',
        method: 'Side-dressing between rows',
        purpose: 'Nitrogen boost',
        cost: `₹${Math.round(fieldSize * 700)}-${Math.round(fieldSize * 900)}`
      }],
      manures: [{
        type: 'Vermicompost',
        quantity: `${fieldSize * 2} tons total (2 tons/acre)`,
        preparation: 'Apply and incorporate lightly',
        benefits: 'Soil structure and slow-release nutrients',
        cost: `₹${Math.round(fieldSize * 2000)}-${Math.round(fieldSize * 3000)}`
      }],
      recoveryTime: '7-10 days',
      totalCost: `₹${Math.round(fieldSize * 1000)}-${Math.round(fieldSize * 1500)}`
    };
  }

  static getMaizeNitrogenTreatment(context) {
    const { fieldSize, growthStage } = context;
    const ureaPerAcre = growthStage === 'vegetative' ? 45 : 35;
    const totalUrea = fieldSize * ureaPerAcre;

    return {
      primaryTreatment: 'Urea Side-dressing for Maize',
      fertilizers: [{
        name: 'Urea (46% N)',
        type: 'Chemical',
        quantity: `${totalUrea} kg total (${ureaPerAcre} kg/acre)`,
        timing: 'Side-dress between rows',
        method: 'Band application',
        purpose: 'Nitrogen boost',
        cost: `₹${Math.round(fieldSize * 800)}-${Math.round(fieldSize * 1000)}`
      }],
      manures: [{
        type: 'Compost',
        quantity: `${fieldSize * 2} tons total (2 tons/acre)`,
        preparation: 'Apply around plants',
        benefits: 'Soil health and slow-release nutrients',
        cost: `₹${Math.round(fieldSize * 1500)}-${Math.round(fieldSize * 2000)}`
      }],
      recoveryTime: '5-8 days',
      totalCost: `₹${Math.round(fieldSize * 1200)}-${Math.round(fieldSize * 1600)}`
    };
  }

  static getTomatoNitrogenTreatment(context) {
    const { fieldSize } = context;
    return {
      primaryTreatment: 'Balanced NPK for Tomato Nitrogen',
      fertilizers: [{
        name: 'NPK 19-19-19',
        type: 'Chemical',
        quantity: `${fieldSize * 30} kg total (30 kg/acre)`,
        timing: 'Weekly fertigation',
        method: 'Drip irrigation or soil application',
        purpose: 'Balanced nutrition with nitrogen focus',
        cost: `₹${Math.round(fieldSize * 1400)}-${Math.round(fieldSize * 1800)}`
      }],
      manures: [{
        type: 'Vermicompost',
        quantity: `${fieldSize * 2.5} tons total (2.5 tons/acre)`,
        preparation: 'Apply around root zone',
        benefits: 'Organic nitrogen and soil health',
        cost: `₹${Math.round(fieldSize * 2000)}-${Math.round(fieldSize * 2800)}`
      }],
      recoveryTime: '7-10 days',
      totalCost: `₹${Math.round(fieldSize * 2200)}-${Math.round(fieldSize * 3000)}`
    };
  }

  static getCottonNitrogenTreatment(context) {
    const { fieldSize, growthStage } = context;
    const ureaPerAcre = growthStage === 'vegetative' ? 50 : 40;
    const totalUrea = fieldSize * ureaPerAcre;

    return {
      primaryTreatment: 'Urea Application for Cotton',
      fertilizers: [{
        name: 'Urea (46% N)',
        type: 'Chemical',
        quantity: `${totalUrea} kg total (${ureaPerAcre} kg/acre)`,
        timing: 'Split application',
        method: 'Side-dressing',
        purpose: 'Nitrogen for vegetative growth',
        cost: `₹${Math.round(fieldSize * 900)}-${Math.round(fieldSize * 1200)}`
      }],
      manures: [{
        type: 'FYM',
        quantity: `${fieldSize * 2} tons total (2 tons/acre)`,
        preparation: 'Well-decomposed, apply before planting',
        benefits: 'Long-term soil fertility',
        cost: `₹${Math.round(fieldSize * 1600)}-${Math.round(fieldSize * 2200)}`
      }],
      recoveryTime: '6-9 days',
      totalCost: `₹${Math.round(fieldSize * 1400)}-${Math.round(fieldSize * 1800)}`
    };
  }

  static getPotassiumTreatment(context) {
    const { fieldSize } = context;
    return {
      primaryTreatment: 'Potassium Correction',
      fertilizers: [{
        name: 'Muriate of Potash (MOP)',
        type: 'Chemical',
        quantity: `${fieldSize * 25} kg total (25 kg/acre)`,
        timing: 'Immediate application',
        method: 'Broadcasting',
        purpose: 'Potassium deficiency correction',
        cost: `₹${Math.round(fieldSize * 700)}-${Math.round(fieldSize * 900)}`
      }],
      manures: [{
        type: 'Wood Ash',
        quantity: `${fieldSize * 0.5} tons total (0.5 tons/acre)`,
        preparation: 'Mix with soil',
        benefits: 'Natural potassium source',
        cost: `₹${Math.round(fieldSize * 300)}-${Math.round(fieldSize * 500)}`
      }],
      recoveryTime: '10-14 days',
      totalCost: `₹${Math.round(fieldSize * 800)}-${Math.round(fieldSize * 1100)}`
    };
  }

  static getWaterManagementTreatment(context) {
    return {
      primaryTreatment: 'Water Management Correction',
      fertilizers: [{
        name: 'No fertilizer needed',
        type: 'Management',
        quantity: 'Adjust irrigation schedule',
        timing: 'Immediate',
        method: 'Irrigation management',
        purpose: 'Water stress correction',
        cost: '₹0'
      }],
      manures: [],
      recoveryTime: '3-5 days',
      totalCost: '₹0 (Management only)'
    };
  }

  static getDefaultScientificTreatment(context) {
    const { fieldSize, cropType } = context;
    return {
      primaryTreatment: `Balanced Nutrition for ${cropType}`,
      fertilizers: [{
        name: 'NPK 12-32-16',
        type: 'Chemical',
        quantity: `${fieldSize * 30} kg total (30 kg/acre)`,
        timing: 'As per crop requirement',
        method: 'Broadcasting',
        purpose: 'Balanced nutrition',
        cost: `₹${Math.round(fieldSize * 900)}-${Math.round(fieldSize * 1200)}`
      }],
      manures: [{
        type: 'Compost',
        quantity: `${fieldSize * 2} tons total (2 tons/acre)`,
        preparation: 'Apply during land preparation',
        benefits: 'Soil health improvement',
        cost: `₹${Math.round(fieldSize * 1000)}-${Math.round(fieldSize * 1500)}`
      }],
      recoveryTime: '7-14 days',
      totalCost: `₹${Math.round(fieldSize * 1200)}-${Math.round(fieldSize * 1800)}`
    };
  }

  static generateScientificReport(cropData, diagnosis, treatment) {
    const healthScore = diagnosis.primaryIssue.includes('Nitrogen') ? 65 : 70;
    const recoveryTime = treatment.recoveryTime || '7-14 days';

    return {
      cropHealth: 'Fair',
      healthScore,
      primaryIssue: diagnosis.primaryIssue,
      confidence: diagnosis.confidence,
      diseases: [{
        name: diagnosis.primaryIssue,
        type: diagnosis.category,
        severity: 'Moderate',
        symptoms: [cropData.symptoms],
        treatment: treatment.primaryTreatment,
        cost: treatment.totalCost,
        urgency: 'Within week'
      }],
      treatmentPlan: {
        chemical: `${treatment.fertilizers[0].name} @ ${treatment.fertilizers[0].quantity}`,
        organic: `${treatment.manures[0]?.type || 'Organic'} Application`,
        frequency: 'Single application with monitoring',
        fertilizers: treatment.fertilizers,
        manures: treatment.manures
      },
      recommendations: {
        immediate: [
          `Apply ${treatment.fertilizers[0].name} immediately`,
          'Monitor leaf color changes daily',
          'Maintain proper water management'
        ],
        weekly: [
          'Check treatment response after 5-7 days',
          'Apply foliar spray if needed',
          'Monitor new growth'
        ],
        prevention: [
          'Split fertilizer applications in future',
          'Regular soil testing',
          'Balanced nutrition program'
        ]
      },
      expectedOutcome: {
        recoveryTime,
        successRate: '90-95%',
        yieldRecovery: '85-95%'
      }
    };
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
          'Follow standard crop care practices',
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

  static getErrorResponse() {
    return {
      error: 'Crop health analysis failed. Please check your data and try again.',
      cropHealth: 'Unknown'
    };
  }
}