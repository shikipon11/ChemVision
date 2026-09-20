// v0.4: 教材ID・参照先・選択問題・反応式の原子数をビルド前に検証する。
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = path.join(__dirname, '..', 'src');
const cache = new Map();
function load(name) {
  if (cache.has(name)) return cache.get(name);
  const file = path.join(source, name + '.ts');
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file, reportDiagnostics: true,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  });
  const problems = (output.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  if (problems.length) throw Error(`${name}: ${problems.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join(', ')}`);
  const exports = {};
  cache.set(name, exports);
  vm.runInNewContext(output.outputText, {exports, require: (request) => load(request.replace(/^\.\//, ''))}, {filename: file});
  return exports;
}
// TSX を含む、変更対象ファイルの構文診断。型検査・ビルドは tsc / Vite が担当。
for (const name of ['App.tsx','ScopeMap.tsx','ReactionNotebook.tsx','GasLab.tsx','gasData.ts','PredictionPractice.tsx','expandedData.ts','data.ts','scopeData.ts','main.tsx']) {
  const file = path.join(source,name);
  const o = ts.transpileModule(fs.readFileSync(file,'utf8'), {fileName:file,reportDiagnostics:true,compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}});
  const errors = (o.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) throw Error(`${name}: ${errors.map(d => ts.flattenDiagnosticMessageText(d.messageText,'; ')).join('\n')}`);
}
const fail = message => { throw new Error(message); };
function unique(items, label) {
  const seen = new Set();
  for (const item of items) { if (seen.has(item.id)) fail(`${label} のIDが重複: ${item.id}`); seen.add(item.id); }
  return seen;
}
const { reactions, substances, cards, quizzes } = load('data');
const { reactionNotes, extraCards, extraQuizzes, extraSubstances } = load('expandedData');
const { scopeChapters } = load('scopeData');
const subIds = unique(substances, '物質');
const reactionIds = unique(reactions, 'アニメーション');
const noteIds = unique(reactionNotes, '反応ノート');
unique(cards, '暗記カード'); unique(quizzes, '確認問題');
const lessonIds = unique(scopeChapters.flatMap(unit => unit.lessons), '学習テーマ');
const broken = [];
const { gasReactions, gasChoices } = load('gasData');
unique(gasReactions, '気体の生成アニメーション');
if (gasChoices.length !== 4 || new Set(gasChoices).size !== 4) fail('気体クイズの選択肢設定');
for (const gas of gasReactions) {
  if (!lessonIds.has(gas.lessonId)) broken.push(`気体反応 ${gas.id} → テーマ ${gas.lessonId}`);
  if (!gasChoices.includes(gas.gas.formula)) broken.push(`気体反応 ${gas.id}: 選択肢に正解がない`);
  if (gas.stages.length !== 3 || gas.stages.some(stage => !stage.trim())) broken.push(`気体反応 ${gas.id}: 段階説明の不備`);
  if (gas.noteId && !noteIds.has(gas.noteId)) broken.push(`気体反応 ${gas.id} → ノート ${gas.noteId}`);
  for (const id of gas.substanceIds) if (!subIds.has(id)) broken.push(`気体反応 ${gas.id} → 物質 ${id}`);
}

for (const r of reactions) for (const id of r.substanceIds) if (!subIds.has(id)) broken.push(`反応 ${r.id} → 物質 ${id}`);
for (const s of substances) for (const id of s.reactionIds) if (!reactionIds.has(id)) broken.push(`物質 ${s.id} → 反応 ${id}`);
for (const note of reactionNotes) {
  if (!lessonIds.has(note.lessonId)) broken.push(`ノート ${note.id} → テーマ ${note.lessonId}`);
  for (const id of note.substanceIds) if (!subIds.has(id)) broken.push(`ノート ${note.id} → 物質 ${id}`);
}
for (const lesson of scopeChapters.flatMap(unit => unit.lessons)) if (lesson.reactionId && !reactionIds.has(lesson.reactionId)) broken.push(`テーマ ${lesson.id} → アニメーション ${lesson.reactionId}`);
for (const card of cards) if (card.reactionId && !reactionIds.has(card.reactionId)) broken.push(`カード ${card.id} → アニメーション ${card.reactionId}`);
for (const quiz of quizzes) {
  if (quiz.reactionId && !reactionIds.has(quiz.reactionId)) broken.push(`問題 ${quiz.id} → アニメーション ${quiz.reactionId}`);
  if (quiz.options.length !== 4 || quiz.correctIndex < 0 || quiz.correctIndex >= quiz.options.length) broken.push(`問題 ${quiz.id}: 解答設定が不正`);
  if (new Set(quiz.options).size !== 4) broken.push(`問題 ${quiz.id}: 選択肢が重複`);
}
if (broken.length) fail(broken.join('\n'));
// 高校化学で一般的な分子式・イオン式に対応する簡易的な原子数検査（電荷・化学的妥当性は別途確認）。
const subscripts = '₀₁₂₃₄₅₆₇₈₉';
function formulaCounts(input) {
  const f = input.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻↑↓]/g, '').replace(/[₀-₉]/g, char => String(subscripts.indexOf(char)));
  const tokens = f.match(/[A-Z][a-z]?|\d+|[()[\]]/g) || [];
  if (!tokens.length || tokens.join('') !== f) throw Error(`式の解析対象外: ${input}`);
  let i = 0;
  const parse = closing => {
    const counts = {};
    while (i < tokens.length && tokens[i] !== closing) {
      if (tokens[i] === '(' || tokens[i] === '[') {
        const close = tokens[i++] === '(' ? ')' : ']';
        const inner = parse(close);
        if (tokens[i] !== close) throw Error(`括弧が不正: ${input}`);
        i++;
        const n = /^\d+$/.test(tokens[i] || '') ? Number(tokens[i++]) : 1;
        for (const [key, count] of Object.entries(inner)) counts[key] = (counts[key] || 0) + count * n;
      } else if (/^[A-Z][a-z]?$/.test(tokens[i])) {
        const key = tokens[i++];
        const n = /^\d+$/.test(tokens[i] || '') ? Number(tokens[i++]) : 1;
        counts[key] = (counts[key] || 0) + n;
      } else throw Error(`式の記号が不正: ${input}`);
    }
    return counts;
  };
  const counts = parse(null);
  if (i !== tokens.length) throw Error(`式の末尾が不正: ${input}`);
  return counts;
}
function sideCounts(side) {
  const counts = {};
  for (const term of side.split(' + ')) {
    const match = term.trim().match(/^(\d+)?(.+)$/);
    if (!match) fail(`反応物の解析失敗: ${term}`);
    const n = Number(match[1] || '1');
    for (const [elem, count] of Object.entries(formulaCounts(match[2].trim()))) counts[elem] = (counts[elem] || 0) + count * n;
  }
  return counts;
}
for (const gas of gasReactions) {
  const arrow = gas.equation.match(/ → /);
  if (!arrow) fail(`気体反応の矢印が不明: ${gas.id}`);
  const [left, right] = gas.equation.split(arrow[0]);
  if (JSON.stringify(Object.entries(sideCounts(left)).sort()) !== JSON.stringify(Object.entries(sideCounts(right)).sort())) fail(`気体反応の原子数が不一致: ${gas.id} ${gas.equation}`);
}
for (const note of reactionNotes) {
  const arrow = note.equation.match(/ → | ⇄ /);
  if (!arrow) fail(`矢印が不明: ${note.id}`);
  const [left, right] = note.equation.split(arrow[0]);
  if (JSON.stringify(Object.entries(sideCounts(left)).sort()) !== JSON.stringify(Object.entries(sideCounts(right)).sort())) fail(`原子数が不一致: ${note.id} ${note.equation}`);
}
console.log(`教材検証 OK: 物質 ${substances.length} (追加 ${extraSubstances.length}), アニメーション ${reactions.length}, 反応ノート ${reactionNotes.length}, 暗記カード ${cards.length} (追加 ${extraCards.length}), 確認問題 ${quizzes.length} (追加 ${extraQuizzes.length}), 学習テーマ ${lessonIds.size}, 気体の生成 ${gasReactions.length}`);
console.log('ID・参照・4択設定・反応ノート原子数チェック OK（物性・条件の正しさは別途確認が必要）');
