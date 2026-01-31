---
name: kimchi:halmoni
description: This command should be used to run the Kimchi self-improvement system. Observes execution outcomes, proposes incremental improvements to skills/validators/personas, validates against history, and applies with versioning.
argument-hint: "[--from-bead ID] [--from-feedback \"text\"] [--taste-only] [--dry-run] [--history]"
---

# Kimchi Halmoni (할머니)

> "Taste, adjust, remember. Each batch teaches the next."

<command_purpose>
Self-improvement system that observes what happened during bead execution or from user feedback, proposes small improvements to skills/validators/personas, validates them, and applies with versioning.
</command_purpose>

## Input

Parse `$ARGUMENTS`:
- `--from-bead ID`: Analyze execution of a specific bead
- `--from-feedback "text"`: Process explicit user feedback
- `--taste-only`: Observe and report without proposing changes
- `--dry-run`: Show proposals without applying
- `--history`: Show skills/CHANGELOG.md
- (no args): Interactive improvement session — ask what to improve

## Process

### 1. TASTE (Observe)

**From bead execution (`--from-bead`):**
- Read `.beads/{id}.yaml` for the bead spec
- Check git log for commits with that bead ID
- Look for iteration count, search patterns, clarifying questions in logs
- Assess: Did the agent struggle? Where?

**From feedback (`--from-feedback`):**
- Parse the feedback text
- Identify which component it relates to (skill, validator, persona, template)
- Assess: Is this a pattern or one-off?

**Interactive (no args):**
- Ask: "What would you like to improve? (skill / validator / persona / template)"
- Ask: "What happened that should be better next time?"

Report observations:
```
Tasting...

Observations:
- [What happened]
- [What worked well]
- [What could be better]
```

### 2. ADJUST (Propose)

Generate specific, minimal changes:

```
Proposed adjustment:

File: [path to skill/validator/persona]

Change:
+ [line to add]
- [line to remove]

Rationale: [Why this helps, with evidence]
```

Rules:
- One change at a time
- Show as diff
- Explain rationale
- Reference specific evidence

### 3. REMEMBER (Validate)

Check the proposal:

| Check | Question |
|-------|----------|
| Conflicts | Does this contradict existing skills/validators? |
| Specificity | Is this actionable, not vague? |
| Generality | Will this help beyond this one case? |
| Protected | Does this touch protected components? |

**Protected components (CANNOT modify):**
- Bead schema required fields (bead_id, title, description, depends_on, context, deliverables, tests, acceptance_criteria)
- Command names
- ACFS integration protocol

If proposal touches protected components, reject it and explain why.

### 4. PASS DOWN (Apply)

If `--dry-run`: Show proposal and stop.
If `--taste-only`: Show observations and stop.

Otherwise, ask for confirmation:
```
Apply this change? [y/n/edit]
```

If confirmed:
1. Apply the change to the file
2. Update version in YAML frontmatter (patch bump)
3. Add entry to `skills/CHANGELOG.md`
4. Commit with message: `halmoni: [brief description]`

### 5. Show History (`--history`)

If `--history` flag, just read and display `skills/CHANGELOG.md`.
