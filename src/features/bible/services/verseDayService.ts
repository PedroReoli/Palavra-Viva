/**
 * Servico de Versiculo do Dia.
 *
 * Usa uma lista curada de versiculos e seleciona com base no dia do ano,
 * garantindo que o mesmo verso apareca para todos os usuarios no mesmo dia.
 */

export interface DailyVerse {
  text: string;
  reference: string;
}

// Lista curada de versiculos populares
const VERSES: DailyVerse[] = [
  { text: 'O Senhor e o meu pastor; nada me faltara.', reference: 'Salmos 23:1' },
  { text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigenito, para que todo aquele que nele cre nao pereca, mas tenha a vida eterna.', reference: 'Joao 3:16' },
  { text: 'Tudo posso naquele que me fortalece.', reference: 'Filipenses 4:13' },
  { text: 'Confia no Senhor de todo o teu coracao e nao te estribes no teu proprio entendimento.', reference: 'Proverbios 3:5' },
  { text: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e nao de mal, para vos dar o fim que esperais.', reference: 'Jeremias 29:11' },
  { text: 'Nao temas, porque eu sou contigo; nao te assombres, porque eu sou teu Deus.', reference: 'Isaias 41:10' },
  { text: 'Buscai primeiro o reino de Deus, e a sua justica, e todas estas coisas vos serao acrescentadas.', reference: 'Mateus 6:33' },
  { text: 'O Senhor e a minha luz e a minha salvacao; a quem temerei?', reference: 'Salmos 27:1' },
  { text: 'Entrega o teu caminho ao Senhor; confia nele, e ele tudo fara.', reference: 'Salmos 37:5' },
  { text: 'E conhecereis a verdade, e a verdade vos libertara.', reference: 'Joao 8:32' },
  { text: 'Deus e o nosso refugio e fortaleza, socorro bem presente na angustia.', reference: 'Salmos 46:1' },
  { text: 'Mas os que esperam no Senhor renovarao as suas forcas.', reference: 'Isaias 40:31' },
  { text: 'O Senhor e bom, ele serve de fortaleza no dia da angustia.', reference: 'Naum 1:7' },
  { text: 'Lancando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vos.', reference: '1 Pedro 5:7' },
  { text: 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.', reference: 'Mateus 11:28' },
  { text: 'Pois onde estiver o vosso tesouro, ai estara tambem o vosso coracao.', reference: 'Mateus 6:21' },
  { text: 'Porque o Senhor da a sabedoria; da sua boca vem o conhecimento e o entendimento.', reference: 'Proverbios 2:6' },
  { text: 'Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos.', reference: 'Filipenses 4:4' },
  { text: 'O amor e paciente, o amor e bondoso.', reference: '1 Corintios 13:4' },
  { text: 'A tua palavra e lampada para os meus pes, e luz para o meu caminho.', reference: 'Salmos 119:105' },
  { text: 'Se Deus e por nos, quem sera contra nos?', reference: 'Romanos 8:31' },
  { text: 'Sê forte e corajoso! Nao tenhas medo, nem fiques desanimado, pois o Senhor, teu Deus, estara contigo por onde quer que andares.', reference: 'Josue 1:9' },
  { text: 'Ora, a fe e a certeza daquilo que esperamos e a prova das coisas que nao vemos.', reference: 'Hebreus 11:1' },
  { text: 'O Senhor e fiel; ele vos fortalecera e vos guardara do Maligno.', reference: '2 Tessalonicenses 3:3' },
  { text: 'Grande e o Senhor e muito digno de louvor; a sua grandeza e insondavel.', reference: 'Salmos 145:3' },
  { text: 'Eu sou o caminho, a verdade e a vida. Ninguem vem ao Pai senao por mim.', reference: 'Joao 14:6' },
  { text: 'Dai gracas ao Senhor, porque ele e bom; o seu amor dura para sempre.', reference: 'Salmos 136:1' },
  { text: 'Eis que estou convosco todos os dias, ate a consumacao dos seculos.', reference: 'Mateus 28:20' },
  { text: 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus.', reference: 'Romanos 8:28' },
  { text: 'Delight-se no Senhor, e ele satisfara os desejos do seu coracao.', reference: 'Salmos 37:4' },
  { text: 'A paz vos deixo, a minha paz vos dou; nao vo-la dou como o mundo a da.', reference: 'Joao 14:27' },
];

/**
 * Retorna o versiculo do dia baseado na data atual.
 * Determinístico: mesmo dia = mesmo verso para todos.
 */
export function getDailyVerse(date: Date = new Date()): DailyVerse {
  const dayOfYear = getDayOfYear(date);
  const index = dayOfYear % VERSES.length;
  return VERSES[index];
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
