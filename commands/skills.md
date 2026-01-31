---
name: skills
description: "This command should be used to list all available Kimchi execution skills with their names, versions, and descriptions."
---

# Kimchi Skills

List all execution skills available in the Kimchi plugin.

## Process

1. Read all `SKILL.md` files in the `skills/` directory (including subdirectories)
2. Parse YAML frontmatter from each for: name, version, description
3. Display as a formatted table:

```
Kimchi Execution Skills
═══════════════════════

| Skill | Version | Description |
|-------|---------|-------------|
| tdd | 1.0.0 | Enforce RED-GREEN-REFACTOR cycle |
| systematic-debugging | 1.0.0 | 4-phase root cause analysis |
| verification-before-completion | 1.0.0 | Ensure work is actually complete |
| simplicity-enforcement | 1.0.0 | Prefer simple solutions over clever ones |
| bead-protocol | 1.0.0 | ACFS integration during execution |

Meta Skills:
| halmoni | 1.0.0 | Self-improvement through accumulated wisdom |

Use /kimchi:skill [name] to view full skill content.
```

Use Glob to find all `**/SKILL.md` files under the skills directory, then Read each to extract frontmatter.
