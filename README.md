<p align="center">
  <img src="docs/images/kimchi.jpg" alt="A jar of kimchi glowing with warm light" width="400">
</p>

# Kimchi

A Claude Code plugin that transforms vague ideas into validated, standalone task specifications (beads) for multi-agent execution.

Kimchi is **prompt-native** — all logic lives in markdown files. No TypeScript, no build step. Skills, agents, and personas work together through a 10-stage planning pipeline that produces self-contained task specs any agent can pick up and execute independently.

## Install

```bash
claude plugin add https://github.com/Tromml/kimchi
```

## Quick Start

```
/kimchi:plan "Add user authentication with magic links"
```

This runs the full pipeline through refinement: clarify, requirements, research, generate, review, refine. The output is a draft plan in `.kimchi/PLAN-DRAFT.md`.

For fully automated end-to-end (plan through bead generation):

```
/kimchi:plan "Add user authentication with magic links" --full-auto
```

## How It Works

Kimchi breaks planning into discrete stages, each producing a markdown artifact:

```
 idea
  |
  v
clarify        Extract understanding through structured questions    -> CONTEXT.md
  |
requirements   Categorize into v1 (must), v2 (next), out of scope   -> REQUIREMENTS.md
  |
research       Investigate codebase patterns and frameworks          -> RESEARCH.md
  |
generate       Create plan with tasks, deps, complexity estimates    -> PLAN.md
  |
review         5 personas critique for scope creep, complexity, etc  -> PLAN-REVIEWED.md
  |
refine         Iterate until quality threshold or diminishing returns -> PLAN-DRAFT.md
  |
plan-revise    Fresh-eyes cross-model review (run per model)         -> PLAN-REVISED-{model}.md
  |
plan-synthesize Merge cross-model revisions into hybrid plan         -> PLAN-SYNTHESIZED.md
  |
beads          Convert to standalone YAML task specs                  -> .beads/
  |
validate       4 validators check standalone executability            -> enriched beads
```

Each stage can be run independently. The pipeline writes everything to `.kimchi/` in your project root.

## Halmoni (Self-Improvement)

<p align="center">
  <img src="docs/images/halmoni.jpg" alt="A Korean grandmother tasting kimchi" width="400">
</p>

> *"Taste, adjust, remember. Each batch teaches the next."*

Halmoni is Kimchi's self-improvement system. Like a Korean grandmother who tastes her kimchi and adjusts the recipe each time, Halmoni observes what happened during execution, proposes improvements to skills and validators, validates them against history, and applies them with versioning.

```
/kimchi:halmoni --from-bead 008
/kimchi:halmoni --from-feedback "the review stage missed the N+1 query"
/kimchi:halmoni --taste-only
```

## Pipeline Skills

| Skill | Description |
|-------|-------------|
| `kimchi:plan` | Full pipeline orchestrator (clarify through refine) |
| `kimchi:clarify` | Extract understanding through structured questions |
| `kimchi:requirements` | Categorize requirements into v1, v2, out of scope |
| `kimchi:research` | Investigate codebase patterns and frameworks |
| `kimchi:generate` | Generate plan with tasks, deps, complexity |
| `kimchi:review` | Multi-persona plan critique |
| `kimchi:refine` | Iterative improvement until quality threshold |
| `kimchi:plan-revise` | Cross-model fresh-eyes review |
| `kimchi:plan-synthesize` | Synthesize cross-model revisions |
| `kimchi:beads` | Convert plan to standalone bead YAML specs |
| `kimchi:validate` | Validate beads for standalone executability |

## Execution Discipline Skills

| Skill | Description |
|-------|-------------|
| `kimchi:tdd` | RED-GREEN-REFACTOR cycle enforcement |
| `kimchi:systematic-debugging` | 4-phase root cause analysis before proposing fixes |
| `kimchi:simplicity-enforcement` | YAGNI, minimal code, duplication over wrong abstraction |
| `kimchi:verification-before-completion` | Evidence before assertions, always |
| `kimchi:bead-protocol` | Multi-agent bead execution coordination |

## Agents

### Pipeline

| Agent | Description |
|-------|-------------|
| `kimchi:pipeline:clarifier` | Generates structured clarification questions |
| `kimchi:pipeline:researcher` | Discovers codebase patterns and conventions |
| `kimchi:pipeline:bead-converter` | Converts plan tasks into standalone bead YAML |

### Review Personas

| Agent | Description |
|-------|-------------|
| `kimchi:review:complexity-detector` | Identifies unnecessary complexity and over-engineering |
| `kimchi:review:feature-trimmer` | Identifies non-essential features to cut or defer |
| `kimchi:review:scope-guardian` | Catches scope creep and vague acceptance criteria |
| `kimchi:review:test-coverage-advocate` | Identifies missing or insufficient test specs |
| `kimchi:review:premature-optimization-detector` | Identifies optimizations not yet needed |

## Utility Skills

| Skill | Description |
|-------|-------------|
| `kimchi:halmoni` | Self-improvement system |
| `kimchi:status` | Check pipeline state and artifact status |
| `kimchi:reset` | Clear `.kimchi/` and start fresh |
| `kimchi:convert` | Convert plugin to OpenCode/Codex formats |

## Format Conversion

Kimchi can convert itself into formats compatible with other AI coding tools:

```
/kimchi:convert --to opencode
/kimchi:convert --to codex
/kimchi:convert --to opencode --also codex
```

Requires [bun](https://bun.sh) runtime. Output goes to `.converted/` by default.

## Project Structure

```
.claude-plugin/marketplace.json
plugins/kimchi/
  .claude-plugin/plugin.json
  skills/           21 skills (pipeline + execution discipline + utility)
  agents/
    pipeline/       3 pipeline agents
    review/         5 review persona agents
  personas/         5 persona definitions
  validators/       4 bead validators
  lib/              4 reference libraries
  templates/        6 output templates
  hooks/            ACFS integration hooks
```

## License

MIT
