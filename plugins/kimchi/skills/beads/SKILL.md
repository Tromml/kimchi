---
name: kimchi:beads
description: This command should be used to convert the final plan into standalone bead YAML task specifications for multi-agent execution. Ninth stage of the Kimchi planning pipeline. Produces .beads/ directory.
---

# Kimchi Beads

<command_purpose>
Convert plan tasks into self-contained bead YAML files with full context (using find: landmarks), deliverables, test specifications, and acceptance criteria. Each bead must be executable by an agent with ZERO external context.
</command_purpose>

## Input

Read in order of preference: `.kimchi/PLAN-SYNTHESIZED.md`, `.kimchi/PLAN-DRAFT.md`, `.kimchi/PLAN-REVIEWED.md`, or `.kimchi/PLAN.md`.
Also read `.kimchi/RESEARCH.md` for context references with landmarks.

## Process

### 1. Create .beads/ Directory

```bash
mkdir -p .beads
```

### 2. Convert Each Task to Bead YAML

For each task in the plan, create a bead file at `.beads/{id}-{slug}.yaml`:

```yaml
bead_id: "[ID]"
title: "[Task title]"
description: |
  [Detailed description of what to implement.
   Must be complete enough to execute without reading the plan.]

depends_on: ["[bead IDs]"]

context:
  - file: "[path/to/file]"
    find: "[search term to locate relevant code]"
    scope: "[entire class|entire method|block|etc]"
    purpose: "[Why this context is relevant]"

deliverables:
  - type: "[file_create|file_modify|file_delete]"
    path: "[full/path/to/file]"
    find: "[anchor point for file_modify]"
    action: "[add after|replace|add before — for file_modify]"
    description: |
      [What will be created or changed]

tests:
  file: "[path/to/test/file]"
  cases:
    - "[Test case description 1]"
    - "[Test case description 2]"
    - "[Edge case description]"
  run_command: "[command to run tests]"

acceptance_criteria:
  - "[Verifiable criterion 1]"
  - "[Verifiable criterion 2]"

estimated_complexity: "[S|M|L]"
requirements: ["[REQ-ID1]", "[REQ-ID2]"]
```

### 3. Context Rules (CRITICAL)

**Every file reference MUST use `find:` landmarks:**

```yaml
# GOOD
context:
  - file: "app/services/storage/s3_client.rb"
    find: "class S3Client"
    purpose: "Existing S3 wrapper to use"

# BAD — never use line numbers
context:
  - file: "app/services/storage/s3_client.rb"
    lines: "12-34"
```

**Find terms must be:**
- Specific enough to be unique in the file
- Stable (survive refactoring — class names, method names, not comments)
- Appropriate scope for purpose

### 4. Test Case Minimums

| Complexity | Minimum Cases | Edge Cases Required |
|------------|--------------|-------------------|
| S | 2+ | 0 |
| M | 4+ | 1+ |
| L | 6+ | 2+ |

### 5. Create Manifest

Write `.beads/manifest.yaml`:

```yaml
version: "1.0"
plan_id: "[feature-slug]-[date]"
created_at: "[ISO 8601 timestamp]"
created_by: "kimchi:beads"

source:
  context: ".kimchi/CONTEXT.md"
  requirements: ".kimchi/REQUIREMENTS.md"
  plan: ".kimchi/PLAN-SYNTHESIZED.md"  # or whichever plan file was used

beads:
  - id: "[ID]"
    file: "[filename].yaml"
    status: "pending"
    depends_on: []

  - id: "[ID]"
    file: "[filename].yaml"
    status: "pending"
    depends_on: ["[ID]"]

dependency_graph: |
  [ASCII art showing dependency relationships]
```

### 6. Validate No Cycles

Check that the dependency graph has no circular dependencies. If cycles found, report them as errors and ask user to resolve.

Report: "Beads created. [N] bead files in .beads/"
Suggest: "Run `/kimchi:validate` to verify beads are standalone-executable."

## Key Principles

- **Self-contained**: An agent reads ONE bead and has everything it needs
- **No cross-references**: Don't say "use the service from bead 002". Point to the actual file.
- **Landmarks over coordinates**: `find:` always, line numbers never
- **Explicit over implicit**: If the agent might need to search for it, put it in the bead
