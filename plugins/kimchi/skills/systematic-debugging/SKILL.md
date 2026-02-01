---
name: kimchi:systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior — before proposing fixes. Enforces 4-phase root cause analysis.
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

**Violating the letter of this process is violating the spirit of debugging.**

## When This Applies

Whenever something isn't working as expected. This is NOT optional.

Use for ANY technical issue:
- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures
- Integration issues

**Use this ESPECIALLY when:**
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- You don't fully understand the issue

**Don't skip when:**
- Issue seems simple (simple bugs have root causes too)
- You're in a hurry (rushing guarantees rework)

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

**FORBIDDEN:** Random changes hoping something works.

## The Four Phases

You MUST complete each phase before proceeding to the next.

### Phase 1: OBSERVE

Gather evidence before forming theories.

1. **Reproduce the issue**
   - What exact steps trigger it?
   - Is it consistent or intermittent?
   - What's the exact error message?

2. **Collect context**
   - What was the input?
   - What was the expected output?
   - What was the actual output?
   - What changed recently?

3. **Read error messages carefully**
   - Don't skip past errors or warnings
   - Read stack traces completely
   - Note line numbers, file paths, error codes

4. **Document observations**
   ```
   Issue: Upload fails with "AccessDenied"
   Reproduces: Every time with files > 1MB
   Works: Files < 1MB upload successfully
   Recent changes: Updated AWS SDK yesterday
   ```

5. **Gather evidence in multi-component systems**

   BEFORE proposing fixes, add diagnostic instrumentation:
   ```
   For EACH component boundary:
     - Log what data enters component
     - Log what data exits component
     - Verify environment/config propagation
     - Check state at each layer

   Run once to gather evidence showing WHERE it breaks
   THEN analyze evidence to identify failing component
   THEN investigate that specific component
   ```

### Phase 2: HYPOTHESIZE

Form testable theories based on evidence.

1. **List possible causes**
   - Each hypothesis must be testable
   - Rank by likelihood based on evidence
   - Include "obvious" causes (they're often right)

2. **Document hypotheses**
   ```
   H1: S3 bucket policy changed (likelihood: low - no recent changes)
   H2: AWS SDK breaking change (likelihood: high - updated yesterday)
   H3: File size validation wrong (likelihood: medium - size-related)
   ```

### Phase 3: TEST

Validate or eliminate hypotheses systematically.

1. **Test highest likelihood first**
2. **One variable at a time**
3. **Document results**

```
Testing H2: AWS SDK breaking change
Action: Downgrade AWS SDK to previous version
Result: Upload works
Conclusion: H2 confirmed - SDK update introduced issue
```

4. **When you don't know**
   - Say "I don't understand X"
   - Don't pretend to know
   - Ask for help
   - Research more

### Phase 4: FIX

Address the ROOT CAUSE, not symptoms.

1. **Create failing test case**
   - Simplest possible reproduction
   - Automated test if possible
   - MUST have before fixing
   - Use the `kimchi:tdd` skill for writing proper failing tests

2. **Implement single fix**
   - Address the root cause identified
   - ONE change at a time
   - No "while I'm here" improvements
   - No bundled refactoring

3. **Verify the fix**
   - Original issue no longer reproduces
   - No new issues introduced
   - Tests pass

4. **If fix doesn't work**
   - STOP
   - Count: How many fixes have you tried?
   - If < 3: Return to Phase 1, re-analyze with new information
   - **If >= 3: STOP and question the architecture (step 5)**
   - DON'T attempt Fix #4 without architectural discussion

5. **If 3+ fixes failed: question architecture**

   Pattern indicating architectural problem:
   - Each fix reveals new shared state/coupling/problem in different place
   - Fixes require "massive refactoring" to implement
   - Each fix creates new symptoms elsewhere

   **STOP and question fundamentals:**
   - Is this pattern fundamentally sound?
   - Are we "sticking with it through sheer inertia"?
   - Should we refactor architecture vs. continue fixing symptoms?

   **Discuss with your human partner before attempting more fixes.**

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "I'll write test after confirming fix works" | Untested fixes don't stick. Test first proves it. |
| "Multiple fixes at once saves time" | Can't isolate what worked. Causes new bugs. |
| "I see the problem, let me fix it" | Seeing symptoms ≠ understanding root cause. |
| "One more fix attempt" (after 2+ failures) | 3+ failures = architectural problem. Question pattern, don't fix again. |

## Red Flags — STOP and Follow Process

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- **"One more fix attempt" (when already tried 2+)**
- **Each fix reveals new problem in different place**

**ALL of these mean: STOP. Return to Phase 1.**

**If 3+ fixes failed:** Question the architecture.

## Verification

- [ ] Issue was reproduced and documented
- [ ] Multiple hypotheses were considered
- [ ] Root cause was identified (not just symptoms)
- [ ] Fix addresses root cause
- [ ] Test added to prevent recurrence

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| **1. OBSERVE** | Read errors, reproduce, check changes, gather evidence | Understand WHAT and WHY |
| **2. HYPOTHESIZE** | List causes, rank likelihood | Testable theories formed |
| **3. TEST** | Test highest likelihood first, one variable at a time | Confirmed or new hypothesis |
| **4. FIX** | Create test, fix root cause, verify | Bug resolved, tests pass |
