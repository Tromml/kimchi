---
name: kimchi:plan-revise
description: This command should be used to perform a fresh-eyes cross-model review of the draft plan. Seventh stage of the Kimchi planning pipeline. Reads PLAN-DRAFT.md and outputs PLAN-REVISED-{model}.md. Run once per model for cross-model analysis.
---

# Kimchi Plan Revise

<command_purpose>
Review the draft plan with "fresh eyes" from a different model's perspective. Find bugs, errors, logic problems, confusion, and missing pieces — then fix everything found. Each model writes its own revision file, enabling cross-model synthesis later.
</command_purpose>

## Input

Read `.kimchi/PLAN-DRAFT.md` (required). If it doesn't exist, tell the user: "No PLAN-DRAFT.md found. Run `/kimchi:refine` first."

Also read for context:
- `.kimchi/REQUIREMENTS.md` — v1 boundary and requirement IDs
- `.kimchi/RESEARCH.md` — codebase patterns and conventions

## Process

### 1. Identify Model

Determine which model is running this review. Use one of:
- The `$MODEL` environment variable if set
- Self-identification: state which model you are (e.g., "claude", "codex", "gemini", "grok", etc.)
- Normalize to lowercase, single-word slug (e.g., "claude", "codex", "gemini")

Store as `{model}` for the output filename.

### 2. Fresh-Eyes Review

Read the draft plan as if seeing it for the first time. Evaluate with intellectual honesty:

**Correctness:**
- Are there logical errors in the task ordering or dependencies?
- Do any tasks contradict each other?
- Are complexity estimates realistic?

**Completeness:**
- Are all v1 requirements covered? Cross-check against REQUIREMENTS.md.
- Are there missing integration points or edge cases?
- Are test specifications sufficient?

**Clarity:**
- Could an agent execute each task without ambiguity?
- Are deliverables specific enough?
- Is context sufficient for standalone execution?

**Architecture:**
- Do the proposed patterns match what RESEARCH.md found in the codebase?
- Are there simpler approaches that were overlooked?
- Is the dependency graph optimal for parallel execution?

**Risks:**
- What could go wrong during implementation?
- Are there hidden assumptions?
- What's the most likely failure mode?

### 3. Fix Everything Found

Don't just report problems — fix them. Produce a complete revised plan that addresses every issue found.

### 4. Write Output

Write `.kimchi/PLAN-REVISED-{model}.md`:

```markdown
# Plan Revision: [Feature Name]

**Revised by:** {model}
**Date:** [today's date]
**Source:** .kimchi/PLAN-DRAFT.md

## Issues Found

| # | Category | Severity | Issue | Resolution |
|---|----------|----------|-------|------------|
| 1 | [Correctness/Completeness/Clarity/Architecture/Risk] | [High/Medium/Low] | [What's wrong] | [How it was fixed] |
| 2 | ... | ... | ... | ... |

## Summary of Changes

[Narrative description of what was changed and why. Be specific about trade-offs considered.]

## Revised Plan

[Complete revised plan with all fixes applied. This must be a full, standalone plan — not a diff.]
```

Report: "Fresh-eyes review complete ({model}). Found [N] issues ([H] high, [M] medium, [L] low). Saved to .kimchi/PLAN-REVISED-{model}.md"
Suggest: "Run `/kimchi:plan-revise` in other models for cross-model coverage, then `/kimchi:plan-synthesize` to blend all revisions."

## Key Principles

- **Fresh eyes**: Pretend you've never seen this plan before. Question everything.
- **Fix, don't just flag**: Every issue found must have a resolution in the revised plan.
- **Respect v1 scope**: Don't add features. Only fix problems and improve clarity.
- **Full plan output**: The revised plan must be complete and standalone, not a patch.
- **Honest assessment**: If the plan is good, say so. Don't invent problems to justify your existence.
