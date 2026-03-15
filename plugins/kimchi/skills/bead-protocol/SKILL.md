---
name: kimchi:bead-protocol
description: Use when executing a bead task. Detects orchestration mode (ACFS or GasTown) from .beads/manifest.yaml and enforces the appropriate execution discipline.
---

# Bead Protocol

## Overview

Beads are self-contained task specifications. Executing them requires discipline: read fully, follow context, communicate status.

**Core principle:** A bead contains everything you need. Read it completely before writing any code.

## Orchestration Detection

**Before anything else**, read `.beads/manifest.yaml` and check the `orchestration` field:

- If `orchestration: gastown` → Follow the **GasTown Protocol** section below
- If `orchestration: acfs` or field is missing → Follow the **ACFS Protocol** section below

## The Iron Law (applies to ALL modes)

```
READ THE FULL BEAD BEFORE WRITING ANY CODE
```

No skimming. No "I'll check the rest later." Read every field.

---

## GasTown Protocol

> 🏘️ **These are GasTown-managed beads.** Coordination is handled by the mayor, not by individual agents.

**If you are an agent and this manifest says `orchestration: gastown`, do NOT use the ACFS workflow below.** Instead:

1. **Read the full bead** — same Iron Law applies
2. **Load context** — find every landmark, understand patterns before implementing
3. **Follow TDD** — use `kimchi:tdd` skill, write tests from the bead's `tests.cases` first
4. **Commit frequently** with bead ID prefix: `{bead_id}: {description}`
5. **Report completion to the mayor** — the mayor tracks status, assigns work, and unblocks dependents

**What the mayor handles (NOT your responsibility in GasTown):**
- File reservations and conflict prevention
- Bead assignment and status tracking
- Dependency resolution and unblocking
- Inter-agent communication

**What you still own:**
- Reading the full bead before coding
- Loading all context landmarks
- TDD execution
- Running `kimchi:verification-before-completion` before reporting done
- Clean commits with bead ID prefix

### GasTown Verification Checklist

- [ ] Bead fully read before starting
- [ ] Context landmarks found and understood
- [ ] Tests written first (TDD)
- [ ] All acceptance criteria verified
- [ ] Commits include bead ID
- [ ] Completion reported to mayor

### If Blocked (GasTown)

Report the blocker to the mayor. The mayor will reassign work or unblock you. Do NOT try to coordinate directly with other agents — that's the mayor's job.

---

## ACFS Protocol

> This section applies when `orchestration: acfs` or no orchestration field is set.

### Starting a Bead

#### 1. Read the Full Bead

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

#### 2. Check File Reservations

Before editing any file:
```bash
# Check if file is reserved by another agent
acfs reserve --check {file_path}
```

If reserved:
- Do NOT proceed with that file
- Send Agent Mail to reservation holder
- Work on non-reserved files first

#### 3. Claim the Bead

Before starting work, claim the bead in the manifest to prevent duplicate execution:

```bash
# Update manifest status from "pending" to "in_progress"
# Include your agent name so others know who's working on it
sed -i '/id: "{bead_id}"/,/status:/ s/status: "pending"/status: "in_progress: {agent_name}"/' .beads/manifest.yaml
git add .beads/manifest.yaml && git commit -m "{bead_id}: claimed by {agent_name}"
git push origin HEAD:beads-sync
```

If the manifest already shows `in_progress` for your bead, STOP — another agent has it.

#### 4. Reserve Your Files

```bash
# Reserve files you'll be editing
acfs reserve --add {file_path} --ttl 3600
```

#### 5. Load Context

For each context reference in the bead:
1. Open the file
2. Find the landmark (search for `find:` value)
3. Read the relevant scope
4. Understand the pattern before implementing

**Do not skip any context entry.** Each one is there for a reason.

#### 6. Update Bead Status

```bash
acfs bead status {bead_id} --set in_progress
```

### During Execution (ACFS)

#### Follow TDD

Use the `kimchi:tdd` skill. Write tests from the bead's `tests.cases` field first.

#### Commit Frequently

Each logical unit of work gets a commit:

```bash
git add {specific_files}
git commit -m "{bead_id}: {description}"
```

Commit message format:
- Start with bead ID
- Describe what changed
- Keep under 72 characters

#### Handle Blockers

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

### Completing a Bead (ACFS)

#### 1. Run Verification Skill

Complete the `kimchi:verification-before-completion` skill checklist:
- All tests pass (entire suite)
- Each acceptance criterion verified
- No regressions
- Diff reviewed

#### 2. Release File Reservations

```bash
acfs reserve --release {file_path}
```

#### 3. Update Bead Status

```bash
acfs bead status {bead_id} --set complete
```

#### 4. Push to beads-sync

```bash
git push origin HEAD:beads-sync
```

#### 5. Send Completion Mail (if others are waiting)

```bash
acfs mail send \
  --to {waiting_agents} \
  --subject "Bead {bead_id} complete" \
  --body "Deliverables available: {list}"
```

### ACFS Verification Checklist

- [ ] Bead fully read before starting
- [ ] File reservations checked and acquired
- [ ] Context landmarks found and understood
- [ ] Commits include bead ID
- [ ] Blockers communicated via Agent Mail
- [ ] Reservations released on completion
- [ ] Status updated in ACFS
- [ ] Pushed to beads-sync

---

## Common Rationalizations (All Modes)

| Excuse | Reality |
|--------|---------|
| "I'll read the rest of the bead later" | You'll miss context. Read it all now. |
| "I know what this bead needs" | The bead knows what it needs. Read it. |
| "Skip context, I know the codebase" | Context entries reference specific patterns. Read them. |
| "Reservations slow me down" | Merge conflicts slow you down more. (ACFS) |
| "Agent Mail is overhead" | Silent blocking wastes everyone's time. (ACFS) |
| "I'll just coordinate directly" | Let the mayor handle it. (GasTown) |

## Red Flags — STOP

- Writing code before reading the full bead
- Skipping context entries
- Not committing with bead ID prefix
- Marking complete without running verification skill
- (ACFS) Editing files without checking reservations
- (ACFS) Being blocked and not communicating via Agent Mail
- (GasTown) Trying to coordinate directly with other agents instead of going through the mayor

**ALL of these mean: STOP. Go back to step 1.**

## Anti-Patterns

### FORBIDDEN: Skipping context

Read the full bead and find all landmarks before writing code. Every context entry exists for a reason.

### FORBIDDEN: Orphaned beads

Always update status. A bead stuck in "in_progress" blocks downstream work.

### FORBIDDEN (ACFS): Editing without reservation

Always check reservations first. Conflicts waste everyone's time.

### FORBIDDEN (ACFS): Silent blocking

If you're blocked, communicate immediately via Agent Mail. Don't wait and hope.

### FORBIDDEN (GasTown): Rogue coordination

Don't message other agents directly. The mayor handles all inter-agent coordination.
