---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing — before committing or creating PRs. Evidence before assertions, always.
---

# Verification Before Completion

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

## Process

### 1. Run ALL Tests

Not just the new tests. The entire test suite.

```bash
# Run full test suite — must be 100% pass
bundle exec rspec

# Any failure = task NOT complete
```

### 2. Verify Acceptance Criteria

For each criterion in the bead/task:

```
Acceptance Criteria:
- [ ] Upload endpoint accepts JPEG, PNG, WebP
- [ ] Files over 5MB rejected with clear error
- [ ] Successful upload returns avatar URL

Manual verification:
□ Tested JPEG upload → works
□ Tested PNG upload → works
□ Tested WebP upload → works
□ Tested 6MB file → rejected with "File too large" error
□ Tested valid upload → returns https://bucket.s3.../avatar.jpg
```

### 3. Check for Regressions

Did the change break anything else?

```bash
# If touching shared code, run related tests
bundle exec rspec spec/services/storage/

# Check for new warnings
bundle exec rspec 2>&1 | grep -i warning
```

### 4. Review the Diff

Look at what actually changed:

```bash
git diff --stat
git diff
```

Questions:
- Is there any debug code left in?
- Are there any TODO comments that should be resolved?
- Is there any commented-out code?
- Are there any hardcoded values that should be config?

### 5. Documentation Check

If the task specified documentation:
- [ ] README updated (if required)
- [ ] Code comments for complex logic
- [ ] API documentation (if endpoint)

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Requirements met | Line-by-line checklist | Tests passing |
| Agent completed | VCS diff shows changes | Agent reports "success" |

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Verify independently |
| "Partial check is enough" | Partial proves nothing |

## Red Flags — STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Done!")
- About to commit/push/PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- **ANY wording implying success without having run verification**

**ALL of these mean: STOP. Run the verification command. Read the output. Then speak.**

## Verification Checklist

Before marking complete, ALL must be true:

- [ ] All tests pass (entire suite, fresh run)
- [ ] Each acceptance criterion manually verified
- [ ] No regressions in related functionality
- [ ] Diff reviewed, no debug code
- [ ] Documentation complete (if required)
- [ ] Evidence cited for every claim

## Anti-Patterns

### FORBIDDEN: "Tests pass, ship it"

Passing tests are necessary but not sufficient. Verify acceptance criteria manually.

### FORBIDDEN: Skipping manual verification

Automated tests don't catch everything. Verify the actual behavior.

### FORBIDDEN: Marking complete with known issues

If something isn't right, the task isn't complete. Don't create "follow-up" tasks for things that should have been done.

## The Bottom Line

**No shortcuts for verification.**

Run the command. Read the output. THEN claim the result.

This is non-negotiable.
