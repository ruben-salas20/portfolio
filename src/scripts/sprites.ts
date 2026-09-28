/**
 * Sprites de la escena de los márgenes, dibujados como cuadrículas de texto:
 * cada carácter es un píxel y la paleta de abajo dice su color. Así un dibujo
 * se edita a mano en el propio archivo, sin herramienta de pixel art.
 *
 * Los colores neutros van como variables CSS, así que los personajes cambian
 * con el tema claro/oscuro igual que el resto de la página. El naranja es el
 * de Clawd, la mascota de Anthropic; el azul, los vaqueros de Rubén, y el
 * verde, el de "disponible".
 */

export type Grid = readonly string[];

const palette: Record<string, string> = {
  '#': 'var(--fg)',
  // El relleno es blanco en los dos temas: si siguiera a --bg, en oscuro
  // Rubén saldría en negativo (cara y polo negros, pelo blanco).
  w: '#ffffff',
  o: '#d97757',
  j: '#6b8cb4',
  J: '#56769d',
  x: '#1f1f1f',
  h: '#2e2622',
  s: '#d9a47e',
  n: '#c48b66',
  v: '#d4d4d4',
  // El polo es casi blanco, no blanco: sobre fondo blanco se leería solo el contorno.
  p: '#f3f3f3',
  k: '#000000',
  g: 'var(--available)',
};

/** Convierte una cuadrícula en un SVG: un <path> por color, píxeles de `px`. */
export function toSvg(grid: Grid, px: number, mirror = false): string {
  const width = grid[0].length;
  const paths: Record<string, string> = {};
  grid.forEach((row, y) => {
    [...row].forEach((char, x) => {
      if (!palette[char]) return;
      const col = mirror ? width - 1 - x : x;
      paths[char] = (paths[char] ?? '') + `M${col} ${y}h1v1h-1z`;
    });
  });
  const body = Object.entries(paths)
    .map(([char, d]) => `<path style="fill:${palette[char]}" d="${d}"/>`)
    .join('');
  return `<svg width="${width * px}" height="${grid.length * px}" viewBox="0 0 ${width} ${grid.length}" shape-rendering="crispEdges">${body}</svg>`;
}

// ---- Rubén -------------------------------------------------------------
// Más resolución y color que el resto de sprites (se pinta a 2 px por píxel,
// ver RUBEN_PX): pelo y barba oscuros, polo blanco con cuello, vaqueros y
// zapatillas, sacados de su referencia. El contorno `x` es oscuro fijo; en
// modo oscuro lo recorta un halo claro (ver `.sprite-ruben` en global.css).

export const RUBEN_PX = 2;

const rubenHead = [
  '.....hhhhhhh......',
  '....hhhhhhhhhh....',
  '...hhhhhhhhhhhh...',
  '...hhhhhhhhhhhh...',
  '...hhsssssssshh...',
  '...hshhsssshhsh...',
  '..sssw#ssss#wsss..',
  '..ssssssnnssssss..',
  '...hssssssssssh...',
  '...hhshhhhhhshh...',
  '...hhhhsssshhhh...',
  '...hhhhhhhhhhhh...',
  '....hhhhhhhhhh....',
  '......hhhhhh......',
  '.......ssss.......',
];

const rubenTorso = [
  '...##ppvssvpp##...',
  '..#pppppvvppppp#..',
  '.#ppppppvvpppppp#.',
  '.#ppppppvvpppppp#.',
  '.#vvppppppppppvv#.',
  '.#ss#pppppppp#ss#.',
  '.#ss#pppppppp#ss#.',
  '.#ss#ppppppvv#ss#.',
  '.#ss#ppppppvv#ss#.',
  '..ss#vvvvvvvv#ss..',
];

const rubenLegs = [
  '....#jjjjjjjj#....',
  '....#jjjJJjjj#....',
  ...Array(7).fill('....#jjJ##Jjj#....'),
  '...#wwwv##wwwv#...',
  '...#vvvv##vvvv#...',
];

const rubenLegsA = [
  '....#jjjjjjjj#....',
  '...#jjjJ##Jjjj#...',
  '...#jjJ#..#Jjj#...',
  '..#jjJ#....#Jjj#..',
  '..#jjJ#....#Jjj#..',
  '.#jjJ#......#Jjj#.',
  '.#jjJ#......#Jjj#.',
  '.#jjJ#......#Jjj#.',
  '#jjJ#........#Jjj#',
  '#wwv#........#wwv#',
  '####..........####',
];

const rubenLegsB = [
  '....#jjjjjjjj#....',
  '.....#jjjjjj#.....',
  '.....#jjJJjj#.....',
  '.....#jjJJjj#.....',
  ...Array(5).fill('.....#jj##jj#.....'),
  '....#wwwvwwwv#....',
  '....#vvvvvvvv#....',
];

/** Sobrescribe unas columnas de unas filas: para variar un fotograma base. */
function patch(grid: string[], col: number, rows: Record<number, string>): string[] {
  return grid.map((row, y) =>
    rows[y] === undefined ? row : row.slice(0, col) + rows[y] + row.slice(col + rows[y].length),
  );
}

// `#` se escribe por comodidad y aquí pasa a `x`, el contorno fijo de Rubén.
const outline = (grid: string[]): Grid => grid.map((row) => row.replaceAll('#', 'x'));

const rubenStand = [...rubenHead, ...rubenTorso, ...rubenLegs];

export const ruben = {
  stand: outline(rubenStand),
  walkA: outline([...rubenHead, ...rubenTorso, ...rubenLegsA]),
  walkB: outline([...rubenHead, ...rubenTorso, ...rubenLegsB]),
  // Brazo derecho levantado, señalando: "¡ahí!".
  point: outline(
    patch(
      patch(rubenStand, 15, {
        8: '.#.',
        9: '#s#',
        10: '#s#',
        11: '#s#',
        12: '#s#',
        13: '#s#',
        14: '#s#',
      }),
      13,
      {
        15: '###p#',
        16: 'pppp#',
        20: '#....',
        21: '#....',
        22: '#....',
        23: '#....',
        24: '#....',
      },
    ),
  ),
};

// ---- Clawd -------------------------------------------------------------

const clawdTop = ['..oooooooo..', '..okooooko..', 'oooooooooooo', 'oooooooooooo', '..oooooooo..', '..oooooooo..'];

export const clawd = {
  stand: [...clawdTop, '..o.o..o.o..', '..o.o..o.o..'],
  walkA: [...clawdTop, '..o.o..o.o..', '.o.o..o.o...'],
  walkB: [...clawdTop, '..o.o..o.o..', '...o.o..o.o.'],
  blink: ['..oooooooo..', '..oooooooo..', ...clawdTop.slice(2), '..o.o..o.o..', '..o.o..o.o..'],
};

// ---- Fallos y sus versiones arregladas ----------------------------------

export const wall = {
  broken: [
    '############',
    '#wwwww#wwww#',
    '######..####',
    '#ww#w..ww#w#',
    '####..######',
    '#wwww.#wwww#',
    '####...#####',
  ],
  fixed: [
    '############',
    '#wwwww#wwww#',
    '############',
    '#ww#wwwww#w#',
    '############',
    '#wwwww#wwww#',
    '############',
  ],
};

// Cartel con un código HTTP: el fallo es un 404 y el arreglo, un 200.
const digits: Record<string, string[]> = {
  '0': ['###', '#.#', '#.#', '#.#', '###'],
  '2': ['###', '..#', '###', '#..', '###'],
  '4': ['#.#', '#.#', '###', '..#', '..#'],
};

function sign(code: string): Grid {
  const rows = digits[code[0]].map((_, y) =>
    ('#w' + [...code].map((d) => digits[d][y]).join('w') + 'w#').replaceAll('.', 'w'),
  );
  const edge = '#'.repeat(15);
  const blank = '#' + 'w'.repeat(13) + '#';
  const post = '......###......';
  return [edge, blank, ...rows, blank, edge, post, post, post];
}

export const signs = { broken: sign('404'), fixed: sign('200') };

export const bug = {
  a: ['.#...#.', '..###..', '#######', '.#####.', '#.#.#.#'],
  b: ['.#...#.', '..###..', '#######', '.#####.', '.#.#.#.'],
};

// ---- Marcas ------------------------------------------------------------

export const bang: Grid = ['#', '#', '#', '.', '#'];
export const check: Grid = ['....g', '...g.', 'g.g..', '.g...'];
export const spark = { a: ['.o.', 'ooo', '.o.'], b: ['o.o', '.o.', 'o.o'] };
