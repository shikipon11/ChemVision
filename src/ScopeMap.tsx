import { useMemo, useState } from 'react';
import { scopeChapters } from './scopeData';
import type { ScopeLesson } from './scopeData';
import './scope-map.css';

export default function ScopeMap({ openReaction }: { openReaction: (id: string) => void }) {
  const [chapterId, setChapterId] = useState(scopeChapters[0].id);
  const [term, setTerm] = useState('');
  const [status, setStatus] = useState<'all' | 'ready' | 'planned'>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const all = useMemo(() => scopeChapters.flatMap(chapter => chapter.lessons), []);
  const totalReady = all.filter(item => item.status === 'ready').length;
  const chapter = scopeChapters.find(item => item.id === chapterId) ?? scopeChapters[0];
  const query = term.trim().toLowerCase();
  const matches = (lesson: ScopeLesson) => (!query || [lesson.title, ...lesson.focus, lesson.visual].join(' ').toLowerCase().includes(query))
    && (status === 'all' || lesson.status === status);
  const visible = query ? scopeChapters.flatMap(item => item.lessons.filter(matches).map(lesson => ({ lesson, chapter: item.title })))
    : chapter.lessons.filter(matches).map(lesson => ({ lesson, chapter: chapter.title }));
  const active = all.find(item => item.id === activeId) ?? null;

  return <section className="scope-map">
    <div className="scope-intro">
      <span className="eyebrow">INORGANIC CHEMISTRY / LEARNING ROADMAP</span>
      <h1>無機化学の全体マップ</h1>
      <p>高校化学で学ぶ代表的な項目を、物質・反応・覚えること・可視化の案に分けて整理しました。気になるテーマを選んで、学習内容を確認しよう。</p>
      <div className="scope-summary">
        <div><small>整理したテーマ</small><strong>{all.length}</strong></div>
        <div><small>学習できる反応</small><strong>{totalReady}</strong></div>
        <div><small>これから追加</small><strong>{all.length - totalReady}</strong></div>
      </div>
      <p className="scope-disclaimer">これは開発用の学習マップです。すべてのテーマの教材が完成しているわけではなく、公式の学習指導要領の項目をそのまま再現した一覧でもありません。</p>
    </div>
    <div className="scope-filters">
      <label>テーマを検索<input type="search" value={term} onChange={event => { setTerm(event.target.value); setActiveId(null); }} placeholder="例：塩化銀、ハロゲン、錯イオン" /></label>
      <label>収録状態<select value={status} onChange={event => { setStatus(event.target.value as 'all' | 'ready' | 'planned'); setActiveId(null); }}><option value="all">すべて</option><option value="ready">アニメーションあり</option><option value="planned">追加予定</option></select></label>
    </div>
    {!query && <div className="scope-chapters" role="group" aria-label="単元を選ぶ">{scopeChapters.map(item =>
      <button type="button" key={item.id} onClick={() => { setChapterId(item.id); setActiveId(null); }} className={item.id === chapter.id ? 'selected' : ''} aria-pressed={item.id === chapter.id}>{item.title}<small>{item.lessons.length}テーマ</small></button>
    )}</div>}
    <div className="scope-section-heading"><div><h2>{query ? '検索結果' : chapter.title}</h2><p>{query ? `「${term}」に一致する項目` : chapter.description}</p></div><span>{visible.length}件</span></div>
    <div className="scope-lessons">{visible.map(({ lesson, chapter: group }) =>
      <button type="button" key={lesson.id} className={active?.id === lesson.id ? 'scope-lesson is-active' : 'scope-lesson'} onClick={() => setActiveId(lesson.id)} aria-pressed={active?.id === lesson.id}>
        <span className="scope-lesson-title">{lesson.title}</span><span className="scope-lesson-sub">{group}</span>
        <span className={lesson.status === 'ready' ? 'scope-state ready' : 'scope-state'}>{lesson.status === 'ready' ? 'アニメーションあり' : '追加予定'}</span>
      </button>
    )}</div>
    {visible.length === 0 && <p className="scope-empty">一致するテーマは見つかりませんでした。検索語や収録状態を変更してみてね。</p>}
    {active && <div className="scope-detail" aria-live="polite"><div className="scope-detail-head"><div><span className="eyebrow">LEARNING CONTENT</span><h2>{active.title}</h2></div><button type="button" aria-label="詳細を閉じる" onClick={() => setActiveId(null)}>閉じる ×</button></div>
      <h3>覚える・理解すること</h3><ul>{active.focus.map(item => <li key={item}>{item}</li>)}</ul>
      <h3>可視化の内容</h3><p>{active.visual}</p>
      {active.reactionId ? <button type="button" className="primary-button" onClick={() => openReaction(active.reactionId!)}>反応アニメーションを開く ↗</button>
        : <p className="scope-planned-note">この項目の図鑑・アニメーション・問題は、今後のバージョンで追加予定です。</p>}
    </div>}
    <p className="scope-source">参考：文部科学省「高等学校学習指導要領解説 理科編 理数編」（2018年告示、2023年公開版）。2年以上前の資料です。最新の実施要項や教材と照合しながら内容を更新します。</p>
  </section>;
}
