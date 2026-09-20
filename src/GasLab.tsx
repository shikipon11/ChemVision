import { useEffect, useMemo, useState } from 'react';
import { gasChoices, gasReactions } from './gasData';
import type { GasFormula, GasReaction } from './gasData';
import { substances } from './data';
import './gas-lab.css';

const names: Record<GasFormula, string> = {
  'CO₂': '二酸化炭素', 'H₂': '水素', 'NH₃': 'アンモニア', 'O₂': '酸素'
};
const atoms: Record<GasFormula, { symbol: string; dx: number; dy: number; color: string }[]> = {
  'CO₂': [{ symbol: 'O', dx: -19, dy: 0, color: '#fda4af' }, { symbol: 'C', dx: 0, dy: 0, color: '#93c5fd' }, { symbol: 'O', dx: 19, dy: 0, color: '#fda4af' }],
  'H₂': [{ symbol: 'H', dx: -10, dy: 0, color: '#e2e8f0' }, { symbol: 'H', dx: 10, dy: 0, color: '#e2e8f0' }],
  'NH₃': [{ symbol: 'N', dx: 0, dy: -8, color: '#a5b4fc' }, { symbol: 'H', dx: -17, dy: 11, color: '#e2e8f0' }, { symbol: 'H', dx: 17, dy: 11, color: '#e2e8f0' }, { symbol: 'H', dx: 0, dy: 18, color: '#e2e8f0' }],
  'O₂': [{ symbol: 'O', dx: -11, dy: 0, color: '#fda4af' }, { symbol: 'O', dx: 11, dy: 0, color: '#fda4af' }]
};

function Molecule({ formula, x, y, floating, index }: {
  formula: GasFormula; x: number; y: number; floating?: boolean; index: number;
}) {
  return <g className={floating ? 'gas-floating' : 'gas-molecule'} style={floating ? { animationDelay: `${index * -0.72}s` } : undefined}>
    <circle cx={x} cy={y} r="30" fill="#9ae6dd" fillOpacity=".08" stroke="#9ae6dd" strokeOpacity=".3" />
    {atoms[formula].map((atom, i) => <g key={i}>
      <circle cx={x + atom.dx} cy={y + atom.dy} r={atom.symbol === 'H' ? 8 : 11} fill={atom.color} stroke="#102438" strokeWidth="1" />
      <text x={x + atom.dx} y={y + atom.dy + 3.5} fontSize="10" fontWeight="800" textAnchor="middle" fill="#162538">{atom.symbol}</text>
    </g>)}
  </g>;
}

function GasDiagram({ reaction, stage }: { reaction: GasReaction; stage: number }) {
  const isSolid = reaction.visual === 'decomposition' || reaction.visual === 'carbonate';
  const hasMetal = reaction.visual === 'metal';
  return <div className="gas-visual-shell">
    <div className="gas-visual-heading"><span>粒子・生成物の模式図</span><span>0{stage + 1} / 03</span></div>
    <svg key={`${reaction.id}-${stage}`} role="img" aria-label={`${reaction.title}：${['反応前', '生成中', '反応後'][stage]}の学習用模式図`} viewBox="0 0 520 270" className="gas-svg">
      <defs><linearGradient id="gas-pool" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#186e94" stopOpacity=".45"/><stop offset="1" stopColor="#1b465e" stopOpacity=".85"/></linearGradient></defs>
      <rect width="520" height="270" rx="16" fill="#11243a"/>
      <path d="M81 43 V232 Q81 246 96 246 H424 Q439 246 439 232 V43" fill="none" stroke="#91c6d5" strokeWidth="3" strokeLinecap="round" />
      <path d="M84 126 H436 V231 Q436 243 423 243 H97 Q84 243 84 231 Z" fill="url(#gas-pool)" />
      <path d="M84 126 H436" stroke="#72c8df" strokeWidth="2" strokeOpacity=".75" />
      {isSolid && <g aria-hidden="true"><path d="M123 229 l30 -16 34 16 35 -19 32 19 35 -18 35 18 39 -13 37 13" fill="none" stroke="#b9cadb" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/></g>}
      {hasMetal && <g aria-hidden="true"><rect x="142" y="207" width="235" height="16" rx="4" fill="#94a3b8" stroke="#e2e8f0"/><text x="260" y="220" textAnchor="middle" fontSize="12" fontWeight="750" fill="#14283c">Zn</text></g>}
      {reaction.visual === 'aqueous' && <g aria-hidden="true"><circle cx="157" cy="193" r="17" fill="#6d74ae" opacity=".85"/><circle cx="254" cy="211" r="14" fill="#c8adc8" opacity=".9"/><circle cx="345" cy="182" r="17" fill="#6d74ae" opacity=".85"/></g>}
      {stage === 0 ? <>
        <text x="260" y="31" textAnchor="middle" fill="#b3d7e8" fontSize="12">反応前：反応物の種類を確認</text>
        <rect x="119" y="142" width="121" height="49" rx="9" fill="#d6f0eb" fillOpacity=".16" stroke="#6fd5c5" />
        <text x="179" y="171" textAnchor="middle" fill="#e1fcf4" fontSize="17" fontWeight="700">{reaction.reactants[0]}</text>
        {reaction.reactants[1] && <><text x="259" y="171" textAnchor="middle" fill="#aad2db" fontSize="20">+</text><rect x="282" y="142" width="121" height="49" rx="9" fill="#d6f0eb" fillOpacity=".16" stroke="#6fd5c5"/><text x="342" y="171" textAnchor="middle" fill="#e1fcf4" fontSize="17" fontWeight="700">{reaction.reactants[1]}</text></>}
      </> : stage === 1 ? <>
        <text x="260" y="31" textAnchor="middle" fill="#b3d7e8" fontSize="12">生成中：原子の組み合わせが変わる</text>
        {[142, 205, 284, 356].map((x, i) => <g key={i} className="gas-reacting"><circle cx={x} cy={i % 2 ? 158 : 195} r="18" fill={i % 2 ? '#fda4af' : '#93c5fd'} fillOpacity=".82"/><circle cx={x + 12} cy={i % 2 ? 168 : 184} r="12" fill="#b2f3e4" fillOpacity=".92" /></g>)}
        <text x="260" y="108" textAnchor="middle" fill="#dfecff" fontSize="12">反応の進行（実際の反応経路ではありません）</text>
      </> : <>
        <text x="260" y="31" textAnchor="middle" fill="#b3d7e8" fontSize="12">反応後：気体分子が生成</text>
        <Molecule formula={reaction.gas.formula} x={175} y={91} floating index={0}/>
        <Molecule formula={reaction.gas.formula} x={316} y={71} floating index={1}/>
        <Molecule formula={reaction.gas.formula} x={259} y={165} floating index={2}/>
        <text x="260" y="205" textAnchor="middle" fill="#e5fbf7" fontSize="13" fontWeight="750">{reaction.gas.formula} が生成</text>
      </>}
    </svg>
    <p className="gas-visual-caption">模式図の粒子の個数・配置・移動速度は実測値ではありません。気泡は気相の存在を示す記号です。</p>
  </div>;
}

export default function GasLab({ openSubstance, openNote }: {
  openSubstance: (id: string) => void; openNote: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [choice, setChoice] = useState<GasFormula | null>(null);
  const [checked, setChecked] = useState(false);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const selected = gasReactions.find(r => r.id === selectedId) ?? null;
  const filtered = useMemo(() => gasReactions.filter(r => [r.title, r.reactants.join(' '), r.gas.name, r.gas.formula].join(' ').toLowerCase().includes(query.trim().toLowerCase())), [query]);
  useEffect(() => { setChoice(null); setChecked(false); setStage(0); setPlaying(false); }, [selectedId]);
  useEffect(() => {
    if (!playing || stage >= 2) return;
    const delay = speed === 'slow' ? 3000 : speed === 'fast' ? 850 : 1650;
    const timer = window.setTimeout(() => setStage(prev => Math.min(2, prev + 1)), delay);
    return () => window.clearTimeout(timer);
  }, [playing, speed, stage]);
  useEffect(() => { if (stage === 2) setPlaying(false); }, [stage]);

  if (!selected) return <section className="gas-lab">
    <div className="page-heading"><div><div className="eyebrow">GAS FORMATION / PARTICLE MODEL</div><h1>気体の生成ラボ</h1><p className="text-muted">反応を予想し、分子の組み替わりを模式図で確認。沈殿反応とは異なる6つの例を学ぼう。</p></div></div>
    <label className="search-wrapper"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="反応物・気体名・化学式で検索" aria-label="気体の反応を検索"/></label>
    <p className="results-line">{filtered.length}件の反応 / 画面上の学習用シミュレーション</p>
    <div className="gas-reaction-grid">{filtered.map((reaction, index)=><button className="gas-reaction-tile" type="button" key={reaction.id} onClick={()=>setSelectedId(reaction.id)}>
      <span className="gas-tile-index">0{index+1} / 予測クイズとアニメーション</span><strong>{reaction.title}</strong><span className="gas-tile-reagents">反応物：{reaction.reactants.filter(Boolean).join(' ＋ ')}</span><span className="gas-tile-link">生成する気体を予想する →</span>
    </button>)}</div>
    {!filtered.length && <p className="empty">一致する反応がありません。</p>}
    <p className="model-note">本機能は化学反応を理解するための仮想教材です。実物の気体を発生させる手順は掲載していません。</p>
  </section>;

  return <section className="gas-lab gas-detail">
    <button type="button" className="text-button back-button" onClick={()=>setSelectedId(null)}>← 気体の反応一覧に戻る</button>
    <div className="eyebrow">GAS FORMATION / {gasReactions.findIndex(item=>item.id===selected.id)+1} / {gasReactions.length}</div>
    <h1>{selected.title}</h1>
    {!checked ? <div className="gas-quiz">
      <span className="badge badge-blue">STEP 1 / 予想する</span>
      <h2>どの気体が生成するだろう？</h2>
      <p>反応物：{selected.reactants.filter(Boolean).join(' ＋ ')}</p>
      <fieldset className="gas-choices"><legend>気体を1つ選択してね</legend>{gasChoices.map(formula=><label key={formula} className={`gas-choice ${choice === formula ? 'is-selected' : ''}`}><input type="radio" name="gas-choice" checked={choice===formula} onChange={()=>setChoice(formula)}/><strong>{formula}</strong><span>{names[formula]}</span></label>)}</fieldset>
      <button className="primary-button" type="button" disabled={!choice} onClick={()=>setChecked(true)}>回答する →</button>
    </div> : <>
      <div className={`gas-feedback ${choice===selected.gas.formula ? 'is-correct' : 'is-incorrect'}`} role="status"><strong>{choice===selected.gas.formula ? '正解！' : `正解は ${selected.gas.formula}（${selected.gas.name}）`}</strong><p>{selected.observation}</p><button type="button" className="text-button" onClick={()=>{setChecked(false);setChoice(null);setStage(0);setPlaying(false);}}>もう一度予想する ↺</button></div>
      <div className="gas-stage-heading"><span className="badge badge-blue">STEP 2 / 粒子モデルで確認</span><h2>反応前から生成後まで</h2></div>
      <GasDiagram reaction={selected} stage={stage}/>
      <div className="gas-controls"><div className="gas-stage-controls"><button type="button" className="icon-btn" aria-label="最初に戻す" onClick={()=>{setPlaying(false);setStage(0);}}>↺</button><button type="button" className="icon-btn" aria-label="前の段階" disabled={stage===0} onClick={()=>{setPlaying(false);setStage(s=>s-1);}}>‹</button><button type="button" className="primary-button" onClick={()=>{if(playing){setPlaying(false);}else{if(stage===2)setStage(0);setPlaying(true);}}}>{playing?'Ⅱ 一時停止':'▶ 再生'}</button><button type="button" className="icon-btn" aria-label="次の段階" disabled={stage===2} onClick={()=>{setPlaying(false);setStage(s=>s+1);}}>›</button></div><label>速度 <select value={speed} onChange={event=>setSpeed(event.target.value as 'slow'|'normal'|'fast')}><option value="slow">ゆっくり</option><option value="normal">ふつう</option><option value="fast">速く</option></select></label></div>
      <div className="gas-stage-tabs" role="group" aria-label="反応の段階">{['反応前','生成中','反応後'].map((label, i)=><button key={label} type="button" className={stage===i?'active':''} aria-pressed={stage===i} onClick={()=>{setPlaying(false);setStage(i);}}>{i+1}. {label}</button>)}</div>
      <div className="gas-stage-text"><strong>{['反応前','生成中','反応後'][stage]}</strong><p>{selected.stages[stage]}</p></div>
      <div className="gas-explanation"><span className="badge badge-blue">STEP 3 / 反応式と解説</span><h2>反応式を確認しよう</h2><p className="gas-equation">{selected.equation}</p>{selected.ionicEquation && <><h3>正味のイオン反応式</h3><p className="gas-equation gas-ionic">{selected.ionicEquation}</p></>}
        <h3>生成物の性質</h3><p>{selected.gas.formula}（{selected.gas.name}）：{selected.gas.property}</p><h3>なぜそうなる？</h3><p>{selected.explanation}</p><p className="gas-model-note">{selected.modelNote}</p></div>
      <div className="gas-related"><h3>関連する物質・反応</h3><div className="chip-row">{selected.substanceIds.map(id=>{const substance=substances.find(s=>s.id===id);return substance && <button key={id} type="button" className="substance-chip" onClick={()=>openSubstance(id)}><strong>{substance.formula}</strong><span>{substance.name}</span><span aria-hidden="true">↗</span></button>;})}</div>{selected.noteId && <button className="text-button" type="button" onClick={()=>openNote(selected.noteId!)}>関連する反応ノートも読む →</button>}</div>
      <p className="model-note">画面上の模式図は反応経路・粒子数・相平衡・気体の捕集方法を再現していません。実物の物質を使う操作は扱いません。</p>
    </>}
  </section>;
}
