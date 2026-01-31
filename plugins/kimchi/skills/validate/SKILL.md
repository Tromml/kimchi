---
name: kimchi:validate
description: This command should be used to validate bead YAML files for standalone executability. Runs 4 validators (context completeness, deliverables clarity, test specification, isolation) and enriches failing beads. Eighth stage of the Kimchi planning pipeline.
argument-hint: "[--loops N] [--bead ID]"
---

# Kimchi Validate

<command_purpose>
Ensure each bead is standalone-executable by running 4 validators. Auto-enrich failing beads. Flag for human review if enrichment can't fix them.
</command_purpose>

## Input

Read all `.beads/*.yaml` files (excluding `manifest.yaml`).

Parse `$ARGUMENTS`:
- `--loops N`: Max enrichment iterations per bead (default: 3)
- `--bead ID`: Validate only one specific bead

## Process

### 1. Run All Validators Per Bead

For each bead, run these 4 checks:

**Context Completeness:**
- Every file reference has a `find:` strategy
- Find terms are specific enough to be unique
- Find terms are stable (class/method names, not comments or TODOs)
- Scope is appropriate for purpose
- Error handling patterns referenced when task involves error handling
- FAIL if: any line number reference, implicit references, find terms matching multiple locations

**Deliverables Clarity:**
- Each deliverable has explicit type (file_create, file_modify, file_delete)
- file_create has full path
- file_modify has find: anchor point
- Descriptions are concrete (not "update the service")
- FAIL if: missing path, file_modify without anchor, vague descriptions

**Test Specification:**
- Test file path specified
- Test cases are scenarios, not vague ("uploads file" not "test uploading")
- Edge cases included (minimum by complexity: S=2, M=4, L=6)
- Run command provided
- FAIL if: no test file, fewer than minimum cases, no run command

**Isolation Check:**
- No references to other beads' internal details
- Dependencies only reference bead IDs
- All context is embedded or findable via find: landmarks
- No pronouns without antecedents ("it", "the others")
- Acceptance criteria don't reference other beads' outputs
- FAIL if: prose references to other beads, missing context

### 2. Enrichment Loop

For each failing bead:
```
while (score < passing) and (iterations < max_loops):
    identify what's missing
    enrich the bead:
      - Add missing context references (search codebase for find: terms)
      - Add missing find: anchors for file_modify deliverables
      - Add test cases to meet minimum
      - Replace vague descriptions with concrete ones
      - Resolve cross-bead references to actual file references
    re-validate
```

### 3. Flag Unrepairable Beads

If a bead can't pass after max_loops:
- Flag it in the report
- List specific failures
- Suggest manual fixes

### 4. Write Validation Report

Write `.kimchi/VALIDATION-REPORT.md`:

```markdown
# Bead Validation Report

**Validated:** [today's date]

## Summary

| Bead | Context | Deliverables | Tests | Isolation | Status |
|------|---------|-------------|-------|-----------|--------|
| 001 | PASS | PASS | PASS | PASS | PASS |
| 002 | ENRICHED | PASS | PASS | PASS | PASS |
| 003 | PASS | PASS | ENRICHED | PASS | PASS |

## Enrichments Applied

### Bead [ID]
- [What was enriched and why]

## Failed Beads (Require Manual Fix)

### Bead [ID]
- [What failed and suggested fix]

## Result

[N] of [N] beads validated and ready.
```

### 5. Offer Push

If all beads pass, ask: "Push beads to beads-sync branch? [y/n]"

If yes:
```bash
git add .beads/
git commit -m "kimchi: validated beads for [feature name]"
git push origin HEAD:beads-sync
```

Report: "[N] beads validated. Saved report to .kimchi/VALIDATION-REPORT.md"
