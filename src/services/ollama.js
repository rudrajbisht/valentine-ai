/**
 * Valentine AI - Ollama Local Service
 *
 * All AI inference is executed locally through Ollama running on localhost:11434.
 * No data is ever sent to external cloud APIs.
 */

export const DEFAULT_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'gemma3:1b';
export const DEFAULT_BASE_URL = import.meta.env.VITE_OLLAMA_BASE_URL || '/api';
const DIRECT_OLLAMA_URL = 'http://localhost:11434';

export const VALENTINE_SYSTEM_PROMPT = `You are Valentine, a warm, friendly, encouraging, and knowledgeable personal fashion stylist.

Your mission:
- Help users choose thoughtful outfits for different occasions, seasons, climates, and dress codes.
- Coordinate colors, silhouettes, textures, fabrics, patterns, and footwear harmoniously.
- Demystify fashion aesthetics and dress codes (e.g., smart-casual, business casual, cocktail, black tie, minimal chic, streetwear) in simple, approachable terms.
- Help users elevate their personal confidence and get the maximum wear out of clothes they already own in their closet.

Styling principles to follow:
1. Tone: Warm, approachable, conversational, and inspiring. Never sound judgmental, elitist, or preachy.
2. Inclusivity: Never make assumptions about the user's gender, age, body type, budget, or lifestyle unless they explicitly share that information. Keep suggestions versatile, neutral, and adaptable.
3. Interactive Styling: When critical styling context is missing (such as the specific event, the weather, their personal comfort level, or colors they love/dislike), ask 1 or 2 brief, friendly follow-up questions at the end of your response to help tailor the outfit.
4. Privacy & Authenticity: Do not recommend or invent commercial shopping links, affiliate codes, fake prices, or product availability. Focus on outfit formulas, color palettes, garment cuts, and styling techniques.
5. Readability: Format your advice clearly with clean bullet points, bold accents, and distinct outfit ideas so the user can easily visualize the look.`;

/**
 * Check if the local Ollama instance is reachable and whether the target model is installed.
 */
export async function checkOllamaConnection(baseUrl = DEFAULT_BASE_URL) {
  const endpoints = [baseUrl, DIRECT_OLLAMA_URL];
  let lastError = null;

  for (const base of endpoints) {
    try {
      const res = await fetch(`${base}/tags`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        const models = (data.models || []).map((m) => m.name);
        const hasGemma = models.some(
          (m) => m === DEFAULT_MODEL || m.startsWith('gemma3') || m.includes('gemma')
        );

        return {
          connected: true,
          models,
          hasModel: hasGemma,
          activeEndpoint: base,
          installedTarget: models.includes(DEFAULT_MODEL),
        };
      }
    } catch (err) {
      lastError = err;
    }
  }

  return {
    connected: false,
    models: [],
    hasModel: false,
    error: lastError ? lastError.message : 'Could not connect to Ollama',
  };
}

/**
 * Send a conversation history to Ollama's /api/chat endpoint.
 *
 * @param {Array<{role: 'user' | 'assistant', content: string}>} messages
 * @param {string} model
 * @param {string} baseUrl
 * @returns {Promise<string>} Valentine's response text
 */
export async function sendChatMessage(messages, model = DEFAULT_MODEL, baseUrl = DEFAULT_BASE_URL) {
  if (!messages || messages.length === 0) {
    throw new Error('Message cannot be empty.');
  }

  // Format messages array with Valentine's system prompt at the beginning
  const formattedMessages = [
    { role: 'system', content: VALENTINE_SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content.trim(),
    })),
  ];

  const payload = {
    model: model,
    messages: formattedMessages,
    stream: false,
  };

  const endpointsToTry = [baseUrl, `${DIRECT_OLLAMA_URL}/api`];
  let lastError = null;

  for (const base of endpointsToTry) {
    const url = base.endsWith('/chat') ? base : `${base}/chat`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorDetails = `HTTP ${response.status} ${response.statusText}`;
        try {
          const errorJson = await response.json();
          if (errorJson.error) {
            errorDetails = errorJson.error;
          }
        } catch {
          // ignore json parse errors
        }

        if (response.status === 404 && errorDetails.includes('model')) {
          throw new Error(
            `Model "${model}" was not found in your local Ollama. Please run 'ollama run ${model}' in your terminal to download it.`
          );
        }

        throw new Error(`Ollama API error: ${errorDetails}`);
      }

      const data = await response.json();
      if (!data.message || !data.message.content) {
        throw new Error('Received an empty response from Valentine AI.');
      }

      return data.message.content;
    } catch (err) {
      lastError = err;
      // If error is specific model error, don't retry second endpoint with identical failure
      if (err.message && err.message.includes('was not found in your local Ollama')) {
        throw err;
      }
    }
  }

  // If both endpoints failed, provide a helpful message
  throw new Error(
    `Unable to connect to Ollama at http://localhost:11434. ` +
    `Please ensure Ollama is running on your computer. ` +
    `Detail: ${lastError ? lastError.message : 'Network connection failed'}`
  );
}
