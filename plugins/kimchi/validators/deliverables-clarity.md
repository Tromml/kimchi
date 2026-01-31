# Validator: Deliverables Clarity

## Purpose

Ensure the agent knows exactly what to produce. Every deliverable must have an explicit type, full path, and concrete description.

## Checks

- [ ] Each deliverable has explicit type
  - Types: `file_create`, `file_modify`, `file_delete`

- [ ] `file_create` deliverables have full path
  - BAD: `path: "upload_service.rb"`
  - GOOD: `path: "app/services/avatars/upload_service.rb"`

- [ ] `file_modify` deliverables have anchor point
  - BAD: `path: "config.rb", action: "add registration"`
  - GOOD: `path: "config.rb", find: "Storage.register", action: "add after"`

- [ ] Deliverable descriptions are concrete
  - BAD: `description: "Update the service"`
  - GOOD: `description: "Add #upload method that accepts file and returns URL"`

- [ ] All deliverable paths use project-relative paths
  - BAD: `path: "~/code/project/app/services/foo.rb"`
  - GOOD: `path: "app/services/foo.rb"`

## Failure Triggers

- Missing type field
- Missing path field
- `file_modify` without find anchor
- Vague descriptions ("update", "fix", "improve", "handle")
- Relative paths without directory context
- Duplicate deliverable paths

## Output Format

For each failing check:
```
FAIL: [check name]
Bead: [bead_id]
Deliverable: [path]
Issue: [what's wrong]
Fix: [what to add/change]
```

For passing beads:
```
PASS: All deliverables have explicit types, paths, and concrete descriptions
```
