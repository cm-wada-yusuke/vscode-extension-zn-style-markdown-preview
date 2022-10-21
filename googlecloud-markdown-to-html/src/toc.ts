import * as cheerio from 'cheerio';

type Toc = {
  text: string;
  id: string;
  level: number;
  children: Toc[];
};

export function parseToc(html: string): Toc[] {
  const $ = cheerio.load(html);
  const headings = $('body > h1, body > h2, body > h3').toArray();
  const headingsToc = headings.map(heading => ({
    level: parseInt(heading.name.slice(1), 10),
    text: $(heading).text().replace(/\x08/g, '').trim(),
    id: heading.attribs.id,
    children: [],
  }));

  return headingsToc.reduce((acc: Toc[], current: Toc): Toc[] => {
    let array = acc;
    do {
      if (
        array.length === 0 ||
        array[array.length - 1].level >= current.level
      ) {
        break;
      }

      array = array[array.length - 1].children;
    } while (true);

    array.push(current);
    return acc;
  }, []);
}
