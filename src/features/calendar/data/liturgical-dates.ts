import type { LiturgicalDate } from '../types';

/**
 * Datas liturgicas fixas (mesmo dia todo ano).
 * Formato date: MM-DD
 */
export const FIXED_DATES: LiturgicalDate[] = [
  // Janeiro
  {
    date: '01-01',
    title: 'Dia Mundial da Paz',
    description: 'Celebracao pela paz entre os povos, marcando o inicio de um novo ano.',
    verse: 'Bem-aventurados os pacificadores, porque eles serao chamados filhos de Deus.',
    verseReference: 'Mateus 5:9',
    type: 'both',
    movable: false,
  },
  {
    date: '01-06',
    title: 'Epifania do Senhor (Dia de Reis)',
    description: 'Celebracao da visita dos Reis Magos ao menino Jesus.',
    verse: 'Entrando na casa, viram o menino com Maria, sua mae. Prostrando-se, o adoraram.',
    verseReference: 'Mateus 2:11',
    type: 'both',
    movable: false,
  },

  // Fevereiro
  {
    date: '02-02',
    title: 'Apresentacao do Senhor',
    description: 'Jesus e apresentado no templo por Maria e Jose, conforme a lei judaica.',
    verse: 'Os meus olhos ja viram a tua salvacao, que preparaste a vista de todos os povos.',
    verseReference: 'Lucas 2:30-31',
    type: 'catholic',
    movable: false,
  },

  // Marco
  {
    date: '03-19',
    title: 'Dia de Sao Jose',
    description: 'Homenagem a Jose, pai terreno de Jesus e esposo de Maria.',
    verse: 'Jose, filho de Davi, nao tenha medo de receber Maria como esposa.',
    verseReference: 'Mateus 1:20',
    type: 'catholic',
    movable: false,
  },
  {
    date: '03-25',
    title: 'Anunciacao do Senhor',
    description: 'O anjo Gabriel anuncia a Maria que ela concebera o Filho de Deus.',
    verse: 'O Espirito Santo vira sobre voce, e o poder do Altissimo a cobrira com a sua sombra.',
    verseReference: 'Lucas 1:35',
    type: 'both',
    movable: false,
  },

  // Junho
  {
    date: '06-24',
    title: 'Nascimento de Joao Batista',
    description: 'Celebracao do nascimento do profeta que preparou o caminho para Jesus.',
    verse: 'Voce, menino, sera chamado profeta do Altissimo, pois ira adiante do Senhor.',
    verseReference: 'Lucas 1:76',
    type: 'both',
    movable: false,
  },

  // Agosto
  {
    date: '08-15',
    title: 'Assuncao de Maria',
    description: 'Celebracao catolica da elevacao de Maria ao ceu em corpo e alma.',
    verse: 'A minha alma engrandece ao Senhor, e o meu espirito se alegra em Deus.',
    verseReference: 'Lucas 1:46-47',
    type: 'catholic',
    movable: false,
  },

  // Outubro
  {
    date: '10-31',
    title: 'Dia da Reforma Protestante',
    description: 'Marco da Reforma iniciada por Martinho Lutero em 1517.',
    verse: 'O justo vivera pela fe.',
    verseReference: 'Romanos 1:17',
    type: 'evangelical',
    movable: false,
  },

  // Novembro
  {
    date: '11-01',
    title: 'Dia de Todos os Santos',
    description: 'Homenagem a todos os santos reconhecidos e desconhecidos.',
    verse: 'Depois destas coisas, vi uma grande multidao que ninguem podia contar.',
    verseReference: 'Apocalipse 7:9',
    type: 'catholic',
    movable: false,
  },
  {
    date: '11-02',
    title: 'Dia de Finados',
    description: 'Dia de oracao e lembranca dos fieis que ja partiram.',
    verse: 'Eu sou a ressurreicao e a vida. Quem cre em mim, ainda que morra, vivera.',
    verseReference: 'Joao 11:25',
    type: 'both',
    movable: false,
  },

  // Dezembro
  {
    date: '12-08',
    title: 'Imaculada Conceicao',
    description: 'Dogma catolico da conceicao sem pecado de Maria.',
    verse: 'Alegra-te, cheia de graca! O Senhor esta contigo.',
    verseReference: 'Lucas 1:28',
    type: 'catholic',
    movable: false,
  },
  {
    date: '12-24',
    title: 'Vespera de Natal',
    description: 'Vigilia de celebracao do nascimento de Jesus Cristo.',
    verse: 'Eis que a virgem conceberae dara a luz um filho, e lhe chamarao Emanuel.',
    verseReference: 'Mateus 1:23',
    type: 'both',
    movable: false,
  },
  {
    date: '12-25',
    title: 'Natal — Nascimento de Jesus',
    description: 'Celebracao do nascimento de Jesus Cristo em Belem.',
    verse: 'Hoje vos nasceu, na cidade de Davi, o Salvador, que e Cristo, o Senhor.',
    verseReference: 'Lucas 2:11',
    type: 'both',
    movable: false,
  },
];

/**
 * Calcula datas moveis baseadas na Pascoa.
 * A Pascoa crista segue o algoritmo de Meeus/Jones/Butcher.
 */
export function getMovableDates(year: number): LiturgicalDate[] {
  const easter = calculateEaster(year);
  const dates: LiturgicalDate[] = [];

  const addDate = (daysFromEaster: number, data: Omit<LiturgicalDate, 'date' | 'movable'>) => {
    const d = new Date(easter);
    d.setDate(d.getDate() + daysFromEaster);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    dates.push({ ...data, date: `${year}-${mm}-${dd}`, movable: true });
  };

  // Quaresma e Pascoa
  addDate(-46, {
    title: 'Quarta-feira de Cinzas',
    description: 'Inicio da Quaresma, periodo de 40 dias de penitencia antes da Pascoa.',
    verse: 'Rasguem o coracao, e nao as vestes. Voltem-se para o Senhor.',
    verseReference: 'Joel 2:13',
    type: 'both',
  });

  addDate(-7, {
    title: 'Domingo de Ramos',
    description: 'Entrada triunfal de Jesus em Jerusalem.',
    verse: 'Hosana! Bendito o que vem em nome do Senhor!',
    verseReference: 'Marcos 11:9',
    type: 'both',
  });

  addDate(-3, {
    title: 'Quinta-feira Santa',
    description: 'Ultima Ceia de Jesus com os discipulos.',
    verse: 'Isto e o meu corpo dado em favor de voces; facam isso em memoria de mim.',
    verseReference: 'Lucas 22:19',
    type: 'both',
  });

  addDate(-2, {
    title: 'Sexta-feira Santa',
    description: 'Crucificacao e morte de Jesus Cristo.',
    verse: 'Esta consumado.',
    verseReference: 'Joao 19:30',
    type: 'both',
  });

  addDate(0, {
    title: 'Pascoa — Ressurreicao de Cristo',
    description: 'Celebracao da ressurreicao de Jesus ao terceiro dia.',
    verse: 'Ele nao esta aqui; ressuscitou, como tinha dito.',
    verseReference: 'Mateus 28:6',
    type: 'both',
  });

  addDate(39, {
    title: 'Ascensao do Senhor',
    description: 'Jesus sobe ao ceu diante dos discipulos.',
    verse: 'Foi elevado as alturas enquanto eles olhavam, e uma nuvem o encobriu.',
    verseReference: 'Atos 1:9',
    type: 'both',
  });

  addDate(49, {
    title: 'Pentecostes',
    description: 'Descida do Espirito Santo sobre os apostolos.',
    verse: 'Todos ficaram cheios do Espirito Santo e comecaram a falar noutras linguas.',
    verseReference: 'Atos 2:4',
    type: 'both',
  });

  addDate(60, {
    title: 'Corpus Christi',
    description: 'Celebracao do Corpo e Sangue de Cristo na Eucaristia.',
    verse: 'Eu sou o pao vivo que desceu do ceu. Se alguem comer deste pao, vivera para sempre.',
    verseReference: 'Joao 6:51',
    type: 'catholic',
  });

  return dates;
}

/**
 * Algoritmo de Meeus/Jones/Butcher para calcular a Pascoa.
 */
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}
