import { pageMeta } from "@/lib/og";
import Link from "next/link";

export const metadata = pageMeta("Prompts & Skills", "Shape agent behavior with system prompts, and extend it with skills: reusable instruction sets the agent loads on demand.", {
  eyebrow: "Build",
  path: "/docs/build/prompts",
});

export default function Page() {
  return (
    <>
      <h1>Prompts &amp; Skills</h1>

      <p>
        An agent&apos;s behavior starts with its system prompt. Skills extend that by providing
        reusable instruction sets the agent can load on demand.
      </p>

      <h2>System prompt</h2>

      <p>
        Set your agent&apos;s system prompt with either <code>prompt</code> or{" "}
        <code>instructions</code>. Both take inline text; <code>instructions</code> also accepts a
        file path.
      </p>

      <pre>
        <code>
          {`# Inline text (either field):
prompt: You are a concise coding assistant.

# Or equivalently:
instructions: You are a concise coding assistant.

# From a file (instructions only):
instructions: prompts/system.md`}
        </code>
      </pre>

      <p>
        <code>instructions</code> also accepts file paths (resolved relative to the agent
        YAML&apos;s directory). If you set both fields, <code>instructions</code> wins.
      </p>

      <h3>Auto-discovery</h3>

      <p>
        When neither <code>prompt</code> nor <code>instructions</code> is set, Omnigent scans the
        agent directory for context files in this order:
      </p>

      <ol>
        <li><code>AGENTS.md</code></li>
        <li><code>CLAUDE.md</code></li>
        <li><code>.cursorrules</code></li>
      </ol>

      <p>The first file found becomes the system prompt. No merge, first wins.</p>

      <h2>Skills</h2>

      <p>
        Skills are reusable instruction bundles that your agent can load at runtime via the{" "}
        <code>/skill-name</code> slash command or the built-in <code>load_skill</code> tool. Each
        skill is a markdown file with structured instructions. Think of it as a recipe the agent
        follows for a specific task.
      </p>

      <h3>How skills are discovered</h3>

      <p>Omnigent discovers skills from two sources:</p>

      <p>
        <strong>1. Bundled skills</strong>, shipped with the agent itself:
      </p>

      <pre>
        <code>
          {`my-agent/
  config.yaml
  skills/
    code-review/
      SKILL.md
    deploy/
      SKILL.md`}
        </code>
      </pre>

      <p>
        Skills in the agent&apos;s <code>skills/</code> directory are always available. The agent
        can invoke each skill by its slash command, such as <code>/code-review</code>, or load it
        with <code>load_skill</code>.
      </p>

      <p>
        <strong>2. Project and user skills</strong>, discovered from the filesystem:
      </p>

      <p>
        Omnigent walks up the directory tree from the agent&apos;s working directory, looking for
        skills in <code>.agents/skills/</code> and <code>.claude/skills/</code> at each level, plus
        your home directory for global skills:
      </p>

      <ul>
        <li>
          <code>{"<project>"}/.agents/skills/</code>: available to any agent run from this project
        </li>
        <li>
          <code>{"<project>"}/.claude/skills/</code>: same, Claude Code convention
        </li>
        <li>
          <code>~/.agents/skills/</code>: available to every agent on your machine
        </li>
        <li>
          <code>~/.claude/skills/</code>: same, Claude Code convention
        </li>
      </ul>

      <p>
        This works like <code>.gitignore</code>. Drop a skill folder in your project and every agent
        picks it up automatically.
      </p>

      <h3>Existing Claude Code skills</h3>

      <p>
        If you already have skills in <code>.claude/skills/</code>, they work alongside Omnigent
        bundled skills automatically. Omnigent discovers them during its directory walk.
      </p>

      <p>
        One caveat: Omnigent&apos;s skill loader only reads <code>name</code> and{" "}
        <code>description</code> from SKILL.md frontmatter. Claude Code&apos;s additional
        frontmatter fields are handled differently depending on your harness:
      </p>

      <table>
        <thead>
          <tr>
            <th>Frontmatter field</th>
            <th>Omnigent skill loader</th>
            <th><code>claude-native</code> harness</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>name</code></td>
            <td>Parsed</td>
            <td>Parsed</td>
          </tr>
          <tr>
            <td><code>description</code></td>
            <td>Parsed</td>
            <td>Parsed</td>
          </tr>
          <tr>
            <td><code>disable-model-invocation</code></td>
            <td>Ignored</td>
            <td>Honored</td>
          </tr>
          <tr>
            <td><code>allowed-tools</code></td>
            <td>Ignored</td>
            <td>Honored</td>
          </tr>
        </tbody>
      </table>

      <p>
        If you need <code>disable-model-invocation</code> or <code>allowed-tools</code> behavior,
        use the <code>claude-native</code> harness and place those skills in{" "}
        <code>.claude/skills/</code>.
      </p>

      <h3>SKILL.md format</h3>

      <p>
        Each skill lives in its own folder and must have a <code>SKILL.md</code> file with YAML
        frontmatter:
      </p>

      <pre>
        <code>
          {`skills/
  my-skill/
    SKILL.md
    references/      # optional resource files
      style-guide.md
    scripts/         # optional scripts
    assets/          # optional assets`}
        </code>
      </pre>

      <p>
        The <code>SKILL.md</code> file has two parts: YAML frontmatter and markdown content.
      </p>

      <pre>
        <code>
          {`---
name: code-review
description: >-
  Review code changes for correctness, tests, security, and
  maintainability. Use when asked to review a PR or diff.
---

# Code review

## Procedure
1. Read the diff carefully.
2. Check for correctness and edge cases.
3. Verify tests cover the changes.
4. Flag security concerns.
5. Summarize findings as blocking / non-blocking / suggestions.

## What to look for
- Off-by-one errors
- Missing error handling
- Untested branches
...`}
        </code>
      </pre>

      <p>
        <strong>Required frontmatter fields:</strong>
      </p>

      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>name</code></td>
            <td>
              Unique skill identifier. Used in slash commands (<code>/code-review</code>) and{" "}
              <code>load_skill</code> calls.
            </td>
          </tr>
          <tr>
            <td><code>description</code></td>
            <td>One-line description. Shown to the agent so it knows when to use the skill.</td>
          </tr>
        </tbody>
      </table>

      <p>
        The markdown body after the frontmatter is the full instruction set. It can be as long and
        detailed as needed.
      </p>

      <h3>Resource files</h3>

      <p>
        Skills can bundle reference materials in <code>references/</code>, <code>scripts/</code>,
        and <code>assets/</code> subdirectories. When a skill is loaded, the agent sees a listing of
        available files and can read them with the <code>read_skill_file</code> tool:
      </p>

      <pre>
        <code>
          {`skills/
  deploy/
    SKILL.md
    references/
      runbook.md
      checklist.md
    scripts/
      validate.sh`}
        </code>
      </pre>

      <h3>Example: Polly&apos;s skills</h3>

      <p>
        The{" "}
        <a
          href="https://github.com/omnigent-ai/omnigent/tree/main/examples/polly"
          target="_blank"
          rel="noreferrer"
        >
          Polly orchestrator
        </a>{" "}
        bundles three skills that define its workflows:
      </p>

      <pre>
        <code>
          {`examples/polly/
  config.yaml
  skills/
    investigate/
      SKILL.md      # read-only investigation workflow
    fanout/
      SKILL.md      # parallel task dispatch
    cross-review/
      SKILL.md      # cross-vendor PR review`}
        </code>
      </pre>

      <p>
        Each skill defines a step-by-step procedure the orchestrator follows. For example, the{" "}
        <code>investigate</code> skill instructs Polly to decompose a question into bounded tasks,
        dispatch sub-agents, and synthesize their reports.
      </p>

      <h3>Filter discovered skills</h3>

      <p>
        By default, all project and user skills are loaded (<code>skills: all</code>). You can
        restrict this in your agent YAML:
      </p>

      <pre>
        <code>
          {`# Load all discovered skills (default):
skills: all

# Load no discovered skills (hermetic):
skills: none

# Load only specific discovered skills by name:
skills:
  - code-review
  - deploy`}
        </code>
      </pre>

      <p>
        This only affects discovered skills (from <code>.agents/skills/</code> and{" "}
        <code>.claude/skills/</code>). Bundled skills in the agent&apos;s own{" "}
        <code>skills/</code> directory are always available regardless.
      </p>
    </>
  );
}
