---
name: kimchi:requirements
description: This command should be used to extract and categorize requirements from CONTEXT.md into v1 (must have), v2 (next iteration), and out of scope. Second stage of the Kimchi planning pipeline. Produces .kimchi/REQUIREMENTS.md.
---

# Kimchi Requirements

<command_purpose>
Parse .kimchi/CONTEXT.md and extract all requirements into a structured, prioritized document with acceptance criteria and traceability.
</command_purpose>

## The Iron Law

```
NO CODEBASE INVESTIGATION DURING REQUIREMENTS EXTRACTION
```

Requirements extraction ONLY reads CONTEXT.md. No codebase investigation:
- No Glob to search for files
- No Grep to search code
- No reading implementation files
- No "checking if exists"
- No "understanding current patterns"

**That's research.** Research is the next stage.

## Input

Read `.kimchi/CONTEXT.md`. If it doesn't exist, tell the user: "No CONTEXT.md found. Run `/kimchi:clarify [idea]` first."

## Process

### 1. Extract Requirements

Parse CONTEXT.md for all explicit and implied requirements:
- Each decision implies at least one requirement
- Each deferred idea is a v2 or out-of-scope requirement
- Look for implied requirements not explicitly stated (e.g., "upload files" implies "validate file type")

### 2. Categorize

**v1 (Must Have):** Essential for the feature to be usable. The feature doesn't work without these.

**v2 (Next Iteration):** Valuable but can ship without. Deferred ideas from CONTEXT.md go here.

**Out of Scope:** Explicitly not part of this work. Include reasoning for each.

### 3. Assign IDs and Acceptance Criteria

- ID format: `[CATEGORY]-[NUMBER]` (e.g., UPLD-01, STOR-02, DISP-03)
- Categories emerge from the feature domain (not predefined)
- Each v1 requirement gets acceptance criteria as checkboxes
- Acceptance criteria must be testable and specific

### 4. Write REQUIREMENTS.md

Write to `.kimchi/REQUIREMENTS.md`:

```markdown
# Requirements: [Feature Name]

**Defined:** [today's date]
**Source:** .kimchi/CONTEXT.md

## v1 Requirements (Must Have)

### [Category 1]

- [ ] **[CAT]-01**: [Requirement description]
  - [ ] [Acceptance criterion 1]
  - [ ] [Acceptance criterion 2]

- [ ] **[CAT]-02**: [Requirement description]
  - [ ] [Acceptance criterion 1]

### [Category 2]

- [ ] **[CAT]-01**: [Requirement description]
  - [ ] [Acceptance criterion 1]
  - [ ] [Acceptance criterion 2]

## v2 Requirements (Next Iteration)

### [Category]

- **[CAT]-01**: [Requirement description]
  *Reason for deferral: [why not v1]*

## Out of Scope

| Feature | Reason |
|---------|--------|
| [Feature] | [Why excluded] |

## Traceability

| Requirement | Category | Priority |
|-------------|----------|----------|
| [CAT]-01 | v1 | Must have |
| [CAT]-02 | v1 | Must have |

**Coverage:**
- v1 requirements: [N] total
- v2 requirements: [N] total
- Out of scope: [N] items
```

### 5. Confirm

Show the user a summary:
- Count of v1, v2, and out-of-scope items
- Ask: "Does this categorization look right? Anything that should move between v1/v2/out-of-scope?"

Report: "Requirements extracted. Saved to .kimchi/REQUIREMENTS.md"

**Next:** Run `/kimchi:research` to investigate codebase patterns.

**STOP.** Do not continue to research.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Just a quick check if this exists" | That's research. Stop. |
| "This would inform better requirements" | Research informs planning, not requirements |
| "I'll look at one file to understand" | One file = codebase investigation = research stage |
| "User would benefit from knowing if..." | User runs research next. They'll find out then |
| "I can do both stages efficiently" | Stages are separate for reason. Trust the pipeline |
| "Need to see patterns to write criteria" | Acceptance criteria come from requirements, not implementation |
| "I'll just Glob to check structure" | Any Glob/Grep = research. Not requirements. |

## Red Flags — STOP and Delete RESEARCH.md

Detecting any of these = boundary violation:

- Used Glob to search for files
- Used Grep to search code
- Read any file outside `.kimchi/` directory
- Mentioned "existing implementation"
- Mentioned "current patterns"
- RESEARCH.md exists when you're done
- Investigated "how it's currently done"

**Action if detected:** Delete RESEARCH.md. Requirements ONLY creates REQUIREMENTS.md.

## Verification Checklist

Before completing requirements stage:

- [ ] Read only CONTEXT.md (no other files)
- [ ] Created REQUIREMENTS.md with v1/v2/out-of-scope
- [ ] All requirements trace to CONTEXT.md decisions
- [ ] Used NO Glob/Grep searches
- [ ] Read NO implementation files
- [ ] Did NOT create RESEARCH.md
- [ ] Output ends with hard STOP message

## Key Principles

- **v1 is minimal**: If you can ship without it, it's v2
- **Out of scope is not a trash bin**: It's a parking lot. Capture it, just don't build it now
- **Acceptance criteria are testable**: "Works correctly" is not testable. "Returns URL matching pattern" is.
- **Every v1 requirement traces to a CONTEXT.md decision**
