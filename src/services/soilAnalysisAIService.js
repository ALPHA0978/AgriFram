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

  static async analyzeSoil(soilData, onStepUpdate = null) {
    const analysisId = `[SOIL-${Date.now()}]`;
    console.log(`${analysisId} 🧪 Starting Soil Chemistry Swarm for: ${soilData.cropType || 'Crop'}`);

    try {
      const ph = parseFloat(soilData.ph) || 6.8;
      const n = parseFloat(soilData.nitrogen) || 120;
      const p = parseFloat(soilData.phosphorus) || 55;
      const k = parseFloat(soilData.potassium) || 180;

      onStepUpdate?.(1, 'Soil Swarm: Launching Soil Chemist & Agronomist in parallel...');

      const [chemistReport, agronomistReport] = await Promise.all([
        this.callAPI(
          `Soil Parameters: pH ${ph}, Nitrogen ${n} ppm, Phosphorus ${p} ppm, Potassium ${k} ppm, Organic Carbon ${soilData.organicCarbon || '0.5%'}, Salinity EC ${soilData.salinity || '0.8 dS/m'}. Crop: ${soilData.cropType || 'General Crop'}.`,
          'You are a Senior Soil Chemist. Evaluate NPK stoichiometric balance, pH buffering capacity, and salinity stress.',
          'amazon.nova-micro-v1:0'
        ).catch(e => `Chemist Warning: ${e.message}`),

        this.callAPI(
          `Soil Type: ${soilData.soilType || 'Alluvial'}, Target Crop: ${soilData.cropType || 'General Crop'}, Field Size: ${soilData.fieldSize || 5} acres. Provide exact fertilizer dosing and organic manure recommendations.`,
          'You are a Chief Agronomist. Focus on exact NPK fertilizer kg/acre doses and organic soil amendment.',
          'amazon.nova-lite-v1:0'
        ).catch(e => `Agronomist Warning: ${e.message}`)
      ]);

      onStepUpdate?.(3, 'Synthesizing NPK dosing & crop suitability report...');

      const bossPrompt = `
You are the Chief Soil Scientist. Review findings:
[Soil Chemist]: ${chemistReport}
[Agronomist]: ${agronomistReport}

Synthesize into ONE valid JSON object:
{
  "soilHealthScore": 82,
  "phStatus": "Optimal (6.8)",
  "npkStatus": {
    "nitrogen": "Slightly Low",
    "phosphorus": "Optimal",
    "potassium": "Optimal"
  },
  "recommendations": [
    "Apply 25 kg/acre Urea in 2 split top-dressing doses",
    "Incorporate 5 tonnes/acre Well-rotted Farmyard Manure (FYM)",
    "Maintain soil moisture at 65% Field Capacity"
  ],
  "suitableCrops": [
    {"crop": "Maize (Hybrid)", "suitability": "High", "reason": "Well suited to 6.8 pH"},
    {"crop": "Summer Moong", "suitability": "Very High", "reason": "Leguminous nitrogen fixation"}
  ]
}
`;

      const response = await this.callAPI(
        bossPrompt,
        'You are the Chief Soil Scientist. Return ONLY valid raw JSON.',
        'amazon.nova-pro-v1:0'
      );

      const finalAnalysis = this.parseJSON(response);
      if (finalAnalysis && finalAnalysis.soilHealthScore) {
        return finalAnalysis;
      }

      return this.getDefaultSoilAnalysis(soilData);
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

    return {
      soilHealthScore: 80,
      phStatus: soilData.ph ? `pH ${soilData.ph} (${parseFloat(soilData.ph) >= 6.5 && parseFloat(soilData.ph) <= 7.5 ? 'Optimal' : 'Needs Conditioning'})` : 'Optimal (6.8)',
      npkStatus: {
        nitrogen: parseFloat(soilData.nitrogen) < 100 ? 'Low' : parseFloat(soilData.nitrogen) > 200 ? 'Excessive' : 'Optimal',
        phosphorus: parseFloat(soilData.phosphorus) < 30 ? 'Low' : 'Optimal',
        potassium: parseFloat(soilData.potassium) < 120 ? 'Low' : 'Optimal'
      },
      recommendations: [
        `Apply ${scientific?.fertilizerRecommendation?.urea || '30 kg/acre Urea'} in split doses during vegetative growth`,
        `Apply ${scientific?.fertilizerRecommendation?.npk || '50 kg/acre NPK (12:32:16)'} at sowing`,
        `Incorporate ${scientific?.organicManure || '4 tonnes/acre Farmyard Manure (FYM)'} to improve organic carbon`
      ],
      suitableCrops: [
        { crop: benchmark.name, suitability: 'High', reason: benchmark.marketAlignment },
        { crop: 'Summer Moong (SML 668)', suitability: 'Very High', reason: 'N-fixing legume restoring soil fertility' },
        { crop: 'Mustard (Brassica)', suitability: 'High', reason: 'Deep root system improving soil structure' }
      ]
    };
  }
}
