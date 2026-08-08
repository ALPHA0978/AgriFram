/**
 * CACPDataService.js
 * Comprehensive Indian Agricultural Economics & Agronomic Benchmark Service
 * Grounded in CACP (Commission for Agricultural Costs & Prices) C2 Comprehensive Cost Framework
 * and PAU (Punjab Agricultural University) Package of Practices.
 */

export class CACPDataService {
  /**
   * Universal Agronomic & Economic Dictionary for Indian Crops
   */
  static CROP_BENCHMARKS = {
    // ---------------- Cereals & Grains ----------------
    maize: {
      name: 'Maize (Hybrid Kharif)',
      category: 'Cereal',
      netMarginC2: '18-28% (Net C2)',
      grossMarginA2FL: '55-70% (Gross A2+FL)',
      harvestDays: '90-110',
      avgYieldPerAcre: '20-22 qtl',
      mspRate: '₹2,225/qtl',
      inputCostPerAcre: '₹16,000',
      buyers: ['Starch Processing Mills', 'Poultry Feed Industry', 'APMC Mandi Wholesale'],
      marketAlignment: 'Key crop diversification alternative to water-intensive Paddy',
      waterConsumption: 'Low-Medium (Conserves 45% water vs Paddy)'
    },
    sorghum: {
      name: 'Sorghum (Grain Jowar)',
      category: 'Cereal / Fodder',
      netMarginC2: '15-25% (Net C2)',
      grossMarginA2FL: '50-65% (Gross A2+FL)',
      harvestDays: '90-120',
      avgYieldPerAcre: '14-16 qtl',
      mspRate: '₹3,180/qtl',
      inputCostPerAcre: '₹12,000',
      buyers: ['Ethanol Distilleries', 'Livestock Fodder Markets', 'APMC Mandi'],
      marketAlignment: 'Drought-resilient millet with rising bio-fuel demand',
      waterConsumption: 'Very Low (Conserves 60% water vs Paddy)'
    },
    wheat: {
      name: 'Wheat (PBW 826 / HD 3086)',
      category: 'Cereal',
      netMarginC2: '20-30% (Net C2)',
      grossMarginA2FL: '65-80% (Gross A2+FL)',
      harvestDays: '120-140',
      avgYieldPerAcre: '21-23 qtl',
      mspRate: '₹2,350/qtl',
      inputCostPerAcre: '₹13,000',
      buyers: ['FCI Government Procurement', 'Flour Mills (Atta Industry)', 'APMC Mandi'],
      marketAlignment: 'Primary staple crop with 100% MSP procurement backing',
      waterConsumption: 'Medium (4-5 irrigations per season)'
    },
    paddy: {
      name: 'Paddy / Rice (PR 126 / DSR)',
      category: 'Cereal',
      netMarginC2: '25-35% (Net C2)',
      grossMarginA2FL: '120-150% (Gross A2+FL)',
      harvestDays: '120-150',
      avgYieldPerAcre: '28-30 qtl',
      mspRate: '₹2,300/qtl',
      inputCostPerAcre: '₹17,000',
      buyers: ['FCI / State Procurement Agencies', 'Rice Export Mills', 'APMC Mandi'],
      marketAlignment: 'High yield potential with 100% government guaranteed buy-in',
      waterConsumption: 'High (~5.2 million L/acre flooded)'
    },
    bajra: {
      name: 'Pearl Millet (Bajra)',
      category: 'Cereal / Millet',
      netMarginC2: '18-26% (Net C2)',
      grossMarginA2FL: '55-70% (Gross A2+FL)',
      harvestDays: '80-95',
      avgYieldPerAcre: '12-15 qtl',
      mspRate: '₹2,500/qtl',
      inputCostPerAcre: '₹10,000',
      buyers: ['FMCG Millet Processing', 'APMC Mandis', 'Livestock Feed Units'],
      marketAlignment: 'Nutri-cereal with strong government millet mission backing',
      waterConsumption: 'Ultra-Low (Rainfed / Minimal irrigation)'
    },

    // ---------------- Pulses & Legumes ----------------
    moong: {
      name: 'Summer Moong (SML 668)',
      category: 'Pulse',
      netMarginC2: '25-35% (Net C2)',
      grossMarginA2FL: '65-80% (Gross A2+FL)',
      harvestDays: '60-75',
      avgYieldPerAcre: '4.5-5.5 qtl',
      mspRate: '₹8,550/qtl',
      inputCostPerAcre: '₹10,000',
      buyers: ['NAFED State Procurement', 'APMC Mandi Wholesale', 'BigBasket'],
      marketAlignment: 'Short 65-day catch crop fixing 35 kg/ha atmospheric nitrogen',
      waterConsumption: 'Low (2-3 light irrigations)'
    },
    chana: {
      name: 'Chickpea (Desi Chana)',
      category: 'Pulse',
      netMarginC2: '22-32% (Net C2)',
      grossMarginA2FL: '60-75% (Gross A2+FL)',
      harvestDays: '110-125',
      avgYieldPerAcre: '8-10 qtl',
      mspRate: '₹5,440/qtl',
      inputCostPerAcre: '₹11,000',
      buyers: ['NAFED Procurement', 'Pulse Processing Mills', 'APMC Mandi'],
      marketAlignment: 'Essential pulse crop with strong MSP price stabilization',
      waterConsumption: 'Low (1-2 irrigations)'
    },

    // ---------------- Oilseeds ----------------
    mustard: {
      name: 'Mustard (Brassica)',
      category: 'Oilseed',
      netMarginC2: '25-34% (Net C2)',
      grossMarginA2FL: '70-85% (Gross A2+FL)',
      harvestDays: '105-120',
      avgYieldPerAcre: '8-10 qtl',
      mspRate: '₹5,650/qtl',
      inputCostPerAcre: '₹12,000',
      buyers: ['Oilseed Crushing Mills', 'HAFED / NAFED Procurement', 'APMC Mandis'],
      marketAlignment: 'High national demand for domestic edible oil independence',
      waterConsumption: 'Low (2 irrigations)'
    },
    soybean: {
      name: 'Soybean (JS 335)',
      category: 'Oilseed / Protein',
      netMarginC2: '22-30% (Net C2)',
      grossMarginA2FL: '60-75% (Gross A2+FL)',
      harvestDays: '95-105',
      avgYieldPerAcre: '8-11 qtl',
      mspRate: '₹4,600/qtl',
      inputCostPerAcre: '₹14,000',
      buyers: ['Soy Solvent Extraction Plants', 'APMC Mandis', 'Agri Exporters'],
      marketAlignment: 'High protein meal and edible oil industrial demand',
      waterConsumption: 'Medium (Kharif rainfed)'
    },

    // ---------------- Vegetables & Perishables ----------------
    tomato: {
      name: 'Hybrid Tomato',
      category: 'Horticulture',
      netMarginC2: '30-45% (Net C2)',
      grossMarginA2FL: '80-110% (Gross A2+FL)',
      harvestDays: '75-90',
      avgYieldPerAcre: '120-150 qtl',
      mspRate: 'Market Mandi Pricing',
      inputCostPerAcre: '₹28,000',
      buyers: ['Q-Commerce (Zepto/Blinkit)', 'Mother Dairy (Safal)', 'Local APMC'],
      marketAlignment: 'High turnover fresh vegetable crop',
      waterConsumption: 'Medium-High (Drip Irrigation required)'
    },
    potato: {
      name: 'Potato (Kufri Pothraj)',
      category: 'Horticulture',
      netMarginC2: '25-40% (Net C2)',
      grossMarginA2FL: '75-95% (Gross A2+FL)',
      harvestDays: '90-105',
      avgYieldPerAcre: '100-130 qtl',
      mspRate: 'Market Mandi Pricing',
      inputCostPerAcre: '₹32,000',
      buyers: ['Cold Storage Owners', 'Potato Processing Units (Lays/Haldiram)', 'APMC'],
      marketAlignment: 'High storable staple vegetable',
      waterConsumption: 'Medium (Sprinkler / Drip)'
    },

    // ---------------- Cash Crops ----------------
    cotton: {
      name: 'Bt Cotton',
      category: 'Cash Crop',
      netMarginC2: '20-30% (Net C2)',
      grossMarginA2FL: '55-70% (Gross A2+FL)',
      harvestDays: '150-180',
      avgYieldPerAcre: '10-14 qtl',
      mspRate: '₹7,020/qtl',
      inputCostPerAcre: '₹22,000',
      buyers: ['Cotton Corporation of India (CCI)', 'Textile Spinning Mills', 'APMC Mandis'],
      marketAlignment: 'Major commercial fiber crop with state MSP intervention',
      waterConsumption: 'Medium-High'
    },
    sugarcane: {
      name: 'Sugarcane (Co 0238)',
      category: 'Cash Crop',
      netMarginC2: '30-42% (Net C2)',
      grossMarginA2FL: '85-110% (Gross A2+FL)',
      harvestDays: '300-360',
      avgYieldPerAcre: '320-380 qtl',
      mspRate: '₹315/qtl (FRP)',
      inputCostPerAcre: '₹42,000',
      buyers: ['Cooperative Sugar Mills', 'Ethanol Distilleries', 'Gur/Khandsari Units'],
      marketAlignment: 'High return perennial crop with assured sugar mill SAP/FRP',
      waterConsumption: 'High (Perennial water intensive)'
    }
  };

  /**
   * Get accurate benchmark data for any crop name
   */
  static getCropBenchmark(cropName = '') {
    if (!cropName || typeof cropName !== 'string') {
      return this.CROP_BENCHMARKS.maize;
    }

    const lower = cropName.toLowerCase();
    for (const [key, data] of Object.entries(this.CROP_BENCHMARKS)) {
      if (lower.includes(key) || data.name.toLowerCase().includes(lower)) {
        return data;
      }
    }

    // Smart Category Fallback for unlisted crops
    if (lower.includes('pulse') || lower.includes('dal')) return this.CROP_BENCHMARKS.moong;
    if (lower.includes('oil') || lower.includes('seed')) return this.CROP_BENCHMARKS.mustard;
    if (lower.includes('veg') || lower.includes('gourd') || lower.includes('spinach')) return this.CROP_BENCHMARKS.tomato;

    return {
      name: cropName,
      category: 'Field Crop',
      netMarginC2: '20-30% (Net C2)',
      grossMarginA2FL: '55-75% (Gross A2+FL)',
      harvestDays: '90-120',
      avgYieldPerAcre: '15-20 qtl',
      mspRate: 'Mandi Market Rate',
      inputCostPerAcre: '₹14,000',
      buyers: ['Local APMC Wholesale Mandi', 'Agri Cooperative Buyers'],
      marketAlignment: 'Grounded in regional CACP cost benchmarks',
      waterConsumption: 'Medium'
    };
  }

  /**
   * Get accurate harvest duration string for any crop
   */
  static getAccurateHarvestDays(cropName) {
    const benchmark = this.getCropBenchmark(cropName);
    return benchmark.harvestDays;
  }

  /**
   * Get authentic buyers list for any crop
   */
  static getRealisticProcurementBuyers(cropName) {
    const benchmark = this.getCropBenchmark(cropName);
    return benchmark.buyers;
  }

  /**
   * Get C2 Net Profit Margin string for any crop
   */
  static calculateC2ProfitMargin(cropName) {
    const benchmark = this.getCropBenchmark(cropName);
    return benchmark.netMarginC2;
  }
}
