# Kimchi Implementation Context

> A guide for the implementing agent: what to steal, from where, and why.

---

## What You're Building

Kimchi is a Claude Code plugin that transforms vague ideas into validated, standalone task specifications (beads) ready for multi-agent execution. It combines the best patterns from four battle-tested AI coding workflow systems.

**The thesis:** The value in these systems is in their prompts, protocols, and patterns—not their code. We're extracting wisdom, not wrapping libraries.

---

## Source Repositories

| Source | Repository | License |
|--------|------------|---------|
| GSD | https://github.com/glittercowboy/get-shit-done | MIT |
| Superpowers | https://github.com/obra/superpowers | MIT |
| ACFS | https://github.com/Dicklesworthstone/agentic_coding_flywheel_setup | MIT |
| Compound Engineering | https://github.com/EveryInc/compound-engineering-plugin | MIT |

All sources are MIT licensed. You can freely adapt, modify, and incorporate their patterns.

---

## Why These Four Sources?

Each system solves a different piece of the AI-assisted coding puzzle:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           THE PROBLEM SPACE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  "I want to add user avatars"                                              │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────┐                                                       │
│  │ UNDERSTANDING   │◀── GSD: How do we extract complete requirements?     │
│  │ What exactly?   │                                                       │
│  └────────┬────────┘                                                       │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │ PLANNING        │◀── Compound: How do we avoid over-engineering?       │
│  │ How to build?   │                                                       │
│  └────────┬────────┘                                                       │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │ TASK SPECS      │◀── ACFS: How do we format for multi-agent execution? │
│  │ Beads for agents│                                                       │
│  └────────┬────────┘                                                       │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │ EXECUTION       │◀── Superpowers: How do we enforce quality?           │
│  │ Actually coding │                                                       │
│  └────────┬────────┘                                                       │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │ LEARNING        │◀── ACFS + Compound: How do we improve over time?     │
│  │ Getting better  │                                                       │
│  └─────────────────┘                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source 1: GSD (Get Shit Done)

**Repository:** https://github.com/glittercowboy/get-shit-done

**What GSD Does Well:**
- Structured clarification until complete understanding
- Phased planning with research before implementation
- CONTEXT.md pattern for capturing decisions
- Fresh subagent context windows (no accumulated confusion)
- Parallel execution with atomic commits

### What to Extract

#### 1. Clarification Question Flow

**Location:** Look at how GSD structures its initial conversation with users.

**Why:** GSD doesn't just ask "what do you want?" — it has categories of questions that systematically extract functional requirements, constraints, edge cases, and scope boundaries.

**Adapt for Kimchi:**
- The question categories (functional, data, integration, constraints, scope)
- The iterative approach (keep asking until confident)
- The output format (structured CONTEXT.md)

**Key insight from GSD:** Questions should be specific enough to get actionable answers, not vague "tell me more." Bad: "What else?" Good: "What should happen when the file upload fails mid-stream?"

#### 2. Requirements Structure (v1/v2/Out)

**Location:** How GSD categorizes requirements after clarification.

**Why:** This three-bucket system prevents scope creep by making explicit what's NOT in v1, while still capturing good ideas for later.

**Adapt for Kimchi:**
- The v1 (must have) / v2 (next iteration) / out of scope structure
- Acceptance criteria per v1 requirement
- The discipline of explicitly marking things as v2 or out

**Key insight from GSD:** "Out of scope" is not a trash bin—it's a parking lot. Capture it, just don't build it now.

#### 3. Research Before Planning

**Location:** GSD's approach to investigating the codebase before generating a plan.

**Why:** Plans that ignore existing patterns fail. GSD investigates what's already there before proposing what to build.

**Adapt for Kimchi:**
- Search for similar features in codebase
- Extract patterns (services, controllers, tests)
- Document with file references
- Note anti-patterns to avoid

**Key insight from GSD:** Research isn't optional. Skipping it leads to plans that fight the codebase instead of flowing with it.

#### 4. CONTEXT.md Pattern

**Location:** The output format GSD uses for capturing understanding.

**Why:** Having a single document that captures ALL decisions prevents "wait, I thought we said..." later.

**Adapt for Kimchi:**
- Section structure (summary, decisions by category, out of scope)
- The level of detail (specific values, not vague descriptions)
- Treating it as the source of truth

---

## Source 2: Superpowers

**Repository:** https://github.com/obra/superpowers

**What Superpowers Does Well:**
- TDD enforcement (mandatory, not suggested)
- Skills framework (contextually activated capabilities)
- Systematic debugging (4-phase root cause analysis)
- Git worktree workflows
- Meta-skill for creating new skills

### What to Extract

#### 1. TDD Skill

**Location:** `skills/testing/test-driven-development/SKILL.md` (or similar path)

**Why:** This is the most battle-tested TDD enforcement prompt we have. It doesn't just say "write tests" — it enforces RED-GREEN-REFACTOR with verification steps.

**Adapt for Kimchi:**
- The exact RED-GREEN-REFACTOR process
- The "verify it fails for the RIGHT reason" step
- The anti-patterns (writing implementation first, testing after)
- The enforcement language ("FORBIDDEN", "MANDATORY")

**Key insight from Superpowers:** TDD skills fail when they're suggestions. Superpowers uses strong language ("If you write code before tests, DELETE IT") that actually works.

#### 2. Systematic Debugging Skill

**Location:** `skills/debugging/` in Superpowers

**Why:** This 4-phase approach (OBSERVE → HYPOTHESIZE → TEST → FIX) prevents the "random changes hoping something works" anti-pattern that wastes so many agent iterations.

**Adapt for Kimchi:**
- The 4-phase structure exactly as written
- The documentation requirements at each phase
- The "one variable at a time" testing discipline
- The "fix root cause, not symptom" principle

**Key insight from Superpowers:** Debugging failures happen when agents skip straight to "fixing." The observation and hypothesis phases are mandatory.

#### 3. Skill Structure

**Location:** Any skill file in Superpowers

**Why:** Superpowers has figured out what makes a skill actually work: triggers, process, verification, anti-patterns.

**Adapt for Kimchi:**
```yaml
---
name: "Skill Name"
version: "1.0.0"  
description: "What this enforces"
triggers:
  - "when this activates"
---

# Skill Name

## When This Applies
[Conditions]

## Process
[Step by step]

## Verification
[How to confirm compliance]

## Anti-Patterns
[What NOT to do - with strong language]
```

**Key insight from Superpowers:** Skills need triggers (when do they activate?) and anti-patterns (what failures look like). Without these, skills are just documentation that gets ignored.

#### 4. Verification Before Completion

**Location:** Superpowers' task completion checklist

**Why:** "Tests pass" is not the same as "done." Superpowers has a checklist that catches the gap.

**Adapt for Kimchi:**
- Run ALL tests, not just new ones
- Manual verification of acceptance criteria
- Regression check
- Diff review (debug code? TODOs? hardcoded values?)

---

## Source 3: ACFS (Agentic Coding Flywheel Setup)

**Repository:** https://github.com/Dicklesworthstone/agentic_coding_flywheel_setup

**What ACFS Does Well:**
- Multi-agent coordination infrastructure
- Beads format for task specifications
- Agent Mail for inter-agent communication
- File reservations to prevent conflicts
- NTM (Named Tmux Manager) for orchestration
- Model-agnostic design
- Self-improvement loops

### What to Extract

#### 1. Beads Format

**Location:** Beads specification in ACFS documentation

**Why:** This is our OUTPUT format. Kimchi produces beads that ACFS consumes.

**CRITICAL:** We're adapting the beads format, not using it exactly. Our key change: **landmarks instead of line numbers** for context references.

**ACFS beads have:**
- Task ID and title
- Dependencies
- Context (file references)
- Deliverables
- Acceptance criteria

**Kimchi beads add:**
- `find:` landmarks instead of line numbers
- `scope:` modifiers
- Explicit test cases with run commands
- Complexity estimates
- Validation status

**Key insight from ACFS:** Beads work because they're self-contained. An agent can execute a bead without reading the plan, without context from other beads, without asking clarifying questions.

#### 2. Agent Mail Concept

**Location:** ACFS Agent Mail documentation

**Why:** When agents are blocked or complete work that unblocks others, they need to communicate.

**Adapt for Kimchi:** The `bead-protocol` skill needs to teach agents HOW to use Agent Mail:
- When to send (blocked, completed, need info)
- What to include (bead ID, specific need, context)
- When to check inbox

We don't implement Agent Mail (ACFS does), we just teach agents to use it.

#### 3. File Reservation Concept

**Location:** ACFS file reservation documentation

**Why:** Parallel agents editing the same file creates merge conflicts.

**Adapt for Kimchi:** Again, we don't implement this—we teach agents to use it:
- Check reservation before editing
- Reserve files you'll modify
- Release when done
- Handle "already reserved" gracefully

#### 4. Refinement Loop Patterns

**Location:** ACFS documentation on iterative improvement

**Why:** ACFS has patterns for "keep improving until good enough" that avoid infinite loops.

**Adapt for Kimchi:**
- Quality threshold (stop when good enough)
- Diminishing returns detection (stop when improvements are tiny)
- Regression detection (stop if getting worse)
- Max iterations (hard stop)

This becomes our "Ralph Wiggum" detection for future phases.

#### 5. Halmoni Inspiration

**Location:** ACFS self-improvement documentation

**Why:** The idea of capturing learnings and applying them to improve the system comes from ACFS's flywheel concept.

**Adapt for Kimchi:** Our "halmoni" system is inspired by but different from ACFS:
- ACFS improves infrastructure
- Kimchi improves skills, validators, personas
- Same philosophy: each cycle makes the next better

---

## Source 4: Compound Engineering

**Repository:** https://github.com/EveryInc/compound-engineering-plugin

**What Compound Does Well:**
- Multi-persona review (12+ specialized perspectives)
- "Prefer duplication over complexity" philosophy
- Feature trimming during planning
- Codify step (explicit learning capture)
- Strong opinions on simplicity

### What to Extract

#### 1. Multi-Persona Review

**Location:** Compound's review agent definitions

**Why:** One perspective misses things. Multiple specialized perspectives catch different issues.

**Compound has personas like:**
- Security Sentinel
- Performance Oracle
- Architecture Strategist
- UX Advocate
- etc.

**Adapt for Kimchi (planning focus, not code review):**
- Feature Trimmer: "Is this actually v1?"
- Complexity Detector: "Is this over-engineered?"
- Premature Optimization Detector: "Do we need this now?"
- Scope Guardian: "Does this belong in this work?"
- Test Coverage Advocate: "Are tests specified?"

**Key insight from Compound:** Each persona has a SPECIFIC concern and SPECIFIC questions. Vague personas ("think about quality") don't work.

#### 2. Simplicity Philosophy

**Location:** Compound's guiding principles

**Why:** This is the antidote to AI tendency toward over-engineering.

**Core principles to extract:**
- "Prefer duplication over wrong abstraction"
- "YAGNI: You Aren't Gonna Need It"
- "Hardcode first, configure later"
- "One obvious way to do it"

**Adapt for Kimchi:**
- These become the `simplicity-enforcement` skill
- Review personas use these as criteria
- Bead validation checks for unnecessary complexity

**Key insight from Compound:** AI agents love abstractions and "flexibility." They need explicit counter-pressure toward simplicity.

#### 3. Feature Trimming

**Location:** Compound's planning phase

**Why:** Plans naturally expand. Compound actively SHRINKS plans during review.

**Adapt for Kimchi:**
- Feature Trimmer persona actively looks for cuts
- "While we're at it" is a red flag
- Every feature must trace to a v1 requirement
- Review output includes "what we removed and why"

#### 4. Codify Step

**Location:** Compound's post-execution learning

**Why:** Learnings evaporate if not captured. Compound has an explicit "what did we learn?" step.

**Adapt for Kimchi:** This becomes halmoni:
- After execution, ask "what would have helped?"
- Propose specific improvements
- Apply if validated
- Track in changelog

---

## What We're Building Fresh

Some things don't exist in any source and we're creating them:

### 1. Landmarks Over Coordinates

**No source has this.** All four systems use line numbers for code references, which break when code changes.

**Our innovation:**
```yaml
# BAD (what sources do)
context:
  - file: "service.rb"
    lines: "12-34"

# GOOD (what we do)  
context:
  - file: "service.rb"
    find: "class UploadService"
    scope: "entire class"
```

### 2. Bead Validation Loop

**Sources validate plans, not beads.** We add a validation loop specifically for bead quality:
- Context completeness (can agent find everything?)
- Deliverables clarity (does agent know what to produce?)
- Test specification (are tests concrete?)
- Isolation check (is bead self-contained?)

### 3. Unified Orchestration

**Sources are separate tools.** We create a single `/kimchi:plan` that orchestrates:
clarify → requirements → research → generate → review → refine → beads → validate

### 4. Kimchi-Specific Personas

**Compound has code review personas. We need planning personas:**
- Feature Trimmer (adapted)
- Complexity Detector (new focus)
- Premature Optimization Detector (new)
- Scope Guardian (new)

### 5. Halmoni (할머니)

**ACFS has improvement loops. We personify it:**
- Taste (observe what happened)
- Adjust (propose changes)
- Remember (validate against history)
- Pass down (apply with versioning)

---

## How to Use the Sources

### Direct Extraction (copy and adapt)

These can be largely copied with minimal changes:

| What | From | Adaptation Needed |
|------|------|-------------------|
| TDD skill content | Superpowers | Minor formatting |
| Systematic debugging | Superpowers | Minor formatting |
| Question categories | GSD | Reformatting to our structure |
| CONTEXT.md template | GSD | Add our sections |
| Simplicity principles | Compound | Convert to skill format |

### Pattern Extraction (understand and reimplement)

These need understanding, then fresh implementation:

| What | From | Why Fresh? |
|------|------|------------|
| Multi-persona review | Compound | Different personas for planning |
| Beads format | ACFS | Adding landmarks, validation |
| Refinement loops | ACFS | Different exit conditions |
| Skill structure | Superpowers | Different triggers for Kimchi |

### Philosophy Extraction (absorb and apply)

These are mindsets, not code:

| Philosophy | From | How to Apply |
|------------|------|--------------|
| "Trim before build" | Compound | Infuse into review personas |
| "Fresh context windows" | GSD | Why beads must be standalone |
| "Skills are mandatory" | Superpowers | Strong enforcement language |
| "Flywheel improves itself" | ACFS | Halmoni's purpose |

---

## Implementation Priorities

When implementing, prioritize extraction in this order:

### Week 1-2: Structure
1. Clone all four repos locally for reference
2. Read GSD's clarification flow end-to-end
3. Read Superpowers' skill files for format understanding
4. Create plugin scaffold

### Week 3-4: Planning Pipeline  
1. Adapt GSD's clarification questions → `/kimchi:clarify`
2. Adapt GSD's requirements structure → `/kimchi:requirements`
3. Adapt GSD's research approach → `/kimchi:research`
4. Build plan generation (fresh, informed by all sources)

### Week 5-6: Review & Beads
1. Adapt Compound's persona approach → `/kimchi:review`
2. Adapt ACFS beads format + our landmarks → `/kimchi:beads`
3. Build validators (fresh, informed by what makes beads fail)

### Week 7-8: Skills
1. Copy/adapt Superpowers TDD skill
2. Copy/adapt Superpowers debugging skill
3. Adapt Compound simplicity principles → skill
4. Build bead-protocol skill (fresh, for ACFS integration)

### Week 9-10: Halmoni & Polish
1. Build halmoni (fresh, inspired by ACFS flywheel)
2. Integration testing
3. Documentation

---

## Key Files to Study in Each Repo

### GSD
```
get-shit-done/
├── [look for clarification/planning prompts]
├── [look for CONTEXT.md examples]
└── [look for requirements extraction logic]
```

### Superpowers
```
superpowers/
├── skills/
│   ├── testing/
│   │   └── test-driven-development/SKILL.md  ← COPY THIS
│   ├── debugging/
│   │   └── [debugging skill]  ← COPY THIS
│   └── [skill structure examples]
└── [meta-skill for creating skills]
```

### ACFS
```
agentic_coding_flywheel_setup/
├── [beads format documentation]
├── [agent mail documentation]  
├── [file reservation documentation]
└── [refinement loop patterns]
```

### Compound
```
compound-engineering-plugin/
├── [multi-persona review definitions]
├── [simplicity principles]
├── [feature trimming logic]
└── [codify step]
```

---

## What NOT to Do

### Don't: Build orchestration over the sources
We're not wrapping GSD + Superpowers + ACFS + Compound. We're extracting patterns and building fresh.

### Don't: Keep their code structure
Each source has its own architecture. Kimchi has its own. Extract wisdom, not code layout.

### Don't: Maintain compatibility
We're not trying to work with these tools. We're replacing their planning capabilities with something unified.

### Don't: Ignore the "why"
Each pattern exists because something failed without it. Understand the failure mode before adapting the solution.

### Don't: Over-engineer the extraction
"Prefer duplication over wrong abstraction" applies to US too. Start simple, iterate.

---

## Questions to Ask Yourself

When extracting from a source:

1. **What problem does this solve?** (The failure mode it prevents)
2. **What's the minimum that works?** (Don't over-extract)
3. **What's Kimchi-specific?** (Planning vs. execution context)
4. **Does our landmark approach change this?** (It often does)
5. **Would halmoni improve this over time?** (If yes, start simple)

---

## The Kimchi Thesis, Restated

**The value is in the prompts, not the plumbing.**

GSD, Superpowers, ACFS, and Compound have collectively discovered what makes AI coding workflows succeed:
- Ask clarifying questions until you truly understand
- Research before planning
- Trim before building  
- Make tasks standalone
- Enforce discipline through skills
- Learn from every execution

Kimchi is the synthesis. One plugin. One flow. Best patterns from all four.

Now go build it. 🍜

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | 2026-01-31 | Human + Claude | Initial context document |
