# Eval fixtures (synthetic)

These fixtures are **synthetic** scenarios for manually or semi-manually
evaluating an agent's behavior when following `SKILL.md`. They are not real
product data or real evidence of behavior — they describe hypothetical
repos/prompts and the criteria an agent's response should meet.

This repo's `test/` suite is a structural check (frontmatter shape, exact
prompt text, absence of banned strings). It does **not** run these fixtures
through an actual agent and cannot verify agent behavior — only a real agent
session can. Treat pass/fail against these fixtures as something a human (or
a separate agent) evaluates by reading the transcript, not something the
Node test runner asserts automatically.

Each fixture file states: the synthetic setup, the prompt given to the agent
under test, and the criteria a reviewer should check for.
