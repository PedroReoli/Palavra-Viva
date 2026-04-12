# Design System — Palavra Viva

Documentacao completa do design system da aplicacao.
Todos os tokens ficam em `src/design/`. Nenhum valor visual hardcoded e permitido.

---

## Sumario

1. [Cores](#1-cores)
2. [Tipografia](#2-tipografia)
3. [Espacamento](#3-espacamento)
4. [Border Radius](#4-border-radius)
5. [Sombras](#5-sombras)
6. [Tema](#6-tema)
7. [Componentes](#7-componentes)
8. [Padroes de Layout](#8-padroes-de-layout)
9. [Icones](#9-icones)
10. [Regras e Proibicoes](#10-regras-e-proibicoes)

---

## 1. Cores

**Arquivo:** `src/design/colors.ts`

### Paleta Primitiva

A paleta base usa dois eixos:

- **Indigo** — cor principal (espiritualidade, profundidade, confianca)
- **Amber** — cor de acento (calor, acolhimento, destaque)
- **Warm** — neutros quentes (texto, fundos, bordas)

### Tokens Semanticos

Os componentes nunca acessam a paleta primitiva. Usam tokens semanticos:

#### Marca

| Token           | Light     | Dark      | Uso                              |
|-----------------|-----------|-----------|----------------------------------|
| primary         | indigo600 | indigo400 | Botoes, links, tab ativa         |
| primaryLight    | indigo400 | indigo300 | Hover, estados leves             |
| primaryDark     | indigo800 | indigo600 | Pressed, enfase                  |
| primaryFaded    | indigo100 | indigo900 | Fundos sutis, badges             |
| secondary       | amber500  | amber400  | Acentos, estrelas, streak        |
| secondaryLight  | amber300  | amber300  | Hover de acento                  |
| secondaryDark   | amber700  | amber600  | Pressed de acento                |
| secondaryFaded  | amber100  | #422006   | Fundos de acento                 |

#### Fundos

| Token           | Light   | Dark     | Uso                              |
|-----------------|---------|----------|----------------------------------|
| background      | warm50  | warm900  | Fundo principal das telas        |
| backgroundAlt   | warm100 | warm800  | Fundo alternativo (secoes)       |
| surface         | white   | warm800  | Cards, modais, inputs            |
| surfaceVariant  | warm100 | warm700  | Cards secundarios                |
| surfaceElevated | white   | warm700  | Elementos flutuantes             |

#### Texto

| Token          | Light   | Dark    | Uso                              |
|----------------|---------|---------|----------------------------------|
| textPrimary    | warm900 | warm50  | Texto principal                  |
| textSecondary  | warm500 | warm400 | Texto auxiliar, placeholders     |
| textTertiary   | warm400 | warm500 | Texto desativado, hints          |
| textInverse    | white   | warm900 | Texto sobre fundo colorido       |
| textOnPrimary  | white   | warm900 | Texto sobre botao primary        |
| textLink       | indigo600 | indigo300 | Links clicaveis              |

#### Feedback

| Token       | Uso                                 |
|-------------|-------------------------------------|
| success     | Confirmacao, checklist concluido    |
| error       | Erro, validacao falha               |
| warning     | Atencao, aviso                      |
| info        | Informacao neutra                   |

#### Interacao

| Token        | Uso                                |
|--------------|------------------------------------|
| pressed      | Fundo ao pressionar                |
| disabled     | Fundo de elemento desativado       |
| disabledText | Texto de elemento desativado       |
| overlay      | Fundo escuro atras de modais       |

### Cores de Destaque (Versiculos)

5 cores para highlight de versiculos, com variante dark:

| Nome    | Light   | Dark    |
|---------|---------|---------|
| yellow  | #FEF08A | #854D0E |
| green   | #BBF7D0 | #166534 |
| blue    | #BFDBFE | #1E40AF |
| pink    | #FBCFE8 | #9D174D |
| orange  | #FED7AA | #9A3412 |

### Como Usar

```typescript
// Importacao direta
import { lightColors } from '@/design/colors';
const bg = lightColors.background;

// Via hook (recomendado — respeita tema ativo)
import { useTheme } from '@/design/theme';
const { colors } = useTheme();
const bg = colors.background;
```

---

## 2. Tipografia

**Arquivo:** `src/design/typography.ts`

### Familias

| Familia  | Pesos                     | Uso                            |
|----------|---------------------------|--------------------------------|
| Poppins  | SemiBold (600), Bold (700) | Headings, botoes, labels fortes |
| Inter    | Regular (400), Medium (500) | Body, captions, labels          |
| Lora     | Regular (400), Bold (700)  | Versiculos, citacoes, destaques |

### Escala de Tamanho

| Token | Valor | Uso tipico                         |
|-------|-------|------------------------------------|
| xs    | 10px  | Overlines, tags minusculas         |
| sm    | 12px  | Captions, timestamps               |
| md    | 14px  | Body small, labels, inputs         |
| base  | 16px  | Body padrao                        |
| lg    | 18px  | Body large, versiculos             |
| xl    | 20px  | Subtitulos, h4/h5                  |
| 2xl   | 24px  | h3, titulos de secao               |
| 3xl   | 30px  | h2, titulos de tela                |
| 4xl   | 36px  | h1, titulos hero                   |

### Alturas de Linha

| Token    | Multiplicador | Uso                              |
|----------|---------------|----------------------------------|
| tight    | 1.2           | Headings                         |
| normal   | 1.5           | Body, captions                   |
| relaxed  | 1.7           | Paragrafos longos                |
| verse    | 1.8           | Versiculos (leitura confortavel) |

### Estilos Compostos

Estilos prontos para uso em `StyleSheet.create()`:

**Headings (Poppins)**

| Estilo | Fonte          | Tamanho | Linha |
|--------|----------------|---------|-------|
| h1     | Poppins Bold   | 36px    | tight |
| h2     | Poppins Bold   | 30px    | tight |
| h3     | Poppins Semi   | 24px    | tight |
| h4     | Poppins Semi   | 20px    | tight |
| h5     | Poppins Semi   | 18px    | tight |

**Body (Inter)**

| Estilo      | Fonte         | Tamanho | Linha  |
|-------------|---------------|---------|--------|
| bodyLarge   | Inter Regular | 18px    | normal |
| body        | Inter Regular | 16px    | normal |
| bodyMedium  | Inter Medium  | 16px    | normal |
| bodySmall   | Inter Regular | 14px    | normal |

**Captions (Inter)**

| Estilo        | Fonte        | Tamanho | Linha  |
|---------------|--------------|---------|--------|
| caption       | Inter Regular | 12px   | normal |
| captionMedium | Inter Medium  | 12px   | normal |
| overline      | Inter Medium  | 10px   | normal + uppercase |

**Botoes/Labels (Poppins)**

| Estilo      | Fonte         | Tamanho | Linha |
|-------------|---------------|---------|-------|
| button      | Poppins Semi  | 16px    | tight |
| buttonSmall | Poppins Semi  | 14px    | tight |
| label       | Inter Medium  | 14px    | normal |

**Versiculos (Lora)**

| Estilo          | Fonte       | Tamanho | Linha |
|-----------------|-------------|---------|-------|
| verse           | Lora Regular | 18px   | verse |
| verseLarge      | Lora Regular | 20px   | verse |
| verseReference  | Lora Bold    | 14px   | normal |
| verseHighlight  | Lora Bold    | 18px   | verse |

### Como Usar

```typescript
import { textStyles } from '@/design/typography';

const styles = StyleSheet.create({
  title: { ...textStyles.h3, color: colors.textPrimary },
  body: { ...textStyles.body, color: colors.textSecondary },
  verse: { ...textStyles.verse, color: colors.textPrimary },
});
```

**Preferencia:** usar componentes `Typography` ao inves de aplicar estilos manualmente:

```tsx
import { Heading, Body, VerseText } from '@/shared/components';

<Heading size="h3">Titulo da Secao</Heading>
<Body>Texto descritivo aqui.</Body>
<VerseText reference="Joao 1:1">"No principio era o Verbo..."</VerseText>
```

---

## 3. Espacamento

**Arquivo:** `src/design/spacing.ts`

### Escala (Grid 4pt)

| Token | Valor | Uso tipico                             |
|-------|-------|----------------------------------------|
| xs    | 4px   | Gap entre icone e texto inline         |
| sm    | 8px   | Gap entre elementos pequenos, padding badges |
| ms    | 12px  | Ajuste fino entre sm e md              |
| md    | 16px  | Padding de containers, gap entre cards |
| lg    | 24px  | Separacao entre secoes                 |
| xl    | 32px  | Margem lateral de telas                |
| xxl   | 48px  | Entre blocos grandes                   |
| xxxl  | 64px  | Topo/fundo de telas                    |

### Constantes Especiais

| Constante        | Valor | Uso                              |
|------------------|-------|----------------------------------|
| screenPadding    | 32px  | Padding horizontal de telas      |
| maxContentWidth  | 600px | Largura maxima em tablets        |

### Como Usar

```typescript
import { spacing, screenPadding } from '@/design/spacing';

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
```

---

## 4. Border Radius

**Arquivo:** `src/design/radii.ts`

| Token | Valor  | Uso tipico                            |
|-------|--------|---------------------------------------|
| none  | 0px    | Sem arredondamento                    |
| sm    | 4px    | Inputs, badges pequenos               |
| md    | 8px    | Cards, botoes, containers             |
| lg    | 12px   | Cards maiores, modais                 |
| xl    | 16px   | Cards de destaque, bottom sheets      |
| xxl   | 24px   | Cards hero, imagens arredondadas      |
| full  | 9999px | Avatares, botoes pill, badges         |

### Como Usar

```typescript
import { radii } from '@/design/radii';

const styles = StyleSheet.create({
  card: { borderRadius: radii.lg },
  avatar: { borderRadius: radii.full },
  button: { borderRadius: radii.md },
});
```

---

## 5. Sombras

**Arquivo:** `src/design/shadows.ts`

| Preset | iOS (shadowRadius) | Android (elevation) | Uso tipico                   |
|--------|--------------------|--------------------|-------------------------------|
| none   | 0                  | 0                  | Sem sombra                    |
| sm     | 2                  | 1                  | Cards rasos, inputs           |
| md     | 4                  | 3                  | Cards padrao, botoes elevados |
| lg     | 8                  | 6                  | Modais, bottom sheets         |
| xl     | 16                 | 10                 | FABs, tooltips, dropdowns     |

### Como Usar

```typescript
import { shadows } from '@/design/shadows';

const styles = StyleSheet.create({
  card: {
    ...shadows.md,
    backgroundColor: colors.surface,
  },
  modal: {
    ...shadows.lg,
  },
});
```

---

## 6. Tema

**Arquivo:** `src/design/theme.ts`

### Estrutura do Tema

O tema combina todos os tokens em um unico objeto:

```typescript
interface Theme {
  colors: ColorTokens;       // lightColors ou darkColors
  fonts: typeof fontFamilies;
  fontSizes: typeof fontSizes;
  lineHeights: typeof lineHeights;
  textStyles: typeof textStyles;
  spacing: typeof spacing;
  screenPadding: number;
  maxContentWidth: number;
  radii: typeof radii;
  shadows: typeof shadows;
  isDark: boolean;
}
```

### Hook useTheme()

Retorna o tema atual e funcoes de controle:

```typescript
import { useTheme } from '@/design/theme';

function MeuComponente() {
  const { colors, spacing, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background, padding: spacing.md }}>
      <Text style={{ color: colors.textPrimary }}>
        Tema atual: {isDark ? 'escuro' : 'claro'}
      </Text>
    </View>
  );
}
```

### ThemeProvider

O `ThemeProvider` deve ser configurado no `_layout.tsx` raiz. Ele:
1. Le a preferencia do sistema (`useColorScheme`)
2. Permite override manual (light/dark/system)
3. Persiste a escolha do usuario via `AsyncStorage`

### Temas Pre-construidos

| Export      | Descricao                |
|-------------|--------------------------|
| lightTheme  | Tema claro completo      |
| darkTheme   | Tema escuro completo     |

---

## 7. Componentes

Todos os componentes do design system ficam em `src/shared/components/`.
Cada componente e uma peca de Lego — montavel, padronizado, sem codigo visual duplicado.

### 7.1 Typography

Componentes de texto que encapsulam os `textStyles`:

```tsx
<Heading size="h1">Titulo Principal</Heading>
<Heading size="h3">Titulo de Secao</Heading>
<Body>Texto padrao do corpo.</Body>
<Body variant="small">Texto menor.</Body>
<Caption>Texto auxiliar, timestamps.</Caption>
<VerseText reference="Salmos 23:1">
  "O Senhor e o meu pastor; nada me faltara."
</VerseText>
```

| Componente | Fonte base | Props principais            |
|------------|------------|-----------------------------|
| Heading    | Poppins    | size (h1-h5), color         |
| Body       | Inter      | variant (default, small, large, medium), color |
| Caption    | Inter      | variant (default, medium), color |
| VerseText  | Lora       | reference, variant (default, large, highlight) |

### 7.2 Button

4 variantes visuais:

| Variante  | Fundo       | Texto        | Borda        |
|-----------|-------------|--------------|--------------|
| primary   | primary     | textOnPrimary | nenhuma     |
| secondary | transparent | primary      | primary      |
| ghost     | transparent | textPrimary  | nenhuma      |
| outline   | transparent | textSecondary | border      |

Props: `variant`, `size` (sm, md, lg), `icon` (Phosphor), `loading`, `disabled`, `onPress`

### 7.3 Card

Card base reutilizavel. Variantes especificas herdam dele:

| Variante            | Conteudo                                     |
|---------------------|----------------------------------------------|
| Card (base)         | children generico, padding, radius, sombra   |
| VerseCard           | texto + referencia + acoes (compartilhar)    |
| ReadingPlanCard     | titulo + progresso + dias restantes          |
| DevotionalCard      | tema + trecho da reflexao + data             |

Props base: `variant`, `style`, `onPress`, `children`

### 7.4 Input

| Variante | Descricao                              |
|----------|----------------------------------------|
| text     | Input padrao com label e helper text   |
| search   | Com icone de busca, sem borda inferior |
| chat     | Input do chat com botao de enviar      |

Props: `variant`, `label`, `placeholder`, `helperText`, `error`, `icon`, `onSubmit`

### 7.5 ChatBubble

| Variante | Alinhamento | Fundo          | Fonte         |
|----------|-------------|----------------|---------------|
| user     | Direita     | primary        | Inter         |
| ai       | Esquerda    | surfaceVariant | Inter + Lora (citacoes) |

Props: `role` (user, ai), `content`, `timestamp`, `loading` (skeleton)

### 7.6 VerseCard

Card especializado para exibicao de versiculos:

- Texto do versiculo (Lora)
- Referencia (livro, capitulo, versiculo)
- Acoes: destacar, anotar, copiar, compartilhar, favoritar
- Variante compartilhavel (com template visual para export)

Props: `text`, `reference`, `version`, `actions`, `template` (para compartilhamento)

### 7.7 AudioPlayer

| Modo | Descricao                                    |
|------|----------------------------------------------|
| mini | Barra no rodape com play/pause e progresso   |
| full | Tela completa com controles e velocidade     |

Props: `mode`, `title`, `reference`, `source`, `onSpeedChange`

### 7.8 CalendarDay

| Estado  | Visual                             |
|---------|------------------------------------|
| normal  | Numero do dia, sem destaque        |
| today   | Circulo com cor primary            |
| marked  | Ponto indicador abaixo do numero   |
| selected | Fundo primary, texto inverse     |

Props: `day`, `state`, `markers`, `onPress`

### 7.9 ReadingChecklistItem

| Estado     | Visual                               |
|------------|--------------------------------------|
| pendente   | Checkbox vazio, texto normal         |
| concluido  | Checkbox marcado, texto com success  |

Props: `title`, `subtitle`, `completed`, `onToggle`

### 7.10 Badge

| Variante | Cor de fundo   | Cor de texto   |
|----------|----------------|----------------|
| default  | primaryFaded   | primary        |
| success  | success (faded) | success       |
| warning  | warning (faded) | warning       |
| error    | error (faded)   | error         |

Props: `variant`, `label`, `size` (sm, md)

### 7.11 Avatar

| Modo     | Visual                              |
|----------|-------------------------------------|
| imagem   | Foto circular do usuario            |
| iniciais | Circulo com iniciais sobre primary  |

Props: `source`, `name` (para iniciais), `size` (sm, md, lg)

### 7.12 BottomSheet

Painel deslizante que sobe do rodape. Usa `react-native-reanimated` para gestos.

Props: `visible`, `onClose`, `snapPoints`, `children`

### 7.13 Modal

Dialog centralizado com overlay escuro.

Props: `visible`, `onClose`, `title`, `children`, `actions`

---

## 8. Padroes de Layout

### 8.1 Dashboard (Home)

```
[StatusBar]
[Header: "Palavra Viva" + Avatar]
[VerseCard: verso do dia]
[Card: progresso do plano de leitura]
[Card: atalho "Conversar com a IA"]
[Card: proxima data do calendario]
[Espacamento inferior para tabs]
```

- ScrollView vertical
- Cards empilhados com `gap: spacing.md`
- Padding lateral: `screenPadding` (32px)
- Inspiracao: Spotify home (cards verticais)

### 8.2 Leitor Biblico

```
[Header: versao + livro + capitulo (seletor)]
[Conteudo: texto biblico em Lora]
[Footer: navegacao anterior/proximo capitulo]
```

- Foco total no texto (sem distracao)
- Tipografia Lora com `lineHeight: verse` (1.8)
- Fundo suave (`background` ou `surface`)
- Modo noturno: dark mode no leitor
- Versiculos com numeracao inline
- Long press para selecionar e abrir menu de acoes
- Inspiracao: Kindle (experiencia de leitura)

### 8.3 Chat IA

```
[Header: "Chat" + titulo da conversa]
[Lista de mensagens (FlatList invertida)]
  [ChatBubble: user]
  [ChatBubble: ai (com streaming)]
[ChatInput: campo + botao enviar]
[Sugestoes rapidas (se conversa vazia)]
```

- FlatList invertida para scroll automatico
- ChatBubbles com cantos arredondados diferenciados
- Streaming: texto aparece progressivamente
- Sugestoes: chips clicaveis com perguntas comuns
- Inspiracao: ChatGPT (interface limpa)

### 8.4 Navegacao

Bottom tabs com 5 abas:

| Tab        | Icone Phosphor | Ativo        |
|------------|----------------|--------------|
| Home       | House          | House (fill) |
| Biblia     | BookOpen       | BookOpen (fill) |
| IA         | ChatCircle     | ChatCircle (fill) |
| Calendario | Calendar       | Calendar (fill) |
| Perfil     | User           | User (fill)  |

- Icone: peso `regular` quando inativo, `fill` quando ativo
- Cor: `tabInactive` quando inativo, `tabActive` quando ativo
- Label abaixo do icone (fonte `caption`)
- Inspiracao: Spotify (bottom tabs minimalistas)

---

## 9. Icones

**Biblioteca:** `phosphor-react-native`

### Regras

- Unica biblioteca de icones permitida
- Nunca usar emojis como icones
- Nunca inserir SVG inline
- Peso padrao: `regular`
- Peso ativo (tabs, estados selecionados): `fill`
- Peso de enfase (headers, CTAs): `bold`
- Tamanho padrao: 24px
- Tamanho pequeno: 20px
- Tamanho grande: 28px
- Cor: sempre via tokens (`colors.icon`, `colors.iconActive`, etc.)

### Catalogo de Icones Sugeridos

| Contexto             | Icone              |
|----------------------|--------------------|
| Home                 | House              |
| Biblia               | BookOpen           |
| Chat IA              | ChatCircle         |
| Calendario           | Calendar           |
| Perfil               | User               |
| Busca                | MagnifyingGlass    |
| Compartilhar         | ShareNetwork       |
| Favoritar            | Heart              |
| Destacar             | HighlighterCircle  |
| Nota                 | NotePencil         |
| Audio                | SpeakerHigh        |
| Play                 | Play               |
| Pause                | Pause              |
| Configuracoes        | Gear               |
| Notificacao          | Bell               |
| Seta voltar          | ArrowLeft          |
| Seta proximo         | ArrowRight         |
| Fechar               | X                  |
| Menu                 | DotsThreeVertical  |
| Copiar               | Copy               |
| Enviar (chat)        | PaperPlaneRight    |
| Streak/fogo          | Flame              |
| Coroa/conquista      | Crown              |
| Download             | DownloadSimple     |
| Expandir             | ArrowsOutSimple    |
| Check                | Check              |
| Lixeira              | Trash              |

### Como Usar

```tsx
import { BookOpen, Heart } from 'phosphor-react-native';
import { useTheme } from '@/design/theme';

function MeuComponente() {
  const { colors } = useTheme();

  return (
    <>
      <BookOpen size={24} color={colors.icon} />
      <Heart size={24} color={colors.error} weight="fill" />
    </>
  );
}
```

---

## 10. Regras e Proibicoes

### Proibido

| O que                      | Onde                    | Alternativa                      |
|----------------------------|-------------------------|----------------------------------|
| Cor hardcoded              | Qualquer arquivo        | `colors.token` via design/colors |
| fontFamily hardcoded       | StyleSheet              | `textStyles.estilo` via design/typography |
| fontSize hardcoded         | StyleSheet              | `fontSizes.token` via design/typography |
| Espacamento arbitrario     | margin, padding, gap    | `spacing.token` via design/spacing |
| borderRadius arbitrario    | StyleSheet              | `radii.token` via design/radii   |
| Emoji como icone           | Qualquer componente     | Phosphor React Native            |
| SVG inline                 | Qualquer componente     | Phosphor React Native            |
| `<Text>` direto            | Telas/componentes       | `<Heading>`, `<Body>`, `<Caption>`, `<VerseText>` |
| Card codado na tela        | Telas                   | Importar de `shared/components/` |
| Sombra manual              | StyleSheet              | `shadows.preset` via design/shadows |

### Obrigatorio

| Regra                        | Motivo                                 |
|------------------------------|----------------------------------------|
| Usar `useTheme()` para cores | Respeita tema ativo (light/dark)       |
| Tipagem TypeScript completa  | Previne erros, autocomplete            |
| Props `style` em componentes | Permite customizacao sem quebrar padrao |
| Re-export em `index.ts`      | Import limpo entre modulos             |
| Fonte via `textStyles`       | Consistencia visual garantida          |
| Tokens via `@/design`        | Fonte unica de verdade                 |

### Checklist de Novo Componente

Antes de criar qualquer componente:

1. Verificar se ja existe em `shared/components/`
2. Se nao existe, avaliar se sera usado por mais de uma feature
   - Sim: criar em `shared/components/`
   - Nao: criar em `features/[nome]/components/`
3. Usar somente tokens do design system
4. Aceitar prop `style` para customizacao
5. Tipar com TypeScript (props interface)
6. Documentar variantes e props
7. Adicionar ao re-export em `index.ts` (se shared)
