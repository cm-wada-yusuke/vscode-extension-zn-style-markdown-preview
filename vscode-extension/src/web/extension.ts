/*
The MIT License (MIT)

Copyright (c) 2022 waddy.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getMarkdownToHTmlUrl } from './configration';
import { PreviewPanel } from './preview-panel';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'zenn-style-markdown-preview.show',
    async () => {
      // URLがセットされていなければ終了
      if (!getMarkdownToHTmlUrl()) {
        vscode.window.showErrorMessage(
          '拡張機能を利用するには、設定で変換URLを指定してください。',
        );
        return;
      }

      // URLがデフォルトの場合はコメントを出す
      if (
        getMarkdownToHTmlUrl() ===
        'https://asia-northeast1-parity-box.cloudfunctions.net/zennStyleMarkdownToHtml'
      ) {
        vscode.window.showInformationMessage(
          'デフォルトの変換URLは、予告なく停止する場合があります。',
        );
      }

      // プレビューパネルを作成
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        // アクティブなエディターがない場合はエラーメッセージを表示して終了
        vscode.window.showErrorMessage(
          'Markdownエディターをアクティブにしてください',
        );
        return;
      }
      const panel = PreviewPanel.createOrShow(
        context.extensionUri,
        activeEditor,
      );

      // アクティブなエディタでテキストがセーブされたとき更新するイベントリスナ
      vscode.workspace.onDidSaveTextDocument(async event => {
        if (
          panel.textEditor === activeEditor &&
          event === activeEditor.document
        ) {
          await panel.update();
        }
      });

      // アクティブなエディタが閉じられたときにパネルも閉じるイベントリスナ
      vscode.workspace.onDidCloseTextDocument(async event => {
        if (
          panel.textEditor === activeEditor &&
          event === activeEditor.document
        ) {
          panel.dispose();
        }
      });
    },
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
