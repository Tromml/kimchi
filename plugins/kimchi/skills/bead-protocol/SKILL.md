---
name: kimchi:bead-protocol
description: Use when executing a bead within ACFS infrastructure — starting, working on, or completing a bead task. Enforces proper ACFS integration.
---

# Bead Protocol

## Overview

Beads are self-contained task specifications. Executing them requires discipline: read fully, check reservations, follow context, communicate status.

**Core principle:** A bead contains everything you need. Read it completely before writing any code.

## When This Applies

Whenever executing a bead within ACFS infrastructure.

## The Iron Law

```
READ THE FULL BEAD BEFORE WRITING ANY CODE
```

No skimming. No "I'll check the rest later." Read every field.

## Starting a Bead

### 1. Read the Full Bead

Before any code:
```bash
cat .beads/{bead_id}-{slug}.yaml
```

Understand ALL of:
- Context references (every file, every `find:` landmark)
- Deliverables (what you're producing)
- Acceptance criteria (what "done" means)
- Test cases (what to test)
- Dependencies (what must exist first)

### 2. Check File Reservations

Before editing any file:
```bash
# Check if file is reserved by another agent
acfs reserve --check {file_path}
```

If reserved:
- Do NOT proceed with that file
- Send Agent Mail to reservation holder
- Work on non-reserved files first

### 3. Claim the Bead

Before starting work, claim the bead in the manifest to prevent duplicate execution:

```bash
# Update manifest status from "pending" to "in_progress"
# Include your agent name so others know who's working on it
sed -i '/id: "{bead_id}"/,/status:/ s/status: "pending"/status: "in_progress: {agent_name}"/' .beads/manifest.yaml
git add .beads/manifest.yaml && git commit -m "{bead_id}: claimed by {agent_name}"
git push origin HEAD:beads-sync
```

If the manifest already shows `in_progress` for your bead, STOP — another agent has it.

### 4. Reserve Your Files

```bash
# Reserve files you'll be editing
acfs reserve --add {file_path} --ttl 3600
```

### 5. Load Context

For each context reference in the bead:
1. Open the file
2. Find the landmark (search for `find:` value)
3. Read the relevant scope
4. Understand the pattern before implementing

**Do not skip any context entry.** Each one is there for a reason.

### 6. Update Bead Status

```bash
acfs bead status {bead_id} --set in_progress
```

## During Execution

### Follow TDD

Use the `kimchi:tdd` skill. Write tests from the bead's `tests.cases` field first.

### Commit Frequently

Each logical unit of work gets a commit:

```bash
git add {specific_files}
git commit -m "{bead_id}: {description}"
```

Commit message format:
- Start with bead ID
- Describe what changed
- Keep under 72 characters

### Handle Blockers

If blocked on a dependency:

1. Check if blocking bead is complete:
   ```bash
   acfs bead status {blocking_bead_id}
   ```

2. If not complete, send Agent Mail:
   ```bash
   acfs mail send \
     --to {agent_on_blocking_bead} \
     --subject "Blocked on {blocking_bead_id}" \
     --body "Bead {bead_id} needs {specific_thing} from {blocking_bead_id}"
   ```

3. Work on non-blocked tasks while waiting

## Completing a Bead

### 1. Run Verification Skill

Complete the `kimchi:verification-before-completion` skill checklist:
- All tests pass (entire suite)
- Each acceptance criterion verified
- No regressions
- Diff reviewed

### 2. Release File Reservations

```bash
acfs reserve --release {file_path}
```

### 3. Update Bead Status

```bash
acfs bead status {bead_id} --set complete
```

### 4. Push to beads-sync

```bash
git push origin HEAD:beads-sync
```

### 5. Send Completion Mail (if others are waiting)

```bash
acfs mail send \
  --to {waiting_agents} \
  --subject "Bead {bead_id} complete" \
  --body "Deliverables available: {list}"
```

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll read the rest of the bead later" | You'll miss context. Read it all now. |
| "Reservations slow me down" | Merge conflicts slow you down more. |
| "I know what this bead needs" | The bead knows what it needs. Read it. |
| "I'll update status when I'm done" | Status updates help other agents plan. Do it now. |
| "Agent Mail is overhead" | Silent blocking wastes everyone's time. |
| "Skip context, I know the codebase" | Context entries reference specific patterns. Read them. |

## Red Flags — STOP

- Writing code before reading the full bead
- Editing files without checking reservations
- Skipping context entries
- Not committing with bead ID prefix
- Being blocked and not communicating
- Marking complete without running verification skill

**ALL of these mean: STOP. Go back to step 1.**

## Verification

- [ ] Bead fully read before starting
- [ ] File reservations checked and acquired
- [ ] Context landmarks found and understood
- [ ] Commits include bead ID
- [ ] Blockers communicated via Agent Mail
- [ ] Reservations released on completion
- [ ] Status updated in ACFS
- [ ] Pushed to beads-sync

## Anti-Patterns

### FORBIDDEN: Editing without reservation

Always check reservations first. Conflicts waste everyone's time.

### FORBIDDEN: Silent blocking

If you're blocked, communicate immediately. Don't wait and hope.

### FORBIDDEN: Skipping context

Read the full bead and find all landmarks before writing code. Every context entry exists for a reason.

### FORBIDDEN: Orphaned beads

Always update status. A bead stuck in "in_progress" blocks downstream work.
