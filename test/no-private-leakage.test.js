import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set(["node_modules", ".git"]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const bannedPatterns = [
  // private meeting links
  /zoom\.us\/j\//i,
  /meet\.google\.com\//i,
  // common internal/private hosting hints
  /\/Users\/[a-zA-Z0-9_-]+\/dev\//,
  /localhost:\d{4,5}/,
  // AWS-style access keys, generic secrets
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

test("no tracked file leaks private meeting URLs, local paths, or credentials", () => {
  const files = walk(root).filter((f) => !f.includes(`${path.sep}test${path.sep}`));
  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue; // binary or unreadable, skip
    }
    for (const pattern of bannedPatterns) {
      assert.doesNotMatch(text, pattern, `${path.relative(root, file)} matches banned pattern ${pattern}`);
    }
  }
});
