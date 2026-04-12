# Regras do Projeto — Palavra Viva

Este arquivo complementa o `AGENTS.md` com regras especificas do projeto.
Deve ser lido e seguido por qualquer agente de IA que atue neste repositorio.

---

## 1. Visao Geral

- App mobile de Biblia com IA conversacional
- Stack: Expo (React Native), Supabase, Claude API, RevenueCat
- Arquitetura: feature-first com design system compartilhado
- Idioma do app: portugues brasileiro
- Publico: cristaos evangelicos e catolicos

---

## 2. Regras de Interface

### 2.1 Icones

- Usar exclusivamente `phosphor-react-native`
- Proibido: emojis como icones, SVG inline hardcoded, icones de outras libs
- Import padrao: `import { IconName } from 'phosphor-react-native'`
- Peso padrao: `regular` (usar `bold` ou `fill` apenas quando o design exigir)

### 2.2 Cores

- Todas as cores devem vir de `src/design/colors.ts`
- Proibido: cores hardcoded em StyleSheet, componentes ou inline styles
- Para dark mode: usar o mapa `colors.dark`
- Acessar cores via `useTheme()` ou importacao direta dos tokens
- Cores de destaque de versiculos: usar `colors.highlight[1-5]`

Exemplo correto:
```typescript
import { colors } from '@/design/colors';
// ou
const { colors } = useTheme();

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background },
});
```

Exemplo proibido:
```typescript
const styles = StyleSheet.create({
  container: { backgroundColor: '#FFFFFF' }, // PROIBIDO
});
```

### 2.3 Tipografia

| Uso                        | Fonte    | Pesos                         |
|----------------------------|----------|-------------------------------|
| Headings, botoes           | Poppins  | SemiBold (600), Bold (700)    |
| Body, captions, labels     | Inter    | Regular (400), Medium (500)   |
| Versiculos, destaques      | Lora     | Regular (400), Bold (700)     |

- Todas as definicoes em `src/design/typography.ts`
- Usar componentes `Typography` (`Heading`, `Body`, `Caption`, `VerseText`) ao inves de `Text` direto
- Proibido: `fontFamily` hardcoded em StyleSheet

Exemplo correto:
```tsx
<Heading size="lg">Titulo</Heading>
<Body>Texto comum</Body>
<VerseText>"No principio era o Verbo..."</VerseText>
```

Exemplo proibido:
```tsx
<Text style={{ fontFamily: 'Inter', fontSize: 16 }}>Texto</Text>
```

### 2.4 Espacamento

- Usar escala definida em `src/design/spacing.ts`
- Grid de 4 pontos: xs(4), sm(8), md(16), lg(24), xl(32), xxl(48)
- Proibido: numeros magicos de margin/padding

Exemplo correto:
```typescript
import { spacing } from '@/design/spacing';

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.sm },
});
```

### 2.5 Border Radius

- Usar escala de `src/design/radii.ts`: sm(4), md(8), lg(12), xl(16), full(9999)
- Proibido: valores arbitrarios de borderRadius

### 2.6 Sombras

- Usar presets de `src/design/shadows.ts`: sm, md, lg
- Incluir `elevation` para Android em cada preset

---

## 3. Arquitetura de Pastas

### 3.1 Estrutura Geral

```
src/
|-- app/          # Expo Router (rotas)
|-- features/     # Modulos por funcionalidade
|-- shared/       # Componentes e logica reutilizavel
|-- design/       # Design tokens
|-- lib/          # Wrappers de terceiros
|-- assets/       # Fontes, imagens
```

### 3.2 Features

Cada feature em `src/features/` deve conter:

```
features/[nome]/
|-- components/    # Componentes especificos da feature
|-- hooks/         # Hooks especificos
|-- services/      # Chamadas API, logica de negocio
|-- stores/        # Zustand stores (se necessario)
|-- types.ts       # Tipos TypeScript da feature
```

Features existentes: `auth`, `bible`, `ai-chat`, `devotional`, `reading-plans`, `calendar`, `subscription`, `verse-card`, `audio-player`.

### 3.3 Componentes Compartilhados

- Local: `src/shared/components/`
- Regra: se dois ou mais features precisam de um componente, ele vai para `shared/`
- Todo componente deve aceitar `style` prop para customizacao externa
- Todo componente deve ter tipagem TypeScript completa
- Re-exports em `src/shared/components/index.ts`

Componentes obrigatorios do design system:

| Componente              | Variantes                                |
|-------------------------|------------------------------------------|
| `Button`                | primary, secondary, ghost, outline       |
| `Card`                  | base (verso, plano, devocional herdam)   |
| `Input`                 | text, search, chat                       |
| `Typography`            | Heading, Body, Caption, VerseText        |
| `ChatBubble`            | user, ai                                 |
| `VerseCard`             | padrao, compartilhavel                   |
| `AudioPlayer`           | mini, full                               |
| `CalendarDay`           | normal, marcado, hoje                    |
| `ReadingChecklistItem`  | pendente, concluido                      |
| `Badge`                 | default, success, warning, error         |
| `Avatar`                | imagem, iniciais                         |
| `BottomSheet`           | —                                        |
| `Modal`                 | —                                        |

### 3.4 Proibicoes de Codigo Visual

- Nenhum card deve ser codado diretamente em telas — sempre importar de `shared/components/`
- Nenhuma cor hardcoded
- Nenhuma fonte hardcoded
- Nenhum espacamento arbitrario
- Nenhum icone fora do Phosphor

---

## 4. Estado da Aplicacao

### 4.1 Zustand

- Uma store por dominio: `authStore`, `bibleStore`, `subscriptionStore`, `chatStore`
- Local: `src/features/*/stores/` ou `src/shared/stores/`
- Persistencia com `zustand/middleware` + `AsyncStorage` quando necessario
- Nomenclatura do hook: `useAuthStore`, `useBibleStore`, etc.

### 4.2 TanStack Query

- Para dados do servidor: API.Bible, Supabase queries, VPS API
- Keys padronizadas: `['feature', 'entity', params]`
- Exemplo: `['bible', 'chapter', { bookId, chapterId }]`
- `staleTime` minimo de 5 minutos para dados biblicos (conteudo estatico)
- `staleTime` curto (30s) para dados do usuario (notas, progresso)

### 4.3 Separacao de Responsabilidades

- **Zustand:** estado local/global da UI (tema, sessao, preferencias)
- **TanStack Query:** estado do servidor (dados remotos, cache, sincronizacao)
- Nunca duplicar dado do servidor no Zustand

---

## 5. Seguranca

### 5.1 Chaves de API

| Chave                    | Onde usar          | Client-side? |
|--------------------------|--------------------|--------------|
| Supabase anon key        | App (client)       | Sim (RLS protege) |
| Supabase service role    | VPS apenas         | Nunca        |
| Claude API key           | VPS apenas         | Nunca        |
| API.Bible key            | App (client)       | Sim          |
| RevenueCat public key    | App (client)       | Sim          |
| RevenueCat webhook secret | VPS apenas        | Nunca        |

### 5.2 Supabase RLS

- Row Level Security ativado em todas as tabelas
- Politica padrao: usuarios so acessam dados onde `user_id = auth.uid()`
- Tabelas publicas (reading_plans): politica de leitura aberta
- Service role key usada apenas no VPS para operacoes administrativas

### 5.3 VPS API

- Rate limiting em todos os endpoints (por IP e por usuario)
- Validacao de input com `zod` em todos os endpoints
- `helmet` para headers de seguranca
- CORS restrito a dominios autorizados
- Tokens JWT com expiracao adequada
- Refresh token com rotacao
- Logs estruturados (sem dados sensiveis)

### 5.4 Armazenamento Local

- Tokens de autenticacao: `expo-secure-store` (nunca AsyncStorage)
- Preferencias nao sensiveis: `AsyncStorage` (via Zustand persist)

---

## 6. Convencoes de Codigo

### 6.1 Nomenclatura

| Tipo           | Convencao         | Exemplo                    |
|----------------|--------------------|----------------------------|
| Componentes    | PascalCase         | `Button.tsx`, `VerseCard.tsx` |
| Hooks          | camelCase + `use`  | `useSubscription.ts`       |
| Servicos       | camelCase          | `bibleService.ts`          |
| Stores         | camelCase + `Store` | `authStore.ts`            |
| Tipos          | PascalCase         | `User`, `Subscription`     |
| Constantes     | UPPER_SNAKE_CASE   | `MAX_RETRIES`, `API_TIMEOUT` |
| Tokens         | camelCase          | `colors.ts`, `typography.ts` |
| Features       | kebab-case         | `ai-chat/`, `reading-plans/` |

### 6.2 Exports

| Tipo           | Export            |
|----------------|-------------------|
| Componentes    | `export default`  |
| Hooks          | named export      |
| Servicos       | named export      |
| Tipos          | named export      |
| Tokens         | named export      |
| Stores         | named export      |

### 6.3 Estrutura Interna de Componente

Ordem dentro de um arquivo de componente:

1. Imports
2. Types / Interfaces
3. Constantes locais
4. Componente (function)
5. `StyleSheet.create()` (no final do arquivo)

### 6.4 Imports

- Usar path alias `@/` para `src/`
- Ordem de imports:
  1. React / React Native
  2. Bibliotecas externas
  3. Design tokens (`@/design/`)
  4. Componentes compartilhados (`@/shared/`)
  5. Modulos da feature (`./`)
  6. Tipos

---

## 7. Integracoes

### 7.1 API.Bible

- Base URL: `https://api.scripture.api.bible/v1`
- Header: `api-key`
- Traducoes: ARA, NVI, ACF
- Cache agressivo via TanStack Query (`staleTime: Infinity` para conteudo biblico)
- Servico em `src/features/bible/services/bibleService.ts`

### 7.2 Claude API (via VPS)

- Endpoint: `POST /ai/chat` no VPS
- System prompt no backend (nunca no client)
- Streaming via Server-Sent Events (SSE)
- Historico de contexto limitado a ultimas 20 mensagens
- Servico em `src/features/ai-chat/services/chatService.ts`

### 7.3 RevenueCat

- SDK: `react-native-purchases`
- Configuracao em `src/lib/revenuecat.ts`
- Offerings: mensal (R$19,90) e anual (R$149,90)
- Webhook no VPS: `POST /subscription/webhook`
- Verificacao client-side via `Purchases.getCustomerInfo()`
- Verificacao server-side via webhook (sincroniza com Supabase)

### 7.4 Supabase

- Cliente em `src/lib/supabase.ts`
- Auth: email/senha + social (Google, Apple)
- Queries via TanStack Query (wrapper)
- Storage para imagens de verse cards

---

## 8. Backend VPS — Escopo e Contratos

### 8.1 Escopo Restrito

O VPS so implementa:
- Registro e login de contas
- Gerenciamento de assinatura (webhook + status)
- Perfil de usuario
- Proxy de IA (Claude API)

Tudo fora desse escopo usa Supabase diretamente do app.

### 8.2 Endpoints

```
POST   /auth/register          -> { email, password, name }
POST   /auth/login             -> { email, password }
POST   /auth/refresh-token     -> { refreshToken }
GET    /subscription/status    -> Authorization: Bearer <token>
POST   /subscription/webhook   -> RevenueCat payload
GET    /user/profile           -> Authorization: Bearer <token>
PUT    /user/profile           -> { name?, avatar_url?, denomination?, preferred_version? }
POST   /ai/chat                -> { messages[], conversationId? }
```

### 8.3 Stack do VPS

- Node.js + Express + TypeScript
- Zod para validacao
- Supabase Admin SDK (service role)
- Helmet + CORS + rate-limit

---

## 9. Padroes de UX

### 9.1 Inspiracoes

- **Spotify:** Navegacao por tabs, cards na home, transicoes suaves
- **Notion:** Organizacao de conteudo, listas, notas inline
- **ChatGPT:** Interface de chat, streaming de respostas, sugestoes
- **Kindle:** Experiencia de leitura, tipografia cuidada, modo noturno

### 9.2 Regras de Layout

- Layout compacto e alta densidade de informacao
- Evitar espacos vazios desnecessarios
- Evitar rolagem excessiva
- Bottom tabs com 5 abas: Home, Biblia, IA, Calendario, Perfil
- Tab bar com icones Phosphor (peso `regular`, ativo `fill`)

### 9.3 Paywall

- Exibir ao final do onboarding
- Exibir ao tentar acessar funcionalidade premium
- Comparacao clara entre planos (free vs premium)
- Botao de restaurar compras visivel

---

## 10. Telas do App

| Tela                | Rota                       | Plano     |
|---------------------|----------------------------|-----------|
| Login               | `(auth)/login`             | Todos     |
| Registro            | `(auth)/register`          | Todos     |
| Onboarding          | `(auth)/onboarding`        | Todos     |
| Home / Dashboard    | `(tabs)/index`             | Todos     |
| Leitor Biblico      | `(tabs)/bible`             | Todos     |
| Chat IA             | `(tabs)/ai`                | Premium   |
| Calendario          | `(tabs)/calendar`          | Todos     |
| Perfil              | `(tabs)/profile`           | Todos     |
| Paywall             | Modal / BottomSheet        | Todos     |
| Devocional          | Dentro de `(tabs)/index`   | Premium   |

---

## 11. Contratos de Dados (Supabase)

### 11.1 Tabelas

| Tabela            | Chave primaria | FK                      | RLS  |
|-------------------|----------------|-------------------------|------|
| profiles          | id (UUID)      | —                       | Sim  |
| subscriptions     | id (UUID)      | user_id -> profiles     | Sim  |
| highlights        | id (UUID)      | user_id -> profiles     | Sim  |
| notes             | id (UUID)      | user_id -> profiles     | Sim  |
| reading_plans     | id (UUID)      | —                       | Leitura publica |
| reading_progress  | id (UUID)      | user_id, plan_id        | Sim  |
| conversations     | id (UUID)      | user_id -> profiles     | Sim  |
| messages          | id (UUID)      | conversation_id         | Sim  |
| devotionals       | id (UUID)      | user_id -> profiles     | Sim  |
| favorites         | id (UUID)      | user_id -> profiles     | Sim  |

### 11.2 Politica RLS Padrao

```sql
-- Leitura: usuario so ve seus dados
CREATE POLICY "select_own" ON [tabela]
  FOR SELECT USING (auth.uid() = user_id);

-- Insercao: usuario so insere para si
CREATE POLICY "insert_own" ON [tabela]
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Atualizacao: usuario so atualiza seus dados
CREATE POLICY "update_own" ON [tabela]
  FOR UPDATE USING (auth.uid() = user_id);

-- Delecao: usuario so deleta seus dados
CREATE POLICY "delete_own" ON [tabela]
  FOR DELETE USING (auth.uid() = user_id);
```

Excecao: `reading_plans` tem politica de leitura publica (qualquer usuario autenticado pode ler).
