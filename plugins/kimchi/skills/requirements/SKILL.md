---
name: requirements
description: This command should be used to extract and categorize requirements from CONTEXT.md into v1 (must have), v2 (next iteration), and out of scope. Second stage of the Kimchi planning pipeline. Produces .kimchi/REQUIREMENTS.md.
---

# Kimchi Requirements

<command_purpose>
Parse .kimchi/CONTEXT.md and extract all requirements into a structured, prioritized document with acceptance criteria and traceability.
</command_purpose>

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
Suggest: "Run `/kimchi:research` to investigate codebase patterns."

## Key Principles

- **v1 is minimal**: If you can ship without it, it's v2
- **Out of scope is not a trash bin**: It's a parking lot. Capture it, just don't build it now
- **Acceptance criteria are testable**: "Works correctly" is not testable. "Returns URL matching pattern" is.
- **Every v1 requirement traces to a CONTEXT.md decision**
