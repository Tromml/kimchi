---
name: kimchi:status
description: This command should be used to check the current state of the Kimchi planning pipeline, including which stages have completed, what artifacts exist, and bead validation status.
---

# Kimchi Status

Check the current state of the planning pipeline.

## Process

1. Check if `.kimchi/` directory exists
2. If no `.kimchi/` directory:
   - Report: "No active plan. Run `/kimchi:plan [idea]` to start."
   - Check if `.beads/` exists and report bead count if so

3. If `.kimchi/` exists, list artifacts and their status:

```
Check for each file:
- .kimchi/CONTEXT.md      → Stage 1: Clarification
- .kimchi/REQUIREMENTS.md → Stage 2: Requirements
- .kimchi/RESEARCH.md     → Stage 3: Research
- .kimchi/PLAN.md         → Stage 4: Generation
- .kimchi/PLAN-REVIEWED.md → Stage 5: Review
- .kimchi/PLAN-FINAL.md   → Stage 6: Refinement
- .kimchi/VALIDATION-REPORT.md → Stage 8: Validation
```

4. Check `.beads/` directory:
   - Count `.yaml` files (excluding manifest)
   - Check if `manifest.yaml` exists
   - Report validation status from VALIDATION-REPORT.md if it exists

5. Format output:

```
Kimchi Pipeline Status
═══════════════════════

Stage 1: Clarification     ✓ CONTEXT.md (modified: [date])
Stage 2: Requirements       ✓ REQUIREMENTS.md (modified: [date])
Stage 3: Research           ✗ Not started
Stage 4: Generation         ✗ Not started
Stage 5: Review             ✗ Not started
Stage 6: Refinement         ✗ Not started
Stage 7: Bead Conversion    ✗ Not started
Stage 8: Validation         ✗ Not started

Beads: [N] files in .beads/
Next step: Run /kimchi:research to continue pipeline
```

Use `ls -la` on the `.kimchi/` and `.beads/` directories to check file existence and modification dates.
