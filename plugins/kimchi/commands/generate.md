---
name: generate
description: "This command should be used to generate an implementation plan with task breakdown, dependencies, and complexity estimates. Fourth stage of the Kimchi planning pipeline. Produces .kimchi/PLAN.md."
---

# Kimchi Generate

<command_purpose>
Create a task breakdown from requirements and research, with dependencies, complexity estimates, and traceability to requirements.
</command_purpose>

## Input

Read `.kimchi/CONTEXT.md`, `.kimchi/REQUIREMENTS.md`, and `.kimchi/RESEARCH.md`. If any are missing, tell the user which prerequisite to run.

## Process

### 1. Map Requirements to Tasks

For each v1 requirement, identify the implementation tasks needed:
- Database changes (migrations, schema)
- Service/business logic
- API endpoints / controllers
- UI components / views
- Tests
- Configuration

### 2. Identify Dependencies

Build a dependency graph:
- Which tasks must complete before others can start?
- Which tasks can run in parallel?
- Are there any circular dependencies? (Error if so)

### 3. Estimate Complexity

| Complexity | Characteristics |
|------------|-----------------|
| **S (Small)** | Single file, clear pattern to follow, < 100 lines |
| **M (Medium)** | Multiple files, some decisions required, 100-300 lines |
| **L (Large)** | Architectural decisions, new patterns, > 300 lines. Consider splitting. |

If any task is L, consider splitting it into smaller tasks.

### 4. Write PLAN.md

Write to `.kimchi/PLAN.md`:

```markdown
# Plan: [Feature Name]

**Generated:** [today's date]
**Source:** .kimchi/CONTEXT.md, .kimchi/REQUIREMENTS.md, .kimchi/RESEARCH.md

## Task Overview

| ID | Task | Complexity | Depends On | Requirements |
|----|------|------------|------------|--------------|
| 001 | [Task title] | S | - | [REQ-ID] |
| 002 | [Task title] | M | - | [REQ-ID] |
| 003 | [Task title] | M | 002 | [REQ-ID] |

## Dependency Graph

```
[ASCII dependency graph showing parallel and sequential tasks]
```

## Task Details

### Task 001: [Title]
**Complexity:** S
**Requirements:** [REQ-ID]
**Depends On:** None

[Description of what this task does]

**Deliverables:**
- [What files/changes will be produced]

**Context Needed:**
- [What existing code the agent needs to see]

---

### Task 002: [Title]
**Complexity:** M
**Requirements:** [REQ-ID]
**Depends On:** None

[Description]

**Deliverables:**
- [List]

**Context Needed:**
- [List]

---

[... additional tasks ...]

## Execution Strategy

**Parallel groups (tasks with no interdependencies):**
- Wave 1: [tasks that can start immediately]
- Wave 2: [tasks that depend on Wave 1]
- Wave 3: [tasks that depend on Wave 2]

**Integration tests:** Final task after all others complete
```

Report: "Plan generated. Saved to .kimchi/PLAN.md"
Suggest: "Run `/kimchi:review` for multi-persona critique, or `/kimchi:beads` to skip review and convert directly."

## Key Principles

- **Every task traces to a v1 requirement**: No orphan tasks
- **No L tasks**: Split them. Large tasks fail in agent execution.
- **Dependencies are explicit**: Not implied, not "obvious"
- **Context Needed lists what the agent must read**: Not what's nice to know
