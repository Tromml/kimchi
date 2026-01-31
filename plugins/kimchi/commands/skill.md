---
name: skill
description: This command should be used to view the full content of a specific Kimchi execution skill.
argument-hint: "[skill-name]"
---

# Kimchi Skill Viewer

Display the full content of a named skill.

## Process

1. Parse `$ARGUMENTS` for the skill name
2. If no name provided, tell user: "Specify a skill name. Run `/kimchi:skills` to see available skills."
3. Search for the skill file:
   - Try `skills/$ARGUMENTS/SKILL.md`
   - Try `skills/meta/$ARGUMENTS/SKILL.md`
   - If not found, suggest closest match
4. Read and display the full SKILL.md content

## Example

```
> /kimchi:skill tdd

[Displays full content of skills/tdd/SKILL.md]
```
