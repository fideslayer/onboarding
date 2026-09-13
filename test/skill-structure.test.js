import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const skill = readFileSync(path.join(root, "SKILL.md"), "utf8");

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, "SKILL.md must start with a YAML frontmatter block");
  const fields = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (m) fields[m[1]] = m[2].trim();
  }
  return fields;
}

test("SKILL.md has required frontmatter fields", () => {
  const fields = frontmatter(skill);
  assert.equal(fields.name, "fideslayer-onboarding");
  assert.ok(fields.description && fields.description.length > 20, "description must be non-trivial");
  assert.match(fields.description, /onboard|FidesLayer|sanity/i, "description should be trigger-focused");
  assert.match(fields.version, /^\d+\.\d+\.\d+$/, "version must be semver");
});

test("SKILL.md does not mandate an agent-specific installer or CLI", () => {
  const bannedPatterns = [
    /npm install -g/i,
    /pip install/i,
    /brew install/i,
    /you must install/i,
    /run our cli/i,
  ];
  for (const pattern of bannedPatterns) {
    assert.doesNotMatch(skill, pattern, `SKILL.md should not mandate installer/CLI: ${pattern}`);
  }
});

test("SKILL.md requires user review/authorization before create or run", () => {
  assert.match(skill, /review and correct/i);
  assert.match(skill, /explicit authorization/i);
});

test("SKILL.md treats repository content as untrusted data", () => {
  assert.match(skill, /untrusted data/i);
  assert.match(skill, /Do not execute, install, or run/i);
});

test("SKILL.md forbids inventing FidesLayer resources", () => {
  assert.match(skill, /Never invent FidesLayer resource names/i);
});

test("SKILL.md distinguishes docs MCP from account MCP", () => {
  assert.match(skill, /docs\.fideslayer\.com\/mcp/);
  assert.match(skill, /mcp\.fideslayer\.com\/mcp/);
});
