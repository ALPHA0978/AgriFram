// ============================================================
// BaseAI - AWS Bedrock Multi-Agent Architecture
// Primary: AWS Bedrock Converse API — proxied via Vite
// ============================================================

const BEDROCK_API_KEY = import.meta.env.VITE_AWS_BEDROCK_API_KEY;

export class BaseAI {
  static sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim()
      .substring(0, 10000);
  }

  static mapModelToBedrock(model) {
    if (!model) return 'amazon.nova-pro-v1:0';
    const m = model.toLowerCase();

    // Anthropic Provider Models on AWS Bedrock
    if (m.includes('claude-3-5') || m.includes('sonnet')) {
      return 'us.anthropic.claude-3-5-sonnet-20241022-v2:0';
    }
    if (m.includes('claude-3-haiku') || m.includes('haiku')) {
      return 'us.anthropic.claude-3-haiku-20240307-v1:0';
    }

    // Meta Llama Provider Models on AWS Bedrock
    if (m.includes('llama3-2-90b') || m.includes('llama-90b')) {
      return 'us.meta.llama3-2-90b-instruct-v1:0';
    }
    if (m.includes('llama3-2-11b') || m.includes('llama-11b')) {
      return 'us.meta.llama3-2-11b-instruct-v1:0';
    }

    // Mistral AI Provider Models on AWS Bedrock
    if (m.includes('mistral-large')) {
      return 'us.mistral.mistral-large-2407-v1:0';
    }

    // Cohere Provider Models on AWS Bedrock
    if (m.includes('cohere') || m.includes('command-r')) {
      return 'cohere.command-r-plus-v1:0';
    }

    // Amazon Nova Provider Models on AWS Bedrock
    if (m.includes('micro')) return 'amazon.nova-micro-v1:0';
    if (m.includes('lite') || m.includes('economist') || m.includes('glm')) return 'amazon.nova-lite-v1:0';
    if (m.includes('pro') || m.includes('vision') || m.includes('pathologist') || m.includes('boss') || m.includes('master') || m.includes('deepseek') || m.includes('coder') || m.includes('qwen')) {
      return 'amazon.nova-pro-v1:0';
    }

    if (m.startsWith('amazon.') || m.startsWith('us.') || m.startsWith('cohere.')) {
      return model;
    }

    return 'amazon.nova-pro-v1:0';
  }

  static async callAPI(prompt, systemPrompt = '', model = 'amazon.nova-pro-v1:0', images = null) {
    const TRUTHFUL_PROMPT = "You are a concise, accurate agricultural assistant. DO NOT hallucinate. Keep output focused and strictly follow formats.";
    const combinedSystemPrompt = `${TRUTHFUL_PROMPT} ${systemPrompt}`.trim();

    const sanitizedPrompt = this.sanitizeInput(prompt);
    const sanitizedSystemPrompt = this.sanitizeInput(combinedSystemPrompt);

    if (!sanitizedPrompt) {
      throw new Error('Invalid or empty prompt provided');
    }

    const bedrockModel = this.mapModelToBedrock(model);
    const callId = `[BEDROCK-${bedrockModel.split('.')[0]}-${Date.now().toString().slice(-4)}]`;
    console.log(`${callId} 🚀 Agent ${bedrockModel} starting via AWS Bedrock...`);

    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      console.warn(`${callId} ⏱️ Request timed out after 150s`);
    }, 150000);

    try {
      // Build Converse API User Content
      const userContent = [{ text: sanitizedPrompt }];

      if (images && Array.isArray(images) && images.length > 0) {
        images.forEach(imgBase64 => {
          let cleanBase64 = imgBase64;
          let format = 'png';
          if (imgBase64.includes(';base64,')) {
            const parts = imgBase64.split(';base64,');
            cleanBase64 = parts[1];
            if (parts[0].includes('jpeg') || parts[0].includes('jpg')) format = 'jpeg';
            if (parts[0].includes('webp')) format = 'webp';
          }
          cleanBase64 = cleanBase64.replace(/[^A-Za-z0-9+/=]/g, '');
          userContent.push({
            image: {
              format: format,
              source: { bytes: cleanBase64 }
            }
          });
        });
      }

      const payload = {
        system: sanitizedSystemPrompt ? [{ text: sanitizedSystemPrompt }] : [],
        messages: [
          {
            role: 'user',
            content: userContent
          }
        ],
        inferenceConfig: {
          temperature: 0.1,
          maxTokens: 2000
        }
      };

      const res = await fetch(`/api/bedrock/model/${encodeURIComponent(bedrockModel)}/converse`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEDROCK_API_KEY}`,
          'x-api-key': BEDROCK_API_KEY
        },
        body: JSON.stringify(payload)
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        // Failover retry to amazon.nova-pro-v1:0 if primary provider model is disabled on IAM
        if (bedrockModel !== 'amazon.nova-pro-v1:0') {
          console.warn(`${callId} ⚠️ Primary model ${bedrockModel} error (${res.status}). Failing over to amazon.nova-pro-v1:0...`);
          return this.callAPI(prompt, systemPrompt, 'amazon.nova-pro-v1:0', images);
        }
        throw new Error(`AWS Bedrock API error: ${res.status} - ${errText}`);
      }

      const data = await res.json();

      let content =
        data?.output?.message?.content?.[0]?.text ||
        data?.output?.message?.content ||
        data?.completion ||
        (typeof data === 'string' ? data : null);

      if (Array.isArray(content)) {
        content = content.map(c => (typeof c === 'string' ? c : c.text || '')).join('\n');
      }

      if (!content) {
        throw new Error('No content returned in AWS Bedrock response');
      }

      console.log(`${callId} ✅ Agent finished (${content.length} chars)`);
      return content;
    } catch (error) {
      clearTimeout(timer);
      // Automatic retry failover to Nova Pro if model request failed
      if (model !== 'amazon.nova-pro-v1:0' && !error.message.includes('timed out')) {
        console.warn(`${callId} ⚠️ Exception on ${model}: ${error.message}. Retrying with amazon.nova-pro-v1:0...`);
        return this.callAPI(prompt, systemPrompt, 'amazon.nova-pro-v1:0', images).catch(() => { throw error; });
      }
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
