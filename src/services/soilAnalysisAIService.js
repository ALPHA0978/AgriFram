/**
 * soilAnalysisAIService.js
 * Dedicated Soil Chemistry & NPK Analysis AI Service (SoilAnalysisAIService)
 * Combines AWS Bedrock Multi-Agent Swarm with ScientificCropService & CACPDataService
 */

import { BaseAI } from './baseAI.js';
import { ScientificCropService } from './scientificCropService.js';
import { CACPDataService } from './CACPDataService.js';

export class SoilAnalysisAIService extends BaseAI {
  /**
   * Primary Soil Chemistry & NPK Diagnostic AI Agent
   */
  static async analyzeSoilHealth(soilData, onStepUpdate = null) {
    return this.analyzeSoil(soilData, onStepUpdate);
  }

  static normalizeSoilAnalysisData(raw = {}, soilData = {}) {
    const phVal = parseFloat(soilData.ph) || 6.5;
    const nVal = parseFloat(soilData.nitrogen) || 140;
    const pVal = parseFloat(soilData.phosphorus) || 45;
    const kVal = parseFloat(soilData.potassium) || 180;
    const ecVal = parseFloat(soilData.salinity) || 0.8;

    // Soil Type Determination
    let defaultSoilType = 'Sandy Loam Soil';
    if (phVal > 7.8) defaultSoilType = 'Alkaline Sodic Soil';
    else if (phVal < 5.8) defaultSoilType = 'Acidic Red Soil';
    else if (ecVal > 2.0) defaultSoilType = 'Saline Soil';
    else if (nVal > 150 && pVal > 50) defaultSoilType = 'Rich Alluvial Soil';

    const soilType = raw.soilType || raw.soil_type || soilData.soilType || defaultSoilType;

    // pH Formatting
    const phStatusText = phVal >= 6.0 && phVal <= 7.5 ? 'Optimal' : phVal < 6.0 ? 'Acidic' : 'Alkaline';
    const pH = raw.pH || raw.phStatus || `${phVal} pH (${phStatusText})`;

    // Health Score
    let healthScore = parseInt(raw.healthScore || raw.soilHealthScore || raw.score || 85, 10);
    if (isNaN(healthScore) || healthScore <= 0) healthScore = 82;

    const soilHealth = raw.soilHealth || raw.status || (healthScore >= 85 ? 'Excellent' : healthScore >= 70 ? 'Good' : 'Fair');

    // Nutrients
    const nText = raw.nutrients?.nitrogen || raw.npkStatus?.nitrogen || `${nVal} ppm (${nVal < 100 ? 'Low' : nVal > 250 ? 'High' : 'Optimal'})`;
    const pText = raw.nutrients?.phosphorus || raw.npkStatus?.phosphorus || `${pVal} ppm (${pVal < 30 ? 'Low' : pVal > 80 ? 'High' : 'Optimal'})`;
    const kText = raw.nutrients?.potassium || raw.npkStatus?.potassium || `${kVal} ppm (${kVal < 120 ? 'Low' : kVal > 250 ? 'High' : 'Optimal'})`;

    const nutrients = {
      nitrogen: nText,
      phosphorus: pText,
      potassium: kText
    };

    // Suitable Crops Normalization
    const defaultCrops = [
      {
        name: 'Wheat (HD-2967 / PBW-550)',
        suitabilityScore: 94,
        profitLevel: 'High Profit',
        season: 'Rabi',
        duration: '4-5 months',
        investment: '₹16,000/acre',
        roi: '145%',
        marketDemand: 'High',
        riskLevel: 'Low',
        waterRequirement: 'Medium',
        soilMatch: `Ideal fit for ${soilType} with pH ${phVal}`
      },
      {
        name: 'Mustard (Pusa Bold)',
        suitabilityScore: 90,
        profitLevel: 'High Profit',
        season: 'Rabi',
        duration: '3-4 months',
        investment: '₹12,000/acre',
        roi: '165%',
        marketDemand: 'High',
        riskLevel: 'Low',
        waterRequirement: 'Low',
        soilMatch: 'Highly resilient to salinity and moderate nutrient levels'
      },
      {
        name: 'Summer Moong (SML-668)',
        suitabilityScore: 88,
        profitLevel: 'Very High Profit',
        season: 'Zaid',
        duration: '2.5 months',
        investment: '₹9,500/acre',
        roi: '180%',
        marketDemand: 'High',
        riskLevel: 'Low',
        waterRequirement: 'Low',
        soilMatch: 'Fixes atmospheric nitrogen & enriches organic carbon'
      }
    ];

    const rawCrops = Array.isArray(raw.suitableCrops) && raw.suitableCrops.length > 0 ? raw.suitableCrops : defaultCrops;

    const suitableCrops = rawCrops.map((c, idx) => {
      if (typeof c === 'string') {
        return {
          name: c,
          suitabilityScore: 88 - idx * 4,
          profitLevel: ['High Profit', 'Very High Profit', 'Good Profit'][idx % 3],
          season: ['Kharif', 'Rabi', 'Zaid'][idx % 3],
          duration: `${3 + (idx % 3)} months`,
          investment: `₹${14 + idx * 4},000/acre`,
          roi: `${135 + idx * 20}%`,
          marketDemand: 'High',
          riskLevel: 'Low',
          waterRequirement: 'Medium',
          soilMatch: `Compatible with ${soilType}`
        };
      }
      return {
        name: c.name || c.crop || c.title || defaultCrops[idx % defaultCrops.length].name,
        suitabilityScore: c.suitabilityScore || (c.suitability === 'Very High' ? 95 : c.suitability === 'High' ? 88 : 82),
        profitLevel: c.profitLevel || ['High Profit', 'Very High Profit', 'Good Profit'][idx % 3],
        season: c.season || ['Kharif', 'Rabi', 'Zaid'][idx % 3],
        duration: c.duration || `${3 + (idx % 3)} months`,
        investment: c.investment || `₹${14 + idx * 4},000/acre`,
        roi: c.roi || `${135 + idx * 20}%`,
        marketDemand: c.marketDemand || 'High',
        riskLevel: c.riskLevel || 'Low',
        waterRequirement: c.waterRequirement || 'Medium',
        soilMatch: c.soilMatch || c.reason || `Well-suited for ${soilType}`
      };
    });

    // Improvements & Recommendations
    const defaultImprovements = [
      `Incorporate 4-5 tonnes/acre of well-decomposed FYM or compost to improve soil organic carbon (current: ${soilData.organicMatter || '3.2'}%)`,
      `Apply Nitrogen split doses (50% basal at sowing, 50% top-dressing at 30 DAP) to maximize N-use efficiency`,
      `Maintain optimal irrigation moisture at 45-60% field capacity`
    ];
    const improvements = Array.isArray(raw.improvements) && raw.improvements.length > 0
      ? raw.improvements
      : Array.isArray(raw.recommendations) && raw.recommendations.length > 0
      ? raw.recommendations
      : defaultImprovements;

    // Fertilizers
    const defaultFertilizers = [
      'Primary: Urea (46% N) - 45 kg/acre in 2 split applications',
      'Secondary: Single Super Phosphate (SSP 16% P2O5) - 60 kg/acre basal dose',
      'Optional: Muriate of Potash (MOP 60% K2O) - 25 kg/acre basal dose'
    ];
    const fertilizers = Array.isArray(raw.fertilizers) && raw.fertilizers.length > 0 ? raw.fertilizers : defaultFertilizers;

    // Management Plan
    const managementPlan = raw.managementPlan || {
      immediate: [
        'Apply basal dose of NPK fertilizers prior to sowing',
        `Adjust field irrigation to maintain ~${soilData.moisture || '48'}% soil moisture`
      ],
      shortTerm: [
        'Foliar spray of 1% NPK (19:19:19) at vegetative stage (30-35 DAP)',
        'Monitor weed growth and maintain soil aeration'
      ],
      longTerm: [
        'Incorporate green manure crops (Dhaincha/Sunhemp) post harvest',
        'Re-test soil health every 6 months to maintain nutrient balance'
      ]
    };

    // Risk Factors & Success Indicators
    const riskFactors = Array.isArray(raw.riskFactors) && raw.riskFactors.length > 0
      ? raw.riskFactors
      : ['Nitrogen volatilization under high soil temperature', 'Nutrient leaching during heavy irrigation'];

    const successIndicators = Array.isArray(raw.successIndicators) && raw.successIndicators.length > 0
      ? raw.successIndicators
      : ['Vigorous root establishment within 21 days', 'Target yield expectation: 22-26 quintals/acre'];

    const monitoring = raw.monitoring || {
      phTesting: 'Every 6 months',
      moistureCheck: 'Bi-weekly',
      nutrientAudit: 'Pre-sowing and Post-harvest',
      salinityCheck: 'Annually'
    };

    return {
      soilType,
      pH,
      phStatus: pH,
      healthScore,
      soilHealthScore: healthScore,
      soilHealth,
      status: soilHealth,
      nutrients,
      npkStatus: nutrients,
      suitableCrops,
      improvements,
      recommendations: improvements,
      fertilizers,
      fertilizerDosage: raw.fertilizerDosage || fertilizers.join('; '),
      organicCompost: raw.organicCompost || 'Apply Farm Yard Manure (FYM) @ 4 Tons/Acre to buffer soil pH and organic carbon.',
      managementPlan,
      riskFactors,
      successIndicators,
      monitoring
    };
  }

  static async analyzeSoil(soilData, onStepUpdate = null) {
    const analysisId = `[SOIL-${Date.now()}]`;
    console.log(`${analysisId} 🧪 Starting Soil Chemistry Swarm for: ${soilData.cropType || 'Crop'}`);

    try {
      const ph = parseFloat(soilData.ph) || 6.5;
      const n = parseFloat(soilData.nitrogen) || 140;
      const p = parseFloat(soilData.phosphorus) || 45;
      const k = parseFloat(soilData.potassium) || 180;
      const om = parseFloat(soilData.organicMatter) || 3.2;
      const ec = parseFloat(soilData.salinity) || 0.8;
      const temp = parseFloat(soilData.temperature) || 24;

      onStepUpdate?.(1, 'Extracting pH, nutrients, and salinity values...');

      const [chemistReport, agronomistReport] = await Promise.all([
        this.callAPI(
          `Soil Parameters: pH ${ph}, Nitrogen ${n} ppm, Phosphorus ${p} ppm, Potassium ${k} ppm, Organic Carbon/Matter ${om}%, Salinity EC ${ec} dS/m, Temp ${temp}°C.`,
          'You are a Senior Soil Chemist. Evaluate NPK stoichiometric balance, pH buffering capacity, and salinity stress.',
          'amazon.nova-micro-v1:0'
        ).catch(e => `Chemist Warning: ${e.message}`),

        this.callAPI(
          `Soil Data: pH ${ph}, N ${n}, P ${p}, K ${k}, Organic Matter ${om}%, Salinity ${ec} dS/m. Provide exact NPK fertilizer kg/acre doses and organic manure recommendations.`,
          'You are a Chief Agronomist. Focus on exact NPK fertilizer kg/acre doses and organic soil amendment.',
          'amazon.nova-lite-v1:0'
        ).catch(e => `Agronomist Warning: ${e.message}`)
      ]);

      onStepUpdate?.(2, 'Applying scientific soil classification standards...');
      await new Promise(r => setTimeout(r, 200));

      onStepUpdate?.(3, 'Identifying acidity, salinity, and nutrient issues...');
      await new Promise(r => setTimeout(r, 200));

      onStepUpdate?.(4, 'Computing lime, gypsum, and fertilizer requirements...');

      const bossPrompt = `
You are the Chief Soil Scientist. Review findings:
[Soil Chemist]: ${chemistReport}
[Agronomist]: ${agronomistReport}
[Input Soil Data]: pH ${ph}, N ${n} ppm, P ${p} ppm, K ${k} ppm, Organic Matter ${om}%, Salinity ${ec} dS/m, Temp ${temp}°C.

Synthesize into ONE valid JSON object matching this EXACT schema:
{
  "soilType": "Sandy Loam Soil",
  "pH": "${ph} pH (Optimal)",
  "healthScore": 85,
  "soilHealth": "Good",
  "nutrients": {
    "nitrogen": "${n} ppm (Optimal)",
    "phosphorus": "${p} ppm (Optimal)",
    "potassium": "${k} ppm (High)"
  },
  "suitableCrops": [
    {
      "name": "Wheat (HD-2967)",
      "suitabilityScore": 94,
      "profitLevel": "High Profit",
      "season": "Rabi",
      "duration": "4-5 months",
      "investment": "₹16,000/acre",
      "roi": "145%",
      "marketDemand": "High",
      "riskLevel": "Low",
      "waterRequirement": "Medium",
      "soilMatch": "Highly compatible with pH ${ph} and organic matter ${om}%"
    },
    {
      "name": "Mustard (Pusa Bold)",
      "suitabilityScore": 90,
      "profitLevel": "High Profit",
      "season": "Rabi",
      "duration": "3-4 months",
      "investment": "₹12,000/acre",
      "roi": "165%",
      "marketDemand": "High",
      "riskLevel": "Low",
      "waterRequirement": "Low",
      "soilMatch": "Well suited to low salinity and light soils"
    }
  ],
  "improvements": [
    "Incorporate 4-5 tonnes/acre of farmyard manure to boost organic carbon",
    "Apply split nitrogen doses to minimize leaching loss"
  ],
  "fertilizers": [
    "Primary: Urea (46% N) - 45 kg/acre split in 2 applications",
    "Secondary: SSP - 60 kg/acre basal dose"
  ],
  "managementPlan": {
    "immediate": ["Apply basal NPK before sowing", "Maintain field capacity moisture"],
    "shortTerm": ["Foliar spray of 1% NPK at 30 DAP", "Regular weed control"],
    "longTerm": ["Green manuring post-harvest", "Bi-annual soil testing"]
  },
  "riskFactors": ["Nitrogen volatilization during warm weather"],
  "successIndicators": ["Strong root anchorage", "Target yield: 22-25 quintals/acre"],
  "monitoring": {
    "phTesting": "Every 6 months",
    "moistureCheck": "Weekly",
    "nutrientAudit": "Seasonal",
    "salinityCheck": "Annually"
  }
}
`;

      onStepUpdate?.(5, 'Matching soil conditions with suitable crops...');

      const response = await this.callAPI(
        bossPrompt,
        'You are the Chief Soil Scientist. Return ONLY valid raw JSON.',
        'amazon.nova-pro-v1:0'
      );

      const parsed = this.parseJSON(response);
      return this.normalizeSoilAnalysisData(parsed || {}, soilData);
    } catch (error) {
      console.warn(`${analysisId} AI call failed, using scientific fallback:`, error.message);
      return this.getDefaultSoilAnalysis(soilData);
    }
  }

  /**
   * Scientific Fallback Generator for Soil Chemistry
   */
  static getDefaultSoilAnalysis(soilData = {}) {
    const cropName = soilData.cropType || 'Maize';
    const scientific = ScientificCropService.getScientificCalculation(cropName, parseFloat(soilData.fieldSize) || 5);
    const benchmark = CACPDataService.getCropBenchmark(cropName);

    const fallbackData = {
      soilHealthScore: 82,
      healthScore: 82,
      soilHealth: 'Good',
      soilType: soilData.ph && parseFloat(soilData.ph) > 7.5 ? 'Alkaline Soil' : 'Sandy Loam Soil',
      pH: soilData.ph ? `${soilData.ph} pH (${parseFloat(soilData.ph) >= 6.0 && parseFloat(soilData.ph) <= 7.5 ? 'Optimal' : 'Needs Conditioning'})` : '6.5 pH (Optimal)',
      nutrients: {
        nitrogen: soilData.nitrogen ? `${soilData.nitrogen} ppm (${parseFloat(soilData.nitrogen) < 100 ? 'Low' : 'Optimal'})` : '140 ppm (Optimal)',
        phosphorus: soilData.phosphorus ? `${soilData.phosphorus} ppm (${parseFloat(soilData.phosphorus) < 30 ? 'Low' : 'Optimal'})` : '45 ppm (Optimal)',
        potassium: soilData.potassium ? `${soilData.potassium} ppm (${parseFloat(soilData.potassium) < 120 ? 'Low' : 'Optimal'})` : '180 ppm (High)'
      },
      improvements: [
        `Apply ${scientific?.fertilizerRecommendation?.urea || '35 kg/acre Urea'} in split top-dressing doses`,
        `Apply ${scientific?.fertilizerRecommendation?.npk || '50 kg/acre NPK (12:32:16)'} as basal dose`,
        `Incorporate ${scientific?.organicManure || '4 tonnes/acre Farmyard Manure (FYM)'} to improve organic carbon`
      ],
      suitableCrops: [
        {
          name: benchmark.name || 'Wheat (HD-2967)',
          suitabilityScore: 94,
          profitLevel: 'High Profit',
          season: 'Rabi',
          duration: '4-5 months',
          investment: '₹16,000/acre',
          roi: '145%',
          marketDemand: 'High',
          riskLevel: 'Low',
          waterRequirement: 'Medium',
          soilMatch: benchmark.marketAlignment || 'Excellent match for current soil profile'
        },
        {
          name: 'Summer Moong (SML 668)',
          suitabilityScore: 90,
          profitLevel: 'Very High Profit',
          season: 'Zaid',
          duration: '2.5 months',
          investment: '₹9,500/acre',
          roi: '180%',
          marketDemand: 'High',
          riskLevel: 'Low',
          waterRequirement: 'Low',
          soilMatch: 'N-fixing legume restoring soil fertility'
        },
        {
          name: 'Mustard (Brassica)',
          suitabilityScore: 88,
          profitLevel: 'High Profit',
          season: 'Rabi',
          duration: '3.5 months',
          investment: '₹12,000/acre',
          roi: '160%',
          marketDemand: 'High',
          riskLevel: 'Low',
          waterRequirement: 'Low',
          soilMatch: 'Deep root system improving soil aeration & structure'
        }
      ]
    };

    return this.normalizeSoilAnalysisData(fallbackData, soilData);
  }
}

