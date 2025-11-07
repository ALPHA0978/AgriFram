export class BaseAI {
  static lastCallTime = 0;
  static minInterval = 10000; // 10 seconds between calls
  static requestQueue = [];
  static isProcessingQueue = false;
  static dailyCallCount = 0;
  static lastResetDate = new Date().toDateString();
  static maxDailyCalls = 20; // Conservative limit

  static async callAPI(prompt, systemPrompt = '') {
    // Check daily limit
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyCallCount = 0;
      this.lastResetDate = today;
    }

    if (this.dailyCallCount >= this.maxDailyCalls) {
      throw new Error('Daily API limit reached. Please try again tomorrow or use offline mode.');
    }

    return new Promise((resolve, reject) => {
      this.requestQueue.push({ prompt, systemPrompt, resolve, reject });
      this.processQueue();
    });
  }

  static async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    // Always wait before first request if recent activity
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastCall));
    }

    while (this.requestQueue.length > 0) {
      const { prompt, systemPrompt, resolve, reject } = this.requestQueue.shift();
      
      try {
        const result = await this.makeAPICall(prompt, systemPrompt);
        this.dailyCallCount++;
        this.lastCallTime = Date.now();
        resolve(result);
      } catch (error) {
        reject(error);
      }

      // Wait between requests
      if (this.requestQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.minInterval));
      }
    }

    this.isProcessingQueue = false;
  }

  static async makeAPICall(prompt, systemPrompt = '') {
    const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!API_KEY) {
      throw new Error('OpenRouter API key not found');
    }

    try {
      const messages = [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt }
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-nano-9b-v2:free",
          messages: messages,
          max_tokens: 1500,
          temperature: 0.1
        })
      });

      if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please wait 10 minutes before trying again.');
      }

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Analysis completed successfully';
    } catch (error) {
      console.error('BaseAI API Error:', error);
      throw error;
    }
  }

  static parseJSON(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      try {
        // Extract JSON from code blocks
        const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          return JSON.parse(codeBlockMatch[1].trim());
        }
        
        // Find complete JSON objects with proper nesting
        const jsonMatches = response.match(/\{(?:[^{}]|\{[^{}]*\})*\}/g);
        if (jsonMatches) {
          for (let i = jsonMatches.length - 1; i >= 0; i--) {
            try {
              const parsed = JSON.parse(jsonMatches[i]);
              if (parsed && typeof parsed === 'object') {
                return parsed;
              }
            } catch (e) { continue; }
          }
        }
        
        // Look for JSON after specific keywords
        const afterJsonMatch = response.match(/(?:json|result|output)\s*:?\s*(\{[\s\S]*?\})/);
        if (afterJsonMatch) {
          return JSON.parse(afterJsonMatch[1]);
        }
        
        return null;
      } catch (parseError) {
        console.warn('JSON parsing failed, using fallback data:', parseError.message);
        return null;
      }
    }
  }
}