import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const readme = readFileSync(path.join(root, "README.md"), "utf8");

const EXACT_PROMPT =
  "Read https://raw.githubusercontent.com/fideslayer/onboarding/main/SKILL.md and use it to onboard this product to FidesLayer. Inspect only the repositories and product context I authorize. Propose a small set of valuable sanity scenarios, including setup Actions, observed States, Tests, and Report templates. Ask me to review and correct the proposal before creating anything in FidesLayer or starting a Run.";

test("README contains exactly one text codeblock", () => {
  const blocks = readme.match(/```text\n[\s\S]*?```/g) || [];
  assert.equal(blocks.length, 1, "README must contain exactly one ```text codeblock");
});

test("README's codeblock is the exact canonical prompt", () => {
  const block = readme.match(/```text\n([\s\S]*?)```/)[1].trim();
  assert.equal(block, EXACT_PROMPT);
});

test("README references the raw SKILL.md URL and the public repo link", () => {
  assert.match(readme, /https:\/\/raw\.githubusercontent\.com\/fideslayer\/onboarding\/main\/SKILL\.md/);
  assert.match(readme, /https:\/\/github\.com\/fideslayer\/onboarding/);
});

test("README does not reference any other github.com/fideslayer/* repo", () => {
  const matches = [...readme.matchAll(/github\.com\/fideslayer\/([a-zA-Z0-9._-]+)/g)].map((m) => m[1]);
  for (const name of matches) {
    assert.equal(name.replace(/[).,]+$/, ""), "onboarding", `unexpected repo reference: fideslayer/${name}`);
  }
});
