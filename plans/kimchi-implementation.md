# feat: Implement Kimchi Claude Code Plugin

**Type:** Enhancement
**Date:** 2026-01-31
**Status:** Draft

---

## Overview

Kimchi is a Claude Code plugin that transforms vague feature ideas into validated, standalone task specifications ("beads") for multi-agent execution via ACFS infrastructure. It synthesizes patterns from four MIT-licensed sources: GSD, Superpowers, ACFS, and Compound Engineering.

The plugin provides:
- An 8-stage planning pipeline (`/kimchi:plan`)
- 4 review personas for plan critique
- 4 bead validators for quality assurance
- 5 execution skills loaded per agent
- A self-improvement system (Halmoni)

## Problem Statement

AI coding agents fail in predictable ways: vague requirements lead to wasted iterations, plans lack detail for standalone execution, agents skip tests and debug randomly, learnings evaporate between sessions, and over-engineering bloats simple features. Four separate tools (GSD, Superpowers, ACFS, Compound Engineering) each solve a piece of this puzzle, but no unified solution exists.

## Proposed Solution

Build a Claude Code plugin following the proven plugin architecture (`.claude-plugin/plugin.json`, `commands/`, `agents/`, `skills/`, `hooks/`). Implement in phases, starting with the plugin scaffold and core pipeline, then adding review, validation, execution skills, and finally the Halmoni learning system.

---

## Technical Approach

### Architecture

Kimchi is a **prompt-native** Claude Code plugin. No TypeScript/JavaScript runtime -- all logic lives in markdown files that Claude loads as instructions. The plugin structure follows the compound-engineering reference implementation pattern.

```
kimchi/
├── .claude-plugin/
│   └── plugin.json              # Manifest (ONLY file in this dir)
├── commands/                    # Slash commands (/kimchi:*)
│   ├── plan.md                  # Full pipeline orchestrator
│   ├── clarify.md               # Stage 1: Clarification
│   ├── requirements.md          # Stage 2: Requirements extraction
│   ├── research.md              # Stage 3: Codebase research
│   ├── generate.md              # Stage 4: Plan generation
│   ├── review.md                # Stage 5: Multi-persona review
│   ├── refine.md                # Stage 6: Adaptive refinement
│   ├── beads.md                 # Stage 7: Bead conversion
│   ├── validate.md              # Stage 8: Bead validation
│   ├── skills.md                # List skills
│   ├── skill.md                 # Show skill content
│   ├── halmoni.md               # Self-improvement
│   ├── status.md                # Pipeline status
│   └── reset.md                 # Clear working directory
├── agents/                      # Subagent definitions
│   ├── pipeline/                # Planning pipeline agents
│   │   ├── clarifier.md         # Drives clarification Q&A
│   │   ├── researcher.md        # Codebase pattern discovery
│   │   └── bead-converter.md    # Plan-to-bead conversion
│   └── review/                  # Review persona agents
│       ├── feature-trimmer.md
│       ├── complexity-detector.md
│       ├── premature-optimization-detector.md
│       ├── scope-guardian.md
│       └── test-coverage-advocate.md
├── skills/                      # Execution skills (SKILL.md)
│   ├── tdd/
│   │   └── SKILL.md
│   ├── systematic-debugging/
│   │   └── SKILL.md
│   ├── verification-before-completion/
│   │   └── SKILL.md
│   ├── simplicity-enforcement/
│   │   └── SKILL.md
│   └── bead-protocol/
│       └── SKILL.md
├── hooks/
│   └── hooks.json               # SessionStart: inject skill awareness
├── lib/                         # Shared reference material
│   ├── clarification-questions.md
│   ├── find-strategies.md
│   ├── refinement-loop.md
│   └── bead-validator.md
├── templates/                   # Output templates
│   ├── CONTEXT.md
│   ├── REQUIREMENTS.md
│   ├── RESEARCH.md
│   ├── PLAN.md
│   ├── bead.yaml
│   └── manifest.yaml
├── validators/                  # Bead validators
│   ├── context-completeness.md
│   ├── deliverables-clarity.md
│   ├── test-specification.md
│   └── isolation-check.md
├── personas/                    # Review persona definitions
│   ├── feature-trimmer.md
│   ├── complexity-detector.md
│   ├── premature-optimization-detector.md
│   ├── scope-guardian.md
│   └── test-coverage-advocate.md
├── inspiration/                 # Source repos (reference only)
│   ├── gsd/
│   ├── superpowers/
│   ├── acfs/
│   └── compound-engineering/
├── KIMCHI_CONTEXT.md            # Design context document
├── KIMCHI_TECHNICAL_SPEC.md     # Full technical specification
└── plans/                       # This plan lives here
```

### Key Design Decisions

1. **Prompt-native architecture**: All logic in markdown, no build step, no runtime dependencies
2. **Commands + Agents separation**: Commands are thin orchestrators; agents do the heavy lifting (GSD pattern)
3. **Skills are always-on**: All 5 execution skills loaded into every agent context (Superpowers forcing-function pattern)
4. **Landmarks over coordinates**: All code references use `find:` semantic identifiers, never line numbers
5. **ACFS is optional**: Plugin produces .beads/ directory; ACFS consumption is separate and not required

---

## Implementation Phases

### Phase 1: Plugin Scaffold & Core Infrastructure

**Goal:** Working plugin that installs, registers all commands (stubs), and has templates ready.

**Tasks:**

- [ ] Create `.claude-plugin/plugin.json` manifest
  - `plugin.json`: name "kimchi", version "0.1.0", description, author, keywords
  - Reference: `inspiration/compound-engineering/plugins/compound-engineering/.claude-plugin/plugin.json`

- [ ] Create all command stub files in `commands/`
  - Each command: YAML frontmatter (name, description, argument-hint) + "Not yet implemented" body
  - 14 command files total (plan, clarify, requirements, research, generate, review, refine, beads, validate, skills, skill, halmoni, status, reset)
  - Reference: `inspiration/compound-engineering/plugins/compound-engineering/commands/`

- [ ] Create output templates in `templates/`
  - `CONTEXT.md` template (adapt from GSD: `inspiration/gsd/get-shit-done/templates/context.md`)
  - `REQUIREMENTS.md` template (adapt from GSD: `inspiration/gsd/get-shit-done/templates/requirements.md`)
  - `RESEARCH.md` template (new, based on spec section 5.4)
  - `PLAN.md` template (new, based on spec section 5.5)
  - `bead.yaml` template (from spec section 7.1)
  - `manifest.yaml` template (from spec section 4.3)

- [ ] Implement `/kimchi:status` command
  - Check for `.kimchi/` directory existence
  - List existing artifacts with last-modified dates
  - Show pipeline state (which stages have completed)

- [ ] Implement `/kimchi:reset` command
  - Clear `.kimchi/` directory
  - Preserve `.beads/` directory
  - Confirm before deleting

- [ ] Create `hooks/hooks.json` with SessionStart hook
  - Inject awareness of available Kimchi skills and commands
  - Reference: `inspiration/superpowers/hooks/session-start.sh`

**Acceptance Criteria:**
- [ ] Plugin installs via Claude Code plugin install mechanism
- [ ] All 14 commands appear in `/` autocomplete as `/kimchi:*`
- [ ] `/kimchi:status` shows "No active plan" when clean
- [ ] `/kimchi:reset` clears `.kimchi/` safely
- [ ] Templates exist and follow spec format

---

### Phase 2: Clarification & Requirements (Pipeline Stages 1-2)

**Goal:** `/kimchi:clarify` produces CONTEXT.md, `/kimchi:requirements` produces REQUIREMENTS.md.

**Tasks:**

- [ ] Create `lib/clarification-questions.md`
  - 5 question categories: Functional, Data, Integration, Constraints, Scope
  - Adapt questioning philosophy from GSD (`inspiration/gsd/get-shit-done/references/questioning.md`)
  - Specific, actionable questions (not vague "tell me more")
  - Max 15 questions before forced termination
  - User can type "done" to exit early

- [ ] Implement `commands/clarify.md`
  - Parse initial idea for domain, scope, implied requirements
  - Use AskUserQuestion tool for structured Q&A
  - Iterate until confidence or max questions reached
  - Output `.kimchi/CONTEXT.md` using template
  - Handle edge case: empty idea (prompt user)

- [ ] Implement `commands/requirements.md`
  - Read `.kimchi/CONTEXT.md` as input
  - Categorize into v1 (must have), v2 (next iteration), out of scope
  - Assign requirement IDs (R1, R2, etc.)
  - Define acceptance criteria per v1 requirement
  - Output `.kimchi/REQUIREMENTS.md`

- [ ] Create `agents/pipeline/clarifier.md`
  - Agent with `context: fork` for clean context window
  - Loaded with clarification-questions.md reference
  - Drives the Q&A loop, writes CONTEXT.md

**Acceptance Criteria:**
- [ ] `/kimchi:clarify "add user avatars"` produces well-structured CONTEXT.md
- [ ] Clarification terminates after max questions or user "done"
- [ ] Empty idea shows helpful error
- [ ] `/kimchi:requirements` produces v1/v2/out-of-scope with acceptance criteria
- [ ] Requirements trace back to CONTEXT.md decisions

---

### Phase 3: Research & Plan Generation (Pipeline Stages 3-4)

**Goal:** `/kimchi:research` produces RESEARCH.md, `/kimchi:generate` produces PLAN.md.

**Tasks:**

- [ ] Create `lib/find-strategies.md`
  - Document landmark patterns: class/method/module/constant/error/config/import
  - Scope modifiers: entire method, entire class, entire file, block, until blank line
  - Reference: spec section 7.3-7.4

- [ ] Implement `commands/research.md`
  - Search codebase for similar features (Glob, Grep)
  - Identify established patterns with `find:` landmarks
  - Detect test framework and runner
  - Document anti-patterns to avoid
  - Falls back to framework docs if no codebase patterns found
  - Output `.kimchi/RESEARCH.md`

- [ ] Create `agents/pipeline/researcher.md`
  - Agent with tools: Glob, Grep, Read, WebSearch, WebFetch
  - Explores codebase, extracts patterns with landmarks
  - Detects language/framework from package manager files

- [ ] Implement `commands/generate.md`
  - Read CONTEXT.md, REQUIREMENTS.md, RESEARCH.md
  - Map requirements to implementation tasks
  - Identify dependencies between tasks
  - Estimate complexity (S/M/L) using heuristics from spec section 5.5
  - Generate dependency graph
  - Output `.kimchi/PLAN.md`

**Acceptance Criteria:**
- [ ] `/kimchi:research` finds patterns with `find:` landmarks (not line numbers)
- [ ] Research handles empty/new codebases gracefully
- [ ] `/kimchi:generate` produces task breakdown with dependency graph
- [ ] Complexity estimates follow S/M/L heuristics
- [ ] Every task traces to at least one v1 requirement

---

### Phase 4: Review & Refinement (Pipeline Stages 5-6)

**Goal:** `/kimchi:review` runs multi-persona review, `/kimchi:refine` iterates to quality.

**Tasks:**

- [ ] Create 5 review persona files in `personas/`
  - `feature-trimmer.md` - identify non-v1 features (adapt from spec section 5.6)
  - `complexity-detector.md` - find over-engineering
  - `premature-optimization-detector.md` - flag unnecessary optimization
  - `scope-guardian.md` - ensure tasks stay in scope
  - `test-coverage-advocate.md` - verify test specifications

- [ ] Create 5 review agents in `agents/review/`
  - Each agent loads its persona definition
  - Each runs independently on PLAN.md
  - Returns structured concerns: What, Why, Recommendation (CUT/DEFER/KEEP/SIMPLIFY)
  - Reference: `inspiration/compound-engineering/plugins/compound-engineering/agents/review/`

- [ ] Implement `commands/review.md`
  - Launch all 5 persona agents in parallel (Task tool)
  - Collect and deduplicate concerns
  - Present to user for ACCEPT/REJECT/MODIFY decisions
  - Apply accepted changes
  - Handle contradictions: surface both sides, user decides
  - Output `.kimchi/PLAN-REVIEWED.md`

- [ ] Create `lib/refinement-loop.md`
  - Quality scoring: completeness, clarity, testability, independence, size
  - Exit conditions: quality threshold (90/100), diminishing returns (<5 point gain), regression, max loops (3)
  - Reference: spec section 5.7

- [ ] Implement `commands/refine.md`
  - Read PLAN-REVIEWED.md
  - Run refinement loop with scoring
  - Track refinement history (iteration, score, changes, exit reason)
  - Support `--loops N` option
  - Output `.kimchi/PLAN-FINAL.md`

**Acceptance Criteria:**
- [ ] All 5 personas run in parallel and return structured concerns
- [ ] User can accept/reject each concern individually
- [ ] Contradictory concerns are surfaced clearly
- [ ] Refinement loop exits on quality threshold or diminishing returns
- [ ] PLAN-FINAL.md includes refinement history

---

### Phase 5: Bead Conversion & Validation (Pipeline Stages 7-8)

**Goal:** `/kimchi:beads` converts plan to YAML beads, `/kimchi:validate` ensures quality.

**Tasks:**

- [ ] Create `agents/pipeline/bead-converter.md`
  - Converts each plan task to bead YAML using template
  - Populates context using `find:` landmarks from RESEARCH.md
  - Defines deliverables with types (file_create, file_modify, file_delete)
  - Specifies test cases with run commands
  - Creates manifest.yaml with dependency graph

- [ ] Implement `commands/beads.md`
  - Read PLAN-FINAL.md and RESEARCH.md
  - Launch bead-converter agent
  - Write draft `.beads/*.yaml` files
  - Write `.beads/manifest.yaml`
  - Check for dependency cycles (error if found)

- [ ] Create 4 validator files in `validators/`
  - `context-completeness.md` - every ref has find: strategy, terms are unique and stable
  - `deliverables-clarity.md` - explicit types, full paths, concrete descriptions
  - `test-specification.md` - test file path, specific cases, run command, minimum counts by complexity
  - `isolation-check.md` - no cross-bead references, all context embedded or findable

- [ ] Create `lib/bead-validator.md`
  - Orchestration logic: run all 4 validators per bead, score, enrich, loop
  - Max enrichment iterations: 3
  - Flag for human review if can't pass after max loops
  - Support `--bead {id}` to validate single bead

- [ ] Implement `commands/validate.md`
  - Read draft `.beads/*.yaml`
  - Run all validators per bead
  - Enrich failing beads (add missing context, fix anchors, add test cases)
  - Generate `.kimchi/VALIDATION-REPORT.md`
  - Support `--loops N` option
  - Prompt user to push to beads-sync branch

**Acceptance Criteria:**
- [ ] Beads follow YAML schema from spec section 7.1
- [ ] All context uses `find:` landmarks, zero line number references
- [ ] Dependency cycles detected and reported as errors
- [ ] Validation enrichment loop auto-fixes common issues
- [ ] VALIDATION-REPORT.md shows per-bead status with enrichment details
- [ ] User prompted to push to beads-sync (optional, not required)

---

### Phase 6: Full Pipeline Orchestrator

**Goal:** `/kimchi:plan` runs all 8 stages end-to-end.

**Tasks:**

- [ ] Implement `commands/plan.md`
  - Orchestrate: clarify → requirements → research → generate → review → refine → beads → validate
  - Support `--depth minimal|standard|comprehensive`
    - minimal: clarify + requirements + generate + beads (skip research, review, refine)
    - standard: full pipeline (default)
    - comprehensive: extra research depth, multiple review rounds
  - Support `--skip-research`, `--skip-review`, `--no-push`
  - Support `--max-refine-loops N`, `--max-bead-validation-loops N`
  - Progress indicators between stages
  - Handle empty idea: prompt user via AskUserQuestion
  - Write `.kimchi/STATE.json` tracking completed stages (for resume)

- [ ] Update `commands/status.md`
  - Read `.kimchi/STATE.json` for pipeline progress
  - Show completed/pending stages
  - Show bead count and validation status

**Acceptance Criteria:**
- [ ] `/kimchi:plan "add user avatars"` runs full pipeline end-to-end
- [ ] All `--depth` and `--skip-*` options work
- [ ] Progress visible between stages
- [ ] Pipeline produces valid `.beads/` directory
- [ ] `/kimchi:status` shows accurate pipeline state

---

### Phase 7: Execution Skills

**Goal:** All 5 execution skills created, `/kimchi:skills` and `/kimchi:skill` commands working.

**Tasks:**

- [ ] Create `skills/tdd/SKILL.md`
  - Adapt from Superpowers: `inspiration/superpowers/skills/test-driven-development/SKILL.md`
  - RED-GREEN-REFACTOR with verification steps
  - Iron Law: "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"
  - Common Rationalizations table (anti-excuse system)
  - FORBIDDEN anti-patterns with strong enforcement language

- [ ] Create `skills/systematic-debugging/SKILL.md`
  - Adapt from Superpowers: `inspiration/superpowers/skills/systematic-debugging/SKILL.md`
  - 4-phase: OBSERVE → HYPOTHESIZE → TEST → FIX
  - Escalation: 3+ failures = question architecture
  - FORBIDDEN: random changes, fixing symptoms, assuming cause

- [ ] Create `skills/verification-before-completion/SKILL.md`
  - From spec section 6.4
  - 5-step checklist: all tests, acceptance criteria, regressions, diff review, docs
  - FORBIDDEN: "tests pass ship it", skipping manual verification

- [ ] Create `skills/simplicity-enforcement/SKILL.md`
  - Adapt from Compound Engineering principles
  - Prefer duplication over wrong abstraction
  - YAGNI, hardcode first, one way to do it
  - FORBIDDEN: enterprise patterns, future-proofing, DRY at all costs

- [ ] Create `skills/bead-protocol/SKILL.md`
  - From spec section 6.6
  - Start: read bead, check reservations, reserve files, load context
  - During: commit with bead ID, handle blockers via Agent Mail
  - Complete: verify, release reservations, update status, push

- [ ] Implement `commands/skills.md`
  - List all skills in `skills/` with name, version, description

- [ ] Implement `commands/skill.md`
  - Show full skill content by name
  - `$ARGUMENTS` = skill name

**Acceptance Criteria:**
- [ ] All 5 SKILL.md files have YAML frontmatter (name, version, description, triggers)
- [ ] Each skill has: When This Applies, Process, Verification, Anti-Patterns sections
- [ ] TDD skill includes Iron Law and Rationalizations table
- [ ] `/kimchi:skills` lists all 5 with versions
- [ ] `/kimchi:skill tdd` shows full TDD skill content

---

### Phase 8: Halmoni Self-Improvement System

**Goal:** `/kimchi:halmoni` observes, proposes, validates, and applies improvements.

**Tasks:**

- [ ] Create `skills/meta/halmoni/SKILL.md` (not in skills/ root -- meta-skill)
  - 4-phase process: TASTE → ADJUST → REMEMBER → PASS DOWN
  - From spec section 8
  - Protected components list (bead schema required fields, command names, ACFS protocol)
  - FORBIDDEN: large changes, unvalidated changes, breaking changes

- [ ] Implement `commands/halmoni.md`
  - Default: interactive improvement session
  - `--from-bead {id}`: analyze specific bead execution
  - `--from-feedback "{text}"`: process human feedback
  - `--taste-only`: observe without proposing
  - `--dry-run`: show proposals without applying
  - `--history`: show CHANGELOG.md

- [ ] Create `skills/CHANGELOG.md`
  - Initial entry: version 1.0.0, all skills created
  - Format: version, date, per-component changes with trigger and evidence

- [ ] Implement proposal → validation → application flow
  - Proposals as diffs with rationale
  - Historical validation: check against past beads if available
  - Conflict detection against existing skills/validators
  - Version increment on apply
  - Git commit with "halmoni: {description}" message

**Acceptance Criteria:**
- [ ] `/kimchi:halmoni` produces observations and proposals
- [ ] Proposals shown as diffs with rationale
- [ ] Protected components cannot be modified
- [ ] `--dry-run` shows but doesn't apply
- [ ] Applied changes update version in frontmatter and CHANGELOG.md
- [ ] Changes committed to git

---

### Phase 9: Polish & Integration Testing

**Goal:** Production-ready release.

**Tasks:**

- [ ] End-to-end test: run `/kimchi:plan "add user avatars with S3 upload"` on a sample Rails project
- [ ] Test each individual stage command works standalone
- [ ] Test `--depth minimal` and `--depth comprehensive` variants
- [ ] Test error paths: empty idea, missing artifacts, validation failures
- [ ] Test skill content is accurate and follows Superpowers patterns
- [ ] Review all command descriptions are in third person (Claude auto-invocation)
- [ ] Verify plugin.json is valid and all paths resolve
- [ ] Create CLAUDE.md for the kimchi project with conventions
- [ ] Add .gitignore (ignore .kimchi/ working directory, keep .beads/)

**Acceptance Criteria:**
- [ ] Full pipeline produces valid beads for sample feature
- [ ] All 14 commands respond correctly
- [ ] All 5 skills have proper structure
- [ ] Plugin installs cleanly
- [ ] No broken references or missing files

---

## Gaps Identified by SpecFlow Analysis (To Address During Implementation)

These gaps from the spec need decisions during implementation:

| Gap | Decision | Phase |
|-----|----------|-------|
| Clarification loop termination | Max 15 questions + user "done" escape | Phase 2 |
| Empty idea handling | Prompt via AskUserQuestion | Phase 2 |
| Research finds nothing | Document "no patterns found", proceed with framework knowledge | Phase 3 |
| Persona contradictions | Surface both sides, user decides | Phase 4 |
| Validation can't pass | Flag in report, user can manually edit + re-validate single bead | Phase 5 |
| Pipeline interruption | Write STATE.json tracking completed stages | Phase 6 |
| ACFS not installed | Produce .beads/ anyway; push step is optional | Phase 5 |
| Concurrent plans | One plan at a time in Phase 1; namespace support deferred | Phase 6 |
| Skill loading mechanism | Skills are always-on (all 5 loaded into every agent context) | Phase 7 |
| Language detection | Detect from package manager files during research stage | Phase 3 |
| Halmoni rollback | Changes are git commits; user can `git revert` | Phase 8 |

---

## Dependencies & Prerequisites

- Claude Code with plugin support (v2.1+)
- Git initialized in target project
- ACFS (optional -- beads work standalone)

## References

### Internal
- `KIMCHI_TECHNICAL_SPEC.md` - Full technical specification
- `KIMCHI_CONTEXT.md` - Design context and source attribution

### Inspiration Sources
- `inspiration/gsd/` - Clarification patterns, CONTEXT.md, requirements structure
- `inspiration/superpowers/` - SKILL.md format, TDD, debugging, skill activation
- `inspiration/acfs/` - Beads format, agent coordination, safety rules
- `inspiration/compound-engineering/` - Plugin structure, multi-persona review, simplicity principles

### Key Files in Inspiration Repos
- `inspiration/compound-engineering/plugins/compound-engineering/.claude-plugin/plugin.json` - Reference plugin manifest
- `inspiration/superpowers/skills/test-driven-development/SKILL.md` - TDD skill to adapt
- `inspiration/superpowers/skills/systematic-debugging/SKILL.md` - Debugging skill to adapt
- `inspiration/gsd/get-shit-done/templates/context.md` - CONTEXT.md template to adapt
- `inspiration/gsd/get-shit-done/templates/requirements.md` - Requirements template to adapt
- `inspiration/gsd/agents/gsd-planner.md` - Planner agent patterns
- `inspiration/gsd/get-shit-done/references/questioning.md` - Questioning philosophy
- `inspiration/compound-engineering/plugins/compound-engineering/agents/review/` - Review agent patterns
