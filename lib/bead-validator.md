# Bead Validation Logic

Reference for the bead validation loop used in `/kimchi:validate`.

## Validation Process

For each bead, run all 4 validators:

1. **Context Completeness** (`validators/context-completeness.md`)
2. **Deliverables Clarity** (`validators/deliverables-clarity.md`)
3. **Test Specification** (`validators/test-specification.md`)
4. **Isolation Check** (`validators/isolation-check.md`)

## Validation Loop

```
for each bead:
    score = run_all_validators(bead)

    while score < THRESHOLD and iterations < MAX_ENRICHMENT_LOOPS:
        missing = identify_missing_elements(bead)
        bead = enrich_bead(bead, missing)
        score = run_all_validators(bead)
        iterations++

    if score < THRESHOLD:
        flag_for_human_review(bead)
```

### Constants

```
THRESHOLD = all 4 validators pass
MAX_ENRICHMENT_LOOPS = 3
```

## Enrichment Strategies

When a validator fails, apply the appropriate enrichment:

### Context Completeness Failures

| Issue | Enrichment |
|-------|-----------|
| Missing `find:` strategy | Search codebase for the file, identify unique landmark |
| Find term not unique | Add `scope:` modifier or use more specific term |
| Missing error handling pattern | Search for `rescue`/`catch` in similar services |
| Missing logging pattern | Search for logger usage in similar services |

### Deliverables Clarity Failures

| Issue | Enrichment |
|-------|-----------|
| Missing type | Infer from description (new file = `file_create`, etc.) |
| Relative path | Resolve to full project-relative path |
| `file_modify` without anchor | Search file for appropriate `find:` anchor |
| Vague description | Expand with specific method names and behavior |

### Test Specification Failures

| Issue | Enrichment |
|-------|-----------|
| Too few cases | Add edge cases based on complexity level |
| Missing run command | Infer from test framework and file path |
| Vague cases | Rewrite with specific inputs and expected outputs |
| No error cases | Add cases for invalid input, service failure |

### Isolation Check Failures

| Issue | Enrichment |
|-------|-----------|
| Reference to other bead | Replace with direct file/find reference |
| Vague pronoun | Replace with explicit file path and find strategy |
| Dependent acceptance criteria | Rewrite to reference concrete data/state |

## Unrepairable Beads

Some issues can't be auto-enriched. Flag these for human review:

- Bead depends on work not defined in any other bead
- Required context file doesn't exist in codebase
- Acceptance criteria require manual/visual verification
- Task scope is genuinely unclear

## Validation Report Format

```markdown
# Validation Report

## Summary

| Bead | Context | Deliverables | Tests | Isolation | Status |
|------|---------|--------------|-------|-----------|--------|
| 001  | PASS | PASS | PASS | PASS | PASS |
| 002  | PASS (enriched) | PASS | PASS | PASS | PASS |
| 003  | PASS | PASS | FAIL | PASS | NEEDS REVIEW |

## Enrichments Applied

### Bead 002
- Added context: error handling pattern reference
- Reason: Task involves error handling but pattern wasn't referenced

## Beads Needing Human Review

### Bead 003
- Validator: Test Specification
- Issue: Acceptance criteria require visual verification of UI layout
- Cannot auto-enrich: visual verification not automatable
```
