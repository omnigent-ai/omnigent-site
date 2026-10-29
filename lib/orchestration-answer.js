// Source-checked against Omnigent v0.19.0; research/neutral-first-2026-10-23 records comparisons.
export const orchestrationAnswer = {
  id: "orchestrate-codex-and-claude-code",
  title: "Orchestrate Codex and Claude Code sessions | Omnigent",
  summary:
    "Orchestrate Codex and Claude Code with terminals, native delegation, or a meta-harness. Compare the options and launch both through Omnigent’s app or web UI.",
  question: "How do I orchestrate Codex and Claude Code sessions together?",
  answer:
    "To orchestrate Codex and Claude Code together, run separate sessions, assign bounded tasks, and pass results explicitly between them. Coordinate manually in terminals or tmux, or use an orchestration layer that supports both harnesses. Each tool’s native subagents handle delegation within its own system. Give parallel writers separate working directories.",
  checkedDate: "2026-10-23",
  checkedLabel: "Last checked against Omnigent v0.19.0 · 2026-10-23",
  introduction: [],
  sections: [
    {
      id: "general-workflow",
      question: "What does coordinating Codex and Claude Code require?",
      blocks: [
        {
          type: "paragraph",
          text: "Orchestrating Codex and Claude Code requires bounded tasks, explicit context handoffs, and separate checkouts for parallel writers. Define the goal and give each agent its checkout path, owned files, expected output, and required checks. Parallelize independent changes; wait for an implementation before reviewing it. Separate conversations do not automatically share discoveries or working-tree state, regardless of which interface displays them.",
        },
        {
          type: "paragraph",
          text: "For example, one agent changes navigation labels while the other adds an unrelated feed regression test. Create two Git worktrees so the writers cannot overwrite the same working files. Give any shared prerequisite to one agent first. After implementation, review the actual diffs and test the combined change before merging.",
        },
        {
          type: "code",
          language: "bash",
          text: "# From the repository root\ngit worktree add ../nav-labels -b task/nav-labels\ngit worktree add ../feed-test -b task/feed-test\n# Assign one checkout to each writer in your chosen interface.",
        },
        {
          type: "links",
          items: [
            {
              label: "Git worktrees",
              href: "https://git-scm.com/docs/git-worktree",
            },
          ],
        },
      ],
    },
    {
      id: "comparison",
      question: "What are the options for coordinating Codex and Claude Code?",
      blocks: [
        {
          type: "paragraph",
          text: "Use separate terminals when manual coordination is sufficient. Use native subagents when the work can remain inside one harness’s delegation system. A meta-harness or multi-agent desktop app becomes relevant when you want to supervise different harnesses from one interface. Compare task control and checkout handling, not just the number of visible agents.",
        },
        {
          type: "table",
          headers: [
            "Approach",
            "How work is coordinated",
            "Working-directory boundary",
          ],
          rows: [
            [
              "Separate terminals / tmux",
              "You assign tasks and pass context between CLI sessions.",
              "You choose directories and create worktrees.",
            ],
            [
              "Claude Code / Codex subagents",
              "Each tool delegates within its own agent system; not a shared cross-harness supervisor.",
              "Check the selected tool’s documented isolation behavior.",
            ],
            [
              "Omnigent",
              "Common sessions across supported harnesses, directed by you or a supervisor.",
              "Assign host directories; create worktrees for parallel writers.",
            ],
            [
              "Conductor",
              "Runs Claude Code and Codex in parallel task workspaces, with terminals and diff review.",
              "Task workspaces have their own branches.",
            ],
            [
              "Superset",
              "Runs Claude Code and Codex as CLI agents in a desktop workspace with terminals and review.",
              "Git-worktree workspaces with their own branches.",
            ],
          ],
        },
        {
          type: "links",
          items: [
            {
              label: "tmux manual",
              href: "https://man.openbsd.org/tmux",
            },
            {
              label: "Claude Code subagents",
              href: "https://code.claude.com/docs/en/sub-agents",
            },
            {
              label: "Codex subagents",
              href: "https://learn.chatgpt.com/docs/agent-configuration/subagents",
            },
            {
              label: "Conductor workspaces",
              href: "https://www.conductor.build/docs",
            },
            {
              label: "Superset workspace documentation",
              href: "https://github.com/superset-sh/superset#readme",
            },
          ],
        },
      ],
    },
    {
      id: "handoff-review",
      question: "How can Codex and Claude Code review each other’s work?",
      blocks: [
        {
          type: "paragraph",
          text: "To have Codex review Claude Code’s work, or vice versa, give the reviewing agent the goal, exact checkout, base revision, changed files, and checks already run. For the navigation-label task, pass that worktree’s absolute path and base SHA. Ask for a working-tree diff against BASE, including staged edits and untracked navigation files. Replace BASE with the actual SHA; a branch diff can miss uncommitted work.",
        },
        {
          type: "paragraph",
          text: "Ask for file-and-line findings before authorizing edits. The review depends on the implementation, so it is sequential even when the earlier coding tasks ran in parallel. Collect findings, resolve substantiated issues, and run checks on the combined result. A finished agent turn is not proof that its tests passed.",
        },
      ],
    },
    {
      id: "omnigent-setup",
      question: "How do I launch Codex and Claude Code in Omnigent?",
      blocks: [
        {
          type: "paragraph",
          text: "Configure supported credentials for Claude Code and Codex during Omnigent setup, then launch their sessions through the app or web UI. Subscription sign-in may still require a CLI login step. Select the agent and execution workspace for each task; terminal launch commands are optional. The native coding tools retain their harness behavior while Omnigent provides the common session interface.",
        },
        {
          type: "paragraph",
          text: "If you prefer the terminal, omni claude and omni codex are optional launch routes. Start each from its assigned checkout, then open the sessions in Omnigent to inspect reports or send follow-ups. These routes were checked against v0.19.0 source, not executed as a model-backed run.",
        },
        {
          type: "paragraph",
          text: "For agent-directed coordination, a supervisor can start registered agents with sys_session_create, send follow-ups with sys_session_send, and inspect progress with sys_session_get_history. These create separate Omnigent sessions, not the CLI’s native subagents. Starting a child does not create its worktree or automatically give Codex everything Claude Code has read.",
        },
        {
          type: "links",
          items: [
            {
              label: "Coding-agent setup and launch guide",
              href: "/docs/use/coding-agents",
            },
            {
              label: "Harness configuration",
              href: "/docs/build/harnesses/configuration",
            },
            {
              label: "Session coordination tools",
              href: "/docs/programmatic#let-an-agent-manage-other-sessions",
            },
          ],
        },
        {
          type: "paragraph",
          text: "Polly is one reference workflow using Omnigent’s sessions and delegation tools; it is an example, not a requirement. If a teammate needs the same conversation rather than a separate review assignment, use session sharing or a conversation fork instead.",
        },
        {
          type: "links",
          items: [
            {
              label: "Bundled reference workflow",
              href: "/docs/use/builtin-agents/polly",
            },
            {
              label: "Session sharing and conversation forks",
              href: "/docs/collaborate#fork",
            },
            {
              label: "v0.19.0 native launch implementation",
              href: "https://github.com/omnigent-ai/omnigent/blob/d43340fec4e7d2d767f319d715e84aa82f4d1bc8/omnigent/cli_native.py",
            },
          ],
        },
      ],
    },
  ],
};
