# Etapas de Desenvolvimento — Palavra Viva

Roadmap completo com checklists por sprint. Cada sprint tem 2 semanas.
Total estimado: 12 semanas (6 sprints).

---

## Sprint 1 — Fundacao e Monetizacao (Semanas 1-2)

Objetivo: App navegavel com design system, autenticacao e paywall funcional.

### 1.1 Setup do Projeto

- [x] Criar projeto Expo com TypeScript (`npx create-expo-app --template`)
- [x] Configurar Expo Router (file-based routing)
- [x] Configurar path aliases (`@/` para `src/`)
- [x] Configurar ESLint + Prettier
- [x] Criar `.env.example` com todas as variaveis
- [x] Configurar `.gitignore` adequado

### 1.2 Design System — Tokens

- [x] Criar `src/design/colors.ts` (paleta light + dark)
- [x] Criar `src/design/typography.ts` (Inter, Poppins, Lora)
- [x] Criar `src/design/spacing.ts` (grid 4pt)
- [x] Criar `src/design/radii.ts`
- [x] Criar `src/design/shadows.ts`
- [x] Criar `src/design/theme.ts` (export unificado + `useTheme()`)
- [x] Carregar fontes customizadas em `_layout.tsx` com `expo-font`

### 1.3 Design System — Componentes Base

- [x] `Typography` (Heading, Body, Caption, VerseText)
- [x] `Button` (primary, secondary, ghost, outline)
- [x] `Input` (text, search)
- [x] `Card` (base reutilizavel)
- [x] `Badge`
- [x] `Avatar`
- [x] `Modal`
- [x] `BottomSheet`
- [x] `index.ts` com re-exports

### 1.4 Navegacao

- [x] `src/app/_layout.tsx` (root layout com providers)
- [x] Grupo `(auth)/` com `_layout.tsx`, `login.tsx`, `register.tsx`, `onboarding.tsx`
- [x] Grupo `(tabs)/` com `_layout.tsx`, `index.tsx`, `bible.tsx`, `ai.tsx`, `calendar.tsx`, `profile.tsx`
- [x] Tab bar customizado com icones Phosphor
- [x] `+not-found.tsx`

### 1.5 Supabase

- [x] Configurar cliente Supabase (`src/lib/supabase.ts`)
- [x] Criar schema do banco (todas as tabelas do README)
- [x] Ativar Row Level Security em todas as tabelas
- [x] Configurar auth com email/senha
- [ ] Configurar auth social (Google, Apple)

### 1.6 Autenticacao

- [x] `src/features/auth/services/authService.ts`
- [x] `src/features/auth/stores/authStore.ts` (Zustand)
- [x] `src/features/auth/hooks/useAuth.ts`
- [x] Tela de login funcional
- [x] Tela de registro funcional
- [x] Persistencia de sessao com `expo-secure-store`
- [x] Protecao de rotas (redirect se nao autenticado)

### 1.7 RevenueCat — Pagamento

- [x] Configurar RevenueCat SDK (`src/lib/revenuecat.ts`)
- [ ] Definir offerings no dashboard RevenueCat (mensal R$19,90, anual R$149,90)
- [x] `src/features/subscription/services/subscriptionService.ts`
- [x] `src/features/subscription/stores/subscriptionStore.ts`
- [x] `src/features/subscription/hooks/useSubscription.ts`
- [x] `src/features/subscription/hooks/useRequirePremium.ts` (gate hook)
- [x] Tela de paywall com comparacao de planos
- [x] Restaurar compras
- [ ] Testar fluxo completo com sandbox

### 1.8 VPS API — Base

- [x] Setup do projeto Node.js + Express + TypeScript
- [x] `POST /auth/register`
- [x] `POST /auth/login`
- [x] `POST /auth/refresh-token`
- [x] `POST /subscription/webhook` (RevenueCat)
- [x] `GET /subscription/status`
- [x] Rate limiting e validacao de input (zod)
- [ ] Deploy inicial na VPS

### Entregaveis

- App navegavel com 5 tabs
- Design system funcional (tokens + componentes base)
- Login e registro funcionando (email + social)
- Paywall funcional com RevenueCat
- VPS recebendo webhooks de assinatura

---

## Sprint 2 — Biblia Core (Semanas 3-4)

Objetivo: Leitor biblico completo com destaques, notas e verso do dia.

### 2.1 Integracao API.Bible

- [x] `src/features/bible/services/bibleService.ts`
- [x] Configurar Axios instance para API.Bible
- [x] Listar versoes disponiveis (ARA, NVI, ACF)
- [x] Listar livros por versao
- [x] Buscar capitulos e versiculos
- [x] Cache com TanStack Query (staleTime longo — conteudo estatico)

### 2.2 Leitor Biblico

- [x] Tela de selecao de versao biblica
- [x] Tela de selecao de livro (Antigo/Novo Testamento)
- [x] Tela de selecao de capitulo
- [x] Componente de leitura com tipografia Lora
- [x] Modo noturno (dark mode no leitor)
- [x] Ajuste de tamanho de fonte
- [x] Scroll suave entre capitulos

### 2.3 Interacao com Versiculos

- [x] Selecao de versiculo (long press)
- [x] Menu de acoes: destacar, anotar, copiar, compartilhar, favoritar
- [x] Sistema de cores para destaques (5 cores)
- [x] Persistencia de destaques no Supabase
- [x] Persistencia de notas no Supabase
- [x] `src/features/bible/stores/bibleStore.ts`

### 2.4 Busca

- [x] Busca por palavra ou frase em toda a Biblia
- [x] Resultados com contexto (versiculo + referencia)
- [x] Componente `Input` variante search

### 2.5 Versiculo do Dia

- [x] Logica de selecao do verso diario
- [x] `VerseCard` na home (componente compartilhado)
- [x] Compartilhamento do verso (texto + imagem)
- [x] Notificacao push diaria com expo-notifications

### Entregaveis

- Leitor biblico funcional com 3 versoes
- Destaques coloridos e notas por versiculo
- Busca biblica
- Verso do dia na home com notificacao

---

## Sprint 3 — IA Conversacional e Devocional (Semanas 5-6)

Objetivo: Chat com IA e devocionais personalizados funcionando.

### 3.1 Proxy de IA

- [x] `POST /ai/chat` no VPS (proxy para Claude API)
- [x] System prompt especializado (teologo, contextualista, conselheiro)
- [x] Streaming de respostas (SSE)
- [x] Limite de mensagens por plano (free vs premium)
- [x] Rate limiting por usuario

### 3.2 Interface de Chat

- [x] `ChatBubble` (user e AI) — componente compartilhado
- [x] `ChatInput` com sugestoes rapidas de perguntas
- [x] Lista de mensagens com scroll automatico
- [x] Indicador de loading/streaming
- [x] `src/features/ai-chat/services/chatService.ts`
- [x] `src/features/ai-chat/stores/chatStore.ts`
- [x] `src/features/ai-chat/hooks/useChat.ts`

### 3.3 Historico de Conversas

- [x] Lista de conversas anteriores
- [x] Persistencia no Supabase (conversations + messages)
- [x] Titulo automatico da conversa (primeira pergunta)
- [x] Excluir conversa

### 3.4 Integracao Biblia + IA

- [x] Acao "Perguntar a IA sobre este versiculo" no menu do leitor
- [x] Contexto automatico (livro, capitulo, passagem)
- [x] Referencias biblicas clicaveis nas respostas da IA

### 3.5 Devocional Personalizado

- [x] `src/features/devotional/services/devotionalService.ts`
- [x] Tela de input: "Como voce esta hoje?" ou tema livre
- [x] Geracao via Claude API (passagem + reflexao + oracao + aplicacao)
- [x] Componente de resultado do devocional
- [x] Persistencia no Supabase (devotionals)
- [x] Salvar e compartilhar devocional

### Entregaveis

- Chat com IA funcional com streaming
- Historico de conversas
- Integracao versiculo -> chat
- Devocional diario gerado por IA

---

## Sprint 4 — Planos de Leitura e Calendario (Semanas 7-8)

Objetivo: Planos de leitura com progresso e calendario liturgico.

### 4.1 Planos de Leitura

- [x] Dados dos planos pre-definidos:
  - Biblia em 1 ano
  - Novo Testamento em 90 dias
  - Salmos e Proverbios (mensal)
  - Tematicos: ansiedade, familia, lideranca, proposito
- [x] `src/features/reading-plans/services/planService.ts`
- [x] Tela de listagem de planos disponiveis
- [x] Tela de detalhe do plano com dias
- [x] `ReadingChecklistItem` — componente compartilhado
- [x] Marcar dia como concluido
- [x] Progresso salvo no Supabase (reading_progress)
- [x] Barra de progresso visual

### 4.2 Calendario Liturgico

- [x] Dados do calendario (feriados cristãos, datas biblicas)
- [x] `CalendarDay` — componente compartilhado
- [x] Visualizacao mensal com marcacoes
- [x] Detalhe do dia: historia biblica + versiculo relacionado
- [x] Suporte a datas evangelicas e catolicas
- [x] `src/features/calendar/services/calendarService.ts`

### 4.3 Streak e Progresso

- [x] Calculo de dias consecutivos de leitura
- [x] Exibicao do streak na home e perfil
- [x] Indicador visual de conquista (badges)
- [x] Estatisticas mensais (versiculos lidos, dias ativos)

### Entregaveis

- 6+ planos de leitura com checklist e progresso
- Calendario liturgico mensal
- Sistema de streak funcional
- Estatisticas de leitura

---

## Sprint 5 — Polimento e Funcionalidades Sociais (Semanas 9-10)

Objetivo: Verse cards, audio, notificacoes e onboarding.

### 5.1 Gerador de Verse Card

- [x] `src/features/verse-card/` completo
- [x] Templates visuais (natureza, minimalista, aquarela, escuro)
- [x] Selecao de versiculo + template
- [x] Renderizacao com `react-native-view-shot`
- [x] Download em alta resolucao
- [x] Compartilhamento para WhatsApp, Instagram Stories
- [x] Gate: limitado no free, ilimitado no premium

### 5.2 Audio Player

- [x] `AudioPlayer` (mini + full) — componente compartilhado
- [x] Integracao com `expo-av`
- [x] Reproducao em background
- [x] Controle de velocidade (0.75x a 2x)
- [x] `src/features/audio-player/services/audioService.ts`
- [x] Gate: apenas premium

### 5.3 Notificacoes

- [x] Configuracao de expo-notifications
- [x] Lembrete diario de leitura (horario personalizavel)
- [x] Verso do dia (push matinal)
- [x] Datas do calendario liturgico
- [x] Tela de configuracao de notificacoes no perfil

### 5.4 Onboarding

- [x] Fluxo de 3-4 telas:
  1. Denominacao (evangelico, catolico, outro)
  2. Versao biblica preferida
  3. Objetivo (leitura diaria, estudo, devocionais)
  4. Horario de leitura (para notificacoes)
- [x] Salvar preferencias no Supabase (profiles)
- [x] Paywall ao final do onboarding
- [x] Exibir apenas no primeiro acesso

### 5.5 Tela de Perfil

- [x] Streak de leitura e conquistas
- [x] Versiculos favoritos
- [x] Plano atual e botao de upgrade
- [x] Configuracoes de notificacao
- [x] Versao biblica preferida
- [x] Logout

### Entregaveis

- Gerador de verse cards compartilhaveis
- Audio player funcional
- Notificacoes configuradas
- Onboarding completo
- Perfil com estatisticas

---

## Sprint 6 — VPS Final, Testes e Deploy (Semanas 11-12)

Objetivo: API finalizada, testes, publicacao nas lojas.

### 6.1 VPS API — Finalizacao

- [ ] `GET /user/profile`
- [ ] `PUT /user/profile`
- [ ] Validacao robusta em todos os endpoints (zod)
- [ ] Rate limiting por IP e por usuario
- [ ] Logs estruturados
- [ ] Health check (`GET /health`)
- [ ] CORS restrito
- [ ] Helmet para headers de seguranca

### 6.2 Testes

- [ ] Testes unitarios dos componentes do design system
- [ ] Testes dos hooks principais (useAuth, useSubscription, useChat)
- [ ] Testes de integracao dos fluxos criticos:
  - Login -> Dashboard
  - Paywall -> Assinatura
  - Leitor -> Destaque -> Nota
  - Chat -> Resposta da IA
- [ ] Teste de assinatura end-to-end (sandbox)
- [ ] Testes da VPS API (supertest)

### 6.3 Deploy

- [ ] Configurar EAS Build
- [ ] Build de producao iOS
- [ ] Build de producao Android
- [ ] Submeter para App Store Connect
- [ ] Submeter para Google Play Console
- [ ] Deploy VPS (Docker + PM2)
- [ ] Configurar dominio e SSL para API
- [ ] Configurar CI/CD basico (GitHub Actions)

### 6.4 Otimizacao

- [ ] Audit de performance (listas longas, scroll, chat)
- [ ] Otimizar tamanho do bundle
- [ ] Splash screen final
- [ ] App icon final
- [ ] Screenshots para as lojas
- [ ] Descricao e metadata das lojas (ASO)

### Entregaveis

- API VPS em producao com seguranca
- App submetido para App Store e Play Store
- Pipeline de CI/CD funcional
- Testes cobrindo fluxos criticos

---

## Resumo das Sprints

| Sprint | Foco                             | Semanas |
|--------|----------------------------------|---------|
| 1      | Fundacao + Design System + Pagamento | 1-2   |
| 2      | Biblia Core                      | 3-4     |
| 3      | IA Conversacional + Devocional   | 5-6     |
| 4      | Planos de Leitura + Calendario   | 7-8     |
| 5      | Polimento (cards, audio, onboarding) | 9-10 |
| 6      | VPS Final + Testes + Deploy      | 11-12   |
