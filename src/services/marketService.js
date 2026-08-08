/**
 * marketService.js
 * Dedicated Market Intelligence AI Service (MarketAIService)
 * Orchestrates AWS Bedrock Multi-Agent Swarms with CACPDataService & AlphaVantageService
 */

import { BaseAI } from './baseAI.js';
import { CACPDataService } from './CACPDataService.js';
import { AlphaVantageService } from './alphaVantageService.js';
import { AgriTechAPIService } from './agriTechAPIService.js';

export class MarketAIService extends BaseAI {
  /**
   * Analyze regional market supply chain shortages and rising trends
   */
  static async analyzeMarketConditions(location = 'Punjab', season = 'Kharif', soilType = 'Alluvial') {
    const analysisId = `[MARKET-${Date.now()}]`;
    console.log(`${analysisId} 📈 Starting Market Intelligence Swarm for ${location}...`);
    const startTime = Date.now();

    try {
      const [dataReport, marketReport] = await Promise.all([
        this.callAPI(
          `Location: ${location}. Season: ${season}. Soil: ${soilType}. Identify top 3 crop supply shortages and 2 key nutritional gaps.`,
          'You are an Agricultural Data Analyst. Focus on supply chain shortages and nutritional demand.',
          'amazon.nova-micro-v1:0'
        ).catch(e => `Data Agent Warning: ${e.message}`),

        this.callAPI(
          `Location: ${location}. Season: ${season}. What agricultural commodities have rising price momentum in local APMC mandis?`,
          'You are an Agricultural Economist. Focus on mandi price momentum and buyer demand.',
          'amazon.nova-lite-v1:0'
        ).catch(e => `Economist Warning: ${e.message}`)
      ]);

      const bossPrompt = `
You are the Chief Market Intelligence Officer. Review agent reports:
[Data Analyst]: ${dataReport}
[Economist]: ${marketReport}

Synthesize into valid JSON:
{
  "shortages": ["crop1", "crop2"],
  "priceRising": ["crop1", "crop2"],
  "nutritionNeeds": ["protein", "iron"]
}
`;

      const bossResponse = await this.callAPI(
        bossPrompt,
        'You are the Chief Market Officer. Return ONLY valid raw JSON.',
        'amazon.nova-pro-v1:0'
      );

      const finalAnalysis = this.parseJSON(bossResponse);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`${analysisId} 🎉 Market Swarm completed in ${elapsed}s`);

      if (finalAnalysis && (finalAnalysis.shortages || finalAnalysis.priceRising)) {
        return finalAnalysis;
      }

      return {
        shortages: ['Maize (Hybrid)', 'Summer Moong'],
        priceRising: ['Mustard', 'Soybean'],
        nutritionNeeds: ['Protein', 'Iron']
      };
    } catch (error) {
      console.warn(`${analysisId} AI call failed, using CACP benchmark fallback:`, error.message);
      return {
        shortages: ['Maize (Hybrid)', 'Summer Moong'],
        priceRising: ['Mustard', 'Soybean'],
        nutritionNeeds: ['Protein', 'Iron']
      };
    }
  }

  /**
   * Suggest optimal crops strictly conforming to user budget and CACP C2 economics
   */
  static async suggestCropsBasedOnMarket(marketConditions, location = 'Punjab', soilType = 'Alluvial', budget = 50000, season = 'Kharif', farmSize = 5, waterAvailability = 'Irrigated') {
    try {
      const systemPrompt = `You are a Senior Agricultural Economist specializing in CACP & PAU Agricultural Standards.
STRICT RULES:
1. NET PROFIT MARGIN must be calculated over C2 Comprehensive Cost framework (including land rent, seeds, fertilizers, diesel, labor). True C2 net margins realistically range from 15% to 35%. NEVER output exaggerated margins like 70-80%!
2. HARVEST DAYS must be biologically accurate (Summer Moong: 60-75d; Grain Sorghum: 90-120d; Hybrid Maize: 90-110d; Wheat: 120-140d; Paddy: 120-150d; Bajra: 80-95d; Sugarcane: 300-360d).
3. MATCH BUYERS REALISTICALLY (Pulses -> NAFED/Mandis; Grains -> Feed/Starch Mills/FCI; Perishables -> Q-Commerce/Mother Dairy; Cash Crops -> Mills/CCI).
4. Total investment for ${farmSize} acres must stay strictly under ₹${budget}.

Return ONLY valid JSON:
[
  {
    "name": "Crop Name",
    "profitMargin": "Net % over C2 (e.g. 24% Net C2)",
    "harvestDays": "Duration in days (e.g. 90-110)",
    "investment": "Total cost for ${farmSize} acres in ₹",
    "reason": "Economic justification",
    "buyers": ["Buyer 1", "Buyer 2"],
    "marketAlignment": "Market demand alignment",
    "soilSuitability": "Soil suitability for ${soilType} soil"
  }
]`;

      const userPrompt = `Location: ${location}, Season: ${season}, Soil: ${soilType}, Farm Size: ${farmSize} acres, Budget: ₹${budget}, Water: ${waterAvailability}. Shortages: ${marketConditions?.shortages?.join(',')}. Suggest 3 optimal crops.`;

      const response = await this.callAPI(userPrompt, systemPrompt, 'amazon.nova-pro-v1:0');
      const parsed = this.parseJSON(response);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(crop => {
          const benchmark = CACPDataService.getCropBenchmark(crop.name);
          return {
            ...crop,
            harvestDays: crop.harvestDays || benchmark.harvestDays,
            profitMargin: crop.profitMargin || benchmark.netMarginC2,
            buyers: Array.isArray(crop.buyers) && crop.buyers.length > 0 ? crop.buyers : benchmark.buyers
          };
        });
      }

      return CACPDataService.getCropBenchmark(location, budget, farmSize, soilType);
    } catch (error) {
      console.warn('MarketAIService.suggestCropsBasedOnMarket failed, using CACP benchmark fallback:', error.message);
      return [
        CACPDataService.getCropBenchmark('maize'),
        CACPDataService.getCropBenchmark('moong'),
        CACPDataService.getCropBenchmark('sorghum')
      ].map(b => ({
        name: b.name,
        profitMargin: b.netMarginC2,
        harvestDays: b.harvestDays,
        investment: b.inputCostPerAcre,
        reason: b.marketAlignment,
        buyers: b.buyers,
        marketAlignment: b.marketAlignment,
        soilSuitability: `Ideal for ${soilType} soil`
      }));
    }
  }

  /**
   * Corporate procurement breakdown by crop category
   */
  static async analyzeCorporateProcurement(crops = [], location = 'Punjab') {
    try {
      const systemPrompt = `You are a corporate agricultural procurement analyst. Return ONLY valid JSON:
[{
  "company": "realistic buyer name matched to crop category",
  "crops": ["crop1"],
  "increasePercentage": "X%",
  "reason": "why increasing procurement",
  "contractOpportunity": "direct contract potential"
}]`;

      const response = await this.callAPI(
        `Analyze corporate buyers for ${crops.join(', ')} in ${location}. Match fresh vegetables to Q-commerce/Mother Dairy, pulses to NAFED/APMC mandis, grains to flour/starch/feed mills.`,
        systemPrompt,
        'amazon.nova-micro-v1:0'
      );

      const parsed = this.parseJSON(response);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (error) {
      console.warn('MarketAIService.analyzeCorporateProcurement failed, using benchmark fallback:', error.message);
    }

    return crops.map(crop => {
      const benchmark = CACPDataService.getCropBenchmark(crop);
      return {
        company: benchmark.buyers[0] || 'APMC Wholesale Mandi',
        crops: [crop],
        increasePercentage: '+18%',
        reason: 'Stable mandi procurement demand'
      };
    });
  }

  /**
   * Regional supply gap analysis
   */
  static async analyzeRegionalGaps(crops = [], location = 'Punjab') {
    try {
      const response = await this.callAPI(
        `Identify regional supply gaps for ${crops.join(', ')} around ${location}.`,
        'Return ONLY valid JSON: [{"region":"string","shortage":"string","opportunity":"string","demandLevel":"High|Medium"}]'
      );
      const parsed = this.parseJSON(response);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (error) {
      console.warn('MarketAIService.analyzeRegionalGaps failed, using fallback:', error.message);
    }

    return crops.map(crop => ({
      region: `${location} APMC Hub`,
      shortage: crop,
      opportunity: 'Regional supply shortfall',
      demandLevel: 'High'
    }));
  }

  /**
   * Value projections over seasonal timeline
   */
  static async getFutureValueProjections(crops = [], timelineData = [], location = 'Punjab') {
    try {
      const response = await this.callAPI(
        `Project mandi value increases for ${crops.join(', ')} in ${location}.`,
        'Return ONLY valid JSON: [{"crop":"string","futureValueIncrease":"+X-Y%","reason":"string"}]'
      );
      const parsed = this.parseJSON(response);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (error) {
      console.warn('MarketAIService.getFutureValueProjections failed, using fallback:', error.message);
    }

    return crops.map(crop => ({
      crop: crop,
      futureValueIncrease: '+8-15%',
      reason: 'Seasonal mandi demand trend'
    }));
  }
}
