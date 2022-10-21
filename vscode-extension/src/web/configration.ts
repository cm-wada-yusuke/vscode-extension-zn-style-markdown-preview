import * as vscode from 'vscode';

export function getMarkdownToHTmlUrl(): string | null | undefined {
  return vscode.workspace
    .getConfiguration('zennStyleMarkdownPreview')
    .get('markdownToHtmlUrl');
}

export function getImageRootDir(): string {
  return (
    vscode.workspace
      .getConfiguration('zennStyleMarkdownPreview')
      .get('imageRootDir') || '/'
  );
}
