import { BaseAI } from './baseAI.js';

export class AlphaVantageService {
  static validateSymbol(symbol) {
    if (!symbol || typeof symbol !== 'string') return false;
    return /^[A-Z0-9.]{1,10}$/.test(symbol.toUpperCase());
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[^A-Za-z0-9.,]/g, '').substring(0, 50);
  }

  static async getCommodityPrice(symbol) {
    const sanitizedSymbol = this.sanitizeInput(symbol).toUpperCase() || 'CORN';
    const validSymbol = this.validateSymbol(sanitizedSymbol) ? sanitizedSymbol : 'CORN';

    try {
      const systemPrompt = `You are a financial data simulator specializing in agricultural commodities. Generate a realistic JSON response matching the Alpha Vantage 'Global Quote' format. Return ONLY valid JSON:
{
  "Global Quote": {
    "01. symbol": "${sanitizedSymbol}",
    "02. open": "current_open_price",
    "03. high": "daily_high",
    "04. low": "daily_low",
    "05. price": "current_price",
    "06. volume": "trading_volume",
    "07. latest trading day": "${new Date().toISOString().split('T')[0]}",
    "08. previous close": "prev_close",
    "09. change": "price_change",
    "10. change percent": "percentage_change%"
  }
}`;
      const response = await BaseAI.callAPI(`Generate current market data for agricultural commodity symbol: ${sanitizedSymbol}`, systemPrompt);
      const data = BaseAI.parseJSON(response);
      return data?.['Global Quote'] || null;
    } catch (error) {
      console.error('AI Price simulation error:', error);
      return null;
    }
  }

  static async getTopGainersLosers() {
    try {
      const systemPrompt = `You are a market trend simulator. Generate a realistic JSON response for top agricultural gainers and losers. Return ONLY valid JSON:
{
  "top_gainers": [
    {"symbol": "CORN", "price": "4.50", "change_amount": "0.15", "change_percentage": "3.4%"},
    {"symbol": "SOYB", "price": "12.80", "change_amount": "0.20", "change_percentage": "1.6%"}
  ],
  "top_losers": [
    {"symbol": "WEAT", "price": "6.20", "change_amount": "-0.10", "change_percentage": "-1.6%"}
  ]
}`;
      const response = await BaseAI.callAPI("Generate current top agricultural gainers and losers in the market.", systemPrompt);
      return BaseAI.parseJSON(response);
    } catch (error) {
      console.error('AI Market trends simulation error:', error);
      return null;
    }
  }

  static async getMarketNews(tickers = '') {
    const sanitizedTickers = this.sanitizeInput(tickers);

    try {
      const systemPrompt = `You are an agricultural news simulator. Generate a realistic 'NEWS_SENTIMENT' JSON response. Return ONLY valid JSON:
{
  "feed": [
    {
      "title": "Global supply outlook for ${sanitizedTickers}",
      "url": "https://example.com/news/1",
      "summary": "AI simulated news about market trends in ${sanitizedTickers}.",
      "overall_sentiment_score": 0.25,
      "overall_sentiment_label": "Somewhat Bullish"
    }
  ]
}`;
      const response = await BaseAI.callAPI(`Generate agricultural market news for: ${sanitizedTickers}`, systemPrompt);
      return BaseAI.parseJSON(response);
    } catch (error) {
      console.error('AI News simulation error:', error);
      return null;
    }
  }

  static async analyzeMarketTrends(cropSymbols) {
    try {
      const marketData = await this.getTopGainersLosers();
      const newsData = await this.getMarketNews('CORN,SOYB,WEAT');

      const trends = {
        supplyShortages: [],
        priceRising: [],
        marketSentiment: 'neutral'
      };

      if (marketData?.top_gainers) {
        trends.priceRising = marketData.top_gainers
          .filter(stock => stock.symbol && this.isAgricultureRelated(stock.symbol))
          .map(stock => stock.symbol)
          .slice(0, 3);
      }

      if (newsData?.feed) {
        const positiveNews = newsData.feed.filter(article =>
          article.overall_sentiment_score > 0.1
        ).length;
        const totalNews = newsData.feed.length;

        if (totalNews > 0) {
          if (positiveNews / totalNews > 0.6) {
            trends.marketSentiment = 'positive';
          } else if (positiveNews / totalNews < 0.4) {
            trends.marketSentiment = 'negative';
          }
        }
      }

      return trends;
    } catch (error) {
      console.error('Market analysis error:', error);
      return {
        supplyShortages: [],
        priceRising: [],
        marketSentiment: 'neutral'
      };
    }
  }

  static isAgricultureRelated(symbol) {
    if (!symbol || typeof symbol !== 'string') return false;
    const agriSymbols = ['CORN', 'SOYB', 'WEAT', 'CANE', 'RICE', 'ADM', 'BG', 'CF'];
    return agriSymbols.some(agri => symbol.includes(agri));
  }

  static async getCropPriceProjections(crops) {
    try {
      const projections = [];
      const limitedCrops = crops.slice(0, 3);

      for (const crop of limitedCrops) {
        const symbol = this.mapCropToSymbol(crop);
        const priceData = await this.getCommodityPrice(symbol);

        if (priceData) {
          const currentPrice = parseFloat(priceData['05. price']) || 0;
          const changePercent = parseFloat(priceData['10. change percent']?.replace('%', '')) || 0;

          projections.push({
            crop: crop,
            currentPrice: `$${currentPrice.toFixed(2)}`,
            changePercent: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`,
            trend: changePercent > 0 ? 'rising' : 'falling',
            futureProjection: this.calculateProjection(changePercent)
          });
        }
      }

      return projections;
    } catch (error) {
      console.error('Price projection error:', error);
      return [];
    }
  }

  static mapCropToSymbol(crop) {
    const mapping = {
      'Turmeric': 'CORN',
      'Coriander': 'SOYB',
      'Chili': 'WEAT',
      'Millets': 'CORN',
      'Pulses': 'SOYB',
      'Wheat': 'WEAT',
      'Rice': 'CORN',
      'Cotton': 'SOYB'
    };

    return mapping[crop] || 'CORN';
  }

  static calculateProjection(changePercent) {
    if (changePercent > 5) return '+25-40%';
    if (changePercent > 2) return '+15-25%';
    if (changePercent > 0) return '+5-15%';
    if (changePercent > -2) return '-5 to +5%';
    return '-10 to -5%';
  }
}