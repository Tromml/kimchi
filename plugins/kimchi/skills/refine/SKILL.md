---
name: kimchi:refine
description: This command should be used to iteratively improve the plan until quality threshold is reached or diminishing returns detected. Sixth stage of the Kimchi planning pipeline. Produces .kimchi/PLAN-FINAL.md.
argument-hint: "[--loops N]"
---

# Kimchi Refine

<command_purpose>
Iteratively evaluate and improve the plan until quality is sufficient. Exits on: quality threshold reached, diminishing returns, regression, or max loops.
</command_purpose>

## Input

Read `.kimchi/PLAN-REVIEWED.md` (preferred) or `.kimchi/PLAN.md` (if review was skipped).

Parse `$ARGUMENTS` for `--loops N` option (default: 3).

## Process

### 1. Evaluate Plan Quality

Score the plan on 5 criteria (each 0-20, total 100):

| Criterion | Score 20 | Score 10 | Score 0 |
|-----------|----------|----------|---------|
| **Completeness** | All v1 requirements covered | Most covered | Gaps exist |
| **Clarity** | Every task unambiguous | Minor ambiguity | Vague descriptions |
| **Testability** | Each task has verifiable criteria | Some criteria vague | Missing criteria |
| **Independence** | Parallel where possible | Unnecessary dependencies | Serial when could be parallel |
| **Size** | All tasks S or M | One L task | Multiple L tasks |

### 2. Refinement Loop

```
for each iteration (up to max_loops):
    1. Score the plan
    2. Check exit conditions:
       - Score >= 90 → exit "quality_reached"
       - Score improvement < 5 from last → exit "diminishing_returns"
       - Score decreased → revert, exit "regression"
       - Max loops reached → exit "max_loops"
    3. Identify lowest-scoring criterion
    4. Apply targeted improvement:
       - Completeness: Add missing tasks for uncovered requirements
       - Clarity: Rewrite ambiguous task descriptions
       - Testability: Add/improve acceptance criteria
       - Independence: Break unnecessary dependencies
       - Size: Split L tasks into S/M tasks
    5. Record what changed
```

### 3. Write Output

Write `.kimchi/PLAN-FINAL.md`:

```markdown
# Final Plan: [Feature Name]

**Refined:** [today's date]
**Source:** .kimchi/PLAN-REVIEWED.md

## Refinement History

| Iteration | Score | Lowest Criterion | Changes Made | Exit Reason |
|-----------|-------|-----------------|--------------|-------------|
| 1 | [N]/100 | [criterion] | [what changed] | - |
| 2 | [N]/100 | [criterion] | [what changed] | - |
| 3 | [N]/100 | - | - | [exit reason] |

## Final Plan

[Complete refined plan with all improvements applied]
```

Report: "Refinement complete (exit: [reason], score: [N]/100). Saved to .kimchi/PLAN-FINAL.md"
Suggest: "Run `/kimchi:beads` to convert plan to bead specifications."
