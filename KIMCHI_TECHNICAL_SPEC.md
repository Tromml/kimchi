# Kimchi Technical Specification

> 김치 - Fermented, layered, improves with time

**Version:** 0.1.0  
**Status:** Draft  
**Last Updated:** 2026-01-31

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Design Principles](#2-philosophy--design-principles)
3. [Architecture Overview](#3-architecture-overview)
4. [Integration with ACFS](#4-integration-with-acfs)
5. [Phase 1: Planning Pipeline](#5-phase-1-planning-pipeline)
6. [Phase 1: Execution Skills](#6-phase-1-execution-skills)
7. [Bead Specification](#7-bead-specification)
8. [Halmoni: Self-Improvement System](#8-halmoni-self-improvement-system)
9. [Command Reference](#9-command-reference)
10. [File Structure](#10-file-structure)
11. [Implementation Plan](#11-implementation-plan)
12. [Future Phases](#12-future-phases)
13. [Appendices](#13-appendices)

---

## 1. Executive Summary

### What is Kimchi?

Kimchi is a Claude Code plugin that transforms vague ideas into validated, standalone task specifications (beads) ready for multi-agent execution via ACFS infrastructure.

### Core Value Proposition

| Problem | Kimchi Solution |
|---------|-----------------|
| Vague requirements lead to wasted agent iterations | Structured clarification extracts complete understanding |
| Plans lack detail for standalone execution | Bead validation ensures each task is self-contained |
| Agents skip tests, debug ad-hoc | Execution skills enforce TDD, systematic debugging |
| Learnings are lost between sessions | Halmoni captures and applies wisdom over time |
| Over-engineering and premature optimization | Multi-persona review trims unnecessary complexity |

### What Kimchi Does NOT Do

- **Coordination:** ACFS handles Agent Mail, file reservations, NTM orchestration
- **Multi-agent spawning:** ACFS handles via NTM
- **Git worktree management:** ACFS handles (Kimchi outputs beads; ACFS distributes)
- **Model selection:** ACFS decides which model executes which bead

### Relationship to Existing Tools

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  KIMCHI (this plugin)                                                       │
│  ═══════════════════════════════════════════════════════════════════════   │
│  • Idea → Validated Beads (planning pipeline)                              │
│  • Execution discipline (skills loaded per agent)                          │
│  • Self-improvement (halmoni)                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Outputs .beads/
                                    │ Skills loaded per agent
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  ACFS (existing infrastructure - not modified by Kimchi)                   │
│  ═══════════════════════════════════════════════════════════════════════   │
│  • Agent Mail (inter-agent messaging)                                      │
│  • NTM (agent orchestration)                                               │
│  • Beads Viewer (task visualization)                                       │
│  • Git worktrees + beads-sync branch                                       │
│  • Multi-model execution                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Influences

Kimchi synthesizes proven patterns from:

| Source | What We Extract |
|--------|-----------------|
| **GSD** | Clarification question flow, requirements structure (v1/v2/out), CONTEXT.md pattern |
| **Superpowers** | TDD enforcement, systematic debugging, skill activation patterns |
| **Compound Engineering** | Multi-persona review, trimming philosophy, feedback codification |
| **ACFS** | Beads format, refinement loop patterns, halmoni-style learning |

---

## 2. Philosophy & Design Principles

### 2.1 Core Philosophy

**"Each unit of engineering work should make subsequent units easier—not harder."**

Kimchi embodies compounding engineering: every plan created, every bead validated, every skill refined feeds back into making the next cycle more effective.

### 2.2 Design Principles

#### Principle 1: Standalone Executability
Every bead must be executable by an agent with ZERO context beyond what's in the bead itself. No "see previous task," no assumed knowledge.

#### Principle 2: Landmarks Over Coordinates
Reference code by semantic identifiers (`find: "class UserService"`) not line numbers (`lines: "12-34"`). Coordinates break when code changes; landmarks survive refactoring.

#### Principle 3: Trim Before Build
Premature optimization and unnecessary features are removed during planning, not discovered during implementation. Multi-persona review actively looks for what to cut.

#### Principle 4: Explicit Over Implicit
If an agent might need to search for it, it should be in the bead. Error handling patterns, logging conventions, validation approaches—all explicit.

#### Principle 5: Wisdom Accumulates
Halmoni (할머니) captures learnings from every execution and applies them to improve future plans. The plugin gets better with use.

#### Principle 6: Skills Are Mandatory
When a skill applies (TDD, systematic debugging), it's not a suggestion—it's enforced. Agents don't skip steps.

---

## 3. Architecture Overview

### 3.1 High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  INPUT                                                                      │
│  "I want to add user avatars with S3 upload"                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PLANNING PIPELINE (/kimchi:plan)                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ Clarify  │→│ Require- │→│ Research │→│ Generate │→│ Review   │         │
│  │          │ │ ments    │ │          │ │ Plan     │ │ (Personas│         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                             │               │
│                                    ┌────────────────────────┘               │
│                                    ▼                                        │
│                           ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│                           │ Refine   │→│ Convert  │→│ Validate │          │
│                           │ (Loop)   │ │ to Beads │ │ Beads    │          │
│                           └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  OUTPUT                                                                     │
│  .beads/ directory with validated, standalone task specifications          │
│  Push to beads-sync branch for ACFS consumption                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXECUTION (via ACFS)                                                       │
│  Each agent loads Kimchi execution skills:                                 │
│  • TDD • Systematic Debugging • Verification • Simplicity • Bead Protocol  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LEARNING (/kimchi:halmoni)                                                │
│  Execution feedback → Skill improvements → Better future plans             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  KIMCHI PLUGIN                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  COMMANDS (entry points)                                            │   │
│  │  /kimchi:plan, /kimchi:clarify, /kimchi:validate, /kimchi:halmoni  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                           │                                                 │
│          ┌────────────────┼────────────────┐                               │
│          ▼                ▼                ▼                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                        │
│  │ PIPELINE    │  │ VALIDATORS  │  │ PERSONAS    │                        │
│  │ STAGES      │  │             │  │             │                        │
│  │             │  │ • context   │  │ • trimmer   │                        │
│  │ • clarify   │  │ • deliver-  │  │ • complex-  │                        │
│  │ • require   │  │   ables     │  │   ity       │                        │
│  │ • research  │  │ • tests     │  │ • scope     │                        │
│  │ • generate  │  │ • isolation │  │ • premature │                        │
│  │ • refine    │  │             │  │             │                        │
│  │ • convert   │  │             │  │             │                        │
│  └─────────────┘  └─────────────┘  └─────────────┘                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SKILLS (execution discipline)                                       │   │
│  │  • tdd • systematic-debugging • verification • simplicity • bead    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  HALMONI (meta-learning)                                            │   │
│  │  taste → adjust → remember → pass down                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Integration with ACFS

### 4.1 Interface Contract

Kimchi's ONLY interface with ACFS is through the `.beads/` directory and the `beads-sync` branch.

```
KIMCHI                              ACFS
───────                             ────
                                    
/kimchi:plan                        
    │                               
    ▼                               
.beads/*.yaml  ─────────────────▶  Beads Viewer (bv)
    │                               reads and displays
    ▼                               
git push beads-sync ────────────▶  Agents pull tasks
                                    
Skills loaded  ─────────────────▶  NTM spawns agents
per agent                           with skills active
                                    
bead-protocol skill ◀───────────▶  Agent Mail
(handles messaging)                 File reservations
```

### 4.2 Bead Directory Structure

```
.beads/
├── manifest.yaml           # Bead index with dependency graph
├── 001-add-avatar-column.yaml
├── 002-s3-upload-service.yaml
├── 003-resize-service.yaml
├── 004-upload-endpoint.yaml
├── 005-avatar-component.yaml
└── 006-integration-tests.yaml
```

### 4.3 Manifest File

```yaml
# .beads/manifest.yaml

version: "1.0"
plan_id: "avatar-feature-2026-01-31"
created_at: "2026-01-31T10:30:00Z"
created_by: "kimchi:plan"

source:
  context: ".kimchi/CONTEXT.md"
  requirements: ".kimchi/REQUIREMENTS.md"
  plan: ".kimchi/PLAN-FINAL.md"

beads:
  - id: "001"
    file: "001-add-avatar-column.yaml"
    status: "pending"
    depends_on: []
    
  - id: "002"
    file: "002-s3-upload-service.yaml"
    status: "pending"
    depends_on: []
    
  - id: "003"
    file: "003-resize-service.yaml"
    status: "pending"
    depends_on: ["002"]
    
  - id: "004"
    file: "004-upload-endpoint.yaml"
    status: "pending"
    depends_on: ["002", "003"]
    
  - id: "005"
    file: "005-avatar-component.yaml"
    status: "pending"
    depends_on: ["001"]
    
  - id: "006"
    file: "006-integration-tests.yaml"
    status: "pending"
    depends_on: ["004", "005"]

dependency_graph: |
  001 ──────────────────────┐
                            ▼
  002 ──┬──▶ 003 ──┬──▶ 004 ──┬──▶ 006
        │          │          │
        └──────────┘          │
  005 ◀───────────────────────┘
```

### 4.4 What Kimchi Does NOT Touch

- ACFS configuration files
- Agent Mail setup
- NTM configuration  
- File reservation system
- Git worktree creation (ACFS handles this)
- Model assignment (ACFS decides)

---

## 5. Phase 1: Planning Pipeline

### 5.1 Pipeline Overview

```
/kimchi:plan [idea]

┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ CLARIFY │──▶│REQUIREM.│──▶│RESEARCH │──▶│GENERATE │──▶│ REVIEW  │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
                                                              │
     ┌────────────────────────────────────────────────────────┘
     ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│ REFINE  │──▶│ CONVERT │──▶│VALIDATE │──▶ .beads/
└─────────┘   └─────────┘   └─────────┘
```

### 5.2 Stage 1: Clarify

**Command:** `/kimchi:clarify [idea]`  
**Input:** Vague feature description  
**Output:** `.kimchi/CONTEXT.md`

**Purpose:** Extract complete understanding through structured questions until no ambiguity remains.

**Process:**

1. Parse the initial idea for domain, scope, and implied requirements
2. Generate clarification questions in categories:
   - **Functional:** What exactly should it do?
   - **Data:** What inputs/outputs? What formats?
   - **Edge cases:** What happens when X fails?
   - **Integration:** How does it connect to existing systems?
   - **Constraints:** Performance, security, compatibility requirements?
3. Ask questions iteratively until confidence threshold reached
4. Summarize decisions in CONTEXT.md

**Question Generation Patterns:**

```markdown
# lib/clarification-questions.md

## Functional Questions
- "When you say [X], do you mean [interpretation A] or [interpretation B]?"
- "What should happen when [edge case]?"
- "Who can perform this action? (all users / admins / specific roles)"
- "Should this be [sync/async]? What are the latency expectations?"

## Data Questions
- "What's the maximum [size/count/length] we should support?"
- "What formats are acceptable? What should be rejected?"
- "Where does this data come from? Where does it go?"
- "What validation rules apply?"

## Integration Questions
- "How does this interact with [existing feature X]?"
- "Are there existing patterns in the codebase for this?"
- "What external services/APIs are involved?"

## Constraint Questions
- "What's the expected load? (requests/sec, concurrent users)"
- "Are there security considerations? (auth, audit, encryption)"
- "What's the error budget? (can it fail silently? must it retry?)"

## Scope Questions
- "Is [implied feature Y] part of this, or separate/later?"
- "What's the minimum viable version vs. nice-to-have?"
```

**Output Format:**

```markdown
# .kimchi/CONTEXT.md

## Feature: User Avatar Upload

### Summary
Users can upload profile avatars that are resized and stored in S3.

### Decisions

#### Upload Behavior
- **Max file size:** 5MB
- **Allowed formats:** JPEG, PNG, WebP
- **Resize strategy:** Server-side on upload (not client, not async)
- **Target sizes:** 32x32 (thumbnail), 128x128 (profile), 512x512 (full)

#### Storage
- **Provider:** S3 (existing AWS account)
- **URL pattern:** Public URLs, no signed URLs needed
- **Naming:** `avatars/{user_id}/{size}.{ext}`

#### Access Control
- **Who can upload:** User can upload their own avatar only
- **Who can view:** Anyone (public)
- **Admin override:** Admins can delete any avatar

#### Error Handling
- **Invalid format:** Reject with clear error message
- **Too large:** Reject before upload starts (client-side check + server validation)
- **S3 failure:** Return error, don't save partial state

#### Edge Cases
- **No avatar:** Show default generated avatar (initials)
- **Replace existing:** Overwrite, no history kept
- **Delete account:** Avatar deleted with account

### Out of Scope (confirmed)
- Cropping UI (future feature)
- Animated GIFs
- AI-generated avatars
- Avatar history/versioning
```

### 5.3 Stage 2: Requirements

**Command:** `/kimchi:requirements`  
**Input:** `.kimchi/CONTEXT.md`  
**Output:** `.kimchi/REQUIREMENTS.md`

**Purpose:** Extract and categorize requirements into v1 (must have), v2 (next iteration), and out of scope.

**Process:**

1. Parse CONTEXT.md for all explicit and implied requirements
2. Categorize each requirement:
   - **v1:** Essential for the feature to be usable
   - **v2:** Valuable but can ship without
   - **Out of scope:** Explicitly not part of this work
3. For each v1 requirement, define acceptance criteria
4. Map requirements to potential tasks

**Output Format:**

```markdown
# .kimchi/REQUIREMENTS.md

## v1 Requirements (Must Have)

### R1: Avatar Upload
Users can upload an image file as their avatar.

**Acceptance Criteria:**
- [ ] Upload endpoint accepts JPEG, PNG, WebP
- [ ] Files over 5MB are rejected with clear error
- [ ] Invalid formats are rejected with clear error
- [ ] Successful upload returns avatar URL

### R2: Avatar Storage
Uploaded avatars are stored persistently in S3.

**Acceptance Criteria:**
- [ ] Avatar saved to S3 at `avatars/{user_id}/{size}.{ext}`
- [ ] Three sizes generated: 32x32, 128x128, 512x512
- [ ] Public URL accessible without authentication

### R3: Avatar Display
User avatars are displayed throughout the application.

**Acceptance Criteria:**
- [ ] Avatar component renders appropriate size
- [ ] Missing avatar shows initials fallback
- [ ] Avatar updates reflect immediately after upload

### R4: Avatar Deletion
Users can remove their avatar.

**Acceptance Criteria:**
- [ ] Delete endpoint removes all sizes from S3
- [ ] User reverts to default avatar display
- [ ] Admins can delete any user's avatar

## v2 Requirements (Next Iteration)

### R5: Cropping UI
Users can crop and adjust their avatar before upload.
*Reason for deferral: Core functionality works without it*

### R6: CDN Integration
Serve avatars through CDN for better performance.
*Reason for deferral: Optimization, not functionality*

## Out of Scope

- Animated GIF support
- Avatar history/versioning
- AI-generated avatars
- Social media avatar import
```

### 5.4 Stage 3: Research

**Command:** `/kimchi:research`  
**Input:** `.kimchi/CONTEXT.md`, `.kimchi/REQUIREMENTS.md`  
**Output:** `.kimchi/RESEARCH.md`

**Purpose:** Investigate codebase patterns and framework best practices before planning.

**Process:**

1. **Codebase Analysis:**
   - Find similar features in the codebase
   - Identify established patterns (services, controllers, tests)
   - Locate relevant configuration and utilities
   
2. **Framework Research:**
   - Check framework documentation for recommended approaches
   - Identify available libraries/gems/packages
   
3. **Pattern Extraction:**
   - Document patterns with file references (using `find:` landmarks)
   - Note anti-patterns to avoid

**Output Format:**

```markdown
# .kimchi/RESEARCH.md

## Codebase Patterns

### File Upload Pattern
Existing file uploads found in document attachment feature.

**Reference Implementation:**
- Service: `app/services/attachments/upload_service.rb`
  - find: `class UploadService`
  - Pattern: Service object with `#call` method, returns Result object
  
- Controller: `app/controllers/api/attachments_controller.rb`
  - find: `def create`
  - Pattern: Strong params, service call, JSON response

- Tests: `spec/services/attachments/upload_service_spec.rb`
  - find: `RSpec.describe`
  - Pattern: Unit tests with mocked S3 client

### S3 Integration
Existing S3 usage found in document storage.

**Configuration:**
- AWS setup: `config/initializers/aws.rb`
  - find: `Aws.config.update`
  
- Credentials: Environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`
  - find: `AWS_S3_BUCKET` in `.env.example`

**Client Pattern:**
- Client wrapper: `app/services/storage/s3_client.rb`
  - find: `class S3Client`
  - Methods: `#upload`, `#delete`, `#presigned_url`

### Image Processing
No existing image processing found. Research external options.

**Recommended:** `image_processing` gem with `vips` backend
- Faster than ImageMagick
- Lower memory usage
- Already used by Active Storage

### Error Handling Pattern
- find: `class ServiceError < StandardError` in `app/errors/`
- find: `rescue Aws::` in existing S3 code
- Pattern: Wrap external errors in domain errors, log with context

### Test Patterns
- S3 mocking: `spec/support/s3_mock.rb`
  - find: `RSpec.configure do |config|`
  - Uses `aws-sdk-s3` stubbing

## Framework Recommendations

### Rails File Upload
- Use `ActionDispatch::Http::UploadedFile` for handling
- Validate content type server-side (don't trust client)
- Stream large files, don't load into memory

### Image Processing
```ruby
# Recommended approach
require "image_processing/vips"

ImageProcessing::Vips
  .source(file)
  .resize_to_fill(128, 128)
  .convert("webp")
  .call
```

## Anti-Patterns to Avoid

- Don't store files locally then move to S3 (stream directly)
- Don't trust client-provided content type
- Don't process images synchronously for large files (but OK for avatars < 5MB)
```

### 5.5 Stage 4: Generate Plan

**Command:** `/kimchi:generate`  
**Input:** `.kimchi/CONTEXT.md`, `.kimchi/REQUIREMENTS.md`, `.kimchi/RESEARCH.md`  
**Output:** `.kimchi/PLAN.md`

**Purpose:** Create a task breakdown with dependencies.

**Process:**

1. Map requirements to implementation tasks
2. Identify dependencies between tasks
3. Estimate complexity (S/M/L)
4. Suggest model assignment based on task nature
5. Generate initial plan document

**Complexity Heuristics:**

| Complexity | Characteristics |
|------------|-----------------|
| **S (Small)** | Single file, clear pattern to follow, < 100 lines |
| **M (Medium)** | Multiple files, some decisions required, 100-300 lines |
| **L (Large)** | Architectural decisions, new patterns, > 300 lines |

**Output Format:**

```markdown
# .kimchi/PLAN.md

## Plan: User Avatar Feature

### Task Overview

| ID | Task | Complexity | Depends On |
|----|------|------------|------------|
| 001 | Add avatar columns to users table | S | - |
| 002 | Create S3 upload service | M | - |
| 003 | Create image resize service | M | 002 |
| 004 | Create avatar upload endpoint | M | 002, 003 |
| 005 | Create avatar display component | S | 001 |
| 006 | Integration tests | M | 004, 005 |

### Dependency Graph

```
001 ──────────────────────┐
                          ▼
002 ──┬──▶ 003 ──┬──▶ 004 ──┬──▶ 006
      │          │          │
      └──────────┘          │
005 ◀───────────────────────┘
```

### Task Details

#### Task 001: Add avatar columns to users table
**Complexity:** S  
**Requirements:** R3 (Avatar Display)

Add database columns to store avatar URLs.

**Deliverables:**
- Migration file adding `avatar_thumbnail_url`, `avatar_profile_url`, `avatar_full_url` to users
- Update User model with avatar URL accessors

**Context Needed:**
- Existing migrations pattern
- User model location

---

#### Task 002: Create S3 upload service
**Complexity:** M  
**Requirements:** R1 (Upload), R2 (Storage)

Service to handle file uploads to S3.

**Deliverables:**
- `app/services/avatars/upload_service.rb`
- Unit tests

**Context Needed:**
- S3Client wrapper
- Service object pattern
- Error handling pattern

---

[... additional tasks ...]
```

### 5.6 Stage 5: Review (Multi-Persona)

**Command:** `/kimchi:review`  
**Input:** `.kimchi/PLAN.md`  
**Output:** `.kimchi/PLAN-REVIEWED.md`

**Purpose:** Multiple review personas critique the plan, focusing on what to remove or simplify.

**Personas:**

#### Persona: Feature Trimmer
```markdown
# personas/feature-trimmer.md

## Role
Identify features that aren't essential for v1.

## Questions to Ask
- Is this feature in the v1 requirements, or did it sneak in?
- Can the core functionality work without this?
- Is this solving a problem we actually have, or might have?

## Red Flags
- "While we're at it, we could also..."
- "It would be nice to..."
- "In case we need to..."
- Features not traced to a v1 requirement

## Output Format
For each concern:
- What: [the feature/task in question]
- Why: [why it should be cut or deferred]
- Recommendation: CUT / DEFER TO V2 / KEEP (with justification)
```

#### Persona: Complexity Detector
```markdown
# personas/complexity-detector.md

## Role
Identify unnecessary complexity and over-engineering.

## Questions to Ask
- Is there a simpler way to achieve this?
- Are we building abstractions we don't need yet?
- Could we hardcode this for now and abstract later?
- Is this flexibility actually required?

## Red Flags
- Generic solutions for specific problems
- "Pluggable" or "extensible" for single use cases
- Multiple layers of indirection
- Configuration for things that won't change

## Output Format
For each concern:
- What: [the complexity]
- Why: [why it's unnecessary]
- Simpler Alternative: [concrete suggestion]
```

#### Persona: Premature Optimization Detector
```markdown
# personas/premature-optimization-detector.md

## Role
Identify optimizations that aren't yet needed.

## Questions to Ask
- Do we have evidence this will be a bottleneck?
- What's the actual expected load?
- Can we add this optimization later if needed?
- Is the optimization worth the complexity cost?

## Red Flags
- Caching without measured need
- Async processing for fast operations
- Database indexes on low-traffic tables
- "Scale" concerns for MVP features

## Output Format
For each concern:
- What: [the optimization]
- Why: [why it's premature]
- When to Add: [trigger condition for actually needing it]
```

#### Persona: Scope Guardian
```markdown
# personas/scope-guardian.md

## Role
Ensure tasks stay within defined scope.

## Questions to Ask
- Does this task deliver a v1 requirement?
- Is the task self-contained or does it bleed into other areas?
- Are we refactoring unrelated code?
- Is the acceptance criteria testable?

## Red Flags
- Tasks that touch code outside feature area
- "Clean up" or "refactor" as part of feature work
- Acceptance criteria that's vague or unmeasurable
- Dependencies on undefined future work

## Output Format
For each concern:
- What: [the scope issue]
- Why: [why it's out of scope]
- Recommendation: REMOVE / NARROW / SPLIT
```

**Review Process:**

1. Each persona reviews the plan independently
2. Concerns are collected and deduplicated
3. Human reviews concerns and decides: ACCEPT / REJECT / MODIFY
4. Accepted changes are applied to plan

**Output Format:**

```markdown
# .kimchi/PLAN-REVIEWED.md

## Review Summary

| Persona | Concerns | Accepted | Rejected |
|---------|----------|----------|----------|
| Feature Trimmer | 2 | 1 | 1 |
| Complexity Detector | 3 | 2 | 1 |
| Premature Optimization | 1 | 1 | 0 |
| Scope Guardian | 1 | 0 | 1 |

## Accepted Changes

### [FT-1] Defer CDN integration
**Persona:** Feature Trimmer  
**Original:** Task 007 included CDN setup  
**Change:** Removed. Added to v2 requirements.  
**Rationale:** Core functionality works without CDN.

### [CD-1] Simplify resize service
**Persona:** Complexity Detector  
**Original:** Pluggable resize strategy pattern  
**Change:** Hardcode vips resize, no strategy pattern  
**Rationale:** Only one resize approach needed for v1.

### [CD-2] Remove async processing
**Persona:** Complexity Detector  
**Original:** Background job for resize  
**Change:** Synchronous resize in request  
**Rationale:** Files < 5MB, resize takes < 500ms.

### [PO-1] Remove preemptive caching
**Persona:** Premature Optimization  
**Original:** Redis cache for avatar URLs  
**Change:** Removed. Database query is fine.  
**Rationale:** No measured performance issue.

## Rejected Changes

### [FT-2] Remove multiple sizes
**Persona:** Feature Trimmer  
**Concern:** Three sizes (32, 128, 512) might be overkill  
**Decision:** REJECT - All three sizes are used in existing UI mockups  

### [SG-1] Split upload and resize
**Persona:** Scope Guardian  
**Concern:** Task 002 and 003 could be one service  
**Decision:** REJECT - Separation aids testability

## Updated Plan

[... plan with accepted changes applied ...]
```

### 5.7 Stage 6: Refine (Adaptive Loop)

**Command:** `/kimchi:refine [--loops N]`  
**Input:** `.kimchi/PLAN-REVIEWED.md`  
**Output:** `.kimchi/PLAN-FINAL.md`

**Purpose:** Iteratively improve the plan until quality threshold reached or diminishing returns detected.

**Refinement Criteria:**

| Criterion | Check |
|-----------|-------|
| Completeness | All v1 requirements covered by tasks |
| Clarity | Task descriptions are unambiguous |
| Testability | Each task has verifiable acceptance criteria |
| Independence | Tasks can be executed in parallel where no dependency |
| Size | No task is larger than "L" complexity |

**Loop Logic:**

```
function refine(plan, max_loops=3):
    prev_score = 0
    
    for i in range(max_loops):
        issues = evaluate(plan)
        score = calculate_score(issues)
        
        # Exit conditions
        if score >= QUALITY_THRESHOLD:
            return plan, "quality_reached"
        if score - prev_score < MIN_IMPROVEMENT:
            return plan, "diminishing_returns"
        if score < prev_score:
            return prev_plan, "regression"
            
        plan = apply_improvements(plan, issues)
        prev_plan = plan
        prev_score = score
    
    return plan, "max_loops"
```

**Output includes refinement history:**

```markdown
# .kimchi/PLAN-FINAL.md

## Refinement History

| Iteration | Score | Changes | Exit Reason |
|-----------|-------|---------|-------------|
| 1 | 72/100 | Split Task 004 (too large) | - |
| 2 | 89/100 | Clarified Task 003 acceptance criteria | - |
| 3 | 94/100 | No significant improvements found | diminishing_returns |

## Final Plan

[... refined plan ...]
```

### 5.8 Stage 7: Convert to Beads

**Command:** `/kimchi:beads`  
**Input:** `.kimchi/PLAN-FINAL.md`, `.kimchi/RESEARCH.md`  
**Output:** `.beads/*.yaml` (draft)

**Purpose:** Convert plan tasks into bead format with full context.

**Conversion Process:**

1. For each task in plan:
   - Create bead YAML file
   - Populate context using `find:` landmarks from RESEARCH.md
   - Define deliverables with modification targets
   - Specify tests with cases and run commands
   - Set acceptance criteria from plan

2. Create manifest.yaml with dependency graph

**Key Transformation: Task → Bead**

```
PLAN TASK                           BEAD
─────────                           ────

Task 002: Create S3 upload          bead_id: "002"
service                             title: "Create S3 upload service"
                                    
Complexity: M                       estimated_complexity: "M"
                                    
Requirements: R1, R2                requirements: ["R1", "R2"]
                                    
(implicit context)          →       context:
                                      - file: "app/services/storage/s3_client.rb"
                                        find: "class S3Client"
                                        purpose: "Existing S3 wrapper to use"
                                      - file: "app/services/attachments/upload_service.rb"
                                        find: "class UploadService"
                                        purpose: "Service pattern to follow"
                                        
Deliverables:                       deliverables:
- upload_service.rb                   - type: "file_create"
- unit tests                            path: "app/services/avatars/upload_service.rb"
                                      - type: "file_create"
                                        path: "spec/services/avatars/upload_service_spec.rb"
                                        
(implicit tests)            →       tests:
                                      file: "spec/services/avatars/upload_service_spec.rb"
                                      cases:
                                        - "uploads file to S3 and returns URL"
                                        - "raises error for invalid content type"
                                        - "raises error when file too large"
                                        - "handles S3 failure gracefully"
                                      run_command: "bundle exec rspec spec/services/avatars/upload_service_spec.rb"
```

### 5.9 Stage 8: Validate Beads

**Command:** `/kimchi:validate [--loops N]`  
**Input:** `.beads/*.yaml` (draft)  
**Output:** `.beads/*.yaml` (validated), `.kimchi/VALIDATION-REPORT.md`

**Purpose:** Ensure each bead is standalone-executable.

**Validation Checklist:**

#### Validator: Context Completeness
```markdown
# validators/context-completeness.md

## Purpose
Ensure agent can FIND everything it needs.

## Checks

□ Every file reference has a `find:` strategy
  BAD:  file: "base_storage.rb"
  GOOD: file: "base_storage.rb", find: "class BaseStorage"

□ Find terms are specific enough to be unique
  BAD:  find: "def initialize"
  GOOD: find: "class S3Storage", scope: "def initialize"

□ Find terms are stable (survive refactoring)
  BAD:  find: "# TODO: fix this"
  GOOD: find: "def upload"

□ Scope is appropriate for purpose
  BAD:  find: "class", scope: "entire file" (when method suffices)
  GOOD: find: "def upload", scope: "entire method"

□ Error handling patterns referenced
  When task involves error handling:
  GOOD: find: "rescue Aws::" with purpose: "Error handling pattern"

□ Logging patterns referenced
  When task involves logging:
  GOOD: find: "Rails.logger" with purpose: "Logging pattern"

## Failure Triggers
- Any line number reference (lines: "12-34")
- "See above" or "as mentioned"
- Implicit file references
- Find terms matching multiple locations
```

#### Validator: Deliverables Clarity
```markdown
# validators/deliverables-clarity.md

## Purpose
Ensure agent knows exactly what to produce.

## Checks

□ Each deliverable has explicit type
  Types: file_create, file_modify, file_delete

□ file_create deliverables have full path
  BAD:  path: "upload_service.rb"
  GOOD: path: "app/services/avatars/upload_service.rb"

□ file_modify deliverables have anchor point
  BAD:  path: "config.rb", action: "add registration"
  GOOD: path: "config.rb", find: "Storage.register", action: "add after"

□ Deliverable descriptions are concrete
  BAD:  description: "Update the service"
  GOOD: description: "Add #upload method that accepts file and returns URL"

## Failure Triggers
- Missing path
- file_modify without find anchor
- Vague descriptions ("update", "fix", "improve")
```

#### Validator: Test Specification
```markdown
# validators/test-specification.md

## Purpose
Ensure tests are specific enough to write.

## Checks

□ Test file path specified
  BAD:  "Add tests"
  GOOD: file: "spec/services/avatars/upload_service_spec.rb"

□ Test cases are scenarios, not vague
  BAD:  "Test uploading"
  GOOD: "uploads file under 5MB and returns public URL"

□ Edge cases identified based on complexity
  S: 2+ cases minimum
  M: 4+ cases, including 1+ edge case
  L: 6+ cases, including 2+ edge cases

□ Run command provided
  BAD:  "Run the tests"
  GOOD: run_command: "bundle exec rspec spec/services/avatars/upload_service_spec.rb"

□ Expected behavior is verifiable
  BAD:  "Should work correctly"
  GOOD: "Returns URL matching https://bucket.s3.../{uuid}.{ext}"

## Failure Triggers
- No test file specified
- Fewer than minimum cases for complexity
- No run command
- Vague case descriptions
```

#### Validator: Isolation Check
```markdown
# validators/isolation-check.md

## Purpose
Ensure bead can be executed without other beads' context.

## Checks

□ No references to other beads' internal details
  BAD:  "Use the service from bead 002"
  GOOD: context entry pointing to actual file

□ Dependencies only reference bead IDs
  BAD:  depends_on: ["the upload service"]
  GOOD: depends_on: ["002"]

□ All context is embedded or findable
  BAD:  "Follow the pattern we discussed"
  GOOD: context entry with file and find

□ No pronouns without antecedents
  BAD:  "It should handle errors like the others"
  GOOD: Explicit file reference to error handling pattern

□ Acceptance criteria don't reference other beads
  BAD:  "Works with the component from task 005"
  GOOD: "Avatar URL is stored in user.avatar_profile_url"

## Failure Triggers
- Prose references to other beads
- Missing context that would require reading other beads
- Acceptance criteria dependent on uncontrolled outputs
```

**Validation Loop:**

```
for each bead:
    score = run_all_validators(bead)
    
    while score < THRESHOLD and iterations < MAX:
        missing = identify_missing_elements(bead)
        bead = enrich_bead(bead, missing)
        score = run_all_validators(bead)
        iterations++
    
    if score < THRESHOLD:
        flag_for_human_review(bead)
```

**Output:**

```markdown
# .kimchi/VALIDATION-REPORT.md

## Validation Summary

| Bead | Context | Deliverables | Tests | Isolation | Status |
|------|---------|--------------|-------|-----------|--------|
| 001  | ✓ | ✓ | ✓ | ✓ | PASS |
| 002  | ✓ | ✓ | ✓ | ✓ | PASS |
| 003  | ✓ (enriched) | ✓ | ✓ | ✓ | PASS |
| 004  | ✓ | ✓ (enriched) | ✓ | ✓ | PASS |
| 005  | ✓ | ✓ | ✓ | ✓ | PASS |
| 006  | ✓ | ✓ | ✓ (enriched) | ✓ | PASS |

## Enrichments Applied

### Bead 003
- Added context: error handling pattern reference
- Reason: Task involves error handling but pattern wasn't referenced

### Bead 004
- Added deliverable anchor: find: "routes.draw" for route addition
- Reason: file_modify without anchor point

### Bead 006
- Added test cases: edge cases for network failure
- Reason: M complexity requires 4+ cases, had only 3

## Beads Ready for ACFS

All 6 beads validated and ready for execution.

Push to beads-sync? [y/n]
```

---

## 6. Phase 1: Execution Skills

Skills are loaded into each agent's context at execution time. They are mandatory—not suggestions.

### 6.1 Skill Structure

```yaml
# skills/execution/{skill-name}/SKILL.md

---
name: "Skill Name"
version: "1.0.0"
description: "What this skill enforces"
triggers:
  - "pattern that activates this skill"
  - "another trigger pattern"
---

# Skill Name

## When This Applies

[Conditions that trigger this skill]

## Process

[Step-by-step mandatory process]

## Verification

[How to confirm skill was followed]

## Anti-Patterns

[What NOT to do]
```

### 6.2 Skill: Test-Driven Development

```markdown
# skills/execution/tdd/SKILL.md

---
name: "Test-Driven Development"
version: "1.0.0"
description: "Enforce RED-GREEN-REFACTOR cycle"
triggers:
  - "implementing a new feature"
  - "adding functionality"
  - "creating a new file with logic"
---

# Test-Driven Development

## When This Applies

ALWAYS when writing code that has behavior. The only exceptions:
- Pure configuration files
- Database migrations (tested via schema verification)
- Static content

## Process

### 1. RED: Write the Test First

Before writing ANY implementation code:

1. Create the test file if it doesn't exist
2. Write a test for the smallest piece of functionality
3. Run the test
4. **VERIFY IT FAILS**
5. **VERIFY IT FAILS FOR THE RIGHT REASON**
   - "Method not found" = right reason (method doesn't exist yet)
   - "Syntax error in test" = wrong reason (fix test first)

```bash
# Run the test, expect failure
bundle exec rspec spec/services/avatars/upload_service_spec.rb

# Expected output should indicate:
# - Method doesn't exist, OR
# - Class doesn't exist, OR  
# - Expected behavior not implemented
```

### 2. GREEN: Make It Pass

Write the MINIMUM code to make the test pass:

1. Create class/method if needed
2. Implement just enough to pass THIS test
3. Do NOT implement more than the test requires
4. Run the test
5. **VERIFY IT PASSES**

```bash
# Run the test, expect success
bundle exec rspec spec/services/avatars/upload_service_spec.rb

# Should be green
```

### 3. REFACTOR: Clean Up

Only after test passes:

1. Look for duplication
2. Improve naming
3. Extract methods if needed
4. Run tests again
5. **VERIFY STILL PASSES**

```bash
# Ensure refactoring didn't break anything
bundle exec rspec spec/services/avatars/upload_service_spec.rb
```

### 4. REPEAT

Move to next test case. Repeat RED-GREEN-REFACTOR.

## Verification

For each piece of functionality:
- [ ] Test was written BEFORE implementation
- [ ] Test failed before implementation was written
- [ ] Test passed after implementation
- [ ] No implementation code exists without corresponding test

## Anti-Patterns

### FORBIDDEN: Writing implementation first

If you find yourself writing implementation before tests:
1. STOP
2. DELETE the implementation code
3. Write the test first
4. Let the test guide the implementation

### FORBIDDEN: Testing after the fact

Tests written after implementation:
- Often miss edge cases
- Test the implementation, not the behavior
- Lead to brittle tests

### FORBIDDEN: Skipping the RED phase

If your test passes immediately:
- The test is wrong, OR
- The functionality already exists, OR
- The test isn't testing what you think

Always verify the test fails first.

### FORBIDDEN: Writing too much at once

One test case → one small implementation → refactor → next test

NOT: Write all tests → Write all implementation
```

### 6.3 Skill: Systematic Debugging

```markdown
# skills/execution/systematic-debugging/SKILL.md

---
name: "Systematic Debugging"
version: "1.0.0"
description: "4-phase root cause analysis"
triggers:
  - "test is failing"
  - "unexpected behavior"
  - "error in execution"
  - "bug report"
---

# Systematic Debugging

## When This Applies

Whenever something isn't working as expected. This is NOT optional.

**FORBIDDEN:** Random changes hoping something works.

## Process

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

3. **Document observations**
   ```
   Issue: Upload fails with "AccessDenied"
   Reproduces: Every time with files > 1MB
   Works: Files < 1MB upload successfully
   Recent changes: Updated AWS SDK yesterday
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

### Phase 4: FIX

Address the ROOT CAUSE, not symptoms.

1. **Fix the actual cause**
   - Don't add workarounds for symptoms
   - If SDK is broken, fix SDK usage (or pin version)
   - NOT: add retry logic to mask the failure

2. **Verify the fix**
   - Original issue no longer reproduces
   - No new issues introduced
   - Tests pass

3. **Prevent recurrence**
   - Add test case for this scenario
   - Document the issue and fix
   - Consider if similar issues could exist elsewhere

## Verification

- [ ] Issue was reproduced and documented
- [ ] Multiple hypotheses were considered
- [ ] Root cause was identified (not just symptoms)
- [ ] Fix addresses root cause
- [ ] Test added to prevent recurrence

## Anti-Patterns

### FORBIDDEN: Random changes

Making changes without a hypothesis:
- "Let me try adding a sleep here"
- "Maybe if I clear the cache"
- "I'll just restart the service"

### FORBIDDEN: Fixing symptoms

Masking the problem instead of solving it:
- Adding retry logic instead of fixing the error
- Catching and ignoring exceptions
- Adding delays to avoid race conditions

### FORBIDDEN: Assuming the cause

Jumping to conclusions without evidence:
- "It's probably a permissions issue"
- "The database must be slow"

Form hypothesis, then TEST it.
```

### 6.4 Skill: Verification Before Completion

```markdown
# skills/execution/verification-before-completion/SKILL.md

---
name: "Verification Before Completion"
version: "1.0.0"
description: "Ensure work is actually complete"
triggers:
  - "about to mark task done"
  - "finishing a bead"
  - "completing implementation"
---

# Verification Before Completion

## When This Applies

Before marking ANY task as complete. No exceptions.

## Process

### 1. Run ALL Tests

Not just the new tests. The entire test suite.

```bash
# Run full test suite
bundle exec rspec

# Must be 100% pass
# Any failure = task NOT complete
```

### 2. Verify Acceptance Criteria

For each criterion in the bead:

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

If the bead specified documentation:
- [ ] README updated (if required)
- [ ] Code comments for complex logic
- [ ] API documentation (if endpoint)

## Verification Checklist

Before marking complete, ALL must be true:

- [ ] All tests pass (entire suite)
- [ ] Each acceptance criterion manually verified
- [ ] No regressions in related functionality  
- [ ] Diff reviewed, no debug code
- [ ] Documentation complete (if required)

## Anti-Patterns

### FORBIDDEN: "Tests pass, ship it"

Passing tests are necessary but not sufficient.

### FORBIDDEN: Skipping manual verification

Automated tests don't catch everything. Verify the actual behavior.

### FORBIDDEN: Marking complete with known issues

If something isn't right, the task isn't complete. Don't create "follow-up" tasks for things that should have been done.
```

### 6.5 Skill: Simplicity Enforcement

```markdown
# skills/execution/simplicity-enforcement/SKILL.md

---
name: "Simplicity Enforcement"
version: "1.0.0"
description: "Prefer simple solutions over clever ones"
triggers:
  - "designing a solution"
  - "implementing feature"
  - "considering abstraction"
---

# Simplicity Enforcement

## When This Applies

Every implementation decision.

## Principles

### Prefer Duplication Over Wrong Abstraction

If you're not sure an abstraction is right:
- Duplicate the code
- Wait until you have 3+ similar cases
- Then extract with full understanding

```ruby
# GOOD: Duplication when pattern unclear
class AvatarUploadService
  def upload(file)
    validate_size(file)
    validate_type(file)
    store_in_s3(file)
  end
end

class DocumentUploadService  
  def upload(file)
    validate_size(file)
    validate_type(file)
    store_in_s3(file)
  end
end

# BAD: Premature abstraction
class GenericUploadService
  def initialize(validator:, storage:)
    @validator = validator
    @storage = storage
  end
  
  def upload(file)
    @validator.validate(file)
    @storage.store(file)
  end
end
```

### YAGNI: You Aren't Gonna Need It

Don't build for hypothetical future requirements.

```ruby
# BAD: Hypothetical future support
class ImageResizer
  STRATEGIES = {
    vips: VipsStrategy,
    imagemagick: ImageMagickStrategy,
    cloudinary: CloudinaryStrategy,  # "in case we switch"
  }
  
  def initialize(strategy: :vips)
    @strategy = STRATEGIES[strategy].new
  end
end

# GOOD: Build what's needed now
class ImageResizer
  def resize(file, dimensions)
    ImageProcessing::Vips
      .source(file)
      .resize_to_fill(*dimensions)
      .call
  end
end
```

### Hardcode First, Configure Later

If a value won't change soon, hardcode it.

```ruby
# BAD: Configuration for things that won't change
config.avatar_sizes = [32, 128, 512]  # In YAML config
config.avatar_bucket = ENV['AVATAR_BUCKET']  # When it's always 'avatars'

# GOOD: Hardcode known values
AVATAR_SIZES = [32, 128, 512].freeze
BUCKET = 'avatars'
```

### One Way to Do It

Don't provide multiple ways to accomplish the same thing.

```ruby
# BAD: Multiple ways
user.avatar_url
user.get_avatar_url
user.fetch_avatar(size: :medium)
Avatar.url_for(user)

# GOOD: One obvious way
user.avatar_url(:medium)
```

## Verification

Before completing:
- [ ] No abstractions without 3+ uses
- [ ] No configuration for fixed values
- [ ] No "pluggable" or "extensible" patterns for single use
- [ ] No multiple ways to do the same thing
- [ ] Could a junior developer understand this in 5 minutes?

## Anti-Patterns

### FORBIDDEN: "Enterprise" patterns for small features

Factory, Strategy, Observer, Visitor patterns are rarely needed.

### FORBIDDEN: Future-proofing

"What if we need to support X later?" - Build it later.

### FORBIDDEN: DRY at all costs

Duplication is better than wrong abstraction.
```

### 6.6 Skill: Bead Protocol

```markdown
# skills/execution/bead-protocol/SKILL.md

---
name: "Bead Protocol"
version: "1.0.0"
description: "ACFS integration during execution"
triggers:
  - "starting work on a bead"
  - "completing a bead"
  - "blocked on a dependency"
  - "need to coordinate with other agents"
---

# Bead Protocol

## When This Applies

Whenever executing a bead within ACFS infrastructure.

## Starting a Bead

### 1. Read the Full Bead

Before any code:
```bash
cat .beads/{bead_id}.yaml
```

Understand:
- All context references
- All deliverables  
- All acceptance criteria
- All test cases

### 2. Check File Reservations

Before editing any file:
```bash
# Check if file is reserved by another agent
acfs reserve --check {file_path}
```

If reserved:
- Do NOT proceed with that file
- Send Agent Mail to reservation holder
- Work on non-reserved files first

### 3. Reserve Your Files

```bash
# Reserve files you'll be editing
acfs reserve --add {file_path} --ttl 3600
```

### 4. Load Context

For each context reference in the bead:
1. Open the file
2. Find the landmark (search for `find:` value)
3. Read the relevant scope
4. Understand the pattern before implementing

## During Execution

### Commit Frequently

Each logical unit of work gets a commit:

```bash
git add {files}
git commit -m "{bead_id}: {description}"
```

Commit message format:
- Start with bead ID
- Describe what changed
- Keep under 72 characters

### Update Bead Status

When starting:
```bash
acfs bead status {bead_id} --set in_progress
```

### Handle Blockers

If blocked on a dependency:

1. Check if blocking bead is complete:
   ```bash
   acfs bead status {blocking_bead_id}
   ```

2. If not complete, send Agent Mail:
   ```bash
   acfs mail send \
     --to {agent_on_blocking_bead} \
     --subject "Blocked on {blocking_bead_id}" \
     --body "Bead {bead_id} needs {specific_thing} from {blocking_bead_id}"
   ```

3. Work on non-blocked tasks while waiting

## Completing a Bead

### 1. Run Verification Skill

Complete the "Verification Before Completion" skill checklist.

### 2. Release File Reservations

```bash
acfs reserve --release {file_path}
```

### 3. Update Bead Status

```bash
acfs bead status {bead_id} --set complete
```

### 4. Push to beads-sync

```bash
git push origin HEAD:beads-sync
```

### 5. Send Completion Mail (if others are waiting)

```bash
acfs mail send \
  --to {waiting_agents} \
  --subject "Bead {bead_id} complete" \
  --body "Deliverables available: {list}"
```

## Verification

- [ ] Bead fully read before starting
- [ ] File reservations checked and acquired
- [ ] Context landmarks found and understood
- [ ] Commits include bead ID
- [ ] Blockers communicated via Agent Mail
- [ ] Reservations released on completion
- [ ] Status updated in ACFS
- [ ] Pushed to beads-sync

## Anti-Patterns

### FORBIDDEN: Editing without reservation

Always check reservations first. Conflicts waste everyone's time.

### FORBIDDEN: Silent blocking

If you're blocked, communicate immediately. Don't wait.

### FORBIDDEN: Skipping context

Read the full bead and find all landmarks before writing code.
```

---

## 7. Bead Specification

### 7.1 Bead YAML Schema

```yaml
# Bead file schema
# File: .beads/{bead_id}-{slug}.yaml

# Required fields
bead_id: string          # Unique identifier (e.g., "001", "002")
title: string            # Human-readable title
description: string      # Detailed description of the task

# Dependencies
depends_on: [string]     # Array of bead IDs this depends on

# Context references (using landmarks, NOT line numbers)
context:
  - file: string         # Path to file
    find: string         # Search term to locate relevant code
    scope: string        # Optional: "entire method", "entire class", "block", etc.
    purpose: string      # Why this context is relevant

# What the agent will produce
deliverables:
  - type: string         # "file_create" | "file_modify" | "file_delete"
    path: string         # Full path to file
    find: string         # For file_modify: anchor point for changes
    action: string       # For file_modify: "add after", "replace", etc.
    description: string  # What will be created/changed

# Test specification
tests:
  file: string           # Path to test file
  structure: string      # Optional: "Mirror {file}" for test structure
  cases: [string]        # List of test case descriptions
  run_command: string    # Command to run tests

# Success criteria
acceptance_criteria: [string]  # List of verifiable criteria

# Metadata
estimated_complexity: string   # "S" | "M" | "L"
suggested_model: string        # Optional: "claude" | "codex" | "gemini"
requirements: [string]         # Which requirements this addresses
```

### 7.2 Example Bead

```yaml
# .beads/002-s3-upload-service.yaml

bead_id: "002"
title: "Create S3 upload service"
description: |
  Service to handle file uploads to S3 for avatar storage.
  Follows existing service patterns in the codebase.
  Validates file size and content type before upload.

depends_on: []

context:
  - file: "app/services/storage/s3_client.rb"
    find: "class S3Client"
    purpose: "Existing S3 wrapper - use this client"
    
  - file: "app/services/attachments/upload_service.rb"
    find: "class UploadService"
    scope: "entire class"
    purpose: "Service pattern to follow - #call method, Result object"
    
  - file: "app/services/attachments/upload_service.rb"
    find: "rescue Aws::"
    purpose: "Error handling pattern for AWS errors"
    
  - file: "app/errors/service_error.rb"
    find: "class ServiceError"
    purpose: "Base error class to inherit from"
    
  - file: "spec/support/s3_mock.rb"
    find: "RSpec.configure"
    purpose: "S3 mocking setup for tests"
    
  - file: ".env.example"
    find: "AWS_S3_BUCKET"
    purpose: "Required environment variables"

deliverables:
  - type: "file_create"
    path: "app/services/avatars/upload_service.rb"
    description: |
      AvatarUploadService class with:
      - #call(file, user_id) method
      - Returns Result object with url on success
      - Validates file size (max 5MB)
      - Validates content type (image/jpeg, image/png, image/webp)
      - Uses S3Client for upload
      - Wraps AWS errors in ServiceError
      
  - type: "file_create"
    path: "spec/services/avatars/upload_service_spec.rb"
    description: "Unit tests for AvatarUploadService"

tests:
  file: "spec/services/avatars/upload_service_spec.rb"
  structure: "Mirror spec/services/attachments/upload_service_spec.rb"
  cases:
    - "uploads valid JPEG file and returns URL"
    - "uploads valid PNG file and returns URL"
    - "uploads valid WebP file and returns URL"
    - "rejects file over 5MB with clear error"
    - "rejects invalid content type with clear error"
    - "wraps S3 errors in ServiceError"
    - "includes user_id in S3 key path"
  run_command: "bundle exec rspec spec/services/avatars/upload_service_spec.rb"

acceptance_criteria:
  - "All test cases pass"
  - "Service follows existing UploadService pattern exactly"
  - "No hardcoded credentials"
  - "Error messages are user-friendly"
  - "Logging matches existing services (Rails.logger.info on success, .error on failure)"

estimated_complexity: "M"
suggested_model: "claude"
requirements: ["R1", "R2"]
```

### 7.3 Context Find Strategies

| Strategy | Use When | Example |
|----------|----------|---------|
| Class definition | Referencing a class | `find: "class UserService"` |
| Method definition | Referencing a method | `find: "def upload"` |
| Module definition | Referencing a module | `find: "module Authentication"` |
| Constant | Referencing a constant | `find: "AVATAR_SIZES ="` |
| Error handling | Showing error pattern | `find: "rescue Aws::"` |
| Config block | Referencing config | `find: "Aws.config.update"` |
| Unique string | Config values, env vars | `find: "AWS_S3_BUCKET"` |
| Comment marker | Marked sections | `find: "# ERROR HANDLING"` |
| Import/require | Dependencies | `find: "require 'image_processing'"` |

### 7.4 Scope Modifiers

| Scope | Meaning |
|-------|---------|
| (none) | Just the line containing the find term |
| `"entire method"` | From method definition to end |
| `"entire class"` | From class definition to end |
| `"entire file"` | Whole file as context |
| `"block"` | Until matching end/brace |
| `"until blank line"` | Until next blank line |

---

## 8. Halmoni: Self-Improvement System

### 8.1 Concept

**할머니 (Halmoni)** - Korean for grandmother.

Like a grandmother who improves her kimchi recipe with each batch, Halmoni observes what works, makes small adjustments, and passes down accumulated wisdom.

### 8.2 Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HALMONI CYCLE                                                              │
│                                                                             │
│  🍜 TASTE (Observe)                                                         │
│     What happened? What worked? What didn't?                               │
│                                                                             │
│           │                                                                 │
│           ▼                                                                 │
│                                                                             │
│  🥢 ADJUST (Propose)                                                        │
│     What small change would help next time?                                │
│                                                                             │
│           │                                                                 │
│           ▼                                                                 │
│                                                                             │
│  🫙 REMEMBER (Validate)                                                     │
│     Does this conflict? Is it useful? Would it have helped before?         │
│                                                                             │
│           │                                                                 │
│           ▼                                                                 │
│                                                                             │
│  📜 PASS DOWN (Apply)                                                       │
│     Update the skill, log the change, increment version                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Halmoni Triggers

| Trigger | Source |
|---------|--------|
| Bead execution complete | Automatic after ACFS reports completion |
| Bead execution failed | Automatic after ACFS reports failure |
| Human feedback | Manual via `/kimchi:halmoni --from-feedback "..."` |
| Validation pattern | When same validation issue occurs 3+ times |
| Explicit invocation | `/kimchi:halmoni` |

### 8.4 What Halmoni Can Improve

| Component | Examples |
|-----------|----------|
| Clarification questions | Add new question patterns, refine existing ones |
| Review personas | Adjust what personas look for, add new concerns |
| Bead validators | Add new checks, refine existing thresholds |
| Execution skills | Add steps, clarify anti-patterns |
| Find strategies | Add new landmark patterns |
| Bead structure | Add optional fields, improve templates |

### 8.5 What Halmoni Cannot Change

| Protected | Reason |
|-----------|--------|
| Core safety checks | Fundamental to system integrity |
| ACFS integration protocol | Compatibility with external system |
| Bead schema required fields | Breaking change for existing beads |
| Command names | User muscle memory |

### 8.6 Halmoni Skill

```markdown
# skills/meta/halmoni/SKILL.md

---
name: "Halmoni"
version: "1.0.0"
description: "Self-improvement through accumulated wisdom"
triggers:
  - "/kimchi:halmoni invoked"
  - "bead execution complete"
  - "bead execution failed"
---

# Halmoni (할머니)

> "Taste, adjust, remember. Each batch teaches the next."

## Purpose

Improve Kimchi's skills, validators, and personas based on execution feedback.

## Process

### 1. TASTE (Observe)

Gather information about what happened:

**For completed beads:**
- How many iterations did the agent need?
- Were there any searches/exploration before finding context?
- Did the agent ask clarifying questions?
- How long did execution take vs. estimate?

**For failed beads:**
- What was the failure mode?
- Was context missing?
- Was a skill not followed?
- Was the bead specification unclear?

**For human feedback:**
- What specifically was the complaint?
- What was expected vs. actual?
- Is this a pattern or one-off?

### 2. ADJUST (Propose)

Generate specific, minimal changes:

```markdown
## Proposed Change

**File:** validators/context-completeness.md

**Change:**
+ □ When task involves error handling:
+   Context must reference error handling pattern
+   Example: find: "rescue Aws::" with purpose

**Rationale:**
Bead 003 execution required 3 iterations to find error handling
pattern. This was predictable and should have been in context.
```

Rules for proposals:
- One change at a time
- Show as diff
- Explain rationale
- Reference specific evidence

### 3. REMEMBER (Validate)

Check the proposal:

| Check | Question |
|-------|----------|
| Conflicts | Does this contradict any existing skill/validator? |
| Specificity | Is this actionable, not vague? |
| Generality | Will this help beyond this one case? |
| Historical | Would this have helped previous beads? |

Run historical validation:
```bash
# Check against past beads
kimchi validate --historical --with-proposed-change
```

### 4. PASS DOWN (Apply)

If validated and approved:

1. Apply the change to the file
2. Update version in frontmatter
3. Add entry to skills/CHANGELOG.md
4. Commit with message: `halmoni: {brief description}`

## Approval Modes

| Mode | Behavior |
|------|----------|
| Interactive (default) | Show proposal, ask for confirmation |
| `--dry-run` | Show proposal, don't apply |
| `--auto-apply` | Apply without confirmation (use carefully) |

## Output Format

```
🍜 Tasting bead 003 execution...

Observations:
• Agent found BaseStorage via "class BaseStorage" ✓
• Agent searched 4 patterns for error handling before finding it
• Agent asked "Should I follow logging pattern?" (not in context)

🥢 Proposed adjustments:

1. validators/context-completeness.md
   
   + □ When task involves error handling:
   +   Reference error handling pattern
   +   Example: find: "rescue Aws::"
   
   Rationale: Would have saved 3 search iterations

2. templates/bead.yaml
   
   + # Halmoni's reminders:
   + # □ Error handling referenced?
   + # □ Logging pattern referenced?
   
   Rationale: Prompt for common patterns

🫙 Validation:
• Conflicts: None
• Specificity: ✓ Actionable
• Generality: ✓ Applies to error-handling beads
• Historical: Would have helped beads 001, 007

Pass down these learnings? [y/n/edit]
```

## Anti-Patterns

### FORBIDDEN: Large changes

Halmoni makes small, incremental improvements. Not rewrites.

### FORBIDDEN: Unvalidated changes

Every change must pass the validation checks.

### FORBIDDEN: Breaking changes

Never modify protected components or break compatibility.
```

### 8.7 Changelog Format

```markdown
# skills/CHANGELOG.md

All notable changes to Kimchi skills, validators, and personas.

## [1.2.0] - 2026-02-01

### validators/context-completeness
- **Added:** Error handling pattern reference requirement
- **Trigger:** Bead 003 required 3 iterations to find error patterns
- **Evidence:** Historical analysis shows 12 beads would have benefited

### validators/test-specification  
- **Changed:** Minimum edge cases for M complexity: 3 → 4
- **Trigger:** Human feedback on bead 015 missing timeout edge case
- **Evidence:** 8 recent M-complexity beads had only 3 cases

## [1.1.0] - 2026-01-28

### skills/execution/tdd
- **Added:** "Verify failure reason" step between RED and GREEN
- **Trigger:** Bead 009 agent wrote test that passed for wrong reason
- **Evidence:** Agent missed that test was syntactically wrong

### skills/execution/bead-protocol
- **Added:** Send Agent Mail when blocked_by dependency not complete
- **Trigger:** Bead 022 agent waited silently for 20 minutes
- **Evidence:** No communication led to wasted time

## [1.0.0] - 2026-01-20

- Initial release
- Skills extracted from Superpowers, Compound Engineering
- Bead validation system implemented
- ACFS integration protocol established
```

---

## 9. Command Reference

### 9.1 Planning Commands

| Command | Description | Input | Output |
|---------|-------------|-------|--------|
| `/kimchi:plan [idea]` | Full planning pipeline | Feature description | `.beads/` |
| `/kimchi:clarify [idea]` | Clarification questions | Feature description | `.kimchi/CONTEXT.md` |
| `/kimchi:requirements` | Extract requirements | CONTEXT.md | `.kimchi/REQUIREMENTS.md` |
| `/kimchi:research` | Research codebase/framework | CONTEXT.md, REQUIREMENTS.md | `.kimchi/RESEARCH.md` |
| `/kimchi:generate` | Generate task plan | All .kimchi/ docs | `.kimchi/PLAN.md` |
| `/kimchi:review` | Multi-persona review | PLAN.md | `.kimchi/PLAN-REVIEWED.md` |
| `/kimchi:refine` | Adaptive refinement | PLAN-REVIEWED.md | `.kimchi/PLAN-FINAL.md` |
| `/kimchi:beads` | Convert to beads | PLAN-FINAL.md | `.beads/` (draft) |
| `/kimchi:validate` | Validate beads | `.beads/` (draft) | `.beads/` (validated) |

### 9.2 Planning Options

```
/kimchi:plan [idea]
    --depth minimal|standard|comprehensive
        minimal: Quick clarification, basic plan
        standard: Full clarification, reviewed plan (default)
        comprehensive: Deep research, multiple review rounds
        
    --max-refine-loops N
        Maximum refinement iterations (default: 3)
        
    --max-bead-validation-loops N
        Maximum bead enrichment iterations (default: 3)
        
    --skip-research
        Skip codebase/framework research stage
        
    --skip-review
        Skip multi-persona review stage
        
    --no-push
        Don't push to beads-sync after validation
```

### 9.3 Skill Commands

| Command | Description |
|---------|-------------|
| `/kimchi:skills` | List all available skills with versions |
| `/kimchi:skill [name]` | Show skill content |
| `/kimchi:skill:create [desc]` | Generate new skill from description |

### 9.4 Halmoni Commands

| Command | Description |
|---------|-------------|
| `/kimchi:halmoni` | Interactive improvement session |
| `/kimchi:halmoni --from-bead [id]` | Learn from specific bead execution |
| `/kimchi:halmoni --from-feedback "[text]"` | Learn from human feedback |
| `/kimchi:halmoni --taste-only` | Observe without proposing changes |
| `/kimchi:halmoni --dry-run` | Show proposals without applying |
| `/kimchi:halmoni --history` | Show CHANGELOG.md |

### 9.5 Utility Commands

| Command | Description |
|---------|-------------|
| `/kimchi:status` | Show planning state, active beads |
| `/kimchi:reset` | Clear .kimchi/ working directory |

---

## 10. File Structure

```
kimchi/
├── .claude-plugin/
│   ├── manifest.json
│   ├── hooks/
│   │   └── session-start.md          # Remind about skills
│   └── commands/
│       ├── kimchi-plan.md            # Full pipeline
│       ├── kimchi-clarify.md
│       ├── kimchi-requirements.md
│       ├── kimchi-research.md
│       ├── kimchi-generate.md
│       ├── kimchi-review.md
│       ├── kimchi-refine.md
│       ├── kimchi-beads.md
│       ├── kimchi-validate.md
│       ├── kimchi-skills.md
│       ├── kimchi-skill.md
│       ├── kimchi-skill-create.md
│       ├── kimchi-halmoni.md
│       ├── kimchi-status.md
│       └── kimchi-reset.md
│
├── skills/
│   ├── CHANGELOG.md                  # Halmoni's memory
│   │
│   ├── execution/                    # Phase 3 execution skills
│   │   ├── tdd/
│   │   │   └── SKILL.md
│   │   ├── systematic-debugging/
│   │   │   └── SKILL.md
│   │   ├── verification-before-completion/
│   │   │   └── SKILL.md
│   │   ├── simplicity-enforcement/
│   │   │   └── SKILL.md
│   │   └── bead-protocol/
│   │       └── SKILL.md
│   │
│   └── meta/
│       └── halmoni/
│           └── SKILL.md
│
├── personas/                         # Review personas
│   ├── feature-trimmer.md
│   ├── complexity-detector.md
│   ├── premature-optimization-detector.md
│   ├── scope-guardian.md
│   └── test-coverage-advocate.md
│
├── validators/                       # Bead validators
│   ├── context-completeness.md
│   ├── deliverables-clarity.md
│   ├── test-specification.md
│   └── isolation-check.md
│
├── templates/
│   ├── CONTEXT.md
│   ├── REQUIREMENTS.md
│   ├── RESEARCH.md
│   ├── PLAN.md
│   ├── bead.yaml
│   └── manifest.yaml
│
├── lib/
│   ├── clarification-questions.md    # Question patterns
│   ├── refinement-loop.md            # Adaptive loop logic
│   ├── beads-converter.md            # Plan → beads
│   ├── bead-validator.md             # Validation orchestration
│   └── find-strategies.md            # Landmark patterns
│
└── docs/
    ├── README.md
    ├── acfs-integration.md
    ├── skill-evolution.md
    └── bead-specification.md
```

---

## 11. Implementation Plan

### Phase 1A: Core Infrastructure (Week 1-2)

**Goal:** Basic plugin structure, commands that do nothing yet.

**Tasks:**

1. Create plugin scaffold
   - `.claude-plugin/manifest.json`
   - All command files (stub implementations)
   - Directory structure
   
2. Create templates
   - CONTEXT.md template
   - REQUIREMENTS.md template
   - RESEARCH.md template
   - PLAN.md template
   - bead.yaml template
   - manifest.yaml template

3. Implement `/kimchi:status`
   - Check for .kimchi/ directory
   - List existing artifacts
   - Show current state

4. Implement `/kimchi:reset`
   - Clear .kimchi/ directory
   - Preserve .beads/

**Deliverables:**
- [ ] Plugin installs via `/plugin install`
- [ ] All commands registered and respond
- [ ] Templates created
- [ ] Status and reset working

### Phase 1B: Clarification & Requirements (Week 2-3)

**Goal:** First two stages of planning pipeline.

**Tasks:**

1. Implement `/kimchi:clarify`
   - Parse initial idea
   - Generate clarification questions
   - Iterate until confident
   - Output CONTEXT.md

2. Create clarification question library
   - Functional questions
   - Data questions
   - Integration questions
   - Constraint questions
   - Scope questions

3. Implement `/kimchi:requirements`
   - Parse CONTEXT.md
   - Categorize into v1/v2/out-of-scope
   - Define acceptance criteria
   - Output REQUIREMENTS.md

**Deliverables:**
- [ ] `/kimchi:clarify` produces CONTEXT.md
- [ ] `/kimchi:requirements` produces REQUIREMENTS.md
- [ ] Question library documented

### Phase 1C: Research & Generate (Week 3-4)

**Goal:** Research and plan generation stages.

**Tasks:**

1. Implement `/kimchi:research`
   - Search codebase for similar patterns
   - Extract patterns with find landmarks
   - Document anti-patterns
   - Output RESEARCH.md

2. Implement find strategy library
   - Class/method/module patterns
   - Error handling patterns
   - Config patterns
   - Test patterns

3. Implement `/kimchi:generate`
   - Map requirements to tasks
   - Identify dependencies
   - Estimate complexity
   - Output PLAN.md

**Deliverables:**
- [ ] `/kimchi:research` produces RESEARCH.md
- [ ] `/kimchi:generate` produces PLAN.md
- [ ] Find strategies documented

### Phase 1D: Review & Refine (Week 4-5)

**Goal:** Multi-persona review and adaptive refinement.

**Tasks:**

1. Create review personas
   - Feature trimmer
   - Complexity detector
   - Premature optimization detector
   - Scope guardian
   - Test coverage advocate

2. Implement `/kimchi:review`
   - Run each persona
   - Collect concerns
   - Present for human decision
   - Apply accepted changes
   - Output PLAN-REVIEWED.md

3. Implement `/kimchi:refine`
   - Define refinement criteria
   - Implement adaptive loop
   - Exit condition detection
   - Output PLAN-FINAL.md

**Deliverables:**
- [ ] All personas created
- [ ] `/kimchi:review` produces PLAN-REVIEWED.md
- [ ] `/kimchi:refine` produces PLAN-FINAL.md
- [ ] Adaptive loop working

### Phase 1E: Beads & Validation (Week 5-6)

**Goal:** Bead conversion and validation.

**Tasks:**

1. Implement `/kimchi:beads`
   - Convert plan tasks to bead format
   - Populate context using find landmarks
   - Create manifest.yaml
   - Output draft beads

2. Create validators
   - Context completeness
   - Deliverables clarity
   - Test specification
   - Isolation check

3. Implement `/kimchi:validate`
   - Run all validators
   - Enrich failing beads
   - Validation loop
   - Output validated beads
   - Output VALIDATION-REPORT.md

4. Implement beads-sync push
   - Push to beads-sync branch
   - ACFS integration point

**Deliverables:**
- [ ] `/kimchi:beads` produces draft beads
- [ ] All validators created
- [ ] `/kimchi:validate` produces validated beads
- [ ] Push to beads-sync working

### Phase 1F: Full Pipeline (Week 6-7)

**Goal:** `/kimchi:plan` runs full pipeline.

**Tasks:**

1. Implement `/kimchi:plan`
   - Orchestrate all stages
   - Handle options (--depth, --skip-*, etc.)
   - Progress reporting
   - Error handling

2. Integration testing
   - End-to-end test with sample feature
   - ACFS integration test

**Deliverables:**
- [ ] `/kimchi:plan` runs full pipeline
- [ ] All options working
- [ ] Integration tests passing

### Phase 1G: Execution Skills (Week 7-8)

**Goal:** All execution skills created and documented.

**Tasks:**

1. Create TDD skill
   - RED-GREEN-REFACTOR process
   - Verification steps
   - Anti-patterns

2. Create systematic debugging skill
   - 4-phase process
   - Documentation requirements
   - Anti-patterns

3. Create verification skill
   - Checklist
   - Manual verification steps
   - Anti-patterns

4. Create simplicity skill
   - Principles
   - Code examples
   - Anti-patterns

5. Create bead protocol skill
   - ACFS integration steps
   - Communication patterns
   - Anti-patterns

6. Implement `/kimchi:skills` and `/kimchi:skill`
   - List skills
   - Show skill content

**Deliverables:**
- [ ] All 5 execution skills created
- [ ] `/kimchi:skills` working
- [ ] `/kimchi:skill [name]` working

### Phase 1H: Halmoni (Week 8-9)

**Goal:** Self-improvement system.

**Tasks:**

1. Create halmoni skill
   - TASTE/ADJUST/REMEMBER/PASS DOWN process
   - Validation checks
   - Anti-patterns

2. Implement `/kimchi:halmoni`
   - Observation gathering
   - Proposal generation
   - Validation
   - Application with confirmation

3. Create CHANGELOG infrastructure
   - Initial CHANGELOG.md
   - Version tracking
   - Commit integration

4. Implement triggers
   - Manual invocation
   - From bead feedback
   - From human feedback

**Deliverables:**
- [ ] Halmoni skill created
- [ ] `/kimchi:halmoni` working
- [ ] CHANGELOG tracking working

### Phase 1I: Polish & Documentation (Week 9-10)

**Goal:** Production-ready release.

**Tasks:**

1. Documentation
   - README.md
   - ACFS integration guide
   - Skill evolution guide
   - Bead specification

2. Error handling
   - Graceful failures
   - Helpful error messages
   - Recovery suggestions

3. Testing
   - Unit tests for validators
   - Integration tests
   - Manual testing

4. Release
   - Version 1.0.0
   - Release notes
   - Installation instructions

**Deliverables:**
- [ ] Full documentation
- [ ] Error handling complete
- [ ] Tests passing
- [ ] Version 1.0.0 released

---

## 12. Future Phases

### Phase 2: Cross-Model Portability

Convert Kimchi skills and commands to work with:
- Codex CLI
- Gemini CLI
- OpenCode
- Other future agents

### Phase 3: Git Worktree Intelligence

Intelligent determination of when to use worktrees:
- Single-bead changes: direct branch
- Multi-bead parallel: worktrees
- Conflict detection and resolution

### Phase 4: Review Phase

Multi-persona code review similar to plan review:
- Security sentinel
- Performance oracle
- Architecture strategist
- Language-specific reviewers

### Phase 5: Adaptive Loop Control

"Ralph Wiggum" style exit detection:
- Quality scoring with diminishing returns
- Regression detection
- Configurable thresholds
- Learning optimal loop counts from history

---

## 13. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Bead** | A self-contained task specification in YAML format |
| **Landmark** | A semantic identifier used to find code (vs. line numbers) |
| **Halmoni** | The self-improvement system (Korean for grandmother) |
| **Persona** | A review role with specific concerns and questions |
| **Validator** | A check that ensures bead quality |
| **Skill** | A mandatory execution discipline loaded per agent |

### Appendix B: ACFS Commands Reference

Commands used in bead-protocol skill:

```bash
# File reservations
acfs reserve --check {path}
acfs reserve --add {path} --ttl {seconds}
acfs reserve --release {path}

# Bead status
acfs bead status {bead_id}
acfs bead status {bead_id} --set {status}

# Agent mail
acfs mail send --to {agent} --subject "{subject}" --body "{body}"
acfs mail inbox

# Beads viewer
bv                    # Open TUI
bv list               # List beads
bv show {bead_id}     # Show bead details
```

### Appendix C: Example Session

```
$ claude

> /kimchi:plan "Add user avatars with S3 upload"

🍜 Starting Kimchi planning pipeline...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 STAGE 1: Clarification

I have some questions to make sure I understand what you want:

**Upload Behavior**
1. What's the maximum file size users can upload?
   > 5MB

2. Which image formats should be accepted?
   > JPEG, PNG, WebP

3. Should resizing happen on upload, or async in background?
   > On upload, it's small files

**Storage**
4. Where should avatars be stored?
   > S3, we already have an AWS account set up

5. Should avatar URLs be public or require signed URLs?
   > Public is fine

[... more questions ...]

✓ Clarification complete. Saved to .kimchi/CONTEXT.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 STAGE 2: Requirements

Extracted requirements:

**v1 (Must Have)**
- R1: Avatar Upload
- R2: Avatar Storage  
- R3: Avatar Display
- R4: Avatar Deletion

**v2 (Next Iteration)**
- R5: Cropping UI
- R6: CDN Integration

**Out of Scope**
- Animated GIFs
- Avatar history

✓ Requirements extracted. Saved to .kimchi/REQUIREMENTS.md

[... stages 3-8 continue ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PLANNING COMPLETE

Created 6 validated beads:
  001-add-avatar-column (S)
  002-s3-upload-service (M)
  003-resize-service (M)
  004-upload-endpoint (M)
  005-avatar-component (S)
  006-integration-tests (M)

Push to beads-sync? [Y/n] y

✓ Pushed to beads-sync. Ready for ACFS execution.
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | 2026-01-31 | Human + Claude | Initial draft |

---

*End of Technical Specification*
