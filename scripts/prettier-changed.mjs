import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const mode = process.argv[2];
if (mode !== 'check' && mode !== 'write') {
  console.error('Usage: node scripts/prettier-changed.mjs <check|write>');
  process.exit(1);
}

const PRETTIER_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.yml',
  '.yaml',
  '.css',
  '.html'
]);

const readGit = (args) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
};

const candidateBaseRefs = [
  process.env.FORMAT_BASE_REF,
  'main',
  process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : null,
  'origin/main'
].filter((value) => Boolean(value));

let mergeBase = null;
for (const ref of candidateBaseRefs) {
  const resolved = readGit(['merge-base', 'HEAD', ref]);
  if (resolved) {
    mergeBase = resolved;
    break;
  }
}

if (!mergeBase) {
  mergeBase = readGit(['rev-parse', 'HEAD~1']) ?? 'HEAD';
}

const branchChanged = mergeBase
  ? (readGit(
      mergeBase === 'HEAD'
        ? ['show', '--pretty=', '--name-only', 'HEAD']
        : ['diff', '--name-only', '--diff-filter=ACMRTUXB', `${mergeBase}...HEAD`]
    ) ?? '')
  : '';

const stagedChanged = readGit(['diff', '--name-only', '--cached', '--diff-filter=ACMRTUXB']) ?? '';
const unstagedChanged = readGit(['diff', '--name-only', '--diff-filter=ACMRTUXB']) ?? '';
const untrackedChanged = readGit(['ls-files', '--others', '--exclude-standard']) ?? '';

const candidateFiles = new Set(
  [branchChanged, stagedChanged, unstagedChanged, untrackedChanged]
    .flatMap((value) => value.split(/\r?\n/))
    .map((file) => file.trim())
    .filter((file) => file.length > 0)
);

const files = Array.from(candidateFiles)
  .filter((file) => {
    const dotIndex = file.lastIndexOf('.');
    const extension = dotIndex >= 0 ? file.slice(dotIndex) : '';
    return PRETTIER_EXTENSIONS.has(extension.toLowerCase());
  })
  .filter((file) => existsSync(file));

if (files.length === 0) {
  console.log('No changed files matched Prettier extensions.');
  process.exit(0);
}

const require = createRequire(import.meta.url);
const prettierBinPath = require.resolve('prettier/bin/prettier.cjs');
const commandArgs = [prettierBinPath, mode === 'check' ? '--check' : '--write', ...files];
const result = spawnSync(process.execPath, commandArgs, { stdio: 'inherit' });

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);
