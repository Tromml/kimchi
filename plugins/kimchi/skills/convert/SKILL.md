---
name: kimchi:convert
description: Convert the kimchi plugin into OpenCode and Codex compatible formats using the bundled converter CLI. Requires bun runtime.
argument-hint: "[--to opencode|codex|both] [--output path]"
---

# Plugin Format Converter

Convert the kimchi Claude Code plugin into OpenCode and Codex compatible formats.

## How to Execute

### 1. Resolve paths

Find these two absolute paths:

- **Plugin root:** Walk up from the current working directory (or this skill's directory) until you find a directory containing `.claude-plugin/plugin.json`. This is the kimchi plugin root.
- **CLI directory:** This skill's `cli/` subdirectory. It contains `src/index.ts` and `package.json`.

Both paths MUST be absolute. CWD varies across invocations.

### 2. Check bun is available

```bash
which bun
```

If missing, tell the user to install bun: `curl -fsSL https://bun.sh/install | bash`

### 3. Install dependencies (if needed)

Check if `node_modules/` exists in the CLI directory. If not:

```bash
cd <cli-dir> && bun install
```

### 4. Run the converter

Parse the user's arguments to determine the target format. Default is `both`.

**OpenCode only:**
```bash
bun run <cli-dir>/src/index.ts convert <plugin-root> --to opencode --output <output-path>
```

**Codex only:**
```bash
bun run <cli-dir>/src/index.ts convert <plugin-root> --to codex --output <output-path>
```

**Both (default):**
```bash
bun run <cli-dir>/src/index.ts convert <plugin-root> --to opencode --also codex --output <output-path>
```

### 5. Output location

Default output to `.converted/` in the **project root** (the git repository root or the directory containing the kimchi plugin), not the current working directory.

If the user passes `--output <path>`, use that instead.

### 6. Report results

After conversion, report:
- What format(s) were generated
- Where the output was written
- List the key generated files (e.g., `opencode.json`, `config.toml`)

## Known Limitations

- Kimchi has no `commands/` directory in the converter sense — only `skills/` and `agents/`. The `commands` array in output will be empty. This is expected; skills are kimchi's functional units.
- The converter skill itself will appear in the conversion output. Harmless.
- The `install` command in the CLI is compound-engineering specific and not useful for kimchi.
