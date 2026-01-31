---
name: kimchi:plan-synthesize
description: This command should be used to synthesize multiple cross-model plan revisions into a superior hybrid plan. Eighth stage of the Kimchi planning pipeline. Reads PLAN-REVISED-*.md files and outputs PLAN-SYNTHESIZED.md — the TRUE final plan.
---

# Kimchi Plan Synthesize

<command_purpose>
Analyze all model-specific plan revisions, compare their findings and fixes, and create a superior hybrid plan that artfully blends the best of all worlds. This is the TRUE final plan that feeds into bead conversion.
</command_purpose>

## Input

Glob for `.kimchi/PLAN-REVISED-*.md` files. If none exist, tell the user: "No revised plans found. Run `/kimchi:plan-revise` in at least one model first."

Also read:
- `.kimchi/PLAN-DRAFT.md` — the baseline draft plan
- `.kimchi/REQUIREMENTS.md` — v1 boundary reference

## Process

### 1. Inventory Revisions

List all `.kimchi/PLAN-REVISED-*.md` files found. Extract model names from filenames. Report:
```
Found revisions from: claude, codex, gemini
Baseline: PLAN-DRAFT.md
```

### 2. Cross-Model Comparison

For each revision, extract:
- Issues found (from the Issues Found table)
- Changes made (from Summary of Changes)
- The revised plan itself

Build a comparison matrix:

**Agreement:** Issues found by multiple models (high confidence — fix these)
**Unique finds:** Issues found by only one model (evaluate carefully — could be insight or noise)
**Contradictions:** Where models disagree on approach (resolve with reasoning)

### 3. Synthesize

Apply ACFS-inspired synthesis logic:

> "3 competing LLMs reviewed the same plan. Analyze with an open mind. Be intellectually honest about what each model did better. Create a superior hybrid that artfully blends the best of all worlds."

Rules:
- **Unanimous issues:** Always fix. If all models found it, it's real.
- **Majority issues:** Fix unless there's a strong reason not to.
- **Unique issues:** Evaluate on merit. A single model can be right when others missed something.
- **Contradictions:** Pick the approach with the strongest reasoning. Explain why.
- **If only 1 revision exists:** Blend the draft and the single revision. The revision's fixes are accepted unless they introduce new problems.

### 4. Write Output

Write `.kimchi/PLAN-SYNTHESIZED.md`:

```markdown
# Synthesized Plan: [Feature Name]

**Synthesized:** [today's date]
**Sources:** PLAN-DRAFT.md, [list of PLAN-REVISED-*.md files]
**Models consulted:** [list of models]

## Cross-Model Comparison

| Issue | Claude | Codex | Gemini | Resolution |
|-------|--------|-------|--------|------------|
| [Issue description] | Found & fixed | Found & fixed | Not flagged | **Accepted** — unanimous/majority |
| [Issue description] | Not flagged | Found & fixed | Not flagged | **Accepted** — valid unique find |
| [Issue description] | Fix A | Fix B | Fix A | **Fix A** — [reasoning] |

## Synthesis Rationale

### What each model did well
- **Claude:** [specific strengths]
- **Codex:** [specific strengths]
- **Gemini:** [specific strengths]

### Key decisions
1. [Decision and reasoning]
2. [Decision and reasoning]

## Synthesized Plan

[Complete synthesized plan — full standalone plan ready for bead conversion]
```

Report: "Synthesis complete. Blended [N] model revisions into .kimchi/PLAN-SYNTHESIZED.md"
Suggest: "Run `/kimchi:beads` to convert the synthesized plan into bead specifications."

## Key Principles

- **Intellectual honesty**: Don't favor one model. Judge fixes on merit.
- **Full plan output**: The synthesized plan must be complete and standalone.
- **Reasoning over voting**: A well-reasoned minority position beats a shallow majority.
- **Preserve v1 scope**: Synthesis must not expand scope beyond REQUIREMENTS.md v1 boundary.
- **Works with 1+ revisions**: Even a single revision gets synthesized against the draft baseline.
