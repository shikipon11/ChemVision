/** 化学データは描画ロジックから独立。値と文章は教材用に手動で確認して収録する。 */
export type Ion = {
  id: string;
  label: string;
  color: string;
  count: number;
};
export type Reaction = {
  id: string;
  name: string;
  category: '沈殿反応';
  equation: string;
  ionicEquation: string;
  reagents: [string, string];
  left: Ion[];
  right: Ion[];
  spectators: Ion[];
  product: { formula: string; name: string; color: string; textColor: string; ions: [string, string] };
  stages: [string, string, string];
  observation: string;
  why: string;
  tips: string;
  substanceIds: string[];
};
export type Substance = {
  id: string;
  name: string;
  formula: string;
  category: string;
  appearance: string;
  solubility: string;
  fact: string;
  reactionIds: string[];
  tags: string[];
};
export type Card = { id: string; prompt: string; answer: string; explanation: string; reactionId?: string };
export type Quiz = {
  id: string;
  label: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  reactionId?: string;
};

const ion = (id: string, label: string, color: string, count = 1): Ion => ({ id, label, color, count });
const C = {
  silver: '#a5b4fc', chloride: '#fbbf7a', nitrate: '#a7f3d0', sodium: '#7dd3fc',
  barium: '#c4b5fd', sulfate: '#fda4af', copper: '#67e8f9', hydroxide: '#fdba74',
  iron: '#fca5a5', calcium: '#d9f99d', carbonate: '#f9a8d4'
};

export const reactions: Reaction[] = [
  {
    id: 'agcl', name: '塩化銀の生成', category: '沈殿反応',
    equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃',
    ionicEquation: 'Ag⁺ + Cl⁻ → AgCl↓',
    reagents: ['硝酸銀水溶液', '塩化ナトリウム水溶液'],
    left: [ion('ag', 'Ag⁺', C.silver), ion('no3', 'NO₃⁻', C.nitrate)],
    right: [ion('na', 'Na⁺', C.sodium), ion('cl', 'Cl⁻', C.chloride)],
    spectators: [ion('na', 'Na⁺', C.sodium), ion('no3', 'NO₃⁻', C.nitrate)],
    product: { formula: 'AgCl', name: '塩化銀', color: '#f0f3fa', textColor: '#253247', ions: ['Ag⁺', 'Cl⁻'] },
    stages: [
      '2つの水溶液中では、それぞれの電解質が陽イオンと陰イオンに分かれています。',
      '水溶液を混ぜるとAg⁺とCl⁻が出会い、水に溶けにくいAgClの結晶が形成され始めます。',
      '白色のAgClが沈殿します。Na⁺とNO₃⁻は水溶液中に残る傍観イオンです。'
    ],
    observation: '白色沈殿ができる。',
    why: 'AgClは水に溶けにくいため、Ag⁺とCl⁻が結びついて結晶として現れます。',
    tips: 'AgClは過剰のアンモニア水に溶け、光で徐々に分解します。',
    substanceIds: ['silver-nitrate', 'sodium-chloride', 'silver-chloride']
  },
  {
    id: 'baso4', name: '硫酸バリウムの生成', category: '沈殿反応',
    equation: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',
    ionicEquation: 'Ba²⁺ + SO₄²⁻ → BaSO₄↓',
    reagents: ['塩化バリウム水溶液', '硫酸ナトリウム水溶液'],
    left: [ion('ba', 'Ba²⁺', C.barium), ion('cl', 'Cl⁻', C.chloride, 2)],
    right: [ion('na', 'Na⁺', C.sodium, 2), ion('so4', 'SO₄²⁻', C.sulfate)],
    spectators: [ion('na', 'Na⁺', C.sodium, 2), ion('cl', 'Cl⁻', C.chloride, 2)],
    product: { formula: 'BaSO₄', name: '硫酸バリウム', color: '#f3f4f6', textColor: '#253247', ions: ['Ba²⁺', 'SO₄²⁻'] },
    stages: [
      'BaCl₂とNa₂SO₄が電離しています。BaCl₂からCl⁻が2個、Na₂SO₄からNa⁺が2個生じます。',
      'Ba²⁺とSO₄²⁻が近づき、水に溶けにくいBaSO₄の結晶を形成します。',
      '白色のBaSO₄が沈殿します。Na⁺とCl⁻は水溶液中に残ります。'
    ],
    observation: '白色沈殿ができる。',
    why: 'BaSO₄は水や希酸に溶けにくい塩です。Ba²⁺とSO₄²⁻の検出に利用されます。',
    tips: 'BaSO₄の白色沈殿は希塩酸にも溶けにくいことがポイントです。',
    substanceIds: ['barium-chloride', 'sodium-sulfate', 'barium-sulfate']
  },
  {
    id: 'cuoh2', name: '水酸化銅(II)の生成', category: '沈殿反応',
    equation: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
    ionicEquation: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓',
    reagents: ['硫酸銅(II)水溶液', '水酸化ナトリウム水溶液'],
    left: [ion('cu', 'Cu²⁺', C.copper), ion('so4', 'SO₄²⁻', C.sulfate)],
    right: [ion('na', 'Na⁺', C.sodium, 2), ion('oh', 'OH⁻', C.hydroxide, 2)],
    spectators: [ion('na', 'Na⁺', C.sodium, 2), ion('so4', 'SO₄²⁻', C.sulfate)],
    product: { formula: 'Cu(OH)₂', name: '水酸化銅(II)', color: '#65c5f5', textColor: '#07345a', ions: ['Cu²⁺', 'OH⁻'] },
    stages: [
      'CuSO₄からCu²⁺とSO₄²⁻、NaOHからNa⁺とOH⁻が生じています。',
      'Cu²⁺1個に対してOH⁻2個が反応し、Cu(OH)₂を形成します。',
      '青白色のCu(OH)₂が沈殿し、Na⁺とSO₄²⁻は水溶液中に残ります。'
    ],
    observation: '青白色沈殿ができる。',
    why: 'Cu(OH)₂は水に溶けにくい塩基です。Cu²⁺にOH⁻を加えると沈殿します。',
    tips: 'Cu(OH)₂を加熱すると黒色のCuOが生成します。',
    substanceIds: ['copper-sulfate', 'sodium-hydroxide', 'copper-hydroxide']
  },
  {
    id: 'feoh3', name: '水酸化鉄(III)の生成', category: '沈殿反応',
    equation: 'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',
    ionicEquation: 'Fe³⁺ + 3OH⁻ → Fe(OH)₃↓',
    reagents: ['塩化鉄(III)水溶液', '水酸化ナトリウム水溶液'],
    left: [ion('fe', 'Fe³⁺', C.iron), ion('cl', 'Cl⁻', C.chloride, 3)],
    right: [ion('na', 'Na⁺', C.sodium, 3), ion('oh', 'OH⁻', C.hydroxide, 3)],
    spectators: [ion('na', 'Na⁺', C.sodium, 3), ion('cl', 'Cl⁻', C.chloride, 3)],
    product: { formula: 'Fe(OH)₃', name: '水酸化鉄(III)', color: '#bb6545', textColor: '#ffffff', ions: ['Fe³⁺', 'OH⁻'] },
    stages: [
      'FeCl₃はFe³⁺と3個のCl⁻に、NaOHはNa⁺とOH⁻に分かれています。',
      'Fe³⁺1個に対してOH⁻3個が反応し、Fe(OH)₃を形成します。',
      '赤褐色のFe(OH)₃が沈殿します。Na⁺とCl⁻は水溶液中に残ります。'
    ],
    observation: '赤褐色沈殿ができる。',
    why: 'Fe(OH)₃は水に溶けにくく、Fe³⁺とOH⁻が反応して沈殿します。',
    tips: 'Fe²⁺から生じるFe(OH)₂の緑白色沈殿と区別しましょう。',
    substanceIds: ['iron-chloride', 'sodium-hydroxide', 'iron-hydroxide']
  },
  {
    id: 'caco3', name: '炭酸カルシウムの生成', category: '沈殿反応',
    equation: 'CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl',
    ionicEquation: 'Ca²⁺ + CO₃²⁻ → CaCO₃↓',
    reagents: ['塩化カルシウム水溶液', '炭酸ナトリウム水溶液'],
    left: [ion('ca', 'Ca²⁺', C.calcium), ion('cl', 'Cl⁻', C.chloride, 2)],
    right: [ion('na', 'Na⁺', C.sodium, 2), ion('co3', 'CO₃²⁻', C.carbonate)],
    spectators: [ion('na', 'Na⁺', C.sodium, 2), ion('cl', 'Cl⁻', C.chloride, 2)],
    product: { formula: 'CaCO₃', name: '炭酸カルシウム', color: '#f2eee4', textColor: '#263247', ions: ['Ca²⁺', 'CO₃²⁻'] },
    stages: [
      'CaCl₂とNa₂CO₃が水溶液中でそれぞれ電離しています。',
      'Ca²⁺とCO₃²⁻が近づき、溶けにくいCaCO₃の結晶を形成します。',
      '白色のCaCO₃が沈殿します。Na⁺とCl⁻は水溶液中に残ります。'
    ],
    observation: '白色沈殿ができる。',
    why: 'CaCO₃は水に溶けにくいため、Ca²⁺とCO₃²⁻が反応すると沈殿します。',
    tips: 'CaCO₃に塩酸を加えるとCO₂が発生し、沈殿が溶けます。',
    substanceIds: ['calcium-chloride', 'sodium-carbonate', 'calcium-carbonate']
  }
];

export const substances: Substance[] = [
  { id: 'silver-nitrate', name: '硝酸銀', formula: 'AgNO₃', category: '銀の化合物', appearance: '白色の結晶。水溶液は無色。', solubility: '水に溶ける。', fact: 'Ag⁺の供給源として塩化物イオンの検出に用いる。', reactionIds: ['agcl'], tags: ['銀', '硝酸塩'] },
  { id: 'sodium-chloride', name: '塩化ナトリウム', formula: 'NaCl', category: 'ナトリウムの化合物', appearance: '白色の結晶。水溶液は無色。', solubility: '水に溶ける。', fact: '水溶液中でNa⁺とCl⁻に電離する。', reactionIds: ['agcl', 'baso4', 'feoh3', 'caco3'], tags: ['塩化物', 'ナトリウム'] },
  { id: 'silver-chloride', name: '塩化銀', formula: 'AgCl', category: '銀の化合物', appearance: '白色の沈殿。', solubility: '水に難溶。過剰のアンモニア水には溶ける。', fact: '光で徐々に分解する。Ag⁺とCl⁻によって沈殿ができる。', reactionIds: ['agcl'], tags: ['白色沈殿', '銀', '塩化物'] },
  { id: 'barium-chloride', name: '塩化バリウム', formula: 'BaCl₂', category: 'バリウムの化合物', appearance: '白色の結晶。水溶液は無色。', solubility: '水に溶ける。', fact: 'Ba²⁺を含む。取り扱いに注意が必要な有害な化合物。', reactionIds: ['baso4'], tags: ['バリウム', '塩化物'] },
  { id: 'sodium-sulfate', name: '硫酸ナトリウム', formula: 'Na₂SO₄', category: 'ナトリウムの化合物', appearance: '白色の結晶。水溶液は無色。', solubility: '水に溶ける。', fact: '水溶液中にSO₄²⁻を供給する。', reactionIds: ['baso4', 'cuoh2'], tags: ['硫酸塩', 'ナトリウム'] },
  { id: 'barium-sulfate', name: '硫酸バリウム', formula: 'BaSO₄', category: 'バリウムの化合物', appearance: '白色の沈殿。', solubility: '水や希酸に難溶。', fact: 'Ba²⁺とSO₄²⁻が反応して生じる。', reactionIds: ['baso4'], tags: ['白色沈殿', 'バリウム', '硫酸塩'] },
  { id: 'copper-sulfate', name: '硫酸銅(II)', formula: 'CuSO₄', category: '銅の化合物', appearance: '無水物は白色、五水和物は青色。水溶液は青色。', solubility: '水に溶ける。', fact: '青色の水溶液にOH⁻を加えるとCu(OH)₂が沈殿する。', reactionIds: ['cuoh2'], tags: ['銅', '硫酸塩', '青色'] },
  { id: 'sodium-hydroxide', name: '水酸化ナトリウム', formula: 'NaOH', category: 'ナトリウムの化合物', appearance: '白色固体。水溶液は無色。', solubility: '水によく溶ける。', fact: '強塩基。水溶液中でNa⁺とOH⁻に電離する。', reactionIds: ['cuoh2', 'feoh3'], tags: ['塩基', '水酸化物'] },
  { id: 'copper-hydroxide', name: '水酸化銅(II)', formula: 'Cu(OH)₂', category: '銅の化合物', appearance: '青白色の沈殿。', solubility: '水に難溶。', fact: '加熱すると黒色の酸化銅(II) CuOになる。', reactionIds: ['cuoh2'], tags: ['青白色沈殿', '銅', '水酸化物'] },
  { id: 'iron-chloride', name: '塩化鉄(III)', formula: 'FeCl₃', category: '鉄の化合物', appearance: '水溶液は黄褐色。', solubility: '水に溶ける。', fact: 'Fe³⁺にOH⁻を加えるとFe(OH)₃が沈殿する。', reactionIds: ['feoh3'], tags: ['鉄', '塩化物'] },
  { id: 'iron-hydroxide', name: '水酸化鉄(III)', formula: 'Fe(OH)₃', category: '鉄の化合物', appearance: '赤褐色の沈殿。', solubility: '水に難溶。', fact: 'Fe³⁺1個にOH⁻3個が対応する。', reactionIds: ['feoh3'], tags: ['赤褐色沈殿', '鉄', '水酸化物'] },
  { id: 'calcium-chloride', name: '塩化カルシウム', formula: 'CaCl₂', category: 'カルシウムの化合物', appearance: '白色の固体。水溶液は無色。', solubility: '水によく溶ける。', fact: 'Ca²⁺を含む水溶液にCO₃²⁻を加えるとCaCO₃が沈殿する。', reactionIds: ['caco3'], tags: ['カルシウム', '塩化物'] },
  { id: 'sodium-carbonate', name: '炭酸ナトリウム', formula: 'Na₂CO₃', category: 'ナトリウムの化合物', appearance: '白色の固体。水溶液は無色。', solubility: '水に溶ける。', fact: '水溶液中にCO₃²⁻を供給する。', reactionIds: ['caco3'], tags: ['炭酸塩', 'ナトリウム'] },
  { id: 'calcium-carbonate', name: '炭酸カルシウム', formula: 'CaCO₃', category: 'カルシウムの化合物', appearance: '白色の沈殿・固体。', solubility: '水に難溶。', fact: '酸と反応してCO₂を発生する。石灰石の主成分。', reactionIds: ['caco3'], tags: ['白色沈殿', 'カルシウム', '炭酸塩'] }
];

export const cards: Card[] = [
  { id: 'f01', prompt: '塩化銀（AgCl）の沈殿は何色？', answer: '白色', explanation: 'Ag⁺とCl⁻から白色のAgClが沈殿する。', reactionId: 'agcl' },
  { id: 'f02', prompt: 'AgClを生成するイオンを2つ答えよう。', answer: 'Ag⁺ と Cl⁻', explanation: '正味のイオン反応式は Ag⁺ + Cl⁻ → AgCl↓。', reactionId: 'agcl' },
  { id: 'f03', prompt: 'AgNO₃水溶液とNaCl水溶液を混ぜたとき、水溶液中に残る傍観イオンは？', answer: 'Na⁺ と NO₃⁻', explanation: 'Ag⁺とCl⁻が沈殿する一方、Na⁺とNO₃⁻は水溶液中に残る。', reactionId: 'agcl' },
  { id: 'f04', prompt: 'AgClは過剰のアンモニア水に溶ける？', answer: '溶ける', explanation: 'ジアンミン銀(I)イオン [Ag(NH₃)₂]⁺ を形成する。', reactionId: 'agcl' },
  { id: 'f05', prompt: '硫酸バリウム（BaSO₄）の沈殿は何色？', answer: '白色', explanation: 'Ba²⁺とSO₄²⁻から白色のBaSO₄が沈殿する。', reactionId: 'baso4' },
  { id: 'f06', prompt: 'BaSO₄の生成に直接関わる2種類のイオンは？', answer: 'Ba²⁺ と SO₄²⁻', explanation: 'Ba²⁺ + SO₄²⁻ → BaSO₄↓。', reactionId: 'baso4' },
  { id: 'f07', prompt: 'BaSO₄の沈殿は希塩酸に溶けやすい？', answer: '溶けにくい', explanation: 'BaSO₄は希酸にも難溶。炭酸塩との見分けにも役立つ。', reactionId: 'baso4' },
  { id: 'f08', prompt: 'Cu²⁺にOH⁻を加えてできる沈殿の化学式は？', answer: 'Cu(OH)₂', explanation: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓。', reactionId: 'cuoh2' },
  { id: 'f09', prompt: 'Cu(OH)₂の沈殿は何色？', answer: '青白色', explanation: '水酸化銅(II)は青白色沈殿として覚える。', reactionId: 'cuoh2' },
  { id: 'f10', prompt: 'Cu(OH)₂を加熱するとできる黒色の物質は？', answer: 'CuO（酸化銅(II)）', explanation: 'Cu(OH)₂ → CuO + H₂O。', reactionId: 'cuoh2' },
  { id: 'f11', prompt: 'Cu(OH)₂の生成に必要なOH⁻は、Cu²⁺1個につき何個？', answer: '2個', explanation: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓。電荷と組成を合わせる。', reactionId: 'cuoh2' },
  { id: 'f12', prompt: 'Fe³⁺にOH⁻を加えてできる沈殿の化学式は？', answer: 'Fe(OH)₃', explanation: 'Fe³⁺ + 3OH⁻ → Fe(OH)₃↓。', reactionId: 'feoh3' },
  { id: 'f13', prompt: 'Fe(OH)₃の沈殿は何色？', answer: '赤褐色', explanation: 'Fe(OH)₂の緑白色と混同しない。', reactionId: 'feoh3' },
  { id: 'f14', prompt: 'Fe³⁺1個と反応するOH⁻は何個？', answer: '3個', explanation: 'Fe³⁺の+3をOH⁻3個の−3で打ち消す。', reactionId: 'feoh3' },
  { id: 'f15', prompt: 'Fe(OH)₂の沈殿は一般に何色？', answer: '緑白色', explanation: '空気中で酸化され、赤褐色のFe(OH)₃へ変化しやすい。', reactionId: 'feoh3' },
  { id: 'f16', prompt: 'Ca²⁺とCO₃²⁻からできる沈殿の化学式は？', answer: 'CaCO₃', explanation: 'Ca²⁺ + CO₃²⁻ → CaCO₃↓。', reactionId: 'caco3' },
  { id: 'f17', prompt: 'CaCO₃の沈殿は何色？', answer: '白色', explanation: '炭酸カルシウムは水に溶けにくい白色固体。', reactionId: 'caco3' },
  { id: 'f18', prompt: 'CaCO₃に塩酸を加えると何の気体が発生する？', answer: 'CO₂（二酸化炭素）', explanation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑。', reactionId: 'caco3' },
  { id: 'f19', prompt: 'BaCl₂とNa₂SO₄の反応で、水溶液中に残る傍観イオンは？', answer: 'Na⁺ と Cl⁻', explanation: 'Ba²⁺とSO₄²⁻が沈殿する。Na⁺とCl⁻は水溶液中に残る。', reactionId: 'baso4' },
  { id: 'f20', prompt: '沈殿反応のイオン反応式で、傍観イオンは書く？', answer: '書かない', explanation: '反応前後で変化しないイオンを省き、実際に変化する粒子を表す。', reactionId: 'agcl' }
];

export const quizzes: Quiz[] = [
  { id: 'q01', label: '色の確認', question: 'AgNO₃水溶液とNaCl水溶液を混ぜると、どんな沈殿が生じる？', options: ['白色のAgCl', '青白色のCu(OH)₂', '赤褐色のFe(OH)₃', '沈殿は生じない'], correctIndex: 0, explanation: 'Ag⁺ + Cl⁻ → AgCl↓。塩化銀は白色沈殿。', reactionId: 'agcl' },
  { id: 'q02', label: '粒子の理解', question: 'AgClが沈殿した後、主に水溶液中に残る傍観イオンの組は？', options: ['Ag⁺とCl⁻', 'Na⁺とNO₃⁻', 'Ag⁺とNO₃⁻', 'Na⁺とCl⁻'], correctIndex: 1, explanation: 'Ag⁺とCl⁻がAgClとして沈殿し、Na⁺とNO₃⁻が残る。', reactionId: 'agcl' },
  { id: 'q03', label: 'イオン反応式', question: 'BaSO₄が生成するときの正しいイオン反応式は？', options: ['Ba²⁺ + 2SO₄²⁻ → Ba(SO₄)₂', 'Ba⁺ + SO₄⁻ → BaSO₄', 'Ba²⁺ + SO₄²⁻ → BaSO₄↓', 'Ba²⁺ + 2Cl⁻ → BaCl₂↓'], correctIndex: 2, explanation: '電荷が打ち消し合う1:1の比でBaSO₄が生じる。', reactionId: 'baso4' },
  { id: 'q04', label: '色の確認', question: 'Cu²⁺を含む水溶液にNaOH水溶液を加えると、通常どんな沈殿が生じる？', options: ['黒色のCuO', '赤褐色のFe(OH)₃', '白色のAgCl', '青白色のCu(OH)₂'], correctIndex: 3, explanation: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓。青白色沈殿が生じる。', reactionId: 'cuoh2' },
  { id: 'q05', label: '係数', question: 'Cu²⁺ + □OH⁻ → Cu(OH)₂↓ の□に入る数は？', options: ['1', '2', '3', '4'], correctIndex: 1, explanation: 'Cu²⁺の電荷+2とOH⁻2個の電荷−2で中性になる。', reactionId: 'cuoh2' },
  { id: 'q06', label: '色の確認', question: 'Fe³⁺にOH⁻を加えると生じるFe(OH)₃の色は？', options: ['赤褐色', '緑白色', '青白色', '黒色'], correctIndex: 0, explanation: 'Fe(OH)₃は赤褐色、Fe(OH)₂は緑白色。', reactionId: 'feoh3' },
  { id: 'q07', label: '係数', question: 'Fe³⁺ + □OH⁻ → Fe(OH)₃↓ の□に入る数は？', options: ['1', '2', '4', '3'], correctIndex: 3, explanation: 'Fe³⁺1個に対してOH⁻が3個必要。', reactionId: 'feoh3' },
  { id: 'q08', label: '反応の予測', question: 'CaCl₂水溶液とNa₂CO₃水溶液を混ぜたときの生成物の沈殿は？', options: ['NaCl', 'CaCO₃', 'Ca(OH)₂', 'CO₂'], correctIndex: 1, explanation: 'Ca²⁺ + CO₃²⁻ → CaCO₃↓。白色沈殿が生じる。', reactionId: 'caco3' },
  { id: 'q09', label: '知識の応用', question: '白色のCaCO₃に希塩酸を加えた場合、主に何が観察される？', options: ['青白色に変わる', '赤褐色に変わる', 'CO₂が発生して固体が溶ける', '変化せず残る'], correctIndex: 2, explanation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑。', reactionId: 'caco3' },
  { id: 'q10', label: '知識の応用', question: '白色沈殿のうち、過剰のアンモニア水に溶けるものは？', options: ['AgCl', 'BaSO₄', 'CaCO₃', 'すべて'], correctIndex: 0, explanation: 'AgClは[Ag(NH₃)₂]⁺を形成して溶ける。', reactionId: 'agcl' },
  { id: 'q11', label: '反応の予測', question: 'Ba²⁺とSO₄²⁻を含む水溶液を混ぜたら、何色の沈殿ができる？', options: ['青白色', '赤褐色', '緑白色', '白色'], correctIndex: 3, explanation: 'BaSO₄は白色で、水や希酸に難溶。', reactionId: 'baso4' },
  { id: 'q12', label: '粒子の理解', question: '「傍観イオン」の説明として正しいものは？', options: ['必ず沈殿になるイオン', '反応の前後で化学的に変化せず水溶液中に残るイオン', '必ず気体になるイオン', '式の係数が0になるイオン'], correctIndex: 1, explanation: '正味のイオン反応式では、反応前後で変化しない傍観イオンを省く。', reactionId: 'agcl' }
];
