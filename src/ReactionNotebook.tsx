import { useEffect, useMemo, useState } from 'react';
import { reactionNotes } from './expandedData';
import { substances } from './data';
import './reaction-notebook.css';

const units = ['すべて', ...Array.from(new Set(reactionNotes.map(note => note.unit)))];
const normalize = (v: string) => v.toLowerCase().replace(/[₀-₉]/g, c => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c))).replace(/\s/g, '');

export default function ReactionNotebook({ selectedNote, openSubstance }: { selectedNote: string | null; openSubstance: (id: string) => void }) {
  const [chosen, setChosen] = useState<string | null>(selectedNote);
  const [query, setQuery] = useState('');
  const [unit, setUnit] = useState('すべて');
  const [hidden, setHidden] = useState(true);
  useEffect(() => { if (selectedNote) { setChosen(selectedNote); setHidden(true); } }, [selectedNote]);
  const selected = reactionNotes.find(note => note.id === chosen);
  const results = useMemo(() => reactionNotes.filter(note => (unit === 'すべて' || unit === note.unit)
    && normalize([note.title, note.equation, note.observation, note.reason, note.unit].join(' ')).includes(normalize(query))), [query, unit]);

  return <section className="note-view">
    <div className="page-heading"><div><div className="eyebrow">INORGANIC / REACTION NOTES</div><h1>反応ノート</h1><p className="text-muted">アニメーション未対応の反応も、反応式・観察結果・理由を対応づけて覚えよう。{reactionNotes.length}件。</p></div></div>
    {selected ? <>
      <button type="button" className="text-button back-button" onClick={() => { setChosen(null); setHidden(true); }}>← 反応ノート一覧に戻る</button>
      <article className="note-detail"><span className="badge badge-blue">{selected.unit} / 反応式・解説</span><h2>{selected.title}</h2>
        <div className="note-predict"><strong>まず結果を予想しよう</strong><p>何が生じる？ 反応式とその理由を思い出してみよう。</p><button className="primary-button" type="button" onClick={() => setHidden(v => !v)}>{hidden ? '答えを表示する' : '答えを隠す'}</button></div>
        {!hidden && <div className="note-answer" aria-live="polite"><span className="mini-label">反応式</span><div className="note-equation">{selected.equation}</div><h3>観察・生成物</h3><p>{selected.observation}</p><h3>なぜそうなる？</h3><p>{selected.reason}</p><h3>条件・注意</h3><p>{selected.conditions}</p></div>}
        <h3 className="section-subtitle">関連する物質</h3><div className="chip-row">{selected.substanceIds.map(id => { const s = substances.find(item => item.id === id); return s && <button key={id} type="button" className="substance-chip" onClick={() => openSubstance(id)}><strong>{s.formula}</strong><span>{s.name}</span><span aria-hidden="true">↗</span></button>; })}</div>
        <p className="model-note">このページは化学反応を学ぶための教材で、実験の操作手順や、粒子運動を実時間で再現するものではありません。</p>
      </article>
    </> : <>
      <label className="search-wrapper"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="反応式・物質名・観察結果で検索" aria-label="反応ノートを検索" /></label>
      <div className="note-unit-picker" role="group" aria-label="分野で絞り込む">{units.map(value => <button type="button" key={value} className={unit === value ? 'selected' : ''} onClick={() => setUnit(value)}>{value}</button>)}</div>
      <p className="results-line">{results.length}件の反応ノート / アニメーション対応5反応は「反応ライブラリ」で確認できるよ。</p>
      <div className="note-grid">{results.map(note => <button key={note.id} className="note-tile" type="button" onClick={() => { setChosen(note.id); setHidden(true); }}><span className="badge badge-blue">{note.unit}</span><strong>{note.title}</strong><span className="note-tile-eq">{note.equation}</span><small>解説・関連物質を見る ↗</small></button>)}</div>
      {!results.length && <p className="empty">該当する反応はありません。検索語を変えてみてね。</p>}
    </>}
  </section>;
}
