/**
 * Palavra Viva — AI Provider Abstraction
 *
 * Para trocar de provider, edite APENAS este arquivo.
 * O resto da aplicacao consome via interface generica.
 *
 * Providers suportados (descomente o que quiser usar):
 *   - OpenAI (GPT-4, GPT-4o)
 *   - Anthropic (Claude)
 *   - Google (Gemini)
 *   - Groq
 *   - OpenRouter (qualquer modelo)
 *   - Ollama (local)
 *
 * Configuracao via .env:
 *   AI_PROVIDER=openai | anthropic | google | groq | openrouter | ollama
 *   AI_API_KEY=sua-chave-aqui
 *   AI_MODEL=nome-do-modelo
 *   AI_BASE_URL=(opcional, para endpoints custom)
 */

// ---------------------------------------------------------------------------
// Interface generica
// ---------------------------------------------------------------------------

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIStreamCallbacks {
  onChunk: (text: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: string) => void;
}

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
  maxTokens: number;
}

// ---------------------------------------------------------------------------
// Configuracao (lida do .env)
// ---------------------------------------------------------------------------

type ProviderType = 'openai' | 'anthropic' | 'google' | 'groq' | 'openrouter' | 'ollama';

const PROVIDER = (process.env.AI_PROVIDER ?? 'openai') as ProviderType;

const PROVIDER_DEFAULTS: Record<ProviderType, { baseUrl: string; model: string }> = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-4-20250514',
  },
  google: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.0-flash',
  },
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
  },
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'anthropic/claude-sonnet-4',
  },
  ollama: {
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3.1',
  },
};

const defaults = PROVIDER_DEFAULTS[PROVIDER];

const config: AIProviderConfig = {
  apiKey: process.env.AI_API_KEY ?? '',
  model: process.env.AI_MODEL ?? defaults.model,
  baseUrl: process.env.AI_BASE_URL ?? defaults.baseUrl,
  maxTokens: 2048,
};

// ---------------------------------------------------------------------------
// System prompt do Palavra Viva
// ---------------------------------------------------------------------------

export const SYSTEM_PROMPT = `Voce e um assistente espiritual cristao chamado "Palavra Viva".
Suas respostas devem ser:
- Baseadas exclusivamente na Biblia Sagrada
- Em portugues brasileiro
- Respeitosas com todas as denominacoes cristas
- Contextualizadas historica e teologicamente
- Praticas e aplicaveis ao dia a dia

Ao citar versiculos, use o formato: "Texto" (Livro Capitulo:Versiculo).
Nunca invente versiculos. Se nao souber, diga que nao tem certeza.
Mantenha um tom acolhedor, pastoral e educativo.`;

// ---------------------------------------------------------------------------
// Implementacao por provider
// ---------------------------------------------------------------------------

/**
 * Envia mensagens para o provider de IA com streaming.
 * Retorna a resposta como stream de texto via callbacks.
 */
export async function streamChat(
  messages: AIMessage[],
  systemPrompt: string = SYSTEM_PROMPT,
): Promise<ReadableStream<Uint8Array> | null> {
  if (!config.apiKey && PROVIDER !== 'ollama') {
    throw new Error(`AI_API_KEY nao configurada para provider: ${PROVIDER}`);
  }

  switch (PROVIDER) {
    case 'anthropic':
      return streamAnthropic(messages, systemPrompt);
    case 'google':
      return streamGoogle(messages, systemPrompt);
    default:
      // OpenAI, Groq, OpenRouter e Ollama usam formato OpenAI-compatible
      return streamOpenAICompatible(messages, systemPrompt);
  }
}

/**
 * Formato OpenAI-compatible (OpenAI, Groq, OpenRouter, Ollama).
 */
async function streamOpenAICompatible(
  messages: AIMessage[],
  systemPrompt: string,
): Promise<ReadableStream<Uint8Array> | null> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.filter((m) => m.role !== 'system'),
      ],
    }),
  });

  if (!response.ok || !response.body) return null;
  return response.body;
}

/**
 * Formato Anthropic (Claude).
 */
async function streamAnthropic(
  messages: AIMessage[],
  systemPrompt: string,
): Promise<ReadableStream<Uint8Array> | null> {
  const response = await fetch(`${config.baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      system: systemPrompt,
      stream: true,
      messages: messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok || !response.body) return null;
  return response.body;
}

/**
 * Formato Google Gemini.
 */
async function streamGoogle(
  messages: AIMessage[],
  systemPrompt: string,
): Promise<ReadableStream<Uint8Array> | null> {
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const response = await fetch(
    `${config.baseUrl}/models/${config.model}:streamGenerateContent?alt=sse&key=${config.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: config.maxTokens },
      }),
    },
  );

  if (!response.ok || !response.body) return null;
  return response.body;
}

// ---------------------------------------------------------------------------
// Utilitarios para parsear SSE por provider
// ---------------------------------------------------------------------------

/**
 * Extrai texto de um chunk SSE baseado no provider ativo.
 * Use no pipe do stream para o client.
 */
export function parseSSEChunk(line: string): string | null {
  if (!line.startsWith('data: ')) return null;
  const data = line.slice(6).trim();
  if (data === '[DONE]') return null;

  try {
    const parsed = JSON.parse(data);

    switch (PROVIDER) {
      case 'anthropic':
        // content_block_delta
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          return parsed.delta.text;
        }
        return null;

      case 'google':
        // candidates[0].content.parts[0].text
        return parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

      default:
        // OpenAI-compatible: choices[0].delta.content
        return parsed.choices?.[0]?.delta?.content ?? null;
    }
  } catch {
    return null;
  }
}

/**
 * Retorna o provider ativo para logs/debug.
 */
export function getProviderInfo() {
  return {
    provider: PROVIDER,
    model: config.model,
    baseUrl: config.baseUrl,
  };
}
