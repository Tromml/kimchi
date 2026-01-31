# Kimchi Plugin Development

## What is this?

Kimchi is a Claude Code plugin that transforms vague ideas into validated, standalone task specifications (beads) for multi-agent execution via ACFS infrastructure.

## Architecture

- **Prompt-native:** All logic lives in markdown files. No TypeScript, no build step.
- **Plugin structure:** `.claude-plugin/plugin.json` manifest, `commands/` for slash commands, `skills/` for execution discipline, `agents/` for subagents.
- **10-stage pipeline:** clarify -> requirements -> research -> generate -> review -> refine -> plan-revise -> plan-synthesize -> beads -> validate

## Key conventions

- Commands are thin orchestrators. Agents do the heavy lifting.
- Skills use Superpowers format: frontmatter with `name` and `description`, Iron Law, Common Rationalizations table, Red Flags, Good/Bad examples.
- Context references use `find:` landmarks, NEVER line numbers.
- Beads must be standalone-executable with zero external context.

## File structure

```
.claude-plugin/plugin.json    # Plugin manifest
commands/                     # 14 slash commands (auto-namespace as /kimchi:*)
skills/                       # 5 execution skills + Halmoni meta-skill
agents/pipeline/              # 3 pipeline agents (clarifier, researcher, bead-converter)
agents/review/                # 5 review persona agents
personas/                     # 5 persona definitions
validators/                   # 4 bead validators
lib/                          # 4 reference libraries
templates/                    # 6 output templates
hooks/                        # ACFS integration hooks
```

## Testing

This is a prompt-native plugin — there's no code to unit test. Validation happens through:
- Manual testing of each command
- Bead validator checks
- Review persona output quality
