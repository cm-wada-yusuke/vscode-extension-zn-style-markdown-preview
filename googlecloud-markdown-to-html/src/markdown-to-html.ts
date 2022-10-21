import type { Request, Response } from 'express';
import markdownToHtml from 'zenn-markdown-html';
import { parseToc } from './toc';
import * as matter from 'gray-matter';

export function zennStyleMarkdownToHtml(req: Request, res: Response) {
  try {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(403).send({ message: 'Invalid Method' });
      return;
    }

    const markdown = req.body.markdown;

    if (typeof markdown !== 'string') {
      res.status(400).send({ message: 'マークダウンが含まれていません' });
      return;
    }

    const { data, content } = matter(markdown);

    const html = markdownToHtml(content);

    // パラメータ指定で tocEnabled: true のときだけ目次生成を実行するように
    const tocEnabled = req.body.tocEnabled;
    const toc = tocEnabled ? parseToc(html) : [];

    res.json({ data, html, toc });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
