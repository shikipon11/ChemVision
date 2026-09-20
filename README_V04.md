# ChemVision v0.4 のGitHubへの追加方法

今回のZIPは**差分アップデート**です。v0.3の既存のファイルは削除しないでください。

1. ZIPを展開し、`src`の中の8ファイル（App.tsx / data.ts / expandedData.ts / ReactionNotebook.tsx / reaction-notebook.css / ScopeMap.tsx / scope-map.css / styles.css）を確認。
2. https://github.com/shikipon11/ChemVision/tree/main/src を開き、`Add file` → `Upload files`で8ファイルをまとめて選択し、`Commit changes`。既存5ファイルは更新、新規3ファイルは追加されます。
3. リポジトリ直下で`Add file` → `Create new file`。ファイル名を `scripts/check-content.cjs` にし、ZIP内の同名ファイルの内容をコピーして`Commit changes`。またはscriptsフォルダーをブラウザで作成してファイルをアップロード。
4. https://github.com/shikipon11/ChemVision/blob/main/package.json を開いて鉛筆マークで編集し、ZIP内の `package.json` の内容で置き換え、`Commit changes`。**最後にpackage.jsonを更新**すると、検証スクリプト未配置による一時的なビルド失敗を避けられます。
5. README.mdは任意で、ZIP内のREADME.mdで更新できます。
6. GitHub Actionsの `Deploy ChemVision` が成功したら https://shikipon11.github.io/ChemVision/ を開き、Ctrl+Shift+Rで更新。
7. メニューの「反応ノート」と「物質図鑑」「暗記カード」「確認問題」「全体マップ」を確認。

※ 現時点ではChatGPTからリポジトリに書き込む権限がないため、上記のGitHub操作が必要です。
※ 更新前の学習履歴は同じブラウザのlocalStorageで維持される構成です。別のブラウザ・端末に自動同期されません。
