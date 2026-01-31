# Validator: Context Completeness

## Purpose

Ensure the agent can FIND everything it needs. Every file reference must have a `find:` strategy that's specific, stable, and scoped appropriately.

## Checks

- [ ] Every file reference has a `find:` strategy
  - BAD: `file: "base_storage.rb"`
  - GOOD: `file: "base_storage.rb", find: "class BaseStorage"`

- [ ] Find terms are specific enough to be unique
  - BAD: `find: "def initialize"`
  - GOOD: `find: "class S3Storage", scope: "def initialize"`

- [ ] Find terms are stable (survive refactoring)
  - BAD: `find: "# TODO: fix this"`
  - GOOD: `find: "def upload"`

- [ ] Scope is appropriate for purpose
  - BAD: `find: "class", scope: "entire file"` (when method suffices)
  - GOOD: `find: "def upload", scope: "entire method"`

- [ ] Error handling patterns referenced
  - When task involves error handling:
  - GOOD: `find: "rescue Aws::"` with `purpose: "Error handling pattern"`

- [ ] Logging patterns referenced
  - When task involves logging:
  - GOOD: `find: "Rails.logger"` with `purpose: "Logging pattern"`

## Failure Triggers

- Any line number reference (`lines: "12-34"`)
- "See above" or "as mentioned"
- Implicit file references
- Find terms matching multiple locations
- File references without find strategy
- Find terms that are comments or temporary markers

## Output Format

For each failing check:
```
FAIL: [check name]
Bead: [bead_id]
Issue: [what's wrong]
Fix: [what to add/change]
```

For passing beads:
```
PASS: All context references have valid find strategies
```
