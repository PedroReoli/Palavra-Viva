# Etapas de Desenvolvimento — Palavra Viva

Roadmap completo com checklists por sprint. Cada sprint tem 2 semanas.
Total estimado: 12 semanas (6 sprints).

---

## Sprint 1 — Fundacao e Monetizacao (Semanas 1-2)

Objetivo: App navegavel com design system, autenticacao e paywall funcional.

### 1.1 Setup do Projeto

- [ ] Criar projeto Expo com TypeScript (`npx create-expo-app --template`)
- [ ] Configurar Expo Router (file-based routing)
- [ ] Configurar path aliases (`@/` para `src/`)
- [ ] Configurar ESLint + Prettier
- [ ] Criar `.env.example` com todas as variaveis
- [ ] Configurar `.gitignore` adequado

### 1.2 Design System — Tokens

- [ ] Criar `src/design/colors.ts` (paleta light + dark)
- [ ] Criar `src/design/typography.ts` (Inter, Poppins, Lora)
- [ ] Criar `src/design/spacing.ts` (grid 4pt)
- [ ] Criar `src/design/radii.ts`
- [ ] Criar `src/design/shadows.ts`
- [ ] Criar `src/design/theme.ts` (export unificado + `useTheme()`)
- [ ] Carregar fontes customizadas em `_layout.tsx` com `expo-font`

### 1.3 Design System — Componentes Base

- [ ] `Typography` (Heading, Body, Caption, VerseText)
- [ ] `Button` (primary, secondary, ghost, outline)
- [ ] `Input` (text, search)
- [ ] `Card` (base reutilizavel)
- [ ] `Badge`
- [ ] `Avatar`
- [ ] `Modal`
- [ ] `BottomSheet`
- [ ] `index.ts` com re-exports

### 1.4 Navegacao

- [ ] `src/app/_layout.tsx` (root layout com providers)
- [ ] Grupo `(auth)/` com `_layout.tsx`, `login.tsx`, `register.tsx`, `onboarding.tsx`
- [ ] Grupo `(tabs)/` com `_layout.tsx`, `index.tsx`, `bible.tsx`, `ai.tsx`, `calendar.tsx`, `profile.tsx`
- [ ] Tab bar customizado com icones Phosphor
- [ ] `+not-found.tsx`

### 1.5 Supabase

- [ ] Configurar cliente Supabase (`src/lib/supabase.ts`)
- [ ] Criar schema do banco (todas as tabelas do README)
- [ ] Ativar Row Level Security em todas as tabelas
- [ ] Configurar auth com email/senha
- [ ] Configurar auth social (Google, Apple)

### 1.6 Autenticacao

- [ ] `src/features/auth/services/authService.ts`
- [ ] `src/features/auth/stores/authStore.ts` (Zustand)
- [ ] `src/features/auth/hooks/useAuth.ts`
- [ ] Tela de login funcional
- [ ] Tela de registro funcional
- [ ] Persistencia de sessao com `expo-secure-store`
- [ ] Protecao de rotas (redirect se nao autenticado)

### 1.7 RevenueCat — Pagamento

- [ ] Configurar RevenueCat SDK (`src/lib/revenuecat.ts`)
- [ ] Definir offerings no dashboard RevenueCat (mensal R$19,90, anual R$149,90)
- [ ] `src/features/subscription/services/subscriptionService.ts`
- [ ] `src/features/subscription/stores/subscriptionStore.ts`
- [ ] `src/features/subscription/hooks/useSubscription.ts`
- [ ] `src/features/subscription/hooks/useRequirePremium.ts` (gate hook)
- [ ] Tela de paywall com comparacao de planos
- [ ] Restaurar compras
- [ ] Testar fluxo completo com sandbox

### 1.8 VPS API — Base

- [ ] Setup do projeto Node.js + Express + TypeScript
- [ ] `POST /auth/register`
- [ ] `POST /auth/login`
- [ ] `POST /auth/refresh-token`
- [ ] `POST /subscription/webhook` (RevenueCat)
- [ ] `GET /subscription/status`
- [ ] Rate limiting e validacao de input (zod)
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

- [ ] `src/features/bible/services/bibleService.ts`
- [ ] Configurar Axios instance para API.Bible
- [ ] Listar versoes disponiveis (ARA, NVI, ACF)
- [ ] Listar livros por versao
- [ ] Buscar capitulos e versiculos
- [ ] Cache com TanStack Query (staleTime longo — conteudo estatico)

### 2.2 Leitor Biblico

- [ ] Tela de selecao de versao biblica
- [ ] Tela de selecao de livro (Antigo/Novo Testamento)
- [ ] Tela de selecao de capitulo
- [ ] Componente de leitura com tipografia Lora
- [ ] Modo noturno (dark mode no leitor)
- [ ] Ajuste de tamanho de fonte
- [ ] Scroll suave entre capitulos

### 2.3 Interacao com Versiculos

- [ ] Selecao de versiculo (long press)
- [ ] Menu de acoes: destacar, anotar, copiar, compartilhar, favoritar
- [ ] Sistema de cores para destaques (5 cores)
- [ ] Persistencia de destaques no Supabase
- [ ] Persistencia de notas no Supabase
- [ ] `src/features/bible/stores/bibleStore.ts`

### 2.4 Busca

- [ ] Busca por palavra ou frase em toda a Biblia
- [ ] Resultados com contexto (versiculo + referencia)
- [ ] Componente `Input` variante search

### 2.5 Versiculo do Dia

- [ ] Logica de selecao do verso diario
- [ ] `VerseCard` na home (componente compartilhado)
- [ ] Compartilhamento do verso (texto + imagem)
- [ ] Notificacao push diaria com expo-notifications

### Entregaveis

- Leitor biblico funcional com 3 versoes
- Destaques coloridos e notas por versiculo
- Busca biblica
- Verso do dia na home com notificacao

---

## Sprint 3 — IA Conversacional e Devocional (Semanas 5-6)

Objetivo: Chat com IA e devocionais personalizados funcionando.

### 3.1 Proxy de IA

- [ ] `POST /ai/chat` no VPS (proxy para Claude API)
- [ ] System prompt especializado (teologo, contextualista, conselheiro)
- [ ] Streaming de respostas (SSE)
- [ ] Limite de mensagens por plano (free vs premium)
- [ ] Rate limiting por usuario

### 3.2 Interface de Chat

- [ ] `ChatBubble` (user e AI) — componente compartilhado
- [ ] `ChatInput` com sugestoes rapidas de perguntas
- [ ] Lista de mensagens com scroll automatico
- [ ] Indicador de loading/streaming
- [ ] `src/features/ai-chat/services/chatService.ts`
- [ ] `src/features/ai-chat/stores/chatStore.ts`
- [ ] `src/features/ai-chat/hooks/useChat.ts`

### 3.3 Historico de Conversas

- [ ] Lista de conversas anteriores
- [ ] Persistencia no Supabase (conversations + messages)
- [ ] Titulo automatico da conversa (primeira pergunta)
- [ ] Excluir conversa

### 3.4 Integracao Biblia + IA

- [ ] Acao "Perguntar a IA sobre este versiculo" no menu do leitor
- [ ] Contexto automatico (livro, capitulo, passagem)
- [ ] Referencias biblicas clicaveis nas respostas da IA

### 3.5 Devocional Personalizado

- [ ] `src/features/devotional/services/devotionalService.ts`
- [ ] Tela de input: "Como voce esta hoje?" ou tema livre
- [ ] Geracao via Claude API (passagem + reflexao + oracao + aplicacao)
- [ ] Componente de resultado do devocional
- [ ] Persistencia no Supabase (devotionals)
- [ ] Salvar e compartilhar devocional

### Entregaveis

- Chat com IA funcional com streaming
- Historico de conversas
- Integracao versiculo -> chat
- Devocional diario gerado por IA

---

## Sprint 4 — Planos de Leitura e Calendario (Semanas 7-8)

Objetivo: Planos de leitura com progresso e calendario liturgico.

### 4.1 Planos de Leitura

- [ ] Dados dos planos pre-definidos:
  - Biblia em 1 ano
  - Novo Testamento em 90 dias
  - Salmos e Proverbios (mensal)
  - Tematicos: ansiedade, familia, lideranca, proposito
- [ ] `src/features/reading-plans/services/planService.ts`
- [ ] Tela de listagem de planos disponiveis
- [ ] Tela de detalhe do plano com dias
- [ ] `ReadingChecklistItem` — componente compartilhado
- [ ] Marcar dia como concluido
- [ ] Progresso salvo no Supabase (reading_progress)
- [ ] Barra de progresso visual

### 4.2 Calendario Liturgico

- [ ] Dados do calendario (feriados cristãos, datas biblicas)
- [ ] `CalendarDay` — componente compartilhado
- [ ] Visualizacao mensal com marcacoes
- [ ] Detalhe do dia: historia biblica + versiculo relacionado
- [ ] Suporte a datas evangelicas e catolicas
- [ ] `src/features/calendar/services/calendarService.ts`

### 4.3 Streak e Progresso

- [ ] Calculo de dias consecutivos de leitura
- [ ] Exibicao do streak na home e perfil
- [ ] Indicador visual de conquista (badges)
- [ ] Estatisticas mensais (versiculos lidos, dias ativos)

### Entregaveis

- 6+ planos de leitura com checklist e progresso
- Calendario liturgico mensal
- Sistema de streak funcional
- Estatisticas de leitura

---

## Sprint 5 — Polimento e Funcionalidades Sociais (Semanas 9-10)

Objetivo: Verse cards, audio, notificacoes e onboarding.

### 5.1 Gerador de Verse Card

- [ ] `src/features/verse-card/` completo
- [ ] Templates visuais (natureza, minimalista, aquarela, escuro)
- [ ] Selecao de versiculo + template
- [ ] Renderizacao com `react-native-view-shot`
- [ ] Download em alta resolucao
- [ ] Compartilhamento para WhatsApp, Instagram Stories
- [ ] Gate: limitado no free, ilimitado no premium

### 5.2 Audio Player

- [ ] `AudioPlayer` (mini + full) — componente compartilhado
- [ ] Integracao com `expo-av`
- [ ] Reproducao em background
- [ ] Controle de velocidade (0.75x a 2x)
- [ ] `src/features/audio-player/services/audioService.ts`
- [ ] Gate: apenas premium

### 5.3 Notificacoes

- [ ] Configuracao de expo-notifications
- [ ] Lembrete diario de leitura (horario personalizavel)
- [ ] Verso do dia (push matinal)
- [ ] Datas do calendario liturgico
- [ ] Tela de configuracao de notificacoes no perfil

### 5.4 Onboarding

- [ ] Fluxo de 3-4 telas:
  1. Denominacao (evangelico, catolico, outro)
  2. Versao biblica preferida
  3. Objetivo (leitura diaria, estudo, devocionais)
  4. Horario de leitura (para notificacoes)
- [ ] Salvar preferencias no Supabase (profiles)
- [ ] Paywall ao final do onboarding
- [ ] Exibir apenas no primeiro acesso

### 5.5 Tela de Perfil

- [ ] Streak de leitura e conquistas
- [ ] Versiculos favoritos
- [ ] Plano atual e botao de upgrade
- [ ] Configuracoes de notificacao
- [ ] Versao biblica preferida
- [ ] Logout

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
