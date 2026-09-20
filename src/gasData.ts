/** 気体の生成：画面上の概念モデル。実験の実施方法・量・装置・条件は収録しない。 */
export type GasFormula = 'CO₂' | 'H₂' | 'NH₃' | 'O₂';
export type GasVisual = 'carbonate' | 'metal' | 'aqueous' | 'decomposition';
export type GasReaction = {
  id: string;
  title: string;
  lessonId: string;
  reactants: [string, string?];
  equation: string;
  ionicEquation?: string;
  gas: { formula: GasFormula; name: string; property: string };
  visual: GasVisual;
  stages: [string, string, string];
  observation: string;
  explanation: string;
  modelNote: string;
  substanceIds: string[];
  noteId?: string;
};
export const gasChoices: GasFormula[] = ['CO₂', 'H₂', 'NH₃', 'O₂'];
export const gasReactions: GasReaction[] = [
  {
    id: 'gas-caco3', title: '炭酸カルシウムと酸', lessonId: 'gas-carbon',
    reactants: ['CaCO₃', 'HCl'], equation: 'CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O',
    ionicEquation: 'CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O',
    gas: { formula: 'CO₂', name: '二酸化炭素', property: '無色の気体。石灰水を白く濁らせる。' },
    visual: 'carbonate',
    stages: ['炭酸カルシウムと酸が反応する前の状態を模式的に表しています。','炭酸塩の成分が酸と反応し、二酸化炭素と水になる過程を総括的に表します。','二酸化炭素が気体として現れます。液中には生成した塩などが残ります。'],
    observation: '気泡が生じ、二酸化炭素が発生する。',
    explanation: '炭酸塩は酸と反応すると、二酸化炭素と水を生じます。式の左右でCa・C・O・H・Clの原子数は一致します。',
    modelNote: '正味のイオン反応式は炭酸塩と酸の変化を表す概念式です。図は実際の溶解・表面反応を再現しません。',
    substanceIds: ['calcium-carbonate', 'carbon-dioxide'], noteId: 'r-carbonate-acid'
  },
  {
    id: 'gas-nahco3', title: '炭酸水素ナトリウムと酸', lessonId: 'gas-carbon',
    reactants: ['NaHCO₃', 'HCl'], equation: 'NaHCO₃ + HCl → NaCl + CO₂↑ + H₂O',
    ionicEquation: 'HCO₃⁻ + H⁺ → CO₂↑ + H₂O',
    gas: { formula: 'CO₂', name: '二酸化炭素', property: '炭酸塩と酸の場合と同じ気体が生じる。' },
    visual: 'carbonate',
    stages: ['炭酸水素ナトリウムと酸の反応前を表します。','炭酸水素イオンがH⁺と反応する変化を総括的に表します。','二酸化炭素と水が生じ、ナトリウム塩が液中に残ります。'],
    observation: '気泡が生じ、二酸化炭素が発生する。',
    explanation: '炭酸水素イオンも酸と反応するとCO₂を生じます。炭酸イオンの反応と、必要なH⁺の数を比べてみよう。',
    modelNote: '反応式は物質全体の変化を表す総括式です。水溶液中の個々の衝突の順序は示していません。',
    substanceIds: ['sodium-hydrogen-carbonate', 'carbon-dioxide']
  },
  {
    id: 'gas-zinc', title: '亜鉛と酸', lessonId: 'hydrogen',
    reactants: ['Zn', 'HCl'], equation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
    ionicEquation: 'Zn + 2H⁺ → Zn²⁺ + H₂↑',
    gas: { formula: 'H₂', name: '水素', property: '無色・無臭で、空気より軽い気体。' },
    visual: 'metal',
    stages: ['亜鉛と酸の反応前を表します。','Znが電子を放出してZn²⁺になり、H⁺が電子を受け取る変化を模式化します。','水素分子H₂が生じ、亜鉛はイオンとして液中に移ります。'],
    observation: '気泡が生じ、水素が発生する。',
    explanation: 'Zn → Zn²⁺ + 2e⁻ と 2H⁺ + 2e⁻ → H₂ を組み合わせた酸化還元反応です。',
    modelNote: '電子授受は別の概念として解説しています。粒子の動線は実際の金属表面の反応機構を示すものではありません。',
    substanceIds: ['zinc', 'hydrogen']
  },
  {
    id: 'gas-ammonia', title: 'アンモニウムイオンと塩基', lessonId: 'gas-ammonia',
    reactants: ['NH₄Cl', 'NaOH'], equation: 'NH₄Cl + NaOH → NH₃↑ + NaCl + H₂O',
    ionicEquation: 'NH₄⁺ + OH⁻ → NH₃ + H₂O',
    gas: { formula: 'NH₃', name: 'アンモニア', property: '無色で刺激臭があり、水に非常によく溶ける気体。' },
    visual: 'aqueous',
    stages: ['アンモニウムイオンと水酸化物イオンを考えます。','NH₄⁺がH⁺を失い、OH⁻と水を生じる変化を模式化します。','NH₃分子が生じます。水に溶けやすく、条件によって気体として現れます。'],
    observation: '条件によってアンモニアが気体として生じる。',
    explanation: 'NH₄⁺はH⁺を与える酸、OH⁻はH⁺を受け取る塩基として働きます。反応式中のN・H・Oの原子数を確かめよう。',
    modelNote: 'NH₃は水に非常によく溶けるため、「生成した分子がすべて直ちに気泡になる」わけではありません。図は概念上の生成と気相への移動を区別しています。',
    substanceIds: ['ammonium-ion', 'ammonia'], noteId: 'r-ammonium-alkali'
  },
  {
    id: 'gas-peroxide', title: '過酸化水素の分解', lessonId: 'gas-oxygen',
    reactants: ['H₂O₂'], equation: '2H₂O₂ → 2H₂O + O₂↑',
    gas: { formula: 'O₂', name: '酸素', property: '無色・無臭で、燃焼を助ける気体。' },
    visual: 'decomposition',
    stages: ['過酸化水素の分子から始めます。','分解によって水分子と酸素分子が生じる総括的な変化を表します。','酸素分子が気体として現れ、水が生成物として残ります。'],
    observation: '酸素が生じ、条件によって気泡として現れる。',
    explanation: '分解反応では、1種類の反応物から複数の生成物が生じます。O原子は反応前4個、反応後も4個です。',
    modelNote: '触媒や実際の反応経路は図示していません。反応式と粒子の絵は量的関係を厳密な縮尺で示すものではありません。',
    substanceIds: ['oxygen']
  },
  {
    id: 'gas-bicarbonate', title: '炭酸水素ナトリウムの分解', lessonId: 'gas-carbon',
    reactants: ['NaHCO₃'], equation: '2NaHCO₃ → Na₂CO₃ + CO₂↑ + H₂O',
    gas: { formula: 'CO₂', name: '二酸化炭素', property: '炭酸塩の分解でも二酸化炭素が生成する。' },
    visual: 'decomposition',
    stages: ['炭酸水素ナトリウムから始めます。','分解により炭酸ナトリウム・水・二酸化炭素になる変化を総括的に表します。','二酸化炭素が気体として現れ、炭酸ナトリウムなどが生成します。'],
    observation: '分解により二酸化炭素が生成する。',
    explanation: '反応物が1種類でも、分解によって気体が生じる例です。炭酸塩と酸の反応との違いも確認しよう。',
    modelNote: '総括式を模式化しています。固体中の結晶構造や反応の進行順序は再現していません。',
    substanceIds: ['sodium-hydrogen-carbonate', 'sodium-carbonate', 'carbon-dioxide'], noteId: 'r-bicarbonate'
  }
];
