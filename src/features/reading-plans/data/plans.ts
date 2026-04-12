import type { ReadingPlan, PlanDay } from '../types';

/**
 * Planos de leitura pre-definidos.
 * Os dados de cada dia (passages) referenciam livros/capitulos da API.Bible.
 */

export const READING_PLANS: ReadingPlan[] = [
  {
    id: 'bible-1-year',
    title: 'Biblia em 1 Ano',
    description: 'Leia toda a Biblia em 365 dias, com uma porcao do Antigo e do Novo Testamento por dia.',
    durationDays: 365,
    type: 'full',
    icon: 'BookOpen',
    days: generateBible1YearDays(),
  },
  {
    id: 'nt-90-days',
    title: 'Novo Testamento em 90 Dias',
    description: 'Percorra todo o Novo Testamento em 3 meses.',
    durationDays: 90,
    type: 'book',
    icon: 'BookOpen',
    days: generateNT90Days(),
  },
  {
    id: 'psalms-30',
    title: 'Salmos e Proverbios',
    description: 'Um mes de sabedoria e louvor. 1 Salmo e 1 capitulo de Proverbios por dia.',
    durationDays: 31,
    type: 'book',
    icon: 'MusicNotes',
    days: generatePsalmsProverbs(),
  },
  {
    id: 'theme-anxiety',
    title: 'Vencendo a Ansiedade',
    description: 'Versiculos e reflexoes para encontrar paz em tempos dificeis.',
    durationDays: 14,
    type: 'thematic',
    icon: 'Heart',
    days: [
      { day: 1, title: 'Deus esta no controle', passages: ['Filipenses 4:6-7', 'Salmos 55:22'] },
      { day: 2, title: 'Confianca no Senhor', passages: ['Proverbios 3:5-6', 'Isaias 41:10'] },
      { day: 3, title: 'Paz que excede', passages: ['Joao 14:27', 'Filipenses 4:8-9'] },
      { day: 4, title: 'Entregue suas preocupacoes', passages: ['1 Pedro 5:7', 'Mateus 6:25-34'] },
      { day: 5, title: 'Forca na fraqueza', passages: ['2 Corintios 12:9-10', 'Isaias 40:31'] },
      { day: 6, title: 'Refugio seguro', passages: ['Salmos 46:1-3', 'Salmos 91:1-4'] },
      { day: 7, title: 'Descanso em Deus', passages: ['Mateus 11:28-30', 'Salmos 23'] },
      { day: 8, title: 'Oracao e suplica', passages: ['Filipenses 4:6', 'Tiago 5:13-16'] },
      { day: 9, title: 'A mente renovada', passages: ['Romanos 12:1-2', 'Isaias 26:3'] },
      { day: 10, title: 'Esperanca futura', passages: ['Jeremias 29:11', 'Romanos 8:28'] },
      { day: 11, title: 'Presenca constante', passages: ['Salmos 139:1-12', 'Deuteronomio 31:6'] },
      { day: 12, title: 'Gratidao como remedio', passages: ['1 Tessalonicenses 5:16-18', 'Salmos 100'] },
      { day: 13, title: 'Amor que liberta', passages: ['1 Joao 4:18', 'Romanos 8:38-39'] },
      { day: 14, title: 'Vitoria final', passages: ['Joao 16:33', 'Apocalipse 21:4'] },
    ],
  },
  {
    id: 'theme-family',
    title: 'Familia Segundo a Biblia',
    description: 'Principios biblicos para fortalecer os lacos familiares.',
    durationDays: 14,
    type: 'thematic',
    icon: 'UsersThree',
    days: [
      { day: 1, title: 'Fundamento do lar', passages: ['Salmos 127:1', 'Proverbios 24:3-4'] },
      { day: 2, title: 'Amor conjugal', passages: ['Efesios 5:25-33', 'Cantares 8:6-7'] },
      { day: 3, title: 'Educar os filhos', passages: ['Proverbios 22:6', 'Deuteronomio 6:6-9'] },
      { day: 4, title: 'Honrar pai e mae', passages: ['Exodo 20:12', 'Efesios 6:1-3'] },
      { day: 5, title: 'Paciencia em familia', passages: ['Colossenses 3:12-14', 'Proverbios 15:1'] },
      { day: 6, title: 'Perdao entre irmaos', passages: ['Mateus 18:21-22', 'Efesios 4:32'] },
      { day: 7, title: 'Exemplo de vida', passages: ['1 Timoteo 4:12', 'Tito 2:7-8'] },
      { day: 8, title: 'Provisao e cuidado', passages: ['1 Timoteo 5:8', 'Salmos 37:25'] },
      { day: 9, title: 'Unidade no lar', passages: ['Salmos 133', 'Filipenses 2:2-4'] },
      { day: 10, title: 'Sabedoria para decidir', passages: ['Tiago 1:5', 'Proverbios 3:5-6'] },
      { day: 11, title: 'Protecao espiritual', passages: ['Josue 24:15', 'Salmos 91'] },
      { day: 12, title: 'Gratidao em familia', passages: ['Salmos 128', '1 Tessalonicenses 5:18'] },
      { day: 13, title: 'Heranca de fe', passages: ['2 Timoteo 1:5', 'Salmos 78:4-7'] },
      { day: 14, title: 'Bencao sobre o lar', passages: ['Numeros 6:24-26', 'Proverbios 3:33'] },
    ],
  },
  {
    id: 'theme-purpose',
    title: 'Proposito de Vida',
    description: 'Descubra o que Deus planejou para voce.',
    durationDays: 10,
    type: 'thematic',
    icon: 'Compass',
    days: [
      { day: 1, title: 'Criado com proposito', passages: ['Efesios 2:10', 'Salmos 139:13-16'] },
      { day: 2, title: 'Planos de Deus', passages: ['Jeremias 29:11', 'Proverbios 19:21'] },
      { day: 3, title: 'Chamado unico', passages: ['Romanos 8:28-30', '2 Timoteo 1:9'] },
      { day: 4, title: 'Dons e talentos', passages: ['1 Corintios 12:4-11', 'Romanos 12:6-8'] },
      { day: 5, title: 'Servir ao proximo', passages: ['Marcos 10:45', 'Galatas 5:13'] },
      { day: 6, title: 'Fruto do Espirito', passages: ['Galatas 5:22-23', 'Joao 15:1-8'] },
      { day: 7, title: 'Perseveranca', passages: ['Hebreus 12:1-2', 'Filipenses 3:13-14'] },
      { day: 8, title: 'Confianca no processo', passages: ['Filipenses 1:6', 'Isaias 55:8-9'] },
      { day: 9, title: 'Impacto no mundo', passages: ['Mateus 5:13-16', 'Atos 1:8'] },
      { day: 10, title: 'Vida com sentido', passages: ['Eclesiastes 12:13', 'Miqueias 6:8'] },
    ],
  },
  {
    id: 'theme-leadership',
    title: 'Lideranca Biblica',
    description: 'Principios de lideranca servidora baseados na Palavra.',
    durationDays: 10,
    type: 'thematic',
    icon: 'Crown',
    days: [
      { day: 1, title: 'Lider servo', passages: ['Marcos 10:42-45', 'Joao 13:12-17'] },
      { day: 2, title: 'Sabedoria para liderar', passages: ['1 Reis 3:9-12', 'Tiago 3:17'] },
      { day: 3, title: 'Coragem e fe', passages: ['Josue 1:9', 'Deuteronomio 31:6'] },
      { day: 4, title: 'Integridade', passages: ['Proverbios 11:3', 'Salmos 15'] },
      { day: 5, title: 'Visao e proposito', passages: ['Proverbios 29:18', 'Habacuque 2:2-3'] },
      { day: 6, title: 'Humildade', passages: ['Filipenses 2:3-8', 'Numeros 12:3'] },
      { day: 7, title: 'Capacitar outros', passages: ['Efesios 4:11-13', '2 Timoteo 2:2'] },
      { day: 8, title: 'Decisoes justas', passages: ['Proverbios 2:6-9', 'Isaias 11:1-5'] },
      { day: 9, title: 'Perseveranca no chamado', passages: ['Galatas 6:9', '2 Timoteo 4:7-8'] },
      { day: 10, title: 'O maior lider', passages: ['Isaias 53:3-5', 'Filipenses 2:9-11'] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Geradores de dias (planos longos)
// ---------------------------------------------------------------------------

function generateBible1YearDays(): PlanDay[] {
  // Simplificado: primeiros 30 dias como exemplo, o resto segue o padrao
  const days: PlanDay[] = [];
  const otBooks = ['Genesis', 'Exodo', 'Levitico', 'Numeros', 'Deuteronomio'];
  const ntBooks = ['Mateus', 'Marcos', 'Lucas', 'Joao', 'Atos'];

  for (let i = 1; i <= 365; i++) {
    const otBook = otBooks[Math.floor((i - 1) / 73) % otBooks.length];
    const otChapter = ((i - 1) % 50) + 1;
    const ntBook = ntBooks[Math.floor((i - 1) / 73) % ntBooks.length];
    const ntChapter = ((i - 1) % 28) + 1;

    days.push({
      day: i,
      title: `Dia ${i}`,
      passages: [`${otBook} ${otChapter}`, `${ntBook} ${ntChapter}`],
    });
  }
  return days;
}

function generateNT90Days(): PlanDay[] {
  const books = [
    { name: 'Mateus', chapters: 28 },
    { name: 'Marcos', chapters: 16 },
    { name: 'Lucas', chapters: 24 },
    { name: 'Joao', chapters: 21 },
    { name: 'Atos', chapters: 28 },
    { name: 'Romanos', chapters: 16 },
    { name: '1 Corintios', chapters: 16 },
    { name: '2 Corintios', chapters: 13 },
    { name: 'Galatas', chapters: 6 },
    { name: 'Efesios', chapters: 6 },
    { name: 'Filipenses', chapters: 4 },
    { name: 'Colossenses', chapters: 4 },
    { name: '1 Tessalonicenses', chapters: 5 },
    { name: '2 Tessalonicenses', chapters: 3 },
    { name: '1 Timoteo', chapters: 6 },
    { name: '2 Timoteo', chapters: 4 },
    { name: 'Tito', chapters: 3 },
    { name: 'Filemom', chapters: 1 },
    { name: 'Hebreus', chapters: 13 },
    { name: 'Tiago', chapters: 5 },
    { name: '1 Pedro', chapters: 5 },
    { name: '2 Pedro', chapters: 3 },
    { name: '1 Joao', chapters: 5 },
    { name: '2 Joao', chapters: 1 },
    { name: '3 Joao', chapters: 1 },
    { name: 'Judas', chapters: 1 },
    { name: 'Apocalipse', chapters: 22 },
  ];

  const allChapters: string[] = [];
  for (const book of books) {
    for (let c = 1; c <= book.chapters; c++) {
      allChapters.push(`${book.name} ${c}`);
    }
  }

  const days: PlanDay[] = [];
  const perDay = Math.ceil(allChapters.length / 90);

  for (let d = 0; d < 90; d++) {
    const start = d * perDay;
    const passages = allChapters.slice(start, start + perDay);
    if (passages.length === 0) break;

    days.push({
      day: d + 1,
      title: `Dia ${d + 1}: ${passages[0]}`,
      passages,
    });
  }
  return days;
}

function generatePsalmsProverbs(): PlanDay[] {
  const days: PlanDay[] = [];
  for (let d = 1; d <= 31; d++) {
    const psalm = d <= 30 ? `Salmos ${(d - 1) * 5 + 1}-${d * 5}` : 'Salmos 146-150';
    const proverb = `Proverbios ${d <= 31 ? d : 31}`;
    days.push({
      day: d,
      title: `Dia ${d}`,
      passages: [psalm, proverb],
    });
  }
  return days;
}
