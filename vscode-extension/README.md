# zenn-style-markdown-preview README

Zenn スタイルの Markdown をプレビューする非公式の拡張です。ディレクトリの構成は問わず、VS Code 上アクティブな Markdown エディタに反応し、プレビュー画面を表示します。zenn-cli や Node.js は必要ありません。`github.dev`などのブラウザ環境でも動作します。変換APIのデフォルトURLは個人でデプロイしたものを利用しており、予告なく停止する場合があります。設定でご自身がデプロイしたURLに置換できます。

![](https://storage.googleapis.com/parity-box-assets/images/ipad_image.png)

## Features

コマンドパレットから `Show zenn-style-markdown document` を選択します。サイドパネルにプレビューが表示されます。

## Extension Settings

- `zennStyleMarkdownPreview.markdownToHtmlUrl`: Markdown を HTML に変換する API の URL です。デフォルトは作者の API を指定していますが、ご自身でデプロイしていただけるととても助かります
- `zennStyleMarkdownPreview.imageRootDir`: 画像のパスに`/images`を使っている場合、プレビュー表示するためのルートを指定できます。VS Code のワークスペースなどで画像のフォルダとプロジェクトのルートが一致しない場合に指定する使い方を想定しています

## Markdown to HTML API

Google Cloud の Cloud Functions へデプロイできます。ソースコードと手順を公開していますのでぜひデプロイしてご利用ください。

https://github.com/cm-wada-yusuke/vscode-extension-zn-style-markdown-preview/tree/main/googlecloud-markdown-to-html

## Known Issues

スクロール同期は未実装です。

## LICENSE

MIT