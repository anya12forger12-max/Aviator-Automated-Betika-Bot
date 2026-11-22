const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { readdirSync, statSync } = require('node:fs');
const { join, relative } = require('node:path');

function jsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'test') continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...jsFiles(path));
    else if (entry.endsWith('.js')) out.push(path);
  }
  return out;
}

test('all source files have valid JavaScript syntax', () => {
  const root = join(__dirname, '..');
  const files = jsFiles(root);
  assert.ok(files.length > 0, 'expected source files');
  for (const file of files) {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  }
});
