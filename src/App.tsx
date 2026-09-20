import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { cards, quizzes, reactions, substances } from './data';
import type { Card, Ion, Quiz, Reaction,  } from './data';

type Screen = 'home' | 'reactions' | 'encyclopedia' | 'cards' | 'quiz';
type Rating = 'again' | 'hard' | 'good';
type LearningRecord = { rating: Rating; due: number; reviewedAt: number };
type StoredProgress = { cards: Record<string, LearningRecord>; quizBest: number | null; quizAttempts: number };

const STORAGE_KEY = 'chemvision-progress-v1';
const DEFAULT_PROGRESS: StoredProgress = { cards: {}, quizBest: null, quizAttempts: 0 };
const DAY = 24 * 60 * 60 * 1000;

function loadProgress(): StoredProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return DEFAULT_PROGRESS;
    const value = data as Partial<StoredProgress>;
    return {
      cards: value.cards && typeof value.cards === 'object' ? value.cards : {},
      quizBest: typeof value.quizBest === 'number' ? value.quizBest : null,
      quizAttempts: typeof value.quizAttempts === 'number' ? value.quizAttempts : 0
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

const normalizationMap: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5',
  '₆': '6', '₇': '7', '₈': '8', '₉': '9', '⁺': '+', '⁻': '-'
};
function normalizeQuery(value: string) {
  return value.toLowerCase().replace(/[₀-₉⁺⁻]/g, (char) => normalizationMap[char] ?? char)
    .replace(/[\s()（）・\-]/g, '');
}
function matchesQuery(value: string, query: string) {
  return normalizeQuery(value).includes(normalizeQuery(query));
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <div className="brand-mark" aria-hidden="true">
        <span className="orb orb-one" /><span className="orb orb-two" /><span className="orb orb-three" />
        <span className="orbit orbit-one" /><span className="orbit orbit-two" />
      </div>
      {!compact && <div><strong>Chem<span>Vision</span></strong><small>見て、考えて、覚える化学。</small></div>}
    </div>
  );
}

const navigation: { id: Screen; label: string; icon: string; short: string }[] = [
  { id: 'home', label: 'ホーム', icon: '⌂', short: 'ホーム' },
  { id: 'reactions', label: '反応ライブラリ', icon: '◉', short: '反応' },
  { id: 'encyclopedia', label: '物質図鑑', icon: '▦', short: '図鑑' },
  { id: 'cards', label: '暗記カード', icon: '▤', short: '暗記' },
  { id: 'quiz', label: '確認問題', icon: '✓', short: '問題' }
];

function Badge({ children, tone = 'mint' }: { children: React.ReactNode; tone?: 'mint' | 'blue' | 'amber' | 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
function SmallArrow() { return <span aria-hidden="true">↗</span>; }

function Particle({ ion, x, y, animated = false, delay = 0 }: { ion: Ion; x: number; y: number; animated?: boolean; delay?: number }) {
  const radius = ion.label.length >= 5 ? 24 : 22;
  return (
    <g className={animated ? 'floating-particle' : 'particle-enter'} style={{ '--drift-delay': `${delay * -0.31}s` } as CSSProperties}>
      <circle cx={x} cy={y} r={radius} fill={ion.color} fillOpacity="0.17" stroke={ion.color} strokeWidth="1.5" />
      <circle cx={x - radius * 0.27} cy={y - radius * 0.27} r="3" fill={ion.color} fillOpacity=".45" />
      <text x={x} y={y + 4} fill="#eef7ff" fontSize={ion.label.length >= 5 ? 11 : 13} fontWeight="650" textAnchor="middle">{ion.label}</text>
    </g>
  );
}
function expandIons(ions: Ion[]) {
  return ions.flatMap((ion) => Array.from({ length: ion.count }, (_, index) => ({ ...ion, key: `${ion.id}-${index}` })));
}
const pairPositions = [
  [75, 132], [147, 166], [119, 204], [66, 205], [155, 117], [112, 150], [65, 165], [164, 209]
];
const mergedPositions = [
  [84, 109], [160, 145], [249, 112], [355, 145], [437, 110], [102, 196],
  [208, 204], [313, 198], [412, 207], [155, 105], [284, 156], [385, 180],
  [57, 160], [456, 162], [241, 158], [350, 111]
];
const spectatorPositions = [[83, 115], [165, 100], [245, 123], [325, 100], [415, 116], [115, 169], [204, 155], [293, 161], [393, 166]];

function Beaker({ x, width, caption }: { x: number; width: number; caption?: string }) {
  return <g>
    <path d={`M${x} 76 V217 Q${x} 232 ${x + 17} 232 H${x + width - 17} Q${x + width} 232 ${x + width} 217 V76`} fill="#193f56" fillOpacity=".34" stroke="#7caabc" strokeWidth="2.2" strokeLinecap="round" />
    <path d={`M${x + 3} 115 H${x + width - 3} V215 Q${x + width - 3} 229 ${x + width - 17} 229 H${x + 17} Q${x + 3} 229 ${x + 3} 215 Z`} fill="#328ab1" fillOpacity=".15" />
    <path d={`M${x + 3} 115 H${x + width - 3}`} stroke="#86d6e8" strokeOpacity=".35" />
    {caption && <text x={x + width / 2} y="42" fill="#a6c3d5" textAnchor="middle" fontSize="13">{caption}</text>}
  </g>;
}

function ReactionDiagram({ reaction, step, showSpectators }: { reaction: Reaction; step: number; showSpectators: boolean }) {
  const left = expandIons(reaction.left);
  const right = expandIons(reaction.right);
  const all = [...left, ...right];
  const spectators = expandIons(reaction.spectators);
  const maskId = `water-${reaction.id}`;
  return <div className="diagram-shell">
    <div className="diagram-top"><span><span className="live-dot" /> 粒子モデル / 模式図</span><span className="diagram-step">{['01 反応前', '02 混合', '03 反応後'][step]}</span></div>
    <svg key={`${reaction.id}-${step}-${showSpectators}`} className="diagram" viewBox="0 0 520 265" role="img" aria-label={`${reaction.name}：${['2種類の水溶液の粒子','水溶液を混ぜた粒子','沈殿と水溶液中のイオン'][step]}を示す模式図`}>
      <defs>
        <linearGradient id={maskId} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#162f4b"/><stop offset="1" stopColor="#101d31"/></linearGradient>
      </defs>
      <rect x="0" y="0" width="520" height="265" rx="14" fill={`url(#${maskId})`} />
      {step === 0 ? <>
        <Beaker x={25} width={190} caption={reaction.reagents[0]} />
        <Beaker x={305} width={190} caption={reaction.reagents[1]} />
        <text x="260" y="171" textAnchor="middle" fontSize="26" fill="#84dac8">+</text>
        {left.map((part, i) => <Particle key={`left-${part.key}`} ion={part} x={pairPositions[i % pairPositions.length][0]} y={pairPositions[i % pairPositions.length][1]} delay={i} />)}
        {right.map((part, i) => <Particle key={`right-${part.key}`} ion={part} x={pairPositions[i % pairPositions.length][0] + 280} y={pairPositions[i % pairPositions.length][1]} delay={i} />)}
      </> : <>
        <Beaker x={25} width={470} />
        {step === 1 ? all.map((part, i) =>
          <Particle key={part.key + (i < left.length ? 'l' : 'r')} ion={part} x={mergedPositions[i][0]} y={mergedPositions[i][1]} animated delay={i} />
        ) : <>
          {showSpectators && spectators.map((part, i) => <Particle key={`spectator-${part.key}`} ion={part} x={spectatorPositions[i][0]} y={spectatorPositions[i][1]} delay={i} />)}
          {Array.from({ length: 9 }, (_, i) => {
            const x = 203 + (i % 3) * 56 + (Math.floor(i / 3) % 2) * 8;
            const y = 187 + Math.floor(i / 3) * 18;
            return <g key={i} className="particle-enter" style={{ animationDelay: `${i * 0.04}s` }}>
              <circle cx={x} cy={y} r="12" fill={reaction.product.color} stroke="#d3dce6" strokeWidth="1"/>
              <circle cx={x + 11} cy={y + 2} r="9" fill={reaction.product.color} fillOpacity=".82" stroke="#d3dce6" strokeWidth=".7"/>
            </g>;
          })}
          <text x="260" y="177" fontSize="12" textAnchor="middle" fill="#f0f6ff" fontWeight="700">{reaction.product.formula} ↓</text>
        </>}
      </>}
    </svg>
    <div className="diagram-bottom"><span>溶媒の水分子は省略</span><span>{step === 2 ? `${reaction.product.name}が沈殿` : '水溶液中のイオン'}</span></div>
  </div>;
}

function ReactionPage({ reaction, onOpenSubstance, onOpenCards }: {
  reaction: Reaction; onOpenSubstance: (id: string) => void; onOpenCards: () => void;
}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState('normal');
  const [showSpectators, setShowSpectators] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  useEffect(() => { setStep(0); setPlaying(false); setShowAnswer(false); setShowSpectators(true); }, [reaction.id]);
  useEffect(() => {
    if (!playing) return;
    if (step >= 2) { setPlaying(false); return; }
    const ms = speed === 'slow' ? 3000 : speed === 'fast' ? 950 : 1800;
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, 2)), ms);
    return () => window.clearTimeout(timer);
  }, [playing, step, speed]);
  return <section className="reaction-detail">
    <div className="section-eyebrow"><Badge>沈殿反応</Badge><span className="muted">REACTION / {reactions.findIndex((r) => r.id === reaction.id) + 1 < 10 ? '0' : ''}{reactions.findIndex((r) => r.id === reaction.id) + 1}</span></div>
    <h2>{reaction.name}</h2>
    <p className="text-muted intro">{reaction.reagents[0]}と{reaction.reagents[1]}を混ぜると、どうなるだろう？</p>
    <ReactionDiagram reaction={reaction} step={step} showSpectators={showSpectators} />
    <div className="play-controls">
      <div className="step-controls">
        <button className="icon-btn" type="button" aria-label="最初に戻る" onClick={() => { setPlaying(false); setStep(0); }}>↺</button>
        <button className="icon-btn" type="button" aria-label="前の段階へ" disabled={step === 0} onClick={() => { setPlaying(false); setStep((s) => s - 1); }}>‹</button>
        <button className="primary-button playback" type="button" onClick={() => {
          if (playing) setPlaying(false);
          else { if (step === 2) setStep(0); setPlaying(true); }
        }}>{playing ? 'Ⅱ 一時停止' : '▶ 再生'}</button>
        <button className="icon-btn" type="button" aria-label="次の段階へ" disabled={step === 2} onClick={() => { setPlaying(false); setStep((s) => s + 1); }}>›</button>
      </div>
      <label className="speed-label">速度 <select aria-label="再生速度" value={speed} onChange={(event) => setSpeed(event.target.value)}><option value="slow">0.5×</option><option value="normal">1×</option><option value="fast">2×</option></select></label>
    </div>
    <div className="steps" aria-label="反応の段階">
      {['反応前', '混合', '反応後'].map((label, index) => <button key={label} type="button" className={`step-pill ${step === index ? 'active' : ''}`} onClick={() => { setPlaying(false); setStep(index); }}><span>{index + 1}</span>{label}</button>)}
    </div>
    <div className="detail-callout"><div className="callout-number">0{step + 1}</div><div><strong>{['水溶液中で電離する', 'イオンが接触する', '難溶性の塩が沈殿する'][step]}</strong><p>{reaction.stages[step]}</p></div></div>
    {step === 2 && <label className="toggle-line"><input type="checkbox" checked={showSpectators} onChange={(event) => setShowSpectators(event.target.checked)} /> 傍観イオンも表示する</label>}
    <div className="equation-card">
      <div className="eq-heading"><strong>化学反応式</strong><Badge tone="blue">覚えよう</Badge></div>
      <p className="chemical-equation">{reaction.equation}</p>
      <div className="separator"/>
      <strong>正味のイオン反応式</strong>
      <p className="chemical-equation ionic">{reaction.ionicEquation}</p>
    </div>
    <div className="two-col">
      <div className="surface-card"><div className="mini-label">観察結果</div><strong>{reaction.observation}</strong><p>{reaction.why}</p></div>
      <div className="surface-card"><div className="mini-label">入試のチェックポイント</div><strong>{reaction.product.formula} の特徴</strong><p>{reaction.tips}</p></div>
    </div>
    <div className="predict-card">
      <div><span className="mini-label">セルフチェック</span><h3>今の反応を、何も見ずに説明できる？</h3><p>反応式を隠して、生成物の色とイオンの組を思い出してみよう。</p></div>
      <button type="button" className="secondary-button" onClick={() => setShowAnswer(!showAnswer)}>{showAnswer ? '答えを隠す' : '答えを確認'}</button>
      {showAnswer && <div className="answer-reveal">{reaction.product.name}（{reaction.product.formula}）：{reaction.observation} 正味のイオン反応式は {reaction.ionicEquation}</div>}
    </div>
    <div className="related-section"><h3>関連する物質</h3><div className="chip-row">{reaction.substanceIds.map((id) => { const sub = substances.find((s) => s.id === id); return sub && <button key={id} type="button" className="substance-chip" onClick={() => onOpenSubstance(id)}><strong>{sub.formula}</strong><span>{sub.name}</span><SmallArrow /></button>; })}</div></div>
    <button type="button" className="text-button" onClick={onOpenCards}>この反応の暗記カードを復習する →</button>
    <p className="model-note">※ このアニメーションは学習用の模式図です。イオンの実際の大きさ・数・速度、溶媒和や結晶形成の詳細を再現するものではありません。ビーカーの画像上で物質を混ぜるなどの実験操作を案内する機能はありません。</p>
  </section>;
}

function Library({ openSubstance, openReaction }: { openSubstance: string | null; openReaction: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('すべて');
  const [chosen, setChosen] = useState<string | null>(openSubstance);
  useEffect(() => { if (openSubstance) setChosen(openSubstance); }, [openSubstance]);
  const filters = ['すべて', '沈殿', '銀', '鉄', '銅', 'バリウム', 'カルシウム'];
  const results = substances.filter((s) => {
    const haystack = [s.name, s.formula, s.category, s.appearance, ...s.tags].join(' ');
    const matchFilter = filter === 'すべて' || (filter === '沈殿' ? s.appearance.includes('沈殿') : haystack.includes(filter));
    return matchFilter && (!query.trim() || matchesQuery(haystack, query));
  });
  const selected = substances.find((s) => s.id === chosen);
  return <section className="library-view">
    <div className="page-heading"><div><div className="eyebrow">ENCYCLOPEDIA</div><h1>物質図鑑</h1><p className="text-muted">化学式・物質名・性質から調べよう。{substances.length}種類の物質を収録。</p></div></div>
    <label className="search-wrapper"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setChosen(null); }} placeholder="例：AgCl、塩化銀、白色沈殿" aria-label="物質を検索" /></label>
    <div className="filter-row">{filters.map((f) => <button key={f} className={`filter-chip ${f === filter ? 'selected' : ''}`} type="button" onClick={() => { setFilter(f); setChosen(null); }}>{f}</button>)}</div>
    {selected ? <div className="substance-detail">
      <button className="text-button back-button" type="button" onClick={() => setChosen(null)}>← 図鑑の一覧に戻る</button>
      <div className="substance-hero"><div className="formula-tile">{selected.formula}</div><div><Badge tone="blue">{selected.category}</Badge><h2>{selected.name}</h2><div className="text-muted">{selected.formula}</div></div></div>
      <div className="property-grid"><div className="property"><span>外観・色</span><strong>{selected.appearance}</strong></div><div className="property"><span>溶解性</span><strong>{selected.solubility}</strong></div><div className="property full"><span>覚えるポイント</span><strong>{selected.fact}</strong></div></div>
      <h3 className="section-subtitle">関連する反応</h3><div className="stack-list">{selected.reactionIds.map((id) => { const r = reactions.find((entry) => entry.id === id); return r && <button type="button" className="list-row" key={id} onClick={() => openReaction(id)}><span><strong>{r.name}</strong><small>{r.equation}</small></span><SmallArrow /></button>; })}</div>
    </div> : <>
      <div className="results-line">{results.length}件の物質</div>
      <div className="substance-grid">{results.map((s) => <button type="button" key={s.id} className="substance-card" onClick={() => setChosen(s.id)}><span className="formula-large">{s.formula}</span><strong>{s.name}</strong><span className="substance-tagline">{s.appearance}</span><span className="substance-link">詳しく見る ↗</span></button>)}</div>
      {results.length === 0 && <div className="empty">該当する物質がありません。別の化学式や物質名で検索してみてね。</div>}
    </>}
  </section>;
}

function Flashcards({ progress, onRate, initialReaction, openReaction }: {
  progress: StoredProgress; onRate: (id: string, rating: Rating) => void; initialReaction: string | null; openReaction: (id: string) => void;
}) {
  const [mode, setMode] = useState<'all' | 'due' | 'weak'>('all');
  const [reactionFilter, setReactionFilter] = useState(initialReaction ?? 'all');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { if (initialReaction) { setReactionFilter(initialReaction); setMode('all'); setIndex(0); setFlipped(false); } }, [initialReaction]);
  const now = Date.now();
  const filtered = cards.filter((card) => {
    if (reactionFilter !== 'all' && card.reactionId !== reactionFilter) return false;
    const rating = progress.cards[card.id];
    return mode === 'all' || (mode === 'due' ? !rating || rating.due <= now : rating?.rating === 'again' || rating?.rating === 'hard');
  });
  const safeIndex = Math.min(index, Math.max(filtered.length - 1, 0));
  const current: Card | undefined = filtered[safeIndex];
  function move(next: number) { setIndex(next); setFlipped(false); }
  function rate(rating: Rating) {
    if (!current) return;
    const currentIndex = safeIndex;
    onRate(current.id, rating);
    setFlipped(false);
    const removedFromFilter = mode === 'due' || (mode === 'weak' && rating === 'good');
    if (currentIndex >= filtered.length - 1) setIndex(0);
    else setIndex(removedFromFilter ? currentIndex : currentIndex + 1);
  }
  return <section className="cards-view">
    <div className="page-heading"><div><div className="eyebrow">SPACED REPETITION</div><h1>暗記カード</h1><p className="text-muted">答えを思い出してから、カードを裏返そう。{cards.length}枚のカードを収録。</p></div></div>
    <div className="card-filters"><div className="segmented">{([['all', 'すべて'], ['due', '今日の復習'], ['weak', '苦手']] as const).map(([value, label]) => <button type="button" key={value} className={mode === value ? 'active' : ''} onClick={() => { setMode(value); move(0); }}>{label}</button>)}</div>
      <select aria-label="反応で絞り込む" value={reactionFilter} onChange={(event) => { setReactionFilter(event.target.value); move(0); }}><option value="all">すべての反応</option>{reactions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
    {current ? <>
      <div className="flash-head"><span>FLASHCARD / {String(safeIndex + 1).padStart(2, '0')}</span><span>{safeIndex + 1} / {filtered.length}</span></div>
      <button type="button" className={`flashcard ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped(!flipped)} aria-label={flipped ? '質問に戻る' : '答えを表示する'}>
        <span className="flash-watermark" aria-hidden="true">{flipped ? 'A' : 'Q'}</span>
        <span className="flash-label">{flipped ? 'ANSWER / 答え' : 'QUESTION / 問題'}</span>
        <span className="flash-main">{flipped ? current.answer : current.prompt}</span>
        {flipped && <span className="flash-explanation">{current.explanation}</span>}
        <span className="flash-foot">{flipped ? 'タップで問題に戻る' : 'タップで答えを見る'} ↗</span>
      </button>
      {flipped ? <div className="rating-row"><span>思い出せた？</span><div><button type="button" className="rating-again" onClick={() => rate('again')}>忘れた</button><button type="button" className="rating-hard" onClick={() => rate('hard')}>あやふや</button><button type="button" className="rating-good" onClick={() => rate('good')}>覚えた</button></div></div> : <div className="flash-navigation"><button className="secondary-button" type="button" disabled={safeIndex === 0} onClick={() => move(safeIndex - 1)}>← 前へ</button><button className="secondary-button" type="button" disabled={safeIndex >= filtered.length - 1} onClick={() => move(safeIndex + 1)}>次へ →</button></div>}
      {current.reactionId && <button className="text-button" type="button" onClick={() => openReaction(current.reactionId!)}>関連する反応アニメーションを見る →</button>}
    </> : <div className="empty"><h3>対象のカードはありません ✦</h3><p>条件を変えるか、復習日が来たらまた確認しよう。</p><button className="secondary-button" type="button" onClick={() => { setMode('all'); setReactionFilter('all'); move(0); }}>すべてのカードを見る</button></div>}
    <div className="guide-note">復習目安：「忘れた」は翌日、「あやふや」は3日後、「覚えた」は7日後に再出題。学習記録はこのブラウザ内に保存されるよ。</div>
  </section>;
}

function QuizPage({ onComplete, openReaction }: { onComplete: (score: number) => void; openReaction: (id: string) => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const current: Quiz = quizzes[index];
  function select(i: number) { if (selected !== null) return; setSelected(i); if (i === current.correctIndex) setScore((s) => s + 1); }
  function next() {
    if (index === quizzes.length - 1) { onComplete(score); setDone(true); }
    else { setIndex((i) => i + 1); setSelected(null); }
  }
  function restart() { setIndex(0); setSelected(null); setScore(0); setDone(false); }
  return <section className="quiz-view">
    <div className="page-heading"><div><div className="eyebrow">KNOWLEDGE CHECK</div><h1>確認問題</h1><p className="text-muted">粒子の動き・色・反応式を思い出してみよう。全{quizzes.length}問。</p></div></div>
    {done ? <div className="quiz-finish"><div className="finish-illustration">✓</div><Badge>学習完了</Badge><h2>おつかれさま！</h2><div className="score"><strong>{score}</strong><span> / {quizzes.length} 問正解</span></div><p>間違えた問題は、対応する反応や物質図鑑でもう一度確認しよう。</p><button className="primary-button" type="button" onClick={restart}>もう一度挑戦する ↗</button></div> : <>
      <div className="quiz-progress"><span>QUESTION {String(index + 1).padStart(2, '0')} / {String(quizzes.length).padStart(2, '0')}</span><span>{Math.round(index / quizzes.length * 100)}%</span></div>
      <div className="progress-track"><div style={{ width: `${((index + 1) / quizzes.length) * 100}%` }} /></div>
      <div className="quiz-card"><Badge tone="blue">{current.label}</Badge><h2>{current.question}</h2><div className="options">{current.options.map((option, i) => <button key={i} className={`option ${selected !== null && i === current.correctIndex ? 'correct' : ''} ${selected === i && i !== current.correctIndex ? 'incorrect' : ''}`} type="button" disabled={selected !== null} onClick={() => select(i)}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>{selected !== null && i === current.correctIndex && <span className="option-mark">✓</span>}</button>)}</div>
        {selected !== null && <div className={`quiz-feedback ${selected === current.correctIndex ? 'is-correct' : 'is-incorrect'}`} role="status"><strong>{selected === current.correctIndex ? '正解！' : 'ここを確認しよう'}</strong><p>{current.explanation}</p>{current.reactionId && <button type="button" className="text-button" onClick={() => openReaction(current.reactionId!)}>この反応をアニメーションで見る →</button>}</div>}
        <div className="quiz-actions"><span>現在の正解数：{score}問</span><button className="primary-button" type="button" disabled={selected === null} onClick={next}>{index === quizzes.length - 1 ? '結果を見る' : '次の問題へ →'}</button></div>
      </div>
    </>}
  </section>;
}

function Home({ progress, goTo, openReaction }: { progress: StoredProgress; goTo: (screen: Screen) => void; openReaction: (id: string) => void }) {
  const learned = cards.filter((card) => progress.cards[card.id]?.rating === 'good').length;
  const reviewed = cards.filter((card) => progress.cards[card.id]).length;
  const due = cards.filter((card) => !progress.cards[card.id] || progress.cards[card.id].due <= Date.now()).length;
  return <section className="home-view">
    <div className="eyebrow">WELCOME TO CHEMVISION / 0.1</div>
    <div className="hero"><div className="hero-copy"><Badge>無機化学・沈殿反応編</Badge><h1>化学は、<br /><em>見えると変わる。</em></h1><p>目に見えないイオンの動きを、目に見える理解へ。反応を観察し、物質を調べ、思い出して覚えよう。</p><button type="button" className="primary-button hero-button" onClick={() => openReaction('agcl')}>反応を見てみる <SmallArrow /></button></div>
      <div className="hero-art" aria-hidden="true"><div className="hero-orbit hero-orbit-one"/><div className="hero-orbit hero-orbit-two"/><div className="hero-atom hero-atom-one">Ag⁺</div><div className="hero-atom hero-atom-two">Cl⁻</div><div className="hero-atom hero-atom-three">Na⁺</div><div className="hero-center">AgCl<small>↓</small></div><span className="hero-art-label">PARTICLE MODEL / 01</span></div></div>
    <div className="dashboard-heading"><div><div className="eyebrow">LEARNING OVERVIEW</div><h2>今日の学習</h2></div><span className="text-muted small">学習状況はこの端末に保存</span></div>
    <div className="stats"><button className="stat-card" type="button" onClick={() => goTo('cards')}><span>復習できるカード</span><strong>{due}<small> / {cards.length}</small></strong><span className="stat-caption">カードを開く ↗</span></button><button className="stat-card" type="button" onClick={() => goTo('cards')}><span>学習したカード</span><strong>{reviewed}<small> / {cards.length}</small></strong><span className="stat-caption">うち「覚えた」{learned}枚</span></button><button className="stat-card" type="button" onClick={() => goTo('quiz')}><span>確認問題の最高記録</span><strong>{progress.quizBest === null ? '—' : progress.quizBest}<small> / {quizzes.length}</small></strong><span className="stat-caption">{progress.quizAttempts}回挑戦</span></button></div>
    <div className="dashboard-heading second-heading"><div><div className="eyebrow">EXPLORE</div><h2>学習を始める</h2></div></div>
    <div className="feature-grid"><button className="feature-card feature-reaction" type="button" onClick={() => goTo('reactions')}><span className="feature-icon">◉</span><strong>反応ライブラリ</strong><p>イオンが結晶を作る様子を、段階的にアニメーションで確認。</p><span>5種類の反応を収録 <SmallArrow /></span></button><button className="feature-card feature-dictionary" type="button" onClick={() => goTo('encyclopedia')}><span className="feature-icon">▦</span><strong>物質図鑑</strong><p>化学式・色・性質を関連づけて検索。反応にも移動できる。</p><span>{substances.length}種類の物質を収録 <SmallArrow /></span></button><button className="feature-card feature-memory" type="button" onClick={() => goTo('cards')}><span className="feature-icon">▤</span><strong>暗記カード</strong><p>覚えているか確認しよう。理解度に合わせて復習日を設定。</p><span>{cards.length}枚の暗記カード <SmallArrow /></span></button></div>
    <div className="dashboard-heading second-heading"><div><div className="eyebrow">START HERE</div><h2>最初に見てほしい反応</h2></div><button className="text-button" type="button" onClick={() => goTo('reactions')}>すべて見る →</button></div>
    <div className="reaction-preview-grid">{reactions.slice(0, 3).map((r, i) => <button type="button" className="reaction-preview" key={r.id} onClick={() => openReaction(r.id)}><span className="preview-index">0{i + 1} / PRECIPITATION</span><span className="preview-crystal" style={{ '--crystal-color': r.product.color } as CSSProperties}><span /><span /><span /><span /></span><strong>{r.name}</strong><span className="preview-equation">{r.ionicEquation}</span><SmallArrow /></button>)}</div>
  </section>;
}

function ReactionsView({ activeReaction, openSubstance, goToCards }: {
  activeReaction: string | null; openSubstance: (id: string) => void; goToCards: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(activeReaction);
  const [query, setQuery] = useState('');
  useEffect(() => { if (activeReaction) setSelected(activeReaction); }, [activeReaction]);
  const reaction = reactions.find((r) => r.id === selected);
  if (reaction) return <section><button className="text-button back-button" type="button" onClick={() => setSelected(null)}>← 反応一覧に戻る</button><ReactionPage reaction={reaction} onOpenSubstance={openSubstance} onOpenCards={() => goToCards(reaction.id)} /></section>;
  const results = reactions.filter((r) => !query.trim() || matchesQuery([r.name, r.equation, r.ionicEquation, r.observation, r.product.formula, r.reagents.join(' ')].join(' '), query));
  return <section className="reactions-view"><div className="page-heading"><div><div className="eyebrow">REACTION LIBRARY</div><h1>反応ライブラリ</h1><p className="text-muted">物質の変化を粒子の視点で見てみよう。{reactions.length}種類の反応を収録。</p></div></div>
    <label className="search-wrapper"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="反応名・化学式・生成物で検索" aria-label="反応を検索" /></label>
    <div className="results-line">{results.length}件の反応 / 沈殿反応</div>
    <div className="reaction-list">{results.map((r, index) => <button type="button" className="reaction-list-item" key={r.id} onClick={() => setSelected(r.id)}><span className="reaction-index">{String(index + 1).padStart(2, '0')}</span><span className="reaction-swatch" style={{ '--crystal-color': r.product.color } as CSSProperties}><span /><span /><span /></span><span className="reaction-info"><Badge tone="blue">沈殿反応</Badge><strong>{r.name}</strong><small>{r.ionicEquation}</small><span>{r.observation}</span></span><span className="reaction-action">見る ↗</span></button>)}</div>
    {results.length === 0 && <div className="empty">その検索条件に一致する反応はありません。</div>}
  </section>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [selectedSubstance, setSelectedSubstance] = useState<string | null>(null);
  const [selectedCardReaction, setSelectedCardReaction] = useState<string | null>(null);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);
  useEffect(() => { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* ブラウザで保存を許可していない場合も学習できる */ } }, [progress]);
  function navigate(next: Screen) { setScreen(next); setSelectedReaction(null); setSelectedSubstance(null); setSelectedCardReaction(null); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function openReaction(id: string) { setSelectedReaction(id); setSelectedSubstance(null); setSelectedCardReaction(null); setScreen('reactions'); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function openSubstance(id: string) { setSelectedSubstance(id); setSelectedReaction(null); setSelectedCardReaction(null); setScreen('encyclopedia'); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function openCards(id: string) { setSelectedCardReaction(id); setSelectedReaction(null); setScreen('cards'); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function rateCard(id: string, rating: Rating) { const days = rating === 'again' ? 1 : rating === 'hard' ? 3 : 7; setProgress((old) => ({ ...old, cards: { ...old.cards, [id]: { rating, due: Date.now() + days * DAY, reviewedAt: Date.now() } } })); }
  function completeQuiz(score: number) { setProgress((old) => ({ ...old, quizBest: Math.max(old.quizBest ?? 0, score), quizAttempts: old.quizAttempts + 1 })); }
  const pageTitle = useMemo(() => navigation.find((n) => n.id === screen)?.label ?? '', [screen]);
  return <div className="app-shell"><aside className="sidebar"><Brand/><div className="sidebar-divider"/><div className="sidebar-label">NAVIGATION</div><nav className="side-nav" aria-label="メインナビゲーション">{navigation.map((item) => <button key={item.id} type="button" onClick={() => navigate(item.id)} className={`nav-link ${screen === item.id ? 'active' : ''}`} aria-current={screen === item.id ? 'page' : undefined}><span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>{screen === item.id && <span className="nav-indicator"/>}</button>)}</nav><div className="sidebar-bottom"><div className="sidebar-note"><span className="status-dot"/>CHEMVISION / v0.1</div><p>無機化学・沈殿反応を<br/>少しずつ理解しよう。</p></div></aside>
    <div className="main-column"><header className="topbar"><div className="topbar-mobile-brand"><Brand compact/><strong>ChemVision</strong></div><div className="topbar-breadcrumb">CHEMVISION <span>/</span> {pageTitle}</div><div className="topbar-status"><span className="status-dot"/> 学習モード <span className="topbar-v">v0.1</span></div></header><main className="main-content">
      {screen === 'home' && <Home progress={progress} goTo={navigate} openReaction={openReaction}/>}
      {screen === 'reactions' && <ReactionsView activeReaction={selectedReaction} openSubstance={openSubstance} goToCards={openCards}/>}
      {screen === 'encyclopedia' && <Library openSubstance={selectedSubstance} openReaction={openReaction}/>}
      {screen === 'cards' && <Flashcards progress={progress} onRate={rateCard} initialReaction={selectedCardReaction} openReaction={openReaction}/>}
      {screen === 'quiz' && <QuizPage onComplete={completeQuiz} openReaction={openReaction}/>}
    </main><footer className="footer">ChemVision v0.1 <span>·</span> 化学の粒子表現は教育用の模式図です。</footer></div>
    <nav className="mobile-nav" aria-label="モバイルナビゲーション">{navigation.map((item) => <button key={item.id} type="button" onClick={() => navigate(item.id)} className={screen === item.id ? 'active' : ''} aria-current={screen === item.id ? 'page' : undefined}><span aria-hidden="true">{item.icon}</span><small>{item.short}</small></button>)}</nav>
  </div>;
}
