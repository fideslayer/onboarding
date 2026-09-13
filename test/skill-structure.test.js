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

test("SKILL.md forbids claiming FidesLayer resources exist without tool confirmation", () => {
  assert.match(skill, /Never claim a FidesLayer resource .* already exists/i);
});

test("SKILL.md distinguishes docs MCP from account MCP", () => {
  assert.match(skill, /docs\.fideslayer\.com\/mcp/);
  assert.match(skill, /mcp\.fideslayer\.com\/mcp/);
});

test("SKILL.md reuses Flow (not Workflow) as the named resource in Setup", () => {
  assert.match(skill, /reference it by its confirmed name via `\/flow:<name>`/);
  assert.doesNotMatch(skill, /Workflow via `\/flow:<name>`/i);
});

test("SKILL.md gates named Flow reuse on confirmation, and points to discovery in step 5", () => {
  assert.match(skill, /if an existing Flow has already been confirmed by a real MCP tool call/i);
  assert.match(skill, /checked during discovery \(step 5\)/i);
});

test("SKILL.md allows proposing new resource names while banning false existence claims", () => {
  assert.match(skill, /You may freely propose \*new\* resource names/i);
  assert.match(skill, /label them clearly as proposed, not as already existing/i);
  assert.match(skill, /docs server describes capabilities in general, it cannot confirm what exists in the user's account/i);
});

test("SKILL.md does not ban concrete UI interactions from Actions", () => {
  assert.doesNotMatch(skill, /not literal clicks or pages/i);
  assert.doesNotMatch(skill, /not a specific UI step/i);
  assert.match(skill, /click Save/);
  assert.match(skill, /\*\*Action\*\* = an abstract entity/i);
});

test("SKILL.md step 5 restricts mutations to approved resources and separates create from run", () => {
  assert.match(skill, /create only the exact resources the user approved in step 4/i);
  assert.match(skill, /do not assume they have separate persisted resources or create endpoints/i);
  assert.match(skill, /Running a Flow is a separate approval from creating it/i);
  assert.match(skill, /read back the exact resource the tool returned before proposing to run it/i);
  assert.match(skill, /fall back to a manual handoff for that piece/i);
});
