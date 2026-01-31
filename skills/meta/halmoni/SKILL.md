---
name: halmoni
description: Self-improvement through accumulated wisdom. Use when bead execution completes or fails, when processing human feedback, or when explicitly invoked via /kimchi:halmoni.
---

# Halmoni (할머니)

> "Taste, adjust, remember. Each batch teaches the next."

Like a grandmother who improves her kimchi recipe with each batch, Halmoni observes what works, makes small adjustments, and passes down accumulated wisdom.

## Purpose

Improve Kimchi's skills, validators, and personas based on execution feedback. Small, incremental changes — never rewrites.

## When This Applies

| Trigger | Source |
|---------|--------|
| Bead execution complete | Automatic after ACFS reports completion |
| Bead execution failed | Automatic after ACFS reports failure |
| Human feedback | Manual via `/kimchi:halmoni --from-feedback "..."` |
| Validation pattern | When same validation issue occurs 3+ times |
| Explicit invocation | `/kimchi:halmoni` |

## Process

### 1. TASTE (Observe)

Gather information about what happened.

**For completed beads:**
- How many iterations did the agent need?
- Were there any searches/exploration before finding context?
- Did the agent ask clarifying questions?
- How long did execution take vs. estimate?

**For failed beads:**
- What was the failure mode?
- Was context missing?
- Was a skill not followed?
- Was the bead specification unclear?

**For human feedback:**
- What specifically was the complaint?
- What was expected vs. actual?
- Is this a pattern or one-off?

### 2. ADJUST (Propose)

Generate specific, minimal changes:

```markdown
## Proposed Change

**File:** validators/context-completeness.md

**Change:**
+ □ When task involves error handling:
+   Context must reference error handling pattern
+   Example: find: "rescue Aws::" with purpose

**Rationale:**
Bead 003 execution required 3 iterations to find error handling
pattern. This was predictable and should have been in context.
```

Rules for proposals:
- One change at a time
- Show as diff
- Explain rationale
- Reference specific evidence

### 3. REMEMBER (Validate)

Check the proposal against these criteria:

| Check | Question |
|-------|----------|
| Conflicts | Does this contradict any existing skill/validator? |
| Specificity | Is this actionable, not vague? |
| Generality | Will this help beyond this one case? |
| Historical | Would this have helped previous beads? |

### 4. PASS DOWN (Apply)

If validated and approved:

1. Apply the change to the file
2. Update version in frontmatter (if applicable)
3. Add entry to `skills/CHANGELOG.md`
4. Commit with message: `halmoni: {brief description}`

## What Halmoni Can Improve

| Component | Examples |
|-----------|----------|
| Clarification questions | Add new question patterns, refine existing ones |
| Review personas | Adjust what personas look for, add new concerns |
| Bead validators | Add new checks, refine existing thresholds |
| Execution skills | Add steps, clarify anti-patterns |
| Find strategies | Add new landmark patterns |
| Bead structure | Add optional fields, improve templates |

## What Halmoni CANNOT Change

| Protected | Reason |
|-----------|--------|
| Core safety checks | Fundamental to system integrity |
| ACFS integration protocol | Compatibility with external system |
| Bead schema required fields | Breaking change for existing beads |
| Command names | User muscle memory |

## Approval Modes

| Mode | Behavior |
|------|----------|
| Interactive (default) | Show proposal, ask for confirmation |
| `--dry-run` | Show proposal, don't apply |
| `--taste-only` | Show observations only, no proposals |
| `--auto-apply` | Apply without confirmation (use carefully) |

## Anti-Patterns

### FORBIDDEN: Large changes

Halmoni makes small, incremental improvements. Not rewrites. One change at a time.

### FORBIDDEN: Unvalidated changes

Every change must pass the validation checks (Conflicts, Specificity, Generality, Historical).

### FORBIDDEN: Breaking changes

Never modify protected components or break compatibility with existing beads.

### FORBIDDEN: Emotional changes

"This felt bad" is not evidence. Halmoni needs specific, measurable observations.
