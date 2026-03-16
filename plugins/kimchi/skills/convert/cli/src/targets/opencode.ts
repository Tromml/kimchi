import path from "path"
import { copyDir, ensureDir, readText, writeJson, writeText } from "../utils/files"
import { parseFrontmatter, formatFrontmatter } from "../utils/frontmatter"
import type { OpenCodeBundle } from "../types/opencode"

export async function writeOpenCodeBundle(outputRoot: string, bundle: OpenCodeBundle): Promise<void> {
  const paths = resolveOpenCodePaths(outputRoot)
  await ensureDir(paths.root)
  await writeJson(paths.configPath, bundle.config)

  const agentsDir = paths.agentsDir
  for (const agent of bundle.agents) {
    await writeText(path.join(agentsDir, `${agent.name}.md`), agent.content + "\n")
  }

  if (bundle.plugins.length > 0) {
    const pluginsDir = paths.pluginsDir
    for (const plugin of bundle.plugins) {
      await writeText(path.join(pluginsDir, plugin.name), plugin.content + "\n")
    }
  }

  if (bundle.skillDirs.length > 0) {
    const skillsRoot = paths.skillsDir
    for (const skill of bundle.skillDirs) {
      const targetDir = path.join(skillsRoot, skill.name)
      await copyDir(skill.sourceDir, targetDir)
      // Rewrite SKILL.md frontmatter through the formatter to ensure valid YAML
      const skillMdPath = path.join(targetDir, "SKILL.md")
      try {
        const raw = await readText(skillMdPath)
        const { data, body } = parseFrontmatter(raw)
        if (Object.keys(data).length > 0) {
          await writeText(skillMdPath, formatFrontmatter(data, body))
        }
      } catch {
        // SKILL.md may not exist in every skill dir
      }
    }
  }
}

function resolveOpenCodePaths(outputRoot: string) {
  const base = path.basename(outputRoot)
  // Global install: ~/.config/opencode (basename is "opencode")
  // Project install: .opencode (basename is ".opencode")
  if (base === "opencode" || base === ".opencode") {
    return {
      root: outputRoot,
      configPath: path.join(outputRoot, "opencode.json"),
      agentsDir: path.join(outputRoot, "agents"),
      pluginsDir: path.join(outputRoot, "plugins"),
      skillsDir: path.join(outputRoot, "skills"),
    }
  }

  // Custom output directory - nest under .opencode subdirectory
  return {
    root: outputRoot,
    configPath: path.join(outputRoot, "opencode.json"),
    agentsDir: path.join(outputRoot, ".opencode", "agents"),
    pluginsDir: path.join(outputRoot, ".opencode", "plugins"),
    skillsDir: path.join(outputRoot, ".opencode", "skills"),
  }
}
