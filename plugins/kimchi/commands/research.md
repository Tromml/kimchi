---
name: research
description: "This command should be used to investigate codebase patterns, frameworks, and existing implementations before planning. Third stage of the Kimchi planning pipeline. Produces .kimchi/RESEARCH.md."
---

# Kimchi Research

<command_purpose>
Investigate the codebase for existing patterns, similar features, framework conventions, and anti-patterns. All code references use `find:` landmarks (semantic identifiers), never line numbers.
</command_purpose>

## Input

Read `.kimchi/CONTEXT.md` and `.kimchi/REQUIREMENTS.md`. If either doesn't exist, tell the user which prerequisite to run first.

## Process

### 1. Detect Project Stack

Search for package manager files to determine language/framework:
- `Gemfile` / `Gemfile.lock` → Ruby/Rails
- `package.json` → Node/JavaScript/TypeScript
- `requirements.txt` / `pyproject.toml` → Python
- `go.mod` → Go
- `Cargo.toml` → Rust
- `pom.xml` / `build.gradle` → Java

Detect test framework:
- `spec/` directory + `Gemfile` with rspec → RSpec
- `test/` directory + Rails → Minitest
- `jest.config.*` or `vitest.config.*` → Jest/Vitest
- `pytest.ini` / `conftest.py` → Pytest

### 2. Search for Similar Patterns

For each v1 requirement, search the codebase for similar implementations:

```
For each requirement:
  1. Identify keywords (e.g., "upload", "avatar", "resize")
  2. Glob for files matching: **/*{keyword}*
  3. Grep for class/method definitions related to the feature
  4. When found, document with find: landmarks
```

### 3. Extract Patterns with Landmarks

For each discovered pattern, document using `find:` strategies:

| Strategy | Use When | Example |
|----------|----------|---------|
| Class definition | Referencing a class | `find: "class UserService"` |
| Method definition | Referencing a method | `find: "def upload"` |
| Module definition | Referencing a module | `find: "module Authentication"` |
| Constant | Referencing a constant | `find: "AVATAR_SIZES ="` |
| Error handling | Showing error pattern | `find: "rescue Aws::"` |
| Config block | Referencing config | `find: "Aws.config.update"` |
| Unique string | Config values, env vars | `find: "AWS_S3_BUCKET"` |

**NEVER use line numbers.** Always use `find:` with a string unique enough to locate the code.

### 4. Document Anti-Patterns

If you find code that violates framework conventions or has obvious issues, document it as an anti-pattern to avoid.

### 5. Framework Research (if needed)

If codebase has few patterns (new project), research framework best practices:
- Use WebSearch for framework documentation
- Use Context7 MCP tools for library-specific docs
- Document recommended approaches

### 6. Write RESEARCH.md

Write to `.kimchi/RESEARCH.md`:

```markdown
# Research: [Feature Name]

**Researched:** [today's date]
**Stack:** [Language] / [Framework] / [Test Framework]

## Codebase Patterns

### [Pattern Category 1]
[Description of what was found]

**Reference Implementation:**
- Service: `[file path]`
  - find: "[search term]"
  - scope: "[entire class|entire method|etc]"
  - Pattern: [What pattern this demonstrates]

- Controller: `[file path]`
  - find: "[search term]"
  - Pattern: [What pattern this demonstrates]

- Tests: `[file path]`
  - find: "[search term]"
  - Pattern: [What pattern this demonstrates]

### [Pattern Category 2]
[...]

## Framework Recommendations

### [Topic]
[Recommended approach based on framework conventions]

```[language]
# Recommended approach
[code example]
```

## Anti-Patterns to Avoid

- [Description of what NOT to do and why]

## Test Patterns

- Test framework: [name]
- Test directory: [path]
- Run command: [command]
- Mock patterns: [description with find: reference if applicable]

## No Patterns Found

[If nothing relevant was found in the codebase, state that clearly.
"No existing patterns found for [feature area]. Implementation will follow [framework] conventions."]
```

Report: "Research complete. Saved to .kimchi/RESEARCH.md"
Suggest: "Run `/kimchi:generate` to create the implementation plan."

## Key Principles

- **Landmarks, not coordinates**: `find: "class S3Client"` not `lines: "12-34"`
- **Research is not optional**: Plans that ignore existing patterns fight the codebase
- **Anti-patterns matter**: Knowing what NOT to do is as valuable as knowing what TO do
- **Empty is OK**: New projects won't have patterns. Document that and move on.
