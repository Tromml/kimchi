---
name: kimchi:plan
description: This command should be used to run the Kimchi planning pipeline through refinement, transforming a vague idea into a draft plan ready for cross-model analysis. Orchestrates 6 stages: clarify, requirements, research, generate, review, refine. Use --full-auto to also run beads + validate after manual revise/synthesize.
argument-hint: "[feature idea] [--depth minimal|standard|comprehensive] [--skip-research] [--skip-review] [--no-push] [--full-auto]"
---

# Kimchi Plan

<command_purpose>
Planning pipeline orchestrator. Takes a vague idea and produces a draft plan ready for cross-model analysis. With --full-auto, also runs beads + validate.
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
- `--full-auto`: After refine, also run beads + validate (for when user has already done revise/synthesize)

If no idea provided, ask: "What feature or change would you like to plan?"

## Pipeline

### Depth Levels

**minimal:** Quick planning for small, clear features
```
clarify → requirements → generate → refine
```

**standard:** Full pipeline (default)
```
clarify → requirements → research → generate → review → refine
```

**comprehensive:** Deep planning for complex features
```
clarify (extra questions) → requirements → research (deep) → generate → review → refine (5 loops)
```

After refine, the pipeline stops. The user should then:
1. Run `/kimchi:plan-revise` in Claude, Codex, Gemini (or other models) for cross-model analysis
2. Run `/kimchi:plan-synthesize` to blend all revisions
3. Run `/kimchi:beads` to convert to bead specifications
4. Run `/kimchi:validate` to verify beads

With `--full-auto`, stages 9-10 (beads + validate) run automatically after refine.

### Execution

Run each stage as a slash command invocation. Between stages, show progress:

```
Starting Kimchi planning pipeline...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAGE 1/6: Clarification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Run /kimchi:clarify with the idea]

✓ Clarification complete → .kimchi/CONTEXT.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAGE 2/6: Requirements
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Run /kimchi:requirements]

✓ Requirements extracted → .kimchi/REQUIREMENTS.md

[... continue through all stages ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DRAFT PLAN COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Draft plan ready at .kimchi/PLAN-DRAFT.md

Next steps:
  1. Run /kimchi:plan-revise in Claude, Codex, and Gemini for cross-model analysis
  2. Run /kimchi:plan-synthesize to blend all revisions
  3. Run /kimchi:beads to convert to bead specifications
  4. Run /kimchi:validate to verify beads
```

### Stage Orchestration

For each stage, follow the instructions in the corresponding command file:

1. **Clarify** → Execute the clarify command logic with the feature idea
2. **Requirements** → Execute requirements command logic reading CONTEXT.md
3. **Research** → Execute research command logic (skip if --skip-research)
4. **Generate** → Execute generate command logic
5. **Review** → Execute review command logic (skip if --skip-review)
6. **Refine** → Execute refine command logic (skip if --skip-review, uses --max-refine-loops)

Pipeline stops here. User runs plan-revise and plan-synthesize manually across models.

If `--full-auto` is set, also run:
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
