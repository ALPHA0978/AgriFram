import { BaseAI } from './baseAI.js';
import { sanitizeObject } from '../utils/sanitize.js';

export const FALLBACK_DISCLAIMER = '⚠️ DISCLAIMER: This is fallback/default data. The AI cloud service (minimax-m2:cloud) could not be reached or returned an error. The information shown is pre-defined default data and NOT a real AI analysis. Please check your internet connection and try again.';

export class FarmerAI extends BaseAI {
  static sanitizeInputData(data) {
    const sanitized = sanitizeObject(data);
    if (data.imageData) {
      sanitized.imageData = data.imageData; // Restore base64 untouched
    }
    return sanitized;
  }
  static async analyzeCrop(cropData, onStepUpdate = null) {
    const analysisId = `[CROP-${Date.now()}]`;
    console.log(`${analysisId} 🤖 Starting Ollama Cloud Swarm for: ${cropData.cropType || 'Unknown crop'}`);
    const startTime = Date.now();
    try {
      const sanitizedData = this.sanitizeInputData(cropData);
<<<<<<< HEAD
      const farmDataStr = JSON.stringify(sanitizedData);

      // If the user uploaded a camera scan, we use it for the vision agent
      let imageBase64 = null;
      if (sanitizedData.imageData) {
        imageBase64 = sanitizedData.imageData.includes(',')
          ? sanitizedData.imageData.split(',')[1]
          : sanitizedData.imageData;
        // Clean any weird characters / newlines that might break the base64 parser
        imageBase64 = imageBase64.replace(/[^A-Za-z0-9+/=]/g, '');
      }

      onStepUpdate?.(1, 'Agent Swarm Initiated: Launching Pathologist, Data Analyst, & Economist in parallel...');

      // ----------------------------------------------------------------------
      // STEP 1: Execute 3 Specialized Agents AT THE EXACT SAME TIME (Parallel)
      // ----------------------------------------------------------------------
      const [visionReport, dataReport, marketReport] = await Promise.all([

        // 👁️ Agent 1: The Diagnostician (Qwen3-VL Vision)
        this.callAPI(
          `Analyze crop: ${sanitizedData.cropType || 'Unknown'}. Symptoms: ${sanitizedData.symptoms || 'None'}. Provide a strict diagnosis of the disease or pest.`,
          'You are a crop pathologist (Diagnostician). Identify specific diseases and pests.',
          'qwen3-vl:235b-cloud',
          imageBase64 ? [imageBase64] : undefined
        ).catch(e => `Vision Agent Failed: ${e.message}`),

        // 🔬 Agent 2: The Data Analyst
        this.callAPI(
          `Raw input: ${farmDataStr}. Analyze the field size, growth stage, fertilizer, and weather. Highlight any critical agricultural risks.`,
          'You are an expert Data Analyst (Soil/Weather). Be highly analytical and concise.',
          'qwen3-coder:480b-cloud'
        ).catch(e => `Data Agent Failed: ${e.message}`),

        // 📈 Agent 3: The Economist
        this.callAPI(
          `Crop: ${sanitizedData.cropType || 'Unknown'}. Inputs used: Fertilizer (${sanitizedData.fertilizer || 'None'}), Pesticide (${sanitizedData.pesticide || 'None'}). Analyze ROI and economic risks.`,
          'You are an Agricultural Economist. Focus on ROI, cost-saving, and market efficiency.',
          'glm-4.6:cloud'
        ).catch(e => `Market Agent Failed: ${e.message}`)

      ]);

      console.log(`${analysisId} ✅ Phase 1 Complete - Specialized Agents reported back.`);
      onStepUpdate?.(3, 'Master Agronomist is synthesizing the expert reports...');

      // ----------------------------------------------------------------------
      // STEP 2: The Master Agent (Llama 3 Cloud) synthesizes the final JSON
      // ----------------------------------------------------------------------
      const bossPrompt = `
You are the Master Agronomist. Review the findings from your three specialized agents:

[Agent 1: Diagnostician (LLaVA)]
${visionReport}

[Agent 2: Data Analyst (Qwen2)]
${dataReport}

[Agent 3: Economist (Mistral)]
${marketReport}

Based entirely on these 3 reports, synthesize ONE final JSON object for the farmer. 
CRITICAL RULE: If the user provided an image for visual analysis, DO NOT complain about missing data (like field size, location, or fertilizer). Assume the user only wants an Image Health Diagnosis. Base your Health Score and Crop Status purely on the visual evidence provided by Agent 1!
Return ONLY valid JSON matching this exact structure:
{
  "cropHealth": "Excellent|Good|Fair|Poor|Critical",
  "healthScore": 85,
  "primaryIssue": "Name of main disease/pest/issue from the reports",
  "diseases": [
    {
      "name": "Disease/Pest Name",
      "type": "Fungal|Bacterial|Pest|Nutrient",
      "severity": "Low|Medium|High|Critical",
      "symptoms": ["symptom1", "symptom2"],
      "treatment": "Specific treatment recommended",
      "cost": "Estimated cost",
      "urgency": "Immediate|Monitor|Low"
    }
  ],
  "treatmentPlan": {
    "chemical": "Chemical recommendation",
    "organic": "Organic alternative",
    "frequency": "How often to apply"
  },
  "recommendations": {
    "immediate": ["Do this today"],
    "weekly": ["Do this weekly"],
    "prevention": ["Do this next season"]
  },
  "expectedOutcome": {
    "recoveryTime": "Time to recover",
    "successRate": "Probability of success (e.g. 85%)",
    "yieldRecovery": "Expected yield impact"
  }
}
      `;

      const bossResponse = await this.callAPI(
        bossPrompt,
        'You are the Master Agronomist. Return ONLY strictly valid raw JSON without markdown formatting.',
        'deepseek-v3.1:671b-cloud'
      );

      const finalAnalysis = this.parseJSON(bossResponse);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`${analysisId} 🎉 Swarm analysis complete in ${elapsed}s`);
      onStepUpdate?.(5, 'Analysis Complete!');

      if (!finalAnalysis || !finalAnalysis.healthScore) {
        throw new Error('Master Agent failed to return a valid JSON structure');
      }

      return finalAnalysis;
=======
      
      // Check if there are actual symptoms or issues to analyze
      const hasSymptoms = sanitizedData.symptoms && sanitizedData.symptoms.trim().length > 0;
      const hasIssues = hasSymptoms || (sanitizedData.fertilizer && sanitizedData.pesticide);
      
      if (!hasSymptoms) {
        // Return general health assessment without specific treatments
        return this.getGeneralHealthAssessment(sanitizedData);
      }
      
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
>>>>>>> b1c0ef6f730291532a9ac052a352ec97bca4d496
    } catch (error) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`${analysisId} ❌ Crop analysis error after ${elapsed}s:`, error.message);
      console.warn(`${analysisId} ⚠️ Returning fallback data - ${FALLBACK_DISCLAIMER}`);
      return this.getDefaultCropAnalysis();
    }
  }

  static async analyzeSymptoms(cropData) {
    const systemPrompt = `Return JSON:
{"problemType":"Bacterial Disease|Fungal Disease|Pest Infestation|Nutrient Deficiency|Healthy","confidence":85,"keySymptoms":["symptom1","symptom2"],"affectedParts":["leaves"],"pattern":"localized","urgency":"Immediate"}`;

    const response = await this.callAPI(`Crop: ${cropData.cropType}. Symptoms: ${cropData.symptoms || 'None'}. Stage: ${cropData.growthStage}. Classify.`, systemPrompt);
    return this.parseJSON(response) || { problemType: 'Healthy', confidence: 50 };
  }

  static async identifyIssue(cropData, symptomAnalysis) {
    const systemPrompt = `Return JSON:
{"specificIssue":"disease name","scientificName":"name","causativeAgent":"fungus","transmissionMode":"airborne","riskFactors":["factor1"]}`;

    const response = await this.callAPI(`Crop: ${cropData.cropType}. Problem: ${symptomAnalysis.problemType}. Symptoms: ${symptomAnalysis.keySymptoms?.join(', ')}. Identify.`, systemPrompt);
    return this.parseJSON(response) || { specificIssue: 'Unknown', causativeAgent: 'unknown' };
  }

  static async assessSeverity(cropData, identification) {
    const systemPrompt = `Return JSON:
{"severityLevel":"Medium","affectedPercentage":25,"spreadRate":"Moderate","yieldImpact":"15-30%","economicLoss":"₹5000","timeToAction":"3-7 days"}`;

    const response = await this.callAPI(`Crop: ${cropData.cropType}. Size: ${cropData.fieldSize} acres. Issue: ${identification.specificIssue}. Assess severity.`, systemPrompt);
    return this.parseJSON(response) || { severityLevel: 'Medium', affectedPercentage: 20 };
  }

  static async selectTreatment(cropData, identification, severity) {
<<<<<<< HEAD
    const systemPrompt = `Return JSON:
{"primaryTreatment":"treatment","activeIngredient":"ingredient","dosage":"rate","applicationMethod":"spray","frequency":"weekly","alternativeTreatment":"organic","cost":"₹1000","effectiveness":"85%"}`;

    const response = await this.callAPI(`Issue: ${identification.specificIssue}. Agent: ${identification.causativeAgent}. Severity: ${severity.severityLevel}. Select treatment.`, systemPrompt);
    return this.parseJSON(response) || { primaryTreatment: 'General fungicide', cost: '₹1000' };
  }

  static async generateFinalRecommendations(cropData, analysisSteps) {
    const systemPrompt = `Return JSON:
{"cropHealth":"Good","healthScore":75,"primaryIssue":"${analysisSteps.identification.specificIssue}","confidence":90,"diseases":[{"name":"${analysisSteps.identification.specificIssue}","type":"${analysisSteps.identification.causativeAgent}","severity":"${analysisSteps.severity.severityLevel}","symptoms":${JSON.stringify(analysisSteps.symptoms.keySymptoms || [])},"treatment":"${analysisSteps.treatment.primaryTreatment}","cost":"${analysisSteps.treatment.cost}","urgency":"${analysisSteps.symptoms.urgency}"}],"treatmentPlan":{"chemical":"${analysisSteps.treatment.activeIngredient} @ ${analysisSteps.treatment.dosage}","organic":"${analysisSteps.treatment.alternativeTreatment}","frequency":"${analysisSteps.treatment.frequency}"},"recommendations":{"immediate":["Apply treatment","Monitor"],"weekly":["Check progress"],"prevention":["Use resistant varieties"]},"expectedOutcome":{"recoveryTime":"2-4 weeks","successRate":"${analysisSteps.treatment.effectiveness}","yieldRecovery":"Full recovery"}}`;

    const response = await this.callAPI(`Crop: ${cropData.cropType}. Problem: ${analysisSteps.identification.specificIssue}. Severity: ${analysisSteps.severity.severityLevel}. Final recommendations.`, systemPrompt);
=======
    const systemPrompt = `You are a crop treatment specialist. Select optimal treatment with specific fertilizer/manure recommendations. Return ONLY valid JSON:
{
  "primaryTreatment": "specific treatment method",
  "activeIngredient": "chemical/biological agent",
  "dosage": "application rate",
  "applicationMethod": "spray|drench|granular|injection",
  "frequency": "application schedule",
  "alternativeTreatment": "organic/biological option",
  "fertilizers": [
    {
      "type": "Organic|Chemical|Bio-fertilizer",
      "name": "specific fertilizer/manure name",
      "quantity": "kg/acre or tons/acre",
      "purpose": "nutrient correction|growth boost|disease resistance",
      "timing": "application timing",
      "cost": "₹X-Y per acre"
    }
  ],
  "manures": [
    {
      "type": "Cow Dung|Poultry|Vermicompost|Green Manure",
      "quantity": "tons per acre",
      "preparation": "how to prepare/apply",
      "benefits": "specific benefits for this issue",
      "cost": "₹X-Y per acre"
    }
  ],
  "cost": "₹800-1500",
  "effectiveness": "85-95%|70-85%|60-75%|<60%"
}`;

    const response = await this.callAPI(`TREATMENT SELECTION:
Issue: ${identification.specificIssue}
Causative Agent: ${identification.causativeAgent}
Severity: ${severity.severityLevel}
Field Size: ${cropData.fieldSize} acres
Urgency: ${severity.timeToAction}
Crop Type: ${cropData.cropType}

Select the most effective treatment with specific fertilizer and manure recommendations for this issue.`, systemPrompt);
    
    return this.parseJSON(response) || {
      primaryTreatment: 'General fungicide', 
      fertilizers: [{type: 'Chemical', name: 'NPK 19:19:19', quantity: '50 kg/acre', purpose: 'balanced nutrition', timing: 'After treatment', cost: '₹1200-1500'}],
      manures: [{type: 'Cow Dung', quantity: '5 tons/acre', preparation: 'Well-decomposed, mix with soil', benefits: 'Improves soil health and disease resistance', cost: '₹2000-3000'}],
      cost: '₹1000'
    };
  }

  static async generateFinalRecommendations(cropData, analysisSteps) {
    const systemPrompt = `You are a senior agricultural consultant. Provide final recommendations with detailed fertilizer and manure guidance. Return ONLY valid JSON:
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
    "frequency": "${analysisSteps.treatment.frequency}",
    "fertilizers": ${JSON.stringify(analysisSteps.treatment.fertilizers || [])},
    "manures": ${JSON.stringify(analysisSteps.treatment.manures || [])}
  },
  "recommendations": {
    "immediate": ["Apply ${analysisSteps.treatment.primaryTreatment}", "Apply recommended fertilizers", "Monitor spread"],
    "weekly": ["Check treatment effectiveness", "Monitor fertilizer response", "Repeat if needed"],
    "prevention": ["Use resistant varieties", "Regular manure application", "Improve field hygiene"]
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
- Fertilizers: ${JSON.stringify(analysisSteps.treatment.fertilizers)}
- Manures: ${JSON.stringify(analysisSteps.treatment.manures)}
- Confidence: ${analysisSteps.symptoms.confidence}%

Provide comprehensive final recommendations including specific fertilizer and manure guidance.`, systemPrompt);
    
>>>>>>> b1c0ef6f730291532a9ac052a352ec97bca4d496
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

  static async analyzeSoil(soilSample, onStepUpdate = null) {
    const analysisId = `[SOIL-${Date.now()}]`;
    console.log(`${analysisId} 🌍 Starting Soil AI Swarm...`);
    const startTime = Date.now();
    try {
      const s = this.sanitizeInputData(soilSample);
      const rawData = `pH: ${s.ph}, N: ${s.nitrogen}, P: ${s.phosphorus}, K: ${s.potassium}, OM: ${s.organicMatter}%, Moist: ${s.moisture}%, Temp: ${s.temperature}°C`;

      onStepUpdate?.(1, 'Agent Swarm Initiated: Launching Soil Chemist & Market Economist...');

      // ----------------------------------------------------------------------
      // STEP 1: Execute Specialized Agents in Parallel
      // ----------------------------------------------------------------------
      const [chemistryReport, cropMarketReport] = await Promise.all([

        // 🔬 Agent 1: Soil Chemist (Qwen)
        this.callAPI(
          `Analyze the physical/chemical makeup: ${rawData}. Provide a scientific breakdown of toxicity, deficiencies, and exact fertilizer needed.`,
          'You are a Chief Soil Chemist. Be highly technical and analytical.',
          'qwen3-coder:480b-cloud'
        ).catch(e => `Chemist Failed: ${e.message}`),

        // 📈 Agent 2: Crop Economist (Mistral/GLM)
        this.callAPI(
          `Given this soil data: ${rawData}. What are the 3 most profitable crops to grow right now? Include estimated ROI and investment cost.`,
          'You are an Agricultural Economist. Focus purely on crop profitability and market demand.',
          'glm-4.6:cloud'
        ).catch(e => `Economist Failed: ${e.message}`)

      ]);

      console.log(`${analysisId} ✅ Phase 1 Complete - Soil Agents reported back.`);
      onStepUpdate?.(3, 'Master Agronomist is synthesizing the soil analysis...');

      // ----------------------------------------------------------------------
      // STEP 2: The Master Agent synthesizes the final JSON
      // ----------------------------------------------------------------------
      const bossPrompt = `
You are the Master Agronomist. Review the findings from your two specialized agents:

[Agent 1: Soil Chemist]
${chemistryReport}

[Agent 2: Economist]
${cropMarketReport}

Synthesize ONE final JSON object for the farmer based strictly on these reports.
Return ONLY valid JSON matching this exact structure:
{
  "soilType": "e.g. Acidic Loam",
  "pH": "e.g. Acidic (5.5)",
  "healthScore": 82,
  "nutrients": {
    "nitrogen": "e.g. Medium (150 ppm)",
    "phosphorus": "e.g. High (45 ppm)",
    "potassium": "e.g. Medium (200 ppm)"
  },
  "organicMatter": "e.g. Medium (3.5%)",
  "salinity": "e.g. Low (0.8 dS/m)",
  "improvements": ["Action 1", "Action 2"],
  "fertilizers": ["Fertilizer 1", "Fertilizer 2"],
  "suitableCrops": [
    {
      "name": "Crop Name",
      "suitabilityScore": 90,
      "profitLevel": "High",
      "season": "Best season",
      "duration": "Duration",
      "investment": "Cost/acre",
      "roi": "150%",
      "marketDemand": "High",
      "riskLevel": "Low",
      "waterRequirement": "Medium",
      "soilMatch": "Why it matches"
    }
  ],
  "managementPlan": {
    "immediate": ["Do this now"],
    "shortTerm": ["Do this month"],
    "longTerm": ["Do this year"]
  },
  "monitoring": {
    "soilTesting": "Frequency",
    "organicMatter": "Frequency",
    "compaction": "Frequency",
    "salinity": "Frequency"
  },
  "riskFactors": ["Risk 1"],
  "successIndicators": ["Indicator 1"],
  "treatmentCost": "Total est cost"
}
      `;

      const bossResponse = await this.callAPI(
        bossPrompt,
        'You are the Master Agronomist. Return ONLY strictly valid raw JSON without markdown formatting.',
        'deepseek-v3.1:671b-cloud'
      );

      const finalAnalysis = this.parseJSON(bossResponse);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`${analysisId} 🎉 Soil Swarm complete in ${elapsed}s`);
      onStepUpdate?.(5, 'Analysis Complete!');

      if (finalAnalysis && typeof finalAnalysis === 'object' && Object.keys(finalAnalysis).length > 3) {
        return finalAnalysis;
      }

      console.warn(`${analysisId} ⚠️ AI returned invalid or incomplete object structure, using fallback data. Parsed:`, finalAnalysis);
      return this.getDefaultSoilAnalysis();
    } catch (error) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`${analysisId} ❌ Soil analysis error after ${elapsed}s:`, error.message);
      console.warn(`${analysisId} ⚠️ Using fallback data - ${FALLBACK_DISCLAIMER}`);
      return this.getDefaultSoilAnalysis();
    }
  }

  // Kept for backward compatibility - not called in fast mode
  static async analyzeSoilComposition(soilData) {
    return { soilTexture: 'Loam', drainage: 'Good', organicMatter: 'Medium' };
  }

  static async assessChemicalProperties(soilData, composition) {
    return { pHCategory: 'Neutral', nutrientStatus: { nitrogen: { level: 'Medium' }, phosphorus: { level: 'Medium' }, potassium: { level: 'Medium' } } };
  }

  static async evaluateSoilFertility(soilData, chemical) {
    return { fertilityRating: 'Good', healthScore: 75, limitingFactors: ['pH adjustment needed'] };
  }

  static async analyzeCropSuitability(soilData, fertility) {
    return { suitableCrops: [{ name: 'Wheat', suitabilityScore: 85, profitLevel: 'High Profit' }] };
  }

  static async generateSoilRecommendations(soilData, analysisSteps) {
    return this.getDefaultSoilAnalysis();
  }


  static selectSuitableCrops(values, classification) {
    // Priority: Salinity > pH > Nutrients
    if (values.salinity > 4) {
      return [
        { name: 'Barley', suitabilityScore: 85, profitLevel: 'Medium Profit', season: 'Rabi', duration: '4-5 months', investment: '₹15-20k/acre', roi: '120-150%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Low', soilMatch: `Salt-tolerant (EC ${values.salinity} dS/m)` },
        { name: 'Sugar Beet', suitabilityScore: 80, profitLevel: 'High Profit', season: 'Rabi', duration: '5-6 months', investment: '₹25-35k/acre', roi: '150-200%', marketDemand: 'High', riskLevel: 'Medium', waterRequirement: 'Medium', soilMatch: 'Excellent salinity tolerance' },
        { name: 'Quinoa', suitabilityScore: 90, profitLevel: 'High Profit', season: 'Rabi', duration: '3-4 months', investment: '₹20-30k/acre', roi: '180-250%', marketDemand: 'Very High', riskLevel: 'Medium', waterRequirement: 'Low', soilMatch: 'Superior salt tolerance + premium market' },
        { name: 'Date Palm', suitabilityScore: 88, profitLevel: 'High Profit', season: 'Year-round', duration: 'Perennial', investment: '₹80-120k/acre', roi: '200-300%', marketDemand: 'High', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Highly salt-tolerant tree crop' },
        { name: 'Spinach', suitabilityScore: 75, profitLevel: 'Medium Profit', season: 'Rabi', duration: '2-3 months', investment: '₹10-15k/acre', roi: '130-160%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Moderate salt tolerance' }
      ];
    }

    if (values.ph < 6.0) {
      return [
        { name: 'Potatoes', suitabilityScore: 90, profitLevel: 'Good Profit', season: 'Rabi', duration: '3-4 months', investment: '₹25-35k/acre', roi: '150-200%', marketDemand: 'High', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: `Perfect for pH ${values.ph} acidic soil` },
        { name: 'Blueberries', suitabilityScore: 95, profitLevel: 'High Profit', season: 'Year-round', duration: 'Perennial', investment: '₹80-120k/acre', roi: '250-400%', marketDemand: 'Very High', riskLevel: 'Medium', waterRequirement: 'Medium', soilMatch: 'Requires acidic soil pH 4.5-5.5' },
        { name: 'Tea', suitabilityScore: 92, profitLevel: 'High Profit', season: 'Year-round', duration: 'Perennial', investment: '₹40-60k/acre', roi: '200-300%', marketDemand: 'High', riskLevel: 'Low', waterRequirement: 'High', soilMatch: 'Thrives in acidic conditions' },
        { name: 'Sweet Potatoes', suitabilityScore: 85, profitLevel: 'Medium Profit', season: 'Kharif', duration: '4-5 months', investment: '₹20-30k/acre', roi: '140-180%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Low', soilMatch: 'Tolerates acidic soil well' },
        { name: 'Radish', suitabilityScore: 80, profitLevel: 'Medium Profit', season: 'Rabi', duration: '2-3 months', investment: '₹8-12k/acre', roi: '120-150%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Adapts to acidic conditions' }
      ];
    }

    return [
      { name: 'Wheat', suitabilityScore: 88, profitLevel: 'High Profit', season: 'Rabi', duration: '4-5 months', investment: '₹20-25k/acre', roi: '150-180%', marketDemand: 'High', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Good for neutral pH soil' },
      { name: 'Rice', suitabilityScore: 85, profitLevel: 'Medium Profit', season: 'Kharif', duration: '3-4 months', investment: '₹18-22k/acre', roi: '120-150%', marketDemand: 'High', riskLevel: 'Medium', waterRequirement: 'High', soilMatch: 'Versatile crop' },
      { name: 'Maize', suitabilityScore: 87, profitLevel: 'Stable Profit', season: 'Kharif', duration: '3-4 months', investment: '₹15-20k/acre', roi: '110-140%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Adapts to various conditions' }
    ];
  }

  static getpHAdvice(ph) {
    if (ph < 5.5) return 'Apply lime 300-500 kg/acre immediately';
    if (ph < 6.0) return 'Apply lime 200-300 kg/acre';
    if (ph > 8.5) return 'Apply sulfur 100-200 kg/acre';
    if (ph > 8.0) return 'Monitor for alkalinity issues';
    return 'pH is in acceptable range';
  }

  static getSuccessIndicators(values, problems) {
    const indicators = ['Improved crop germination and growth', 'Better nutrient uptake efficiency'];

    if (values.ph < 6.0) indicators.push('pH rises to 6.0-6.5 range');
    if (values.salinity > 4) indicators.push('Salinity reduces below 4 dS/m');
    if (values.nitrogen < 50) indicators.push('Healthier green foliage');

    indicators.push('Increased crop yields and quality');
    return indicators;
  }

  static async optimizeIrrigation(farmData) {
    const analysisId = `[IRRIGATION-${Date.now()}]`;
    console.log(`${analysisId} 💧 Starting irrigation optimization via minimax-m2:cloud...`);
    const startTime = Date.now();
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
    const parsed = this.parseJSON(response);
    if (parsed) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`${analysisId} ✅ Irrigation optimization complete in ${elapsed}s`);
      return parsed;
    }
    console.warn(`${analysisId} ⚠️ Using fallback irrigation data. ${FALLBACK_DISCLAIMER}`);
    return this.getDefaultIrrigation();
  }

  static async analyzeMarketConditions(location, season, soilType) {
    const analysisId = `[MARKET-${Date.now()}]`;
    console.log(`${analysisId} 📈 Starting Market Intelligence Swarm for ${location}...`);
    const startTime = Date.now();

    try {
      // ----------------------------------------------------------------------
      // STEP 1: Execute Specialized Agents in Parallel
      // ----------------------------------------------------------------------
      const [dataReport, marketReport] = await Promise.all([

        // 🔬 Agent 1: Data Analyst (Qwen)
        this.callAPI(
          `Location: ${location}. Season: ${season}. Based on current agricultural data, what are the top 3 crop shortages and 2 biggest nutritional gaps in this region?`,
          'You are an Agricultural Data Analyst. Focus purely on supply chain shortages and nutritional needs.',
          'qwen3-coder:480b-cloud'
        ).catch(e => `Data Agent Failed: ${e.message}`),

        // 📈 Agent 2: Crop Economist (GLM)
        this.callAPI(
          `Location: ${location}. Season: ${season}. What crops currently have rising market prices? Which FMCG/agricultural corporations have increased procurement demand here?`,
          'You are a Corporate Agricultural Economist. Focus on rising prices and corporate buyer demand.',
          'glm-4.6:cloud'
        ).catch(e => `Economist Failed: ${e.message}`)

      ]);

      console.log(`${analysisId} ✅ Phase 1 Complete - Market Agents reported back.`);

      // ----------------------------------------------------------------------
      // STEP 2: The Master Agent synthesizes the final JSON
      // ----------------------------------------------------------------------
      const bossPrompt = `
You are the Chief Market Intelligence Officer. Review the findings from your two specialized agents:

[Agent 1: Data Analyst (Shortages)]
${dataReport}

[Agent 2: Economist (Prices & Corporate Buyers)]
${marketReport}

Synthesize these reports into ONE final JSON object for the farmer.
Return ONLY valid JSON matching this exact structure:
{
  "shortages": ["crop1", "crop2"],
  "corporateDemand": [{"company": "company name", "crops": ["crop1"], "increase": "25%"}],
  "priceRising": ["crop1", "crop2"],
  "nutritionNeeds": ["protein", "iron"]
}
      `;

      const bossResponse = await this.callAPI(
        bossPrompt,
        'You are the Chief Market Officer. Return ONLY strictly valid raw JSON without markdown formatting.',
        'deepseek-v3.1:671b-cloud'
      );

      const finalAnalysis = this.parseJSON(bossResponse);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`${analysisId} 🎉 Market Swarm complete in ${elapsed}s`);

      if (finalAnalysis && (finalAnalysis.shortages || finalAnalysis.priceRising)) {
        return finalAnalysis;
      }

      console.warn(`${analysisId} ⚠️ AI returned invalid format, falling back.`);
      return { shortages: ['Turmeric', 'Coriander'], priceRising: ['Chili', 'Millets'], nutritionNeeds: ['protein', 'iron'], _isFallback: true, _fallbackDisclaimer: FALLBACK_DISCLAIMER };

    } catch (error) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`${analysisId} ❌ Market analysis error after ${elapsed}s:`, error.message);
      console.warn(`${analysisId} ⚠️ Using fallback market data. ${FALLBACK_DISCLAIMER}`);
      return { shortages: ['Turmeric', 'Coriander'], priceRising: ['Chili', 'Millets'], nutritionNeeds: ['protein', 'iron'], _isFallback: true, _fallbackDisclaimer: FALLBACK_DISCLAIMER };
    }
  }

  static async suggestCropsBasedOnMarket(marketConditions, location, soilType, budget, season, farmSize, waterAvailability) {
    const systemPrompt = `You are an expert Agricultural Economist. The user has a STRICT MAXIMUM BUDGET of ₹${budget}. You MUST NEVER suggest crops that cost more than this budget to plant for the entire ${farmSize} acre farm. Return ONLY valid JSON matching this exact structure:
[
  {
    "name": "crop name",
    "profit": "high|medium|low",
    "investment": "Exact total cost under ₹${budget}",
    "reason": "why profitable based on market",
    "marketAlignment": "how it aligns with market needs",
    "soilSuitability": "why suitable for soil"
  }
]`;

    const marketInfo = `Shortages: ${marketConditions.shortages?.join(',')}, Rising prices: ${marketConditions.priceRising?.join(',')}`;
    const userPrompt = `${marketInfo}. Location: ${location}, Season: ${season}, Soil: ${soilType}, Farm Size: ${farmSize} acres. STRICT MAX BUDGET: ₹${budget}. Water: ${waterAvailability}. Suggest 3-5 crops strictly fitting Within the ₹${budget} total budget! If the budget is very low (e.g. ₹1000 for 5 acres = ₹200/acre), you MUST suggest extremely low-cost crops, microgreens, native cover crops, or localized low-investment intercropping. Do not hallucinate high investment costs!`;

    const response = await this.callAPI(userPrompt, systemPrompt, 'deepseek-v3.1:671b-cloud');

    const parsed = this.parseJSON(response);
    return parsed || [
      { name: 'Native Leafy Greens', profit: 'high', investment: `₹${budget}`, reason: 'Immediate cash flow, ultra-low cost', soilSuitability: 'Adapts easily' },
      { name: 'Local Forage/Fodder', profit: 'medium', investment: `₹${Math.floor(budget * 0.8)}`, reason: 'Zero input requirement', soilSuitability: 'Hardy in most soils' },
      { name: 'Seed Spices (boundary planting)', profit: 'medium', investment: `₹${Math.floor(budget * 0.5)}`, reason: 'Low water requirement', soilSuitability: 'Well suited' }
    ];
  }

  static async analyzeCorporateProcurement(crops, location) {
    const systemPrompt = `You are a corporate procurement analyst. Return ONLY valid JSON:
[{
  "company": "realistic buyer name (According to what the crop or vegetable is)",
  "crops": ["crop1"],
  "increasePercentage": "X%",
  "reason": "why increasing procurement",
  "contractOpportunity": "direct contract potential"
}]`;

    const response = await this.callAPI(
      `Analyze which platforms, markets, or companies are increasing procurement for ${crops.join(', ')} in ${location}. CRITICAL: Do NOT suggest FMCG companies like PepsiCo or Nestle for fresh vegetables (like Bottle Gourd or Spinach) unless they actually process them. For fresh vegetables, suggest Q-commerce (Zepto, Blinkit), Grocery Chains (Reliance Fresh, BigBasket, Mother Dairy/Safal), or Local Wholesale APMC Mandis. Only suggest FMCG for grains, potatoes, or cash crops. Provide realistic buyers.`,
      systemPrompt,
      'qwen3-coder:480b-cloud'
    );

    return this.parseJSON(response) || [
      { company: 'Local APMC Wholesale', crops: crops.slice(0, 2), increasePercentage: '30%', reason: 'Steady local demand' },
      { company: 'BigBasket/Zepto', crops: [crops[0]], increasePercentage: '25%', reason: 'Surge in quick-commerce fresh delivery' },
      { company: 'Mother Dairy (Safal)', crops: crops.slice(1, 3), increasePercentage: '20%', reason: 'Retail expansion' }
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
    return this.parseJSON(response) || [{ region: 'North India', shortage: crops[0], opportunity: 'Supply gap', demandLevel: 'High' }];
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
    return this.parseJSON(response) || crops.map(crop => ({ crop, futureValueIncrease: '+25%', reason: 'Market growth' }));
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
    return this.parseJSON(response) || crops.map(crop => ({ crop, growthPeriod: '90-120 days', season: 'Kharif' }));
  }

  static getGeneralHealthAssessment(cropData) {
    return {
      cropHealth: 'Good',
      healthScore: 85,
      primaryIssue: 'No Specific Issues Detected',
      confidence: 75,
      diseases: [],
      treatmentPlan: {
        chemical: 'No specific treatment needed - crop appears healthy',
        organic: 'Continue regular care practices',
        frequency: 'Monitor regularly for any changes'
      },
      recommendations: {
        immediate: ['Continue current care routine', 'Monitor for any symptoms', 'Maintain proper irrigation'],
        weekly: ['Regular field inspection', 'Check for pest activity', 'Monitor weather conditions'],
        prevention: ['Use quality seeds', 'Maintain field hygiene', 'Follow crop calendar']
      },
      expectedOutcome: {
        recoveryTime: 'No treatment needed',
        successRate: 'Crop appears healthy',
        yieldRecovery: 'Expected normal yield'
      },
      generalAdvice: {
        message: 'No specific symptoms detected. For accurate diagnosis and treatment recommendations, please provide detailed symptoms, growth issues, or pest problems.',
        nextSteps: ['Observe crop regularly', 'Report any unusual symptoms', 'Follow standard crop care practices']
      }
    };
  }

  static getDefaultCropAnalysis() {
    console.warn('⚠️ FALLBACK DATA IN USE:', FALLBACK_DISCLAIMER);
    return {
      _isFallback: true,
      _fallbackDisclaimer: FALLBACK_DISCLAIMER,
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
    console.warn('⚠️ FALLBACK DATA IN USE:', FALLBACK_DISCLAIMER);
    return {
      _isFallback: true,
      _fallbackDisclaimer: FALLBACK_DISCLAIMER,
      soilType: 'Standard soil requiring assessment',
      pH: 'Neutral (7.0) - Good for most crops',
      healthScore: 75,
      nutrients: { nitrogen: 'Medium', phosphorus: 'Medium', potassium: 'Medium' },
      organicMatter: 'Medium (3%)',
      improvements: ['Regular soil testing', 'Balanced fertilization', 'Organic matter maintenance'],
      fertilizers: ['Balanced NPK as needed', 'Organic compost 2-5 tons/acre', 'Micronutrients if deficient'],
      suitableCrops: [
        { name: 'Wheat', suitabilityScore: 85, profitLevel: 'High Profit', season: 'Rabi', duration: '4-5 months', investment: '₹20-25k/acre', roi: '150-180%', marketDemand: 'High', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Suitable for neutral soil' },
        { name: 'Rice', suitabilityScore: 80, profitLevel: 'Medium Profit', season: 'Kharif', duration: '3-4 months', investment: '₹18-22k/acre', roi: '120-150%', marketDemand: 'High', riskLevel: 'Medium', waterRequirement: 'High', soilMatch: 'Adapts to various soil types' },
        { name: 'Maize', suitabilityScore: 82, profitLevel: 'Stable Profit', season: 'Kharif', duration: '3-4 months', investment: '₹15-20k/acre', roi: '110-140%', marketDemand: 'Medium', riskLevel: 'Low', waterRequirement: 'Medium', soilMatch: 'Versatile crop for most soils' }
      ],
      managementPlan: {
        immediate: ['Soil testing for accurate assessment'],
        shortTerm: ['Balanced fertilization', 'Crop selection'],
        longTerm: ['Soil health monitoring', 'Sustainable practices']
      },
      monitoring: {
        soilTesting: 'Every 6 months',
        organicMatter: 'Annual assessment',
        compaction: 'Seasonal check',
        salinity: 'Monitor if needed'
      },
      riskFactors: ['Weather-related stress', 'Nutrient imbalances'],
      successIndicators: ['Healthy crop growth', 'Good yields', 'Soil health maintenance']
    };
  }

  static getDefaultIrrigation() {
    console.warn('⚠️ FALLBACK DATA IN USE:', FALLBACK_DISCLAIMER);
    return {
      _isFallback: true,
      _fallbackDisclaimer: FALLBACK_DISCLAIMER,
      overallStatus: 'Good',
      alerts: [
        { type: 'Soil Moisture', severity: 'Medium', message: 'Soil moisture slightly below optimal', action: 'Schedule irrigation within 6 hours' }
      ],
      sensorAnalysis: {
        soilMoisture: { status: 'Low', recommendation: 'Increase irrigation frequency' },
        temperature: { status: 'Optimal', recommendation: 'Continue current monitoring' },
        humidity: { status: 'Good', recommendation: 'Maintain current levels' },
        lightIntensity: { status: 'Optimal', recommendation: 'Good sunlight exposure' }
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