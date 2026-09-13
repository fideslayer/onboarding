# FidesLayer Onboarding Skill

Public, agent-readable skill: [`SKILL.md`](./SKILL.md).

It guides a coding agent through proposing a small, reviewed set of FidesLayer
sanity scenarios (Actions, States, Tests, Report templates) for a product
repository the agent already has authorized access to — with explicit review
gates before anything is created or run in FidesLayer.

Repo: https://github.com/fideslayer/onboarding

## Prerequisites

- An agent/client that can fetch a plain URL (or one you can paste the skill's text into).
- Your own read-only access to the product repository/repositories you want onboarded.
- If you want the agent to actually create or run things in FidesLayer: your own FidesLayer account and session, authenticated by you in your own client. No tokens are ever pasted into chat.

If your agent cannot fetch URLs, copy the contents of [`SKILL.md`](./SKILL.md) into the chat yourself before using the prompt below — do not assume the skill is already installed.

## Copy-paste prompt

Paste this into your coding agent:

```text
Read https://raw.githubusercontent.com/fideslayer/onboarding/main/SKILL.md and use it to onboard this product to FidesLayer. Inspect only the repositories and product context I authorize. Propose a small set of valuable sanity scenarios, including setup Actions, observed States, Tests, and Report templates. Ask me to review and correct the proposal before creating anything in FidesLayer or starting a Run.
```

## License

MIT — see [`LICENSE`](./LICENSE).
