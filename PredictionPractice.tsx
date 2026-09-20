import { useEffect, useState } from 'react';
import type { Reaction } from './data';

type Props = {
  reaction: Reaction;
  onReveal: () => void;
};

/** 反応を見る前に結果を予想する。実験の実施を促さない学習用機能。 */
export default function PredictionPractice({ reaction, onReveal }: Props) {
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [formulaVisible, setFormulaVisible] = useState(false);

  useEffect(() => {
    setAnswer('');
    setChecked(false);
    setFormulaVisible(false);
  }, [reaction.id]);

  const expected = reaction.observation;
  const choices = [
    '白色沈殿が生じる',
    '青白色沈殿が生じる',
    '赤褐色沈殿が生じる',
    '気体が発生する'
  ];
  const getChoice = (text: string): string => {
    if (text.includes('赤褐')) return choices[2];
    if (text.includes('青白') || text.includes('青色')) return choices[1];
    if (text.includes('白色')) return choices[0];
    if (text.includes('気体')) return choices[3];
    return expected;
  };
  const correct = getChoice(expected);

  return (
    <section className="prediction-practice" aria-label="反応結果の予想">
      <div className="eyebrow">PREDICT → OBSERVE → EXPLAIN</div>
      <h3>反応後には何が起こる？</h3>
      <p>{reaction.reagents[0]}と{reaction.reagents[1]}を混合した場合の観察結果を予想しよう。</p>
      <fieldset disabled={checked} className="prediction-choices">
        <legend className="small">結果を1つ選択</legend>
        {choices.map(choice => (
          <label key={choice} className="prediction-choice">
            <input type="radio" name={`prediction-${reaction.id}`} value={choice}
              checked={answer === choice} onChange={() => setAnswer(choice)} />
            <span>{choice}</span>
          </label>
        ))}
      </fieldset>
      {!checked ? (
        <button type="button" className="primary-button" disabled={!answer} onClick={() => setChecked(true)}>
          答え合わせ
        </button>
      ) : (
        <div className="prediction-feedback" role="status">
          <strong>{answer === correct ? '正解！' : `正解：${correct}`}</strong>
          <p>{reaction.why}</p>
          <button type="button" className="primary-button" onClick={onReveal}>
            アニメーションで確かめる →
          </button>{' '}
          <button type="button" className="text-button" onClick={() => setFormulaVisible(v => !v)}>
            {formulaVisible ? '反応式を隠す' : '反応式を表示'}
          </button>
          {formulaVisible && <p className="prediction-formula">{reaction.equation}<br />{reaction.ionicEquation}</p>}
          <button type="button" className="text-button" onClick={() => { setAnswer(''); setChecked(false); setFormulaVisible(false); }}>
            もう一度考える
          </button>
        </div>
      )}
    </section>
  );
}
