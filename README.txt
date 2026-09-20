ChemVision v0.2 予想クイズ追加パッチ

1. PredictionPractice.tsx を src/ に追加。
2. prediction.css を src/ に追加。
3. src/App.tsx の先頭付近に次を追加:
   import PredictionPractice from './PredictionPractice';
   import './prediction.css';
4. src/App.tsx の ReactionPage 関数内にある
   const [showAnswer, setShowAnswer] = useState(false);
   の次の行へ次を追加:
   const [predictionDone, setPredictionDone] = useState(false);
5. 同関数の useEffect(() => { setStep(0); ... }, [reaction.id]); の中に
   setPredictionDone(false); を追加。
6. 同関数の return <section className="reaction-detail"> 直後に次を挿入:
   {!predictionDone && <PredictionPractice reaction={reaction} onReveal={() => { setPredictionDone(true); setStep(0); setPlaying(true); }} />}

このパッチは反応の画面に予想問題を追加します。従来のアニメーションも引き続き利用可能です。
GitHubのsrc内に2ファイルをアップロードしたあと、App.tsxだけ上記の編集が必要です。
