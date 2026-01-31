# Validator: Isolation Check

## Purpose

Ensure the bead can be executed without other beads' context. An agent should be able to pick up this bead and execute it with ZERO knowledge of other beads.

## Checks

- [ ] No references to other beads' internal details
  - BAD: "Use the service from bead 002"
  - GOOD: Context entry pointing to actual file with find strategy

- [ ] Dependencies only reference bead IDs
  - BAD: `depends_on: ["the upload service"]`
  - GOOD: `depends_on: ["002"]`

- [ ] All context is embedded or findable
  - BAD: "Follow the pattern we discussed"
  - GOOD: Context entry with file and find

- [ ] No pronouns without antecedents
  - BAD: "It should handle errors like the others"
  - GOOD: Explicit file reference to error handling pattern

- [ ] Acceptance criteria don't reference other beads
  - BAD: "Works with the component from task 005"
  - GOOD: "Avatar URL is stored in user.avatar_profile_url"

- [ ] Description is self-contained
  - BAD: "Continues the work from bead 001"
  - GOOD: Full description of what to build and why

## Failure Triggers

- Prose references to other beads ("bead 002", "task 3", "previous task")
- Missing context that would require reading other beads
- Acceptance criteria dependent on uncontrolled outputs
- Vague references ("the service", "the component", "as before")
- Description assumes knowledge from other beads
- "See above" or "as mentioned" in any field

## Output Format

For each failing check:
```
FAIL: [check name]
Bead: [bead_id]
Field: [which field has the issue]
Issue: [the problematic reference]
Fix: [how to make it standalone]
```

For passing beads:
```
PASS: Bead is fully self-contained and executable without other bead context
```
