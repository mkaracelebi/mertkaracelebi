// Fails if forbidden characters or words appear in the source or the built site.
// The forbidden words are stored as character codes so they never appear in this repo.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const decode = (codes) => String.fromCharCode(...codes);
const BANNED_WORDS = [
  [116, 97, 109, 101, 32, 105, 109, 112, 97, 108, 97],
  [105, 109, 112, 97, 108, 97],
  [99, 117, 114, 114, 101, 110, 116, 115],
  [108, 97, 116, 116, 105, 99, 101],
].map(decode);

const BANNED_CHARS = [
  [String.fromCharCode(0x2014), 'em dash'],
  [String.fromCharCode(0x2013), 'en dash'],
];

const ROOTS = ['src', 'public', 'scripts', 'dist', 'README.md', 'astro.config.mjs', 'wrangler.jsonc'];
const TEXT_EXT = new Set(['.astro', '.ts', '.js', '.mjs', '.css', '.html', '.md', '.json', '.jsonc', '.xml', '.txt', '.svg', '']);
const SKIP_DIRS = new Set(['node_modules', '.git', '_astro']);

const files = [];
const walk = (p) => {
  if (!existsSync(p)) return;
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const name of readdirSync(p)) if (!SKIP_DIRS.has(name)) walk(join(p, name));
  } else if (TEXT_EXT.has(extname(p)) || p.endsWith('_headers') || p.endsWith('_redirects')) {
    files.push(p);
  }
};
ROOTS.forEach(walk);
// Built JS and CSS bundles live in dist/_astro; scan those too.
if (existsSync('dist/_astro')) {
  for (const name of readdirSync('dist/_astro')) {
    if (/\.(js|css)$/.test(name)) files.push(join('dist/_astro', name));
  }
}

const problems = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lower = text.toLowerCase();
  for (const word of BANNED_WORDS) {
    let i = lower.indexOf(word);
    while (i !== -1) {
      const line = text.slice(0, i).split('\n').length;
      problems.push(`${file}:${line}  banned word #${BANNED_WORDS.indexOf(word) + 1}`);
      i = lower.indexOf(word, i + 1);
    }
  }
  for (const [ch, name] of BANNED_CHARS) {
    let i = text.indexOf(ch);
    while (i !== -1) {
      const line = text.slice(0, i).split('\n').length;
      problems.push(`${file}:${line}  ${name}`);
      i = text.indexOf(ch, i + 1);
    }
  }
}

if (problems.length) {
  console.error(`check-copy: ${problems.length} problem(s)\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`check-copy: ${files.length} files clean`);
