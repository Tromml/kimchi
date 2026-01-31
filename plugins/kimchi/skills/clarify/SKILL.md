---
name: kimchi:clarify
description: This command should be used to extract complete understanding of a feature idea through structured clarification questions. First stage of the Kimchi planning pipeline. Produces .kimchi/CONTEXT.md.
argument-hint: "[feature idea]"
---

# Kimchi Clarify

<command_purpose>
Extract complete understanding of a feature idea through structured, iterative clarification questions. Output a CONTEXT.md that captures all decisions so downstream stages never need to ask the user again.
</command_purpose>

## Input

Feature idea from `$ARGUMENTS`. If empty, ask: "What feature or change would you like to plan?"

## Process

### 1. Parse the Initial Idea

Analyze the idea for:
- **Domain**: What area of the system does this touch?
- **Scope**: How big does this feel? (single feature, multi-feature, architectural)
- **Implied requirements**: What's obviously needed even if not stated?
- **Ambiguities**: What could be interpreted multiple ways?

### 2. Generate Clarification Questions

Ask questions in focused batches (3-5 at a time) using the AskUserQuestion tool. Draw from these categories but only ask what's relevant:

**Functional Questions:**
- "When you say [X], do you mean [interpretation A] or [interpretation B]?"
- "What should happen when [edge case]?"
- "Who can perform this action? (all users / admins / specific roles)"
- "Should this be sync or async? What are the latency expectations?"

**Data Questions:**
- "What's the maximum [size/count/length] we should support?"
- "What formats are acceptable? What should be rejected?"
- "Where does this data come from? Where does it go?"
- "What validation rules apply?"

**Integration Questions:**
- "How does this interact with [existing feature X]?"
- "Are there existing patterns in the codebase for this?"
- "What external services/APIs are involved?"

**Constraint Questions:**
- "What's the expected load? (requests/sec, concurrent users)"
- "Are there security considerations? (auth, audit, encryption)"
- "What's the error budget? (can it fail silently? must it retry?)"

**Scope Questions:**
- "Is [implied feature Y] part of this, or separate/later?"
- "What's the minimum viable version vs. nice-to-have?"

### 3. Question Strategy

- Ask specific questions that get actionable answers, not vague "tell me more"
- Follow the thread — if an answer reveals new complexity, ask about it
- Challenge vagueness — make abstract concrete with specific examples
- Maximum 15 questions total before wrapping up
- If user says "done", "that's enough", "let's move on" — stop asking
- After each batch, assess: "Do I have enough to write CONTEXT.md?" If yes, stop.

### 4. Write CONTEXT.md

Create `.kimchi/` directory if it doesn't exist, then write `.kimchi/CONTEXT.md`:

```markdown
# Feature: [Feature Name]

**Gathered:** [today's date]
**Status:** Ready for requirements extraction

<domain>
## Feature Boundary

[Clear statement of what this feature delivers. The scope anchor.]

</domain>

<decisions>
## Implementation Decisions

### [Area 1 discussed]
- [Specific decision made]
- [Another decision]

### [Area 2 discussed]
- [Specific decision made]

### Claude's Discretion
[Areas where user said "you decide" or didn't express preference — Claude has flexibility here]

</decisions>

<specifics>
## Specific Ideas

[Any "I want it like X" references, particular behaviors, interaction patterns mentioned]

[If none: "No specific requirements — open to standard approaches"]

</specifics>

<deferred>
## Deferred Ideas

[Ideas that came up but belong in future work. Captured so they're not lost.]

[If none: "None — discussion stayed within feature scope"]

</deferred>
```

### 5. Confirm

Show the user a summary of CONTEXT.md and ask: "Does this capture your intent? Anything to add or correct?"

If corrections needed, update CONTEXT.md and confirm again.

Report: "Clarification complete. Saved to .kimchi/CONTEXT.md"
Suggest: "Run `/kimchi:requirements` to extract and categorize requirements."

## Key Principles

- **Decisions, not descriptions**: Capture "card-based layout, not timeline" not "modern and clean"
- **Concrete, not vague**: "Max 5MB file size" not "reasonable file size"
- **Explicit scope**: What's IN and what's OUT, both documented
- **Claude's Discretion**: Where the user doesn't care, say so — gives downstream agents flexibility
