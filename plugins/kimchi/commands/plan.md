---
name: plan
description: "This command should be used to run the full Kimchi planning pipeline, transforming a vague idea into validated bead task specifications. Orchestrates all 8 stages: clarify, requirements, research, generate, review, refine, beads, validate."
argument-hint: "[feature idea] [--depth minimal|standard|comprehensive] [--skip-research] [--skip-review] [--no-push]"
---

# Kimchi Plan

<command_purpose>
Full planning pipeline orchestrator. Takes a vague idea and produces validated .beads/ ready for multi-agent execution.
</command_purpose>

## Input

Feature idea from `$ARGUMENTS`.

Parse options:
- `--depth minimal|standard|comprehensive` (default: standard)
- `--skip-research`: Skip codebase research stage
- `--skip-review`: Skip multi-persona review stage
- `--no-push`: Don't offer to push to beads-sync
- `--max-refine-loops N`: Max refinement iterations (default: 3)
- `--max-bead-validation-loops N`: Max bead enrichment iterations (default: 3)

If no idea provided, ask: "What feature or change would you like to plan?"

## Pipeline

### Depth Levels

**minimal:** Quick planning for small, clear features
```
clarify → requirements → generate → beads
```

**standard:** Full pipeline (default)
```
clarify → requirements → research → generate → review → refine → beads → validate
```

**comprehensive:** Deep planning for complex features
```
clarify (extra questions) → requirements → research (deep) → generate → review → refine (5 loops) → beads → validate (5 loops)
```

### Execution

Run each stage as a slash command invocation. Between stages, show progress:

```
Starting Kimchi planning pipeline...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAGE 1/8: Clarification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Run /kimchi:clarify with the idea]

✓ Clarification complete → .kimchi/CONTEXT.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAGE 2/8: Requirements
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Run /kimchi:requirements]

✓ Requirements extracted → .kimchi/REQUIREMENTS.md

[... continue through all stages ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLANNING COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created [N] validated beads:
  001-[slug] (S)
  002-[slug] (M)
  003-[slug] (M)

[Unless --no-push]: Push to beads-sync? [y/n]
```

### Stage Orchestration

For each stage, follow the instructions in the corresponding command file:

1. **Clarify** → Execute the clarify command logic with the feature idea
2. **Requirements** → Execute requirements command logic reading CONTEXT.md
3. **Research** → Execute research command logic (skip if --skip-research)
4. **Generate** → Execute generate command logic
5. **Review** → Execute review command logic (skip if --skip-review)
6. **Refine** → Execute refine command logic (skip if --skip-review, uses --max-refine-loops)
7. **Beads** → Execute beads command logic
8. **Validate** → Execute validate command logic (uses --max-bead-validation-loops)

### Error Handling

If any stage fails:
- Report which stage failed and why
- Save whatever artifacts were produced
- Tell user they can resume from the failed stage (e.g., "Run `/kimchi:research` to retry")

## Key Principles

- **Each stage reads from the previous stage's output file** — not from memory
- **Progress is visible** between stages
- **Interruption is safe** — artifacts are written after each stage completes
- **User interaction happens during clarify and review** — other stages are autonomous
