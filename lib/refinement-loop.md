# Refinement Loop Logic

Reference for the adaptive refinement loop used in `/kimchi:refine`.

## Scoring Criteria

Each criterion is scored 0-20 points (total: 100).

| Criterion | 0-5 (Poor) | 6-10 (Needs Work) | 11-15 (Good) | 16-20 (Excellent) |
|-----------|-----------|-------------------|--------------|-------------------|
| **Completeness** | Major requirements missing | Some requirements uncovered | Most covered, minor gaps | All v1 requirements mapped to tasks |
| **Clarity** | Ambiguous descriptions | Some vague language | Mostly clear, few ambiguities | Unambiguous, concrete descriptions |
| **Testability** | No acceptance criteria | Vague criteria | Measurable criteria, some gaps | Every task has verifiable criteria |
| **Independence** | Many unnecessary dependencies | Some avoidable coupling | Mostly independent, justified deps | Maximum parallelism, all deps necessary |
| **Size** | Multiple XL tasks | Has L tasks that could split | Appropriate sizing | All tasks S or M, L only when justified |

## Quality Thresholds

```
QUALITY_THRESHOLD = 90    # Exit when score >= 90
MIN_IMPROVEMENT = 5       # Exit when improvement < 5 (diminishing returns)
MAX_LOOPS = 3             # Default maximum iterations
```

## Loop Logic

```
function refine(plan, max_loops=3):
    prev_score = 0
    prev_plan = plan

    for i in range(max_loops):
        issues = evaluate(plan)
        score = calculate_score(issues)

        # Exit: quality reached
        if score >= QUALITY_THRESHOLD:
            return plan, "quality_reached"

        # Exit: diminishing returns
        if score - prev_score < MIN_IMPROVEMENT:
            return plan, "diminishing_returns"

        # Exit: regression (plan got worse)
        if score < prev_score:
            return prev_plan, "regression"

        plan = apply_improvements(plan, issues)
        prev_plan = plan
        prev_score = score

    return plan, "max_loops"
```

## Common Improvements by Criterion

### Completeness
- Map unmapped requirements to existing or new tasks
- Add missing acceptance criteria

### Clarity
- Replace vague language ("handle", "manage", "process") with specifics
- Add concrete examples to descriptions

### Testability
- Add measurable acceptance criteria
- Specify expected values, not just "works correctly"

### Independence
- Remove unnecessary dependencies
- Split tightly coupled tasks

### Size
- Split L tasks into S/M subtasks
- Ensure each subtask is independently deliverable

## Refinement History Format

```markdown
## Refinement History

| Iteration | Score | Changes | Exit Reason |
|-----------|-------|---------|-------------|
| 1 | 72/100 | Split Task 004 (too large) | - |
| 2 | 89/100 | Clarified Task 003 acceptance criteria | - |
| 3 | 94/100 | No significant improvements found | diminishing_returns |
```
