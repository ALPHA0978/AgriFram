export class BaseAI {
  static async callAPI(prompt, systemPrompt = '') {
    const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Hugging Face API key not found');
    }

    try {
      const messages = [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 2000,
          temperature: 0.7
        })
      });

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
      // First try to parse the entire response
      return JSON.parse(response);
    } catch (error) {
      try {
        // Try to extract JSON from response with better regex
        const jsonMatch = response.match(/\{[\s\S]*?\}(?=\s*$|\s*[^\}])/g);
        if (jsonMatch && jsonMatch.length > 0) {
          // Try the last complete JSON object found
          const lastJson = jsonMatch[jsonMatch.length - 1];
          return JSON.parse(lastJson);
        }
        
        // Try to find JSON between code blocks
        const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          return JSON.parse(codeBlockMatch[1].trim());
        }
        
        // Try to find any valid JSON structure
        const simpleJsonMatch = response.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
        if (simpleJsonMatch) {
          return JSON.parse(simpleJsonMatch[0]);
        }
        
        return null;
      } catch (parseError) {
        console.warn('JSON parsing failed, using fallback data:', parseError.message);
        return null;
      }
    }
  }
}