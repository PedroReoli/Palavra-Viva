export interface CardTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontStyle: 'serif' | 'sans';
}

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'light-minimal',
    name: 'Minimalista',
    backgroundColor: '#FAFAF9',
    textColor: '#1C1917',
    accentColor: '#78716C',
    fontStyle: 'serif',
  },
  {
    id: 'dark',
    name: 'Escuro',
    backgroundColor: '#1C1917',
    textColor: '#FAFAF9',
    accentColor: '#A8A29E',
    fontStyle: 'serif',
  },
  {
    id: 'nature',
    name: 'Natureza',
    backgroundColor: '#14532D',
    textColor: '#F0FDF4',
    accentColor: '#86EFAC',
    fontStyle: 'serif',
  },
  {
    id: 'ocean',
    name: 'Oceano',
    backgroundColor: '#1E3A5F',
    textColor: '#E0F2FE',
    accentColor: '#7DD3FC',
    fontStyle: 'sans',
  },
  {
    id: 'sunset',
    name: 'Por do Sol',
    backgroundColor: '#7C2D12',
    textColor: '#FFF7ED',
    accentColor: '#FDBA74',
    fontStyle: 'serif',
  },
  {
    id: 'royal',
    name: 'Real',
    backgroundColor: '#312E81',
    textColor: '#EEF2FF',
    accentColor: '#C7D2FE',
    fontStyle: 'serif',
  },
];
