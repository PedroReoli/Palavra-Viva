/**
 * Parser generico de SSE para qualquer provider de IA.
 *
 * Detecta automaticamente o formato:
 *   - OpenAI-compatible: choices[0].delta.content
 *   - Anthropic: content_block_delta.delta.text
 *   - Google: candidates[0].content.parts[0].text
 *
 * Uso:
 *   const text = parseSSELine(line);
 *   if (text) fullText += text;
 */
export function parseSSELine(line: string): string | null {
  if (!line.startsWith('data: ')) return null;
  const data = line.slice(6).trim();
  if (data === '[DONE]') return null;

  try {
    const parsed = JSON.parse(data);

    // OpenAI-compatible (OpenAI, Groq, OpenRouter, Ollama)
    const openaiContent = parsed.choices?.[0]?.delta?.content;
    if (openaiContent) return openaiContent;

    // Anthropic (Claude)
    if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
      return parsed.delta.text;
    }

    // Google (Gemini)
    const geminiContent = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
    if (geminiContent) return geminiContent;

    return null;
  } catch {
    return null;
  }
}

/**
 * Processa um chunk inteiro de SSE (pode conter multiplas linhas).
 * Retorna todo o texto extraido concatenado.
 */
export function parseSSEChunk(chunk: string): string {
  let text = '';
  const lines = chunk.split('\n');
  for (const line of lines) {
    const parsed = parseSSELine(line);
    if (parsed) text += parsed;
  }
  return text;
}
