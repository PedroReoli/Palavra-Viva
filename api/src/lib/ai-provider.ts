/**
 * Palavra Viva — AI Provider Abstraction
 *
 * Provider padrao: Google Gemini (configuravel via .env)
 *
 * Para trocar de provider, edite APENAS o .env da API:
 *   AI_PROVIDER=google
 *   AI_API_KEY=sua-chave
 *   AI_MODEL=gemini-2.0-flash
 *
 * Este arquivo abstrai a comunicacao com qualquer provider.
 * O resto da aplicacao nao precisa saber qual provider esta ativo.
 */

// ---------------------------------------------------------------------------
// Interface generica
// ---------------------------------------------------------------------------

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
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

type ProviderType = 'google' | 'openai' | 'anthropic' | 'groq' | 'openrouter' | 'ollama';

const PROVIDER = (process.env.AI_PROVIDER ?? 'google') as ProviderType;

const PROVIDER_DEFAULTS: Record<ProviderType, { baseUrl: string; model: string }> = {
  google: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.0-flash',
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-4-20250514',
  },
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
  },
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'google/gemini-2.0-flash',
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
// Funcao principal
// ---------------------------------------------------------------------------

/**
 * Envia mensagens para o provider de IA com streaming.
 * Retorna um ReadableStream para pipe direto ao client via SSE.
 */
export async function streamChat(
  messages: AIMessage[],
  systemPrompt: string = SYSTEM_PROMPT,
): Promise<ReadableStream<Uint8Array> | null> {
  if (!config.apiKey && PROVIDER !== 'ollama') {
    throw new Error(`AI_API_KEY nao configurada para provider: ${PROVIDER}`);
  }

  switch (PROVIDER) {
    case 'google':
      return streamGemini(messages, systemPrompt);
    case 'anthropic':
      return streamAnthropic(messages, systemPrompt);
    default:
      return streamOpenAICompatible(messages, systemPrompt);
  }
}

// ---------------------------------------------------------------------------
// Google Gemini (provider padrao)
// ---------------------------------------------------------------------------

/**
 * Modelos Gemini disponiveis (referencia):
 *
 *   gemini-2.0-flash       — Rapido, barato, bom para chat (RECOMENDADO)
 *   gemini-2.0-flash-lite  — Mais rapido ainda, menor custo
 *   gemini-2.5-flash       — Mais inteligente, com "thinking"
 *   gemini-2.5-pro         — Mais capaz, para tarefas complexas
 *
 * Limites do plano gratuito (Google AI Studio):
 *   - 15 RPM (requests por minuto)
 *   - 1.500 RPD (requests por dia)
 *   - 1.000.000 TPM (tokens por minuto)
 */
async function streamGemini(
  messages: AIMessage[],
  systemPrompt: string,
): Promise<ReadableStream<Uint8Array> | null> {
  // Converter mensagens para formato Gemini
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const url = `${config.baseUrl}/models/${config.model}:streamGenerateContent?alt=sse&key=${config.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // System instruction (equivalente ao system prompt)
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },

      // Historico de mensagens
      contents,

      // Configuracao de geracao
      generationConfig: {
        maxOutputTokens: config.maxTokens,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },

      // Safety settings — permissivos para conteudo religioso
      // Sem isso, o Gemini pode bloquear discussoes teologicas
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    console.error(`[Gemini] Erro ${response.status}: ${errorBody}`);
    return null;
  }

  if (!response.body) return null;
  return response.body;
}

// ---------------------------------------------------------------------------
// OpenAI-compatible (OpenAI, Groq, OpenRouter, Ollama)
// ---------------------------------------------------------------------------

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
      temperature: 0.7,
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

// ---------------------------------------------------------------------------
// Anthropic (Claude)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Utilitarios
// ---------------------------------------------------------------------------

/**
 * Retorna informacoes do provider ativo (para debug/logs).
 */
export function getProviderInfo() {
  return {
    provider: PROVIDER,
    model: config.model,
    baseUrl: config.baseUrl,
  };
}
