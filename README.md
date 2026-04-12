# Palavra Viva

> Sua Biblia. Sua IA. Sua fe, mais perto de voce.

App mobile de espiritualidade crista com IA conversacional para iOS e Android.

---

## Sobre o Projeto

Palavra Viva e um app biblico com IA conversacional em PT-BR. O usuario le a Biblia, conversa com uma IA sobre passagens, recebe devocionais personalizados e acompanha sua jornada espiritual.

**Modelo:** Freemium + Assinatura (R$19,90/mês ou R$149,90/ano)

**Publico:** Cristaos evangelicos e catolicos no Brasil

**Inspiracoes de UX:**

| Referencia | O que absorvemos                        |
|------------|-----------------------------------------|
| Spotify    | Navegacao fluida, bottom tabs, home cards |
| Notion     | Organizacao de conteudo, listas, notas  |
| ChatGPT    | Interface de chat, streaming, sugestoes |
| Kindle     | Experiencia de leitura, tipografia, foco |

---

## Stack Tecnologica

| Camada            | Tecnologia                | Motivo                                      |
|-------------------|---------------------------|---------------------------------------------|
| Mobile            | Expo (React Native)       | iOS + Android com 1 codebase                |
| Navegacao         | Expo Router               | File-based routing, deep linking            |
| Backend (in-app)  | Supabase                  | Auth, banco, storage, RLS                   |
| Backend (VPS)     | Node.js + Express         | API minima: contas, assinatura, proxy IA    |
| IA                | Google Gemini (padrao)     | Plano gratuito generoso, rapido, bom em PT-BR. Configuravel para outros providers |
| Biblia            | API.Bible                 | Gratuita, multiplas versoes em PT-BR        |
| Pagamento         | RevenueCat                | Assinaturas mobile (App Store + Play Store) |
| Estado            | Zustand                   | Leve, hook-based, persistencia facil        |
| Cache/Servidor    | TanStack Query            | Cache, retry, stale-while-revalidate        |
| HTTP              | Axios                     | Interceptors, tipagem, cancelamento         |
| Icones            | Phosphor React Native     | 6000+ icones, 6 pesos, sem emoji            |
| Fontes            | expo-font                 | Carregamento assincrono de fontes custom    |
| Notificacoes      | Expo Notifications        | Push notifications gratuito                 |
| Audio             | expo-av                   | Reproducao em background                    |
| Compartilhamento  | expo-sharing              | Share nativo                                |
| Captura de tela   | react-native-view-shot    | Gerar imagem de verse cards                 |
| Armazenamento     | expo-secure-store         | Tokens e dados sensiveis                    |
| Animacoes         | react-native-reanimated   | Animacoes performaticas (UI thread)         |
| Analytics         | Mixpanel                  | Comportamento do usuario                    |

---

## Estrutura de Pastas

```
src/
|
|-- app/                              # Expo Router (file-based routing)
|   |-- (auth)/
|   |   |-- _layout.tsx
|   |   |-- login.tsx
|   |   |-- register.tsx
|   |   |-- onboarding.tsx
|   |-- (tabs)/
|   |   |-- _layout.tsx
|   |   |-- index.tsx                 # Home / Dashboard
|   |   |-- bible.tsx                 # Leitor biblico
|   |   |-- ai.tsx                    # Chat IA (Premium)
|   |   |-- calendar.tsx              # Calendario liturgico
|   |   |-- profile.tsx               # Perfil
|   |-- _layout.tsx                   # Root layout (fonts, providers)
|   |-- +not-found.tsx
|
|-- features/                         # Modulos por funcionalidade
|   |-- auth/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- services/
|   |   |-- stores/
|   |   |-- types.ts
|   |-- bible/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- services/
|   |   |-- stores/
|   |   |-- types.ts
|   |-- ai-chat/
|   |-- devotional/
|   |-- reading-plans/
|   |-- calendar/
|   |-- subscription/
|   |-- verse-card/
|   |-- audio-player/
|
|-- shared/                           # Componentes e logica reutilizavel
|   |-- components/                   # Design System
|   |   |-- Button.tsx
|   |   |-- Card.tsx
|   |   |-- Input.tsx
|   |   |-- Typography.tsx
|   |   |-- ChatBubble.tsx
|   |   |-- VerseCard.tsx
|   |   |-- AudioPlayer.tsx
|   |   |-- CalendarDay.tsx
|   |   |-- ReadingChecklistItem.tsx
|   |   |-- Badge.tsx
|   |   |-- Avatar.tsx
|   |   |-- BottomSheet.tsx
|   |   |-- Modal.tsx
|   |   |-- index.ts
|   |-- hooks/
|   |-- services/
|   |-- types/
|   |-- utils/
|
|-- design/                           # Design tokens (fonte unica de verdade)
|   |-- colors.ts                     # Paleta completa (light + dark)
|   |-- typography.ts                 # Fontes, tamanhos, pesos
|   |-- spacing.ts                    # Escala de espacamento (grid 4pt)
|   |-- radii.ts                      # Border radius
|   |-- shadows.ts                    # Sombras
|   |-- theme.ts                      # Export unificado + useTheme()
|
|-- lib/                              # Wrappers de terceiros
|   |-- api.ts                        # Axios instance + interceptors
|   |-- supabase.ts                   # Cliente Supabase
|   |-- revenuecat.ts                 # RevenueCat config
|   |-- analytics.ts                  # Mixpanel
|
|-- assets/
    |-- fonts/
        |-- Inter-*.ttf
        |-- Poppins-*.ttf
        |-- Lora-*.ttf
```

### Principio de organizacao

Cada pasta em `features/` segue a mesma estrutura interna:

```
features/[nome]/
|-- components/     # Componentes especificos da feature
|-- hooks/          # Hooks especificos
|-- services/       # Chamadas API e logica de negocio
|-- stores/         # Zustand stores (se necessario)
|-- types.ts        # Tipos TypeScript da feature
```

Componentes reutilizaveis entre features ficam em `shared/components/`.
Nunca duplicar componente — se dois features precisam, vai para `shared/`.

---

## Arquitetura Backend

O backend e dividido em duas camadas: Supabase (direto do app) e uma API minima em VPS.

### Supabase (in-app)

Responsavel por tudo que nao precisa de logica customizada no servidor:

- **Auth:** Login social (Google, Apple) e email/senha
- **Banco de dados:** Destaques, notas, historico de chat, progresso de leitura, favoritos, devocionais
- **Storage:** Imagens de verse cards gerados pelo usuario
- **Row Level Security:** Ativado em todas as tabelas — usuarios so acessam seus proprios dados

### VPS (API minima — Node.js + Express)

Responsavel apenas por:

| Endpoint                    | Metodo | Descricao                          |
|-----------------------------|--------|------------------------------------|
| `/auth/register`            | POST   | Registro de conta                  |
| `/auth/login`               | POST   | Login                              |
| `/auth/refresh-token`       | POST   | Renovar token                      |
| `/subscription/status`      | GET    | Status da assinatura do usuario    |
| `/subscription/webhook`     | POST   | Webhook do RevenueCat              |
| `/user/profile`             | GET    | Buscar perfil                      |
| `/user/profile`             | PUT    | Atualizar perfil                   |
| `/ai/chat`                  | POST   | Proxy para IA (provider configuravel) |

**Regra:** A chave de IA nunca e exposta no client. Todas as chamadas passam pelo VPS (proxy). O provider e configuravel via `AI_PROVIDER` no `.env` da API.

### Fluxo de Dados

```
App (Expo)
  |
  |--- Supabase -----------------> Dados do usuario (notas, destaques, progresso)
  |
  |--- VPS API ------------------> Auth, assinatura, proxy IA
  |
  |--- API.Bible ----------------> Textos biblicos (cache agressivo)
  |
  |--- RevenueCat SDK -----------> Verificacao de assinatura (client-side)
  |
  |--- RevenueCat Webhook -------> VPS (sincroniza status no Supabase)
```

---

## Design System

### Foundation — Tokens

Todos os valores visuais sao definidos em `src/design/`. Nenhum valor hardcoded e permitido em componentes.

#### Cores (`colors.ts`)

Paleta semantica com suporte a light e dark mode:

```
primary         # Cor principal da marca
primaryLight    # Variante clara
primaryDark     # Variante escura
secondary       # Cor de acento
background      # Fundo principal
surface         # Fundo de cards e modais
surfaceVariant  # Fundo alternativo
textPrimary     # Texto principal
textSecondary   # Texto secundario
textInverse     # Texto sobre fundo escuro
success         # Feedback positivo
warning         # Feedback de atencao
error           # Feedback de erro
info            # Feedback informativo
highlight[1-5]  # Cores para destaque de versiculos
```

#### Tipografia (`typography.ts`)

| Uso                    | Fonte           | Pesos                    |
|------------------------|-----------------|--------------------------|
| Headings, botoes       | Poppins         | SemiBold (600), Bold (700) |
| Body, captions         | Inter           | Regular (400), Medium (500) |
| Versiculos, destaques  | Lora            | Regular (400), Bold (700)  |

Escala de tamanho: xs (10), sm (12), md (14), base (16), lg (18), xl (20), 2xl (24), 3xl (30), 4xl (36)

#### Espacamento (`spacing.ts`)

Grid de 4 pontos:

```
xs:   4
sm:   8
md:   16
lg:   24
xl:   32
xxl:  48
```

#### Border Radius (`radii.ts`)

```
sm:   4
md:   8
lg:   12
xl:   16
full: 9999
```

#### Sombras (`shadows.ts`)

Tres niveis: sm, md, lg — cada um com shadowColor, shadowOffset, shadowOpacity, shadowRadius e elevation (Android).

### Componentes Compartilhados

Todos em `src/shared/components/`. Funcionam como pecas de Lego — montaveis, padronizados, sem codigo visual duplicado.

| Componente              | Descricao                                          |
|-------------------------|----------------------------------------------------|
| `Button`                | Variantes: primary, secondary, ghost, outline      |
| `Card`                  | Base reutilizavel (verso, plano, devocional herdam) |
| `Input`                 | Text, search, chat input                           |
| `Typography`            | Heading, Body, Caption, VerseText                  |
| `ChatBubble`            | Bolha de mensagem (user, AI)                       |
| `VerseCard`             | Versiculo com referencia, compartilhavel            |
| `AudioPlayer`           | Mini player e player completo                      |
| `CalendarDay`           | Dia do calendario com marcacao                     |
| `ReadingChecklistItem`  | Item de checklist de plano de leitura              |
| `Badge`                 | Indicador de status ou contagem                    |
| `Avatar`                | Foto ou iniciais do usuario                        |
| `BottomSheet`           | Painel deslizante inferior                         |
| `Modal`                 | Dialog modal padrao                                |

### Padroes de Layout

- **Dashboard:** Cards empilhados (verso do dia, progresso, atalho IA)
- **Leitura:** Foco no texto, tipografia Lora, fundo suave, modo noturno
- **Chat:** Inspirado no ChatGPT — bolhas, streaming, sugestoes rapidas
- **Navegacao:** Bottom tabs com icones Phosphor (5 abas: Home, Biblia, IA, Calendario, Perfil)

---

## Schema do Banco de Dados (Supabase)

```sql
-- Perfis de usuario
profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  denomination TEXT,
  preferred_version TEXT DEFAULT 'nvi',
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Assinaturas
subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  plan TEXT NOT NULL,           -- 'free', 'monthly', 'yearly'
  status TEXT NOT NULL,         -- 'active', 'expired', 'cancelled'
  provider_id TEXT,             -- ID do RevenueCat
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Destaques biblicos
highlights (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  verse_id TEXT NOT NULL,
  color TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Notas pessoais
notes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  verse_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Planos de leitura (definicoes)
reading_plans (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  type TEXT NOT NULL             -- 'full', 'thematic', 'book'
)

-- Progresso de leitura do usuario
reading_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  plan_id UUID REFERENCES reading_plans(id),
  day INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ
)

-- Conversas com IA
conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Mensagens de conversa
messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role TEXT NOT NULL,            -- 'user', 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Devocionais gerados
devotionals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  verse_id TEXT,
  reflection TEXT NOT NULL,
  prayer TEXT,
  application TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Versiculos favoritos
favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  verse_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

---

## Funcionalidades por Plano

| Funcionalidade              | Gratuito | Premium |
|-----------------------------|----------|---------|
| Biblia completa (ARA, NVI)  | Sim      | Sim     |
| Planos de leitura            | Sim      | Sim     |
| Versiculo do dia             | Sim      | Sim     |
| Calendario liturgico         | Sim      | Sim     |
| IA Conversacional            | Nao      | Sim     |
| Devocional com IA            | Nao      | Sim     |
| Audio das passagens          | Nao      | Sim     |
| Historico de conversas       | Nao      | Sim     |
| Cartao personalizado         | Limitado | Ilimitado |

---

## Desenvolvimento

### Pre-requisitos

- Node.js >= 18
- Expo CLI (`npx expo`)
- Conta Supabase
- Conta RevenueCat
- Chave API.Bible
- Chave de IA (OpenAI, Anthropic, Google, Groq, OpenRouter ou Ollama local)
- VPS com Node.js (para API minima)

### Instalacao

```bash
# Clonar o repositorio
git clone <url-do-repo>
cd palavra-viva

# Instalar dependencias
npm install

# Copiar variaveis de ambiente
cp .env.example .env
```

### Variaveis de Ambiente

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=               # URL da VPS API
EXPO_PUBLIC_API_BIBLE_KEY=
REVENUECAT_API_KEY_IOS=
REVENUECAT_API_KEY_ANDROID=

# Apenas no VPS (nunca no client)
SUPABASE_SERVICE_ROLE_KEY=
AI_PROVIDER=google                 # Padrao: Gemini. Outros: openai, anthropic, groq, openrouter, ollama
AI_API_KEY=                        # Chave do Google AI Studio (AIza...)
AI_MODEL=gemini-2.0-flash         # Opcional — usa default do provider
REVENUECAT_WEBHOOK_SECRET=
```

### Execucao

```bash
# Desenvolvimento
npx expo start

# Build de desenvolvimento (necessario para RevenueCat)
npx expo run:ios
npx expo run:android

# Build de producao (EAS)
eas build --platform all
```

---

## Etapas de Desenvolvimento

Consulte [ETAPAS.md](ETAPAS.md) para o roadmap completo com checklists por sprint.

---

## Regras do Projeto

Consulte [docs/ai/project-rules.md](docs/ai/project-rules.md) para regras de codigo, interface e seguranca.

Consulte [AGENTS.md](AGENTS.md) para regras gerais de agentes IA neste repositorio.

---

## Configuracao da IA

O Palavra Viva usa **Google Gemini** como provider padrao de IA.

Consulte [docs/guia-gemini.md](docs/guia-gemini.md) para:
- Como obter a chave de API (gratuita)
- Modelos disponiveis e precos
- Limites do plano gratuito
- Troubleshooting
- Como trocar para outro provider
