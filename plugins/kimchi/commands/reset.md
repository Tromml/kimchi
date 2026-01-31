---
name: reset
description: "This command should be used to clear the Kimchi working directory (.kimchi/) and start fresh. Preserves .beads/ directory. Use when starting a new planning session or recovering from a bad state."
---

# Kimchi Reset

Clear the planning pipeline working directory.

## Process

1. Check if `.kimchi/` directory exists
   - If not: "Nothing to reset. No .kimchi/ directory found."

2. List what will be deleted:
   ```
   Files to remove:
   - .kimchi/CONTEXT.md
   - .kimchi/REQUIREMENTS.md
   - .kimchi/RESEARCH.md
   - .kimchi/PLAN.md
   - .kimchi/PLAN-REVIEWED.md
   - .kimchi/PLAN-FINAL.md
   - .kimchi/VALIDATION-REPORT.md
   ```

3. Ask for confirmation using AskUserQuestion:
   - "This will delete all planning artifacts in .kimchi/. The .beads/ directory will be preserved. Continue?"
   - Options: "Yes, reset" / "No, cancel"

4. If confirmed:
   - Delete `.kimchi/` directory: `rm -rf .kimchi/`
   - Report: "Reset complete. .kimchi/ cleared. .beads/ preserved."
   - Note: "Run /kimchi:plan [idea] to start a new planning session."

5. If cancelled:
   - Report: "Reset cancelled."

## Important

- NEVER delete `.beads/` — those are validated outputs that ACFS may be consuming
- NEVER delete `plans/`, `inspiration/`, or any other kimchi plugin directories
- Only delete the `.kimchi/` working directory
