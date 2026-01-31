# Validator: Test Specification

## Purpose

Ensure tests are specific enough to write. Every bead must have a test file, concrete test cases matching its complexity, and a run command.

## Minimum Test Case Requirements

| Complexity | Min Cases | Edge Cases | Error Cases |
|------------|-----------|------------|-------------|
| S | 2+ | 0 | 1 |
| M | 4+ | 1+ | 1+ |
| L | 6+ | 2+ | 2+ |

## Checks

- [ ] Test file path specified
  - BAD: "Add tests"
  - GOOD: `file: "spec/services/avatars/upload_service_spec.rb"`

- [ ] Test cases are scenarios, not vague descriptions
  - BAD: "Test uploading"
  - GOOD: "uploads file under 5MB and returns public URL"

- [ ] Edge cases identified based on complexity
  - S: 2+ cases minimum
  - M: 4+ cases, including 1+ edge case
  - L: 6+ cases, including 2+ edge cases

- [ ] Run command provided
  - BAD: "Run the tests"
  - GOOD: `run_command: "bundle exec rspec spec/services/avatars/upload_service_spec.rb"`

- [ ] Expected behavior is verifiable
  - BAD: "Should work correctly"
  - GOOD: "Returns URL matching https://bucket.s3.../{uuid}.{ext}"

- [ ] Error path tests included
  - BAD: Only happy-path cases
  - GOOD: Cases for invalid input, service failures, edge conditions

## Failure Triggers

- No test file specified
- Fewer than minimum cases for complexity
- No run command
- Vague case descriptions (contains "works", "handles", "correctly" without specifics)
- No error path cases
- Test cases that don't map to any acceptance criterion

## Output Format

For each failing check:
```
FAIL: [check name]
Bead: [bead_id]
Issue: [what's wrong]
Current: [what exists]
Required: [what's needed]
```

For passing beads:
```
PASS: Test specification has [N] cases for [complexity] task (minimum: [M])
```
