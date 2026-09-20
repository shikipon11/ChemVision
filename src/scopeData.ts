/** ChemVisionの編集用カリキュラム索引。公式文書の逐語的な写しではありません。 */
export type ScopeLesson = {
  id: string;
  title: string;
  focus: string[];
  visual: string;
  /** ready は現行アプリの対応アニメーションへリンクできる項目のみ */
  status: 'ready' | 'planned';
  reactionId?: string;
};
export type ScopeChapter = {
  id: string;
  title: string;
  description: string;
  lessons: ScopeLesson[];
};

const planned = (id: string, title: string, focus: string[], visual: string): ScopeLesson =>
  ({ id, title, focus, visual, status: 'planned' });
const ready = (id: string, title: string, reactionId: string, focus: string[], visual: string): ScopeLesson =>
  ({ id, title, reactionId, focus, visual, status: 'ready' });

export const scopeChapters: ScopeChapter[] = [
  {
    id: 'nonmetals', title: '非金属元素とその化合物',
    description: '単体の性質、代表的な化合物、同族元素の規則性を関連づける。',
    lessons: [
      planned('hydrogen', '水素', ['単体と水素化物の性質', '水への溶解性と反応性の比較'], '分子モデルと結合の比較'),
      planned('noble-gases', '貴ガス', ['He・Ne・Arの性質', '電子配置と化学的安定性'], '電子配置の模式図'),
      planned('halogens', 'ハロゲン単体', ['F₂・Cl₂・Br₂・I₂の性質', '酸化力と周期表の関係'], '周期表と電子授受のモデル'),
      planned('halides', 'ハロゲン化物', ['ハロゲン化水素の性質', 'ハロゲン化物イオンの識別'], 'イオンと沈殿の比較'),
      planned('oxygen-ozone', '酸素とオゾン', ['同素体と分子構造', '酸化作用との関係'], 'O₂とO₃の分子モデル'),
      planned('sulfur', '硫黄と硫黄酸化物', ['硫黄の単体と化合物', '酸化数の変化'], '電子授受の模式図'),
      planned('sulfates', '硫酸塩と硫酸の性質', ['硫酸イオンの識別', '代表的な硫酸塩の溶解性'], 'イオン組合せの比較'),
      planned('nitrogen', '窒素とアンモニア', ['窒素・アンモニアの性質', 'アンモニウムイオンとの関係'], '分子・イオンの対応図'),
      planned('nitric-acid', '窒素酸化物と硝酸塩', ['窒素の酸化数', '代表的な硝酸塩の性質'], '酸化数の変化を示す図'),
      planned('phosphorus', 'リンとリン酸塩', ['リンの同素体', 'リン酸とリン酸塩の基本的な性質'], '構造とイオンの模式図'),
      planned('carbon', '炭素と炭酸塩', ['炭素の同素体', 'CO・CO₂と炭酸塩の性質'], '分子・結晶の比較図'),
      planned('silicon', 'ケイ素と二酸化ケイ素', ['ケイ素の性質', 'SiO₂の構造とガラスの特徴'], '共有結合の網目構造の模式図')
    ]
  },
  {
    id: 'main-metals', title: '典型金属元素',
    description: '周期表上の位置と金属の性質、代表的なイオン・塩の特徴を整理する。',
    lessons: [
      planned('alkali', 'アルカリ金属', ['Li・Na・Kの共通性と違い', '典型的なイオンと化合物'], '最外殻電子の比較'),
      planned('alkaline-earth', 'アルカリ土類金属', ['Mg・Ca・Baの性質', '水酸化物と塩の溶解性'], '2価陽イオンの模式図'),
      planned('aluminium', 'アルミニウム', ['酸化物・水酸化物の性質', '両性の考え方'], '水溶液中のイオン変化'),
      planned('tin-lead', 'スズと鉛', ['代表的な酸化数', '単体・化合物の性質'], '酸化数を比較する図'),
      planned('flame', '炎色反応', ['特徴的な炎の色', '元素の識別と発光の考え方'], '発光色の見本と電子準位の模式図'),
      planned('metal-trends', '金属の反応性と周期性', ['イオン化傾向との関連', '酸化還元との関連'], '電子を失う様子の模式図')
    ]
  },
  {
    id: 'other-metals', title: '遷移元素などの金属',
    description: '高校化学で扱う代表的な金属と、そのイオン・酸化数・化合物を比較する。',
    lessons: [
      planned('iron', '鉄と鉄イオン', ['Fe²⁺・Fe³⁺の違い', '酸化数と沈殿の色'], '酸化数と水溶液中の粒子の比較'),
      planned('copper', '銅と銅イオン', ['銅の単体と化合物', 'Cu²⁺の性質と色'], '銅イオンと錯イオンの模式図'),
      planned('silver', '銀と銀イオン', ['銀の化合物と光への性質', 'Ag⁺とハロゲン化物イオン'], '沈殿と溶解の比較'),
      planned('zinc', '亜鉛と亜鉛イオン', ['亜鉛化合物の性質', '両性水酸化物と錯イオン'], 'イオン種の変化を示す図'),
      planned('chromium', 'クロムの化合物', ['代表的な酸化数', 'クロム酸イオンと二クロム酸イオン'], 'イオンの組成と色の比較'),
      planned('manganese', 'マンガンの化合物', ['代表的な酸化数', '過マンガン酸イオンの性質'], '電子授受と色の変化の模式図')
    ]
  },
  {
    id: 'ions', title: '沈殿・錯イオン・金属イオンの識別',
    description: '反応の観察結果を、イオンの組合せ・電荷・溶解性と結び付ける。',
    lessons: [
      ready('silver-chloride', '塩化銀の生成', 'agcl', ['Ag⁺とCl⁻の組合せ', '白色沈殿と傍観イオン'], '既存の沈殿アニメーション'),
      ready('barium-sulfate', '硫酸バリウムの生成', 'baso4', ['Ba²⁺とSO₄²⁻の組合せ', '白色沈殿の性質'], '既存の沈殿アニメーション'),
      ready('copper-hydroxide', '水酸化銅(II)の生成', 'cuoh2', ['Cu²⁺とOH⁻の組合せ', '青白色沈殿と係数'], '既存の沈殿アニメーション'),
      ready('iron-hydroxide', '水酸化鉄(III)の生成', 'feoh3', ['Fe³⁺とOH⁻の組合せ', '赤褐色沈殿と係数'], '既存の沈殿アニメーション'),
      ready('calcium-carbonate', '炭酸カルシウムの生成', 'caco3', ['Ca²⁺とCO₃²⁻の組合せ', '白色沈殿の性質'], '既存の沈殿アニメーション'),
      planned('sulfides', '硫化物の沈殿', ['代表的な硫化物の色', '金属イオンと溶解性の関係'], '沈殿色を比較する模式図'),
      planned('complexes', '錯イオンの形成', ['配位結合と錯イオン', '沈殿の溶解や色の変化'], '粒子モデルによる錯体の模式図'),
      planned('amphoteric', '両性水酸化物', ['Al・Znなどの水酸化物', '条件による存在形態の違い'], 'イオン種の変化を比較する図'),
      planned('separation', '金属イオンの系統分離', ['複数のイオンの識別', '観察結果から存在するイオンを推定'], '判別フローチャート')
    ]
  },
  {
    id: 'gases', title: '気体の性質と識別',
    description: '気体の性質と関連するイオン・分子を、暗記と粒子モデルで整理する。',
    lessons: [
      planned('gas-properties', '代表的な気体の特徴', ['水への溶解性・密度・色', '分子式と性質の対応'], '気体の性質の比較表'),
      planned('gas-carbon', '二酸化炭素と炭酸塩', ['CO₂と炭酸塩の関係', 'イオンと分子の変化'], '炭酸イオンと分子の模式図'),
      planned('gas-ammonia', 'アンモニアとアンモニウム', ['NH₃の基本的な性質', 'NH₄⁺との関係'], '分子とイオンの粒子モデル'),
      planned('gas-oxygen', '酸素と酸化還元', ['O₂の基本的な性質', '酸化反応における電子の変化'], '酸化還元の模式図'),
      planned('gas-halogen', 'ハロゲン関連の気体', ['代表的なハロゲン関連気体の性質', '物質とイオンの違い'], '粒子構造の比較図')
    ]
  },
  {
    id: 'industry', title: '無機工業・材料と応用',
    description: '工業的な物質の利用と、構造・性質の関係を概念的に理解する。',
    lessons: [
      planned('industrial-ammonia', 'アンモニアの工業的利用', ['窒素化合物との関連', '反応の平衡という考え方'], '反応物と生成物の関係図'),
      planned('industrial-acids', '代表的な無機酸の工業', ['硫酸・硝酸の利用と性質', '原料・製品の関係の概観'], '物質どうしの関係マップ'),
      planned('industrial-sodium', 'ナトリウム化合物の工業', ['炭酸ナトリウムと水酸化ナトリウム', '化合物の性質と用途'], '化合物の関係マップ'),
      planned('industrial-metals', '金属材料の製造と利用', ['鉄・アルミニウム・銅の性質と用途', '酸化還元と材料の関係'], '金属の性質の比較図'),
      planned('industrial-silicates', 'ガラス・セラミックス', ['結晶・非晶質の構造', '材料と性質の関係'], '固体構造の比較模式図'),
      planned('industrial-environment', '無機物質と環境・生活', ['代表的な無機物質の用途', '性質に応じた利用'], '性質・用途の対応マップ')
    ]
  }
];
