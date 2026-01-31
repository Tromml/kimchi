---
name: kimchi:review
description: This command should be used to run multi-persona review of the implementation plan. Five specialized personas critique the plan for scope creep, complexity, premature optimization, and test coverage. Fifth stage of the Kimchi planning pipeline. Produces .kimchi/PLAN-REVIEWED.md.
---

# Kimchi Review

<command_purpose>
Run 5 specialized review personas against the plan in parallel. Each persona looks for specific problems. User decides which concerns to accept.
</command_purpose>

## Input

Read `.kimchi/PLAN.md`. If it doesn't exist, tell the user: "No PLAN.md found. Run `/kimchi:generate` first."

Also read `.kimchi/REQUIREMENTS.md` for v1/v2 boundary reference.

## Process

### 1. Launch Review Personas in Parallel

Launch all 5 review agents using the Task tool, each with the PLAN.md content:

```
- Task feature-trimmer: "Review this plan for non-v1 features that should be cut or deferred"
- Task complexity-detector: "Review this plan for unnecessary complexity and over-engineering"
- Task premature-optimization-detector: "Review this plan for optimizations not yet needed"
- Task scope-guardian: "Review this plan for scope creep and tasks outside feature boundary"
- Task test-coverage-advocate: "Review this plan for missing or insufficient test specifications"
```

Each persona returns structured concerns in this format:
```
- What: [the issue]
- Why: [why it's a problem]
- Recommendation: CUT / DEFER TO V2 / SIMPLIFY / KEEP (with justification)
```

### 2. Collect and Deduplicate

Gather all concerns from all personas. If multiple personas flag the same issue, merge into one concern noting which personas flagged it.

### 3. Present to User

Show the review summary:

```
Review Results
══════════════

Feature Trimmer:     [N] concerns
Complexity Detector: [N] concerns
Premature Optimization: [N] concerns
Scope Guardian:      [N] concerns
Test Coverage:       [N] concerns

─────────────────────────────────

Concern 1: [What]
  Personas: Feature Trimmer, Scope Guardian
  Why: [Explanation]
  Recommendation: DEFER TO V2

  Accept / Reject / Modify? [ask user]

Concern 2: [What]
  ...
```

Use AskUserQuestion for each concern (or batch them if there are many):
- ACCEPT: Apply the recommendation
- REJECT: Keep the plan as-is
- MODIFY: User provides alternative

### 4. Handle Contradictions

If personas give contradictory feedback, surface both sides:
```
CONTRADICTION:
  - Complexity Detector: "Remove resize strategy pattern"
  - Test Coverage: "Add more test cases for resize strategies"

  Both can't be right. Which direction? [ask user]
```

### 5. Apply Changes and Write Output

Write `.kimchi/PLAN-REVIEWED.md`:

```markdown
# Plan Review: [Feature Name]

**Reviewed:** [today's date]

## Review Summary

| Persona | Concerns | Accepted | Rejected |
|---------|----------|----------|----------|
| Feature Trimmer | [N] | [N] | [N] |
| Complexity Detector | [N] | [N] | [N] |
| Premature Optimization | [N] | [N] | [N] |
| Scope Guardian | [N] | [N] | [N] |
| Test Coverage | [N] | [N] | [N] |

## Accepted Changes

### [Concern ID]: [What changed]
**Persona:** [Which persona]
**Original:** [What was in the plan]
**Change:** [What's different now]
**Rationale:** [Why accepted]

## Rejected Changes

### [Concern ID]: [What was proposed]
**Persona:** [Which persona]
**Decision:** REJECT — [User's reasoning]

## Updated Plan

[Full updated plan with accepted changes applied]
```

Report: "Review complete. Saved to .kimchi/PLAN-REVIEWED.md"
Suggest: "Run `/kimchi:refine` to proceed to adaptive refinement."
