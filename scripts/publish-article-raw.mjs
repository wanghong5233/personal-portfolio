import fs from 'node:fs';
import path from 'node:path';

const contentDir = path.resolve('src/content/articles');
const publicDir = path.resolve('public/raw/articles');

fs.mkdirSync(publicDir, { recursive: true });

const existing = new Set(
  fs.readdirSync(publicDir).filter((name) => name.endsWith('.md')),
);

let copied = 0;
for (const name of fs.readdirSync(contentDir)) {
  if (!name.endsWith('.md')) continue;
  const from = path.join(contentDir, name);
  const to = path.join(publicDir, name);
  fs.copyFileSync(from, to);
  existing.delete(name);
  copied += 1;
}

for (const stale of existing) {
  fs.unlinkSync(path.join(publicDir, stale));
}

console.log(`published ${copied} raw article markdown file(s) → public/raw/articles`);
