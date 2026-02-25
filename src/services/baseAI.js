// ============================================================
// BaseAI - All-Ollama Cloud Multi-Agent Architecture
// Primary:  Ollama Cloud (ollama.com/api) — proxied via Vite
// ============================================================

const OLLAMA_API_KEY = '053ac592a8724bd789d00ffea8d0a709.z_zq5Z_BThFPI6dkZbOBB1VQ';

export class BaseAI {
  static sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim()
      .substring(0, 10000);
  }

  // Allow passing the specific model for the multi-agent swarm
  static async callAPI(prompt, systemPrompt = '', model = 'deepseek-v3.1:671b-cloud', images = null) {
    const TRUTHFUL_PROMPT = "You are a concise, accurate agricultural assistant. DO NOT hallucinate. Keep output focused and strictly follow formats.";
    const combinedSystemPrompt = `${TRUTHFUL_PROMPT} ${systemPrompt}`.trim();

    const sanitizedPrompt = this.sanitizeInput(prompt);
    const sanitizedSystemPrompt = this.sanitizeInput(combinedSystemPrompt);

    if (!sanitizedPrompt) {
      throw new Error('Invalid or empty prompt provided');
    }

    const callId = `[AI-${model.split(':')[0]}-${Date.now().toString().slice(-4)}]`;
    console.log(`${callId} 🚀 Agent ${model} starting...`);

    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      console.warn(`${callId} ⏱️ Request timed out after 150s`);
    }, 150000);

    try {
      const messages = [
        ...(sanitizedSystemPrompt ? [{ role: "system", content: sanitizedSystemPrompt }] : []),
        {
          role: "user",
          content: sanitizedPrompt,
          ...(images ? { images } : {}) // Pass base64 image array if provided
        }
      ];

      const res = await fetch('/api/ollama/chat', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OLLAMA_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: false,
          options: { temperature: 0.1, num_predict: 2000 }
        })
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(`Ollama API error: ${res.status} - ${errText}`);
      }

      const data = await res.json();

      // Handle raw content, stripping <think> tags if Minimax or DeepSeek models are used
      let content =
        data?.message?.content ||
        data?.message?.thinking ||
        data?.response ||
        (typeof data === 'string' ? data : null);

      if (!content) {
        throw new Error('No content in Ollama Cloud response');
      }

      console.log(`${callId} ✅ Agent finished (${content.length} chars)`);
      return content;
    } catch (error) {
      clearTimeout(timer);
      console.error(`${callId} ❌ Agent Failed:`, error.message);
      throw error;
    }
  }

  static parseJSON(response) {
    if (!response || typeof response !== 'string') return null;

    let cleaned = response.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    cleaned = cleaned.replace(/<\/think>/gi, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      try {
        const block = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (block) return JSON.parse(block[1].trim());

        // Extreme fallback: find the first { and last }
        const firstParen = cleaned.indexOf('{');
        const lastParen = cleaned.lastIndexOf('}');
        if (firstParen !== -1 && lastParen !== -1 && lastParen > firstParen) {
          const rawJson = cleaned.substring(firstParen, lastParen + 1);
          return JSON.parse(rawJson);
        }

        const obj = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (obj) return JSON.parse(obj[1]);

        return null;
      } catch (e) {
        console.warn('JSON parsing failed:', e.message);
        console.log('--- RAW RESPONSE FOR DEBUGGING ---');
        console.log(response);
        return null;
      }
    }
  }
}
