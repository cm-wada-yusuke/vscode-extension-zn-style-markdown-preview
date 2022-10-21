import * as vscode from 'vscode';
import { getImageRootDir, getMarkdownToHTmlUrl } from './configration';

export class PreviewPanel {
  public static currentPanel: PreviewPanel | undefined;
  public static readonly viewType = 'zenn-preview';
  public readonly textEditor: vscode.TextEditor;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private readonly _css: vscode.Uri;
  private readonly _script: vscode.Uri;
  private readonly _markdownToHtmlUrl: string;
  private readonly _imageRootDir: string;
  private _disposables: vscode.Disposable[] = [];
  private _content: string = '';

  public static createOrShow(
    extensionUri: vscode.Uri,
    textEditor: vscode.TextEditor,
  ) {
    if (this.currentPanel && this.currentPanel.textEditor === textEditor) {
      return this.currentPanel;
    }
    this.currentPanel = new PreviewPanel(extensionUri, textEditor);
    return this.currentPanel;
  }

  constructor(extensionUri: vscode.Uri, textEditor: vscode.TextEditor) {
    this.textEditor = textEditor;
    const filePath = textEditor.document.fileName;
    this._panel = vscode.window.createWebviewPanel(
      PreviewPanel.viewType,
      `Zenn style Preview ${filePath.substring(filePath.lastIndexOf('/') + 1)}`,
      vscode.ViewColumn.Beside,
      // Webviewからメッセージを送るには`enableScripts`を`true`にしておく
      { enableScripts: true },
    );
    this._extensionUri = extensionUri;

    // ローカルリソースのURIは`webview.asWebviewUri`で変換する
    this._css = this._panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist/web/index.css'),
    );

    this._script = this._panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist/web/extension.js'),
    );

    this._markdownToHtmlUrl = getMarkdownToHTmlUrl()!;
    this._imageRootDir = getImageRootDir();

    // Set the webview's initial html content
    this.update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'alert':
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this._disposables,
    );
  }

  async update() {
    const markdown = this.textEditor.document.getText();
    console.log({ markdown });
    const res = await fetch(this._markdownToHtmlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown }),
    });
    if (res.status !== 200) {
      throw new Error(
        `Markdown変換に失敗しました: ${res.status} ${res.statusText}`,
      );
    }
    const body = JSON.parse(await res.text());
    const data = body.data;
    const markdownHtml = body.html;
    console.log({ markdownHtml });
    this._content = `
    <!DOCTYPE html>
    <html lang="jp">
      <head>
        <title>Preview</title>
        <style>
          :root {
            background-color: #fff;
          }
          body {
            color: unset;
          }
          blockquote {
            background: unset;
            border-color: unset;
          }
          code {
            color: unset;
          }
          div.znc {
            margin-top: 32px;
          }
        </style>
        <link rel="stylesheet" href=${this._css}>
        <script src="https://embed.zenn.studio/js/listen-embed-event.js"></script>
        <script>
        const vscode = acquireVsCodeApi();
        const previousState = vscode.getState();
    
        window.onload = function() {
          let scrollPositionY = window.scrollY;
    
          //stateにスクロール位置が残っていればそれを使う
          if(previousState && previousState.scrollPositionY){
            scrollPositionX = previousState.scrollPositionY;
          }
          window.scroll(0, scrollPositionY);
        };
    
        //スクロール位置を保存する
        window.onscroll = () => {
          const scrollPositionY = window.scrollY;
          vscode.setState({ scrollPositionY });
        };
        </script>
      </head>
      <body>
        <div id="markdown-data" class="data">
          <h1>${data.title}</h1>
        </div>
        <div id="zenn-markdown-html" class="znc">
          ${markdownHtml}
        </div>
        <script defer src="${this._script}"></script>
      </body>
    </html>
    `;
    this._panel.webview.html = this._transformLocalImage(this._content);
  }

  open() {
    this._panel.reveal();
  }

  dispose() {
    this._panel.dispose();
  }

  private _transformLocalImage(html: string): string {
    const imgPattern = /<img\s[^>]*src="(\/images\/[^"]+)"[^>]*>/gm;
    const root = vscode.workspace.workspaceFolders?.[0].uri;
    const matches = [...html.matchAll(imgPattern)];
    const srcList = [...new Set(matches.map(([, url]) => url))];

    if (!root || !srcList.length) {
      return html;
    }

    // img タグの src を変換する
    const newHtml = srcList.reduce((htmlText, src) => {
      const imageRoot = vscode.Uri.joinPath(root, this._imageRootDir);
      const imageUri = vscode.Uri.joinPath(imageRoot, src);
      const url = this._panel.webview.asWebviewUri(imageUri);

      return htmlText.replace(
        new RegExp(`(<img\\s[^>]*src=")/images/[^"]+("[^>]*>)`),
        `$1${url}$2`,
      );
    }, html);

    return newHtml;
  }
}
