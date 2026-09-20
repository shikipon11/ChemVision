# ChemVision v0.5 — 気体の生成 / バージョン表示修正版

既存の v0.4 の GitHub リポジトリに重ねるための**差分更新**です。ZIPの内容を `src` フォルダーに丸ごとコピーせず、以下の3段階でGitHubに追加します。既存のファイルは削除しません。

## 変更点

- `src/GasLab.tsx` / `src/gasData.ts` / `src/gas-lab.css`：気体の生成6反応（CO₂ 3例、H₂、NH₃、O₂）、4択予想、3段階の学習用粒子模式図、再生・一時停止・速度変更、反応式・解説、図鑑と反応ノートへのリンク。
- `src/App.tsx`：新メニュー「気体の生成」、ホーム画面からの導線を追加。`WELCOME TO CHEMVISION / 0.2`をはじめ、サイドバー・画面上部・フッターの古いバージョン表記を`package.json`と連動させた。
- `src/ScopeMap.tsx`：水素、二酸化炭素、アンモニア、酸素の対象テーマから気体の生成ラボへ移動できるようにした。
- `src/styles.css`：ホームの4つの機能カードとモバイルナビゲーションを調整。
- `scripts/check-content.cjs`：気体の反応データのID、教材リンク、クイズ選択肢、反応式の原子数を検証対象に追加。
- `package.json`：バージョン番号を `0.5.0` に更新。

## GitHubでの導入手順（VS Code不要）

1. **まず、`src`に6ファイルをアップロードする。** https://github.com/shikipon11/ChemVision/tree/main/src を開き、「Add file」→「Upload files」。このZIPの`src/`内にある **`App.tsx`, `ScopeMap.tsx`, `styles.css`, `GasLab.tsx`, `gasData.ts`, `gas-lab.css`** を選ぶ。「Commit changes」で `main` に保存。元からある`src/data.ts`などを消さない。
2. **次に、検証スクリプトを更新する。** https://github.com/shikipon11/ChemVision/blob/main/scripts/check-content.cjs を開き、鉛筆マークから編集。ZIP内の`scripts/check-content.cjs`の中身を**全て**コピーして既存の内容を置き換え、「Commit changes」。中身が空にならないよう、保存後にファイルの内容を確認する。
3. **最後に、`package.json`を更新する。** https://github.com/shikipon11/ChemVision/blob/main/package.json を開き、鉛筆マークからZIP内の`package.json`の内容で置き換え、「Commit changes」。最後に更新することで、追加ファイルがない状態でビルドが走るのを避けやすくする。
4. https://github.com/shikipon11/ChemVision/actions で一番新しい「Deploy ChemVision」が成功したのを確認してから、 https://shikipon11.github.io/ChemVision/ を開く。古い表示なら `Ctrl + Shift + R` で再読み込み。

## 動作確認

- ホームの見出しが `WELCOME TO CHEMVISION / 0.5.0`、画面上部・サイドバー・フッターも `v0.5.0` に変わっている。
- 「気体の生成」→「炭酸カルシウムと酸」→「CO₂」→「回答する」で反応式と3段階の模式図が表示される。`▶ 再生`・一時停止・段階ボタンが使える。
- 「亜鉛と酸」を開くと生成気体は H₂、「アンモニウムイオンと塩基」では NH₃、「過酸化水素の分解」では O₂ を確認できる。
- 「無機化学の全体マップ」→「気体」関連テーマで気体アニメーションへのリンクが表示される。
- 既存の「沈殿反応」「反応ノート」「物質図鑑」「暗記カード」「確認問題」も開け、学習履歴が残っていることを確認する。

## 注意

このアニメーションは化学式・反応前後の分子を理解するための概念図であり、分子数の定量比・粒子運動・実験操作・実際の反応経路を再現したものではありません。新しい6反応以外を含め、高校化学の全範囲を収録した状態ではありません。GitHub Pages上の実動作はアップロード後の確認が必要です。
