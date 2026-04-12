# Guia de Configuracao — Google Gemini

Passo a passo para obter a chave de API do Google Gemini e configurar no Palavra Viva.

---

## 1. Criar a Chave de API

### 1.1 Acessar o Google AI Studio

1. Abra o navegador e acesse: https://aistudio.google.com
2. Faca login com sua conta Google
3. Se for o primeiro acesso, aceite os termos de uso

### 1.2 Gerar a API Key

1. No menu lateral, clique em **"Get API key"** (ou acesse direto: https://aistudio.google.com/apikey)
2. Clique em **"Create API key"**
3. Selecione um projeto Google Cloud existente ou crie um novo
4. A chave sera gerada no formato: `AIzaSy...` (comeca com AIza)
5. **Copie e guarde a chave** — ela nao sera exibida novamente

### 1.3 Verificar a Chave

Teste no terminal para confirmar que funciona:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=SUA_CHAVE_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Diga ola em portugues"}]}]}'
```

Se retornar um JSON com `candidates`, a chave esta funcionando.

---

## 2. Configurar no Palavra Viva

### 2.1 Arquivo .env da API

Abra o arquivo `api/.env` (crie a partir do `api/.env.example` se nao existir):

```env
AI_PROVIDER=google
AI_API_KEY=AIzaSy...sua-chave-aqui
AI_MODEL=gemini-2.0-flash
```

Isso e tudo. O app ja esta preparado para usar o Gemini.

### 2.2 Reiniciar a API

```bash
cd api
npm run dev
```

### 2.3 Testar

Com a API rodando, faca uma requisicao de teste:

```bash
curl -X POST http://localhost:3000/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_SUPABASE" \
  -d '{"messages":[{"role":"user","content":"O que a Biblia fala sobre fe?"}]}'
```

---

## 3. Modelos Disponiveis

| Modelo                | Velocidade | Custo    | Ideal para                        |
|-----------------------|------------|----------|-----------------------------------|
| `gemini-2.0-flash`    | Rapido     | Barato   | Chat do app (RECOMENDADO)         |
| `gemini-2.0-flash-lite` | Muito rapido | Mais barato | Respostas simples, alto volume |
| `gemini-2.5-flash`    | Medio      | Medio    | Respostas mais elaboradas         |
| `gemini-2.5-pro`      | Lento      | Caro     | Devocionais complexos, exegese    |

Para trocar o modelo, altere `AI_MODEL` no `.env`:

```env
AI_MODEL=gemini-2.5-flash
```

---

## 4. Limites do Plano Gratuito

O Google AI Studio oferece uso gratuito com os seguintes limites:

| Recurso                    | Limite                |
|----------------------------|-----------------------|
| Requests por minuto (RPM)  | 15                    |
| Requests por dia (RPD)     | 1.500                 |
| Tokens por minuto (TPM)    | 1.000.000             |

Para o MVP, o plano gratuito e suficiente. Com 1.500 requests/dia e um app com ~100 usuarios ativos, cada usuario poderia enviar ~15 mensagens/dia sem custo.

### Quando migrar para o plano pago

Migre quando:
- Ultrapassar 1.500 requests/dia consistentemente
- Precisar de mais de 15 RPM (picos de uso simultaneo)
- Quiser usar modelos mais avancados sem limite

Para migrar: habilite o faturamento no Google Cloud Console e use a mesma chave.

---

## 5. Precos (plano pago)

Precos aproximados por 1M de tokens (abril 2026):

| Modelo              | Input         | Output        |
|---------------------|---------------|---------------|
| gemini-2.0-flash    | US$0.10       | US$0.40       |
| gemini-2.0-flash-lite | US$0.075    | US$0.30       |
| gemini-2.5-flash    | US$0.15       | US$0.60       |
| gemini-2.5-pro      | US$1.25       | US$10.00      |

**Estimativa de custo mensal com gemini-2.0-flash:**

| Usuarios ativos | Msgs/dia/usuario | Custo estimado |
|-----------------|------------------|----------------|
| 100             | 10               | ~US$2/mes      |
| 500             | 10               | ~US$10/mes     |
| 2.000           | 10               | ~US$40/mes     |
| 5.000           | 10               | ~US$100/mes    |

---

## 6. Safety Settings

O Gemini tem filtros de seguranca que podem bloquear conteudo religioso legitimo (discussoes sobre pecado, sofrimento, morte, etc).

O Palavra Viva ja configura safety settings permissivos em `api/src/lib/ai-provider.ts`:

```typescript
safetySettings: [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
]
```

`BLOCK_ONLY_HIGH` significa: so bloquear conteudo com alta probabilidade de ser nocivo. Isso permite discussoes teologicas normais sem bloqueios.

Se alguma pergunta for bloqueada indevidamente, voce pode alterar para `BLOCK_NONE` (disponivel apenas com plano pago).

---

## 7. Troubleshooting

### "API key not valid"

- Verifique se a chave comeca com `AIza`
- Confirme que nao tem espacos extras no `.env`
- Tente gerar uma nova chave no Google AI Studio

### "quota exceeded"

- Voce ultrapassou o limite gratuito de 1.500 requests/dia
- Aguarde ate meia-noite (PST) para o reset
- Ou habilite faturamento no Google Cloud

### Resposta bloqueada (safety)

- O Gemini bloqueou a resposta por conteudo sensivel
- Verifique os safety settings no `ai-provider.ts`
- Tente reformular a pergunta no system prompt

### Resposta vazia

- Verifique se `AI_MODEL` esta correto
- Teste a chave com o curl da secao 1.3
- Verifique os logs da API: `npm run dev`

### Latencia alta

- Use `gemini-2.0-flash` (mais rapido)
- Reduza `maxOutputTokens` se as respostas forem longas demais
- Considere `gemini-2.0-flash-lite` para respostas curtas

---

## 8. Migracao para Outro Provider

Se precisar trocar de Gemini para outro provider no futuro:

1. Abra `api/.env`
2. Altere as 3 variaveis:

```env
# Exemplo: trocar para OpenAI
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4o
```

3. Reinicie a API: `npm run dev`

Nenhuma alteracao de codigo e necessaria. A abstracao em `api/src/lib/ai-provider.ts` cuida de tudo.

---

## 9. Links Uteis

- Google AI Studio: https://aistudio.google.com
- Gerar API Key: https://aistudio.google.com/apikey
- Documentacao Gemini API: https://ai.google.dev/gemini-api/docs
- Modelos disponiveis: https://ai.google.dev/gemini-api/docs/models
- Precos: https://ai.google.dev/pricing
- Google Cloud Console: https://console.cloud.google.com
