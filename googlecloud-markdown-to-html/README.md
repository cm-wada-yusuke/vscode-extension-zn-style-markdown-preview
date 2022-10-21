# Zennスタイルの Markdown 変換API

[zenn-markdown-html](https://github.com/zenn-dev/zenn-editor/tree/canary/packages/zenn-markdown-html) をベースに Markdown をHTMLに変換するAPIを用意します。このAPIを VSCode 拡張から呼び出します。VSCode 拡張デフォルト設定では個人のAPIを利用しているため、可能な限りご自身の環境にデプロイしてご利用いただけると助かります。

# デプロイ方法

[Google Cloud CLI](https://cloud.google.com/sdk/docs/configurations?hl=ja) を使います。

## 前提

Cloud Functions をデプロイするための Google Cloud のプロジェクトを作成してください。

## gcloud コマンドのインストール

https://cloud.google.com/sdk/docs/downloads-interactive?hl=ja

環境にあわせてインストールします。私は M1 Mac で [インストーラ](https://cloud.google.com/sdk/docs/downloads-interactive?hl=ja)を使ってインストールしました。

## 利用するプロジェクトにあわせて設定

[こちら](https://cloud.google.com/sdk/docs/configurations?hl=ja#multiple_configurations) のページを参考にデプロイ先プロジェクトの設定を追加します。

### 設定例

```
gcloud config configurations create my-project
gcloud config configurations activate my-project
gcloud config set core/project my-project
gcloud config set core/project my-project
gcloud config set compute/region asia-northeast1
gcloud config set core/account myaccountxxxxxxxxxx@gmail.com
```

これで、利用するプロジェクトに認証した状態でコマンドを実行できるようになります。

## ビルド＆デプロイ

以下のように実行してください。

```
yarn build

gcloud auth login

# ログイン後
./deploy.sh
```

最初のデプロイでは、以下のようにPIを有効にするかどうか聞かれる場合があります。yでデプロイを進めてください。

```
API [cloudfunctions.googleapis.com] not enabled on project [0000000000]. Would you like to enable and retry (this will take a few minutes)? (y/N)?  y
```

デプロイするとURLが出力されます。そのURLを VSCode プラグインに設定することで利用できます。