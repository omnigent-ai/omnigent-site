// Source-checked against Omnigent v0.19.0; research/neutral-first-2026-10-23 records comparisons.
export const metaHarnessAnswer = {
  id: "meta-harness",
  summary:
    "A meta-harness coordinates coding-agent runtimes. Compare manual coordination and native delegation, then see where Omnigent’s shared session tools fit.",
  question: "What is a meta-harness?",
  answer:
    "A meta-harness is a layer that coordinates multiple agent harnesses: the runtimes that connect models to tools and execute their interaction loops. Coordination means assigning tasks, tracking separate sessions, passing results between agents, and collecting their work. It preserves the underlying harnesses rather than replacing them with a single agent runtime.",
  checkedDate: "2026-10-23",
  checkedLabel: "Last checked against Omnigent v0.19.0 · 2026-10-23",
  introduction: [],
  sections: [
    {
      id: "what-it-coordinates",
      question: "What does a meta-harness coordinate?",
      blocks: [
        {
          type: "paragraph",
          text: "A meta-harness coordinates tasks, progress, and results across agent sessions. A model generates responses; a harness manages the working loop around it, including tool calls, conversation history, and permissions. The meta-harness needs to identify each session, send it a task, expose its progress, and retrieve its result. Two agents in adjacent terminal panes do not coordinate themselves.",
        },
        {
          type: "paragraph",
          text: "Using more than one harness can be useful when you want an implementation checked through a different toolchain, or when different tasks need different runtime capabilities. Choose by the capabilities each task needs. You can keep the harness that already suits an editing task while choosing another for an independent review. That does not guarantee a better review; the reviewer still needs a useful brief and evidence.",
        },
        {
          type: "paragraph",
          text: "For example, assign a navigation change to one agent and an unrelated feed test to another. Give each its own Git worktree and file ownership. When the navigation implementation is ready, send its actual diff to a reviewer. The independent tasks can overlap; reviewing an unfinished implementation cannot. Coordination includes deciding when work must wait.",
        },
        {
          type: "links",
          items: [
            {
              label: "Git worktrees separate working files",
              href: "https://git-scm.com/docs/git-worktree",
            },
          ],
        },
      ],
    },
    {
      id: "alternatives",
      question: "When should I use a meta-harness instead of a single harness?",
      blocks: [
        {
          type: "paragraph",
          text: "Use a meta-harness when you need cross-harness coordination or shared session controls that a single harness does not provide. Separate terminals or tmux are enough when you are happy to assign tasks and copy the important context yourself. They add little machinery, but you remain responsible for progress tracking and handoffs. A shared terminal layout is a view of processes, not a task dependency system.",
        },
        {
          type: "paragraph",
          text: "A harness’s native subagents are a closer fit when all delegated work can stay within that tool’s agent system. Claude Code and Codex document native delegation; those mechanisms do not by themselves establish a common supervisor spanning both products. Omnigent is an option when you need cross-harness task assignment, session sharing, or reusable controls across runtimes; separate terminals leave that coordination to you, while native subagents stay within their harness’s delegation system.",
        },
        {
          type: "links",
          items: [
            {
              label: "Claude Code subagents",
              href: "https://code.claude.com/docs/en/sub-agents",
            },
            {
              label: "Codex subagents",
              href: "https://learn.chatgpt.com/docs/agent-configuration/subagents",
            },
          ],
        },
      ],
    },
    {
      id: "omnigent-fit",
      question: "How does Omnigent work as a meta-harness?",
      blocks: [
        {
          type: "paragraph",
          text: "Omnigent coordinates supported agent harnesses through shared sessions; you still manage task briefs, checkout separation, and integration-specific limits. You can direct those sessions yourself or let a supervisor create children with sys_session_create, send work with sys_session_send, and inspect progress with sys_session_get_history. The capability is a shared coordination interface; a supervisor agent is optional. Omnigent also adds session sharing, contextual policies, and guardrails above the harnesses, with enforcement at each integration’s supported gates.",
        },
        {
          type: "paragraph",
          text: "Separate sessions do not automatically share everything they have read. Pass the goal, absolute checkout path, expected result, and relevant prior findings. Creating a child does not create a Git worktree. Omnigent coordinates the conversations; Git supplies checkout separation. The host is simply the machine or sandbox where execution occurs, regardless of which interface you use.",
        },
        {
          type: "paragraph",
          text: "Integration capabilities still differ, including approval handling and fork-history support. A common interface does not erase those differences or create an OS sandbox. Omnigent fits when you need that shared coordination; check the selected integrations before relying on a particular operation.",
        },
        {
          type: "links",
          items: [
            {
              label: "Harness integrations and capability differences",
              href: "/docs/build/harnesses",
            },
            {
              label: "Session creation and coordination tools",
              href: "/docs/programmatic#let-an-agent-manage-other-sessions",
            },
            {
              label: "v0.19.0 harness capability definitions",
              href: "https://github.com/omnigent-ai/omnigent/blob/d43340fec4e7d2d767f319d715e84aa82f4d1bc8/omnigent/harness_capabilities.py",
            },
          ],
        },
      ],
    },
  ],
};

export const contextualPolicyAnswer = {
  id: "contextual-policy",
  summary:
    "A contextual policy uses action and session state to decide whether agent work proceeds. Compare permissions and hooks, then examine Omnigent’s policy layer.",
  question: "What is a contextual policy?",
  answer:
    "A contextual policy decides whether an agent action may proceed by considering the action and relevant session state, rather than only matching a fixed tool or command rule. Context can include prior approvals, recorded spending, conversation labels, or the active model. The result may allow, deny, or request human approval.",
  checkedDate: "2026-10-23",
  checkedLabel: "Last checked against Omnigent v0.19.0 · 2026-10-23",
  introduction: [],
  sections: [
    {
      id: "context-changes-decision",
      question: "How does a contextual policy differ from a fixed rule?",
      blocks: [
        {
          type: "paragraph",
          text: "An agent policy is contextual when its decision depends on session state as well as the proposed action. A fixed rule might always ask before a command; a contextual rule can ask only after a spending checkpoint, or change its decision after the conversation acquires a classification label. The same action can receive different decisions because the state has changed. This can be a numeric comparison; another language model is not required.",
        },
        {
          type: "paragraph",
          text: "Consider a $2 warning checkpoint. Before recorded spending reaches $2, work proceeds. At the next supported gate after that threshold, the policy asks whether to continue. Approval records the acknowledged checkpoint, so it need not ask again for that threshold. A separate $5 hard cap remains a separate rule: approving the warning does not raise the cap.",
        },
      ],
    },
    {
      id: "permissions-comparison",
      question:
        "How do contextual policies compare with native agent permissions?",
      blocks: [
        {
          type: "paragraph",
          text: "Contextual policies use session state as well as the action, while static native permissions match tools, commands, or paths. Claude Code, Codex, and Cursor offer static permissions and contextual hooks; it would be inaccurate to say these harnesses cannot make contextual decisions. All three document hooks with session-related inputs, and current documentation also describes model-based review. Omnigent adds a shared policy interface and persisted session state across supported integrations; native rules and hooks remain useful for harness-specific controls.",
        },
        {
          type: "table",
          headers: ["Harness", "Permission rules", "Contextual extension"],
          rows: [
            [
              "Claude Code",
              "Permission modes and allow/ask/deny rules for tools, commands, and paths.",
              "Hooks receive session and tool context; supported prompt hooks use a model.",
            ],
            [
              "Codex",
              "Approval controls govern when permission is requested; execution rules match command prefixes.",
              "Hooks receive session context. Native auto-review evaluates eligible approval requests with conversation context.",
            ],
            [
              "Cursor",
              "Desktop run modes and allowlists; CLI permissions have a separate configuration.",
              "Hooks can inspect event context and maintain per-conversation state; supported prompt hooks use a model.",
            ],
            [
              "Omnigent",
              "Policies can allow, deny, or request approval at supported integration gates.",
              "The same policy works across every harness.",
            ],
          ],
        },
        {
          type: "links",
          items: [
            {
              label: "Claude Code permission rules",
              href: "https://code.claude.com/docs/en/permissions",
            },
            {
              label: "Claude Code hook inputs and decisions",
              href: "https://code.claude.com/docs/en/hooks",
            },
            {
              label: "Codex command-prefix rules",
              href: "https://learn.chatgpt.com/docs/agent-configuration/rules",
            },
            {
              label: "Codex hooks and handler limitations",
              href: "https://learn.chatgpt.com/docs/hooks",
            },
            {
              label: "Codex contextual auto-review",
              href: "https://learn.chatgpt.com/docs/sandboxing/auto-review",
            },
            {
              label: "Cursor desktop run modes",
              href: "https://cursor.com/docs/agent/security/run-modes",
            },
            {
              label: "Cursor contextual hooks",
              href: "https://cursor.com/docs/agent/hooks",
            },
          ],
        },
        {
          type: "paragraph",
          text: "A command hook can implement contextual logic and keep its own state. That requires maintaining the implementation and connecting it to the right events. Do not infer identical support from a shared word such as “hooks”: events and handler types differ. Codex, for example, documents prompt and agent hook handlers as parsed but skipped.",
        },
      ],
    },
    {
      id: "omnigent-fit",
      question: "How do Omnigent contextual policies work?",
      blocks: [
        {
          type: "paragraph",
          text: "Omnigent supplies a common policy event interface and persisted session state across supported integrations. Policies can be attached to sessions, declared in agent specifications, or configured server-wide by administrators. This is useful when you want to reuse policy logic across harnesses rather than maintain an unrelated hook program for each one.",
        },
        {
          type: "paragraph",
          text: "Omnigent’s policy context includes recorded usage and the active model. Conversation labels are available in server-side context; they are not populated on every runner-local path. A label-dependent rule needs a defined response when the label is absent. A policy can remember an approval, but the available context and action gates still depend on the integration.",
        },
        {
          type: "links",
          items: [
            {
              label: "Policy configuration and enforcement phases",
              href: "/docs/policies/overview",
            },
            {
              label: "Set coding-agent spending limits",
              href: "/answers/set-spending-limits-for-coding-agents",
            },
            {
              label: "v0.19.0 policy event context",
              href: "https://github.com/omnigent-ai/omnigent/blob/d43340fec4e7d2d767f319d715e84aa82f4d1bc8/omnigent/policies/schema.py",
            },
          ],
        },
      ],
    },
    {
      id: "policy-enforcement",
      question: "What actions can agent policies block?",
      blocks: [
        {
          type: "paragraph",
          text: "An agent policy can block actions at supported request or tool-call gates. A request gate can block a turn before it reaches the model; a tool-call gate can block a supported tool invocation. A check after an action cannot undo a write or API change. In Omnigent v0.19.0, a root-session budget with all-model enforcement denies new user turns and tool calls at supported gates once recorded cost reaches its cap; it does not stop every in-flight model call.",
        },
        {
          type: "paragraph",
          text: "Use an approval policy for a decision at an available gate. Neither a task instruction nor a shared policy interface is evidence that every integration enforces an identical boundary.",
        },
        {
          type: "links",
          items: [
            {
              label: "v0.19.0 cost-policy enforcement",
              href: "https://github.com/omnigent-ai/omnigent/blob/d43340fec4e7d2d767f319d715e84aa82f4d1bc8/omnigent/policies/builtins/cost.py",
            },
          ],
        },
      ],
    },
  ],
};

export const handoffAnswer = {
  id: "hand-off-a-session-to-a-teammate",
  summary:
    "Hand off a coding-agent task with a clear state brief and code changes. Compare shared sessions, conversation forks, and repository-based handoffs in Omnigent.",
  question: "How do I hand off a coding agent session to a teammate?",
  answer:
    "To hand off a coding agent session, first decide whether your teammate should continue the same live conversation or start an independent one. Share the task state, relevant code changes, and next step. For live continuation, use a tool with explicit collaborator access and keep its execution environment available.",
  checkedDate: "2026-10-23",
  checkedLabel: "Last checked against Omnigent v0.19.0 · 2026-10-23",
  introduction: [],
  sections: [
    {
      id: "prepare-handoff",
      question: "What should a coding-agent handoff include?",
      blocks: [
        {
          type: "paragraph",
          text: "Before taking over a coding-agent task, a teammate needs a brief naming the goal, checkout path, branch or base commit, failing or passing checks, unresolved questions, and next action. State whether the agent is still running. If you want the incoming person to wait for that work, say so; otherwise two people may send conflicting instructions into the same investigation.",
        },
        {
          type: "paragraph",
          text: "For example, you have isolated a failing parser test and want its maintainer to continue. Include the exact failing command, what you have ruled out, and any uncommitted patch. Ask the maintainer to reproduce the failure before changing code. A long transcript without the current state leaves them to rediscover which earlier assumptions still hold.",
        },
        {
          type: "paragraph",
          text: "Separate conversation context from repository state. A session link can expose discussion, but it is not a Git clone and does not necessarily include uncommitted files. Transfer a branch or patch when the recipient will use another checkout. Remove secrets from any transcript or artifact you share.",
        },
      ],
    },
    {
      id: "handoff-options",
      question: "Should I share a coding-agent session or send a Git branch?",
      blocks: [
        {
          type: "paragraph",
          text: "Send a Git branch or pull request when your teammate mainly needs the code; share the live coding-agent session when they need to direct the existing agent in its environment. Include a short task brief with the branch so they can review it or begin a new agent conversation. You lose live conversation continuity, but gain a familiar code-review boundary without granting access to your running tools.",
        },
        {
          type: "paragraph",
          text: "A transcript export or conversation fork helps when the reasoning matters as well as the patch. Claude Code documents resume and fork workflows for its own conversations. Those features do not by themselves establish cross-person access to another developer’s running session. Check the tool’s account, history, and machine requirements rather than treating “resume” as a collaboration permission.",
        },
        {
          type: "paragraph",
          text: "Omnigent’s permissioned session sharing fits co-driving: Read access lets a teammate observe, while Edit access lets them send messages and direct the existing agent. Compared with a transcript or Git branch, it preserves the live conversation but grants access to the running environment. Remote terminal sharing is another way to expose a running environment; it requires terminal-access controls rather than conversation-level permissions.",
        },
        {
          type: "links",
          items: [
            {
              label: "Git patch export",
              href: "https://git-scm.com/docs/git-format-patch",
            },
            {
              label: "Claude Code conversation resume and fork workflows",
              href: "https://code.claude.com/docs/en/cli-reference",
            },
          ],
        },
      ],
    },
    {
      id: "omnigent-fit",
      question: "How do I share a coding-agent session in Omnigent?",
      blocks: [
        {
          type: "paragraph",
          text: "To hand off a coding-agent session in Omnigent, open Share and grant your trusted teammate Edit access to continue, or Read access to observe. They need access to the same reachable server and, on an authenticated deployment, an account. Prefer a specific collaborator when only one person needs to take over. Sending a URL does not make your local server reachable.",
        },
        {
          type: "paragraph",
          text: "Public Edit requires an administrator to allow it in Settings > Sharing > Maximum public permission; the default maximum remains Read. General access concerns people who can sign in, not anonymous editing. Edit lets a collaborator direct the agent with the session’s available environment and access; it is not merely permission to comment.",
        },
        {
          type: "paragraph",
          text: "Co-driving retains the execution host. If that host is your laptop, the agent’s work still happens there. Keep it awake and connected. Applicable policy, approval, and sandbox gates remain; agreeing who directs the next step is still your responsibility.",
        },
        {
          type: "paragraph",
          text: "For independent continuation, fork rather than co-drive. Omnigent documents omnigent run --fork <session_id> and a web Clone Session workflow. History transfer depends on the harness. Arrange the repository and inputs on the receiving host: a conversation fork does not copy the original working directory or its uncommitted changes.",
        },
        {
          type: "links",
          items: [
            {
              label: "Sharing, co-driving, and conversation forks",
              href: "/docs/collaborate",
            },
            {
              label: "Harness fork-history support",
              href: "/docs/build/harnesses",
            },
            {
              label: "v0.19.0 collaboration workflow",
              href: "https://github.com/omnigent-ai/omnigent/blob/d43340fec4e7d2d767f319d715e84aa82f4d1bc8/README.md#5-collaborate-with-your-team",
            },
          ],
        },
      ],
    },
  ],
};

export const schedulingAnswer = {
  id: "schedule-recurring-agent-tasks",
  summary:
    "Schedule coding-agent work with cron, CI, or a session scheduler. Compare execution targets, permissions, run checks, and Omnigent’s recurring-task controls.",
  question: "How do I schedule recurring tasks for an AI coding agent?",
  answer:
    "To schedule recurring coding-agent tasks, ask Omnigent in plain language, such as “run this every weekday at 9am Chicago time,” or use the scheduled-tasks UI. Specify the task, repository, and expected output, then review the schedule and execution settings. Test a run before leaving it unattended, and check the actual result.",
  checkedDate: "2026-10-23",
  checkedLabel: "Last checked against Omnigent v0.19.0 · 2026-10-23",
  introduction: [],
  sections: [
    {
      id: "prepare-recurring-task",
      question: "What does a recurring coding-agent task need?",
      blocks: [
        {
          type: "paragraph",
          text: "A recurring coding-agent task needs explicit inputs, a checkout revision or update strategy, an output location, and a stopping condition. Write it for a new session, not as a continuation of a conversation it cannot see. Keep credentials and permissions narrow. Decide what happens if an earlier run is still working; recurrence alone does not resolve concurrent writers.",
        },
        {
          type: "paragraph",
          text: "For example: “Run the parser unit tests in this checkout, summarize failures with test names, and stop. Do not edit files or push changes.” Record where the report should appear and who checks failures. The instruction describes intent; a read-only execution boundary needs separate enforcement. Test access to the repository and dependencies before leaving it unattended.",
        },
      ],
    },
    {
      id: "scheduler-options",
      question: "How should I choose a scheduler for coding-agent tasks?",
      blocks: [
        {
          type: "paragraph",
          text: "Choose a coding-agent scheduler by execution environment and the record you need: cron for a maintained machine, CI for repository jobs with retained logs, a hosted scheduler for cloud execution, or a session scheduler for inspectable conversations. With cron or a system timer, you supply the working directory, logs, overlap controls, and failure reporting. A sleeping laptop cannot run its scheduled process just because the calendar time has arrived.",
        },
        {
          type: "paragraph",
          text: "CI fits repository-triggered work when you already have runner setup, secrets management, and retained job logs. GitHub Actions supports scheduled workflows, but warns that scheduled events can be delayed or dropped under load. Treat it as a job scheduler, not an exact-time service.",
        },
        {
          type: "paragraph",
          text: "Hosted options also exist. Claude Code documents cloud scheduled tasks, currently a research preview. Codex documents scheduled tasks with local or web execution. Local tasks still need the computer and app running; hosted execution needs its own repository or connected inputs. Compare these environment requirements before choosing a scheduler.",
        },
        {
          type: "paragraph",
          text: "Omnigent’s session scheduler is useful when you want each run to become an inspectable conversation, with its agent settings and follow-ups, rather than only a process log. Compare host selection, timezone behavior, approval handling, and missed-run behavior. A cloud target is not automatically a copy of your laptop’s checkout.",
        },
        {
          type: "links",
          items: [
            {
              label: "GitHub Actions scheduled-event behavior",
              href: "https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule",
            },
            {
              label: "Claude Code headless execution",
              href: "https://code.claude.com/docs/en/headless",
            },
            {
              label: "Claude Code cloud scheduled tasks",
              href: "https://code.claude.com/docs/en/routines",
            },
            {
              label: "Codex scheduled tasks",
              href: "https://learn.chatgpt.com/docs/automations",
            },
          ],
        },
      ],
    },
    {
      id: "omnigent-setup",
      question: "How do I schedule recurring coding-agent tasks in Omnigent?",
      blocks: [
        {
          type: "paragraph",
          text: "Ask Omnigent to create the recurring coding-agent task, or open Automations in the sidebar at /tasks and choose New automation. Review the agent, prompt, schedule, and execution target before approving an agent-created task. Use the Active/Paused toggle to pause or resume future runs. The web UI uses your browser’s timezone for creation and preserves an existing task’s timezone when editing. For a different IANA timezone, use the API or agent tools; the API’s default timezone is UTC.",
        },
        {
          type: "paragraph",
          text: "For example, ask: “Every weekday at 9am Chicago time, run the parser unit tests in this checkout, report failures, and do not edit or push files.” The agent prepares the schedule for your approval; check the timezone and next run before confirming. The automation documentation covers recurrence-format details if you need them.",
        },
        {
          type: "paragraph",
          text: "Pin the connected host and repository workspace for checkout-specific work. In the API, workspace without host_id is rejected. Omitting both is valid: the scheduler chooses the owner’s most-recently-active live host and its home directory. A configured managed_sandbox target provisions a fresh sandbox per firing; omit host_id and workspace and arrange the inputs there.",
        },
        {
          type: "links",
          items: [
            {
              label: "Automation configuration and run history",
              href: "/docs/build/scheduled-tasks",
            },
            {
              label: "v0.19.0 automation behavior and limits",
              href: "https://github.com/omnigent-ai/omnigent/blob/d43340fec4e7d2d767f319d715e84aa82f4d1bc8/docs/AUTOMATIONS.md",
            },
          ],
        },
      ],
    },
    {
      id: "unattended-checks",
      question:
        "What should I check before leaving coding-agent tasks unattended?",
      blocks: [
        {
          type: "paragraph",
          text: "Recurring coding-agent tasks need execution permissions, a verified budget policy, and checks of the actual output as well as run status. Calls to sys_scheduled_task_create and sys_scheduled_task_update always require interactive approval. Scheduling does not waive execution permissions; a prompting permission mode can leave an unattended run waiting. Set max_cost_usd through the API or agent tools; the web dialog has no budget field.",
        },
        {
          type: "paragraph",
          text: "In v0.19.0, budget attachment is best-effort: a missing policy store or attachment error can leave a run without that cap. Verify the policy on the fired session. An attached cap gates new work using recorded costs; in-flight work can overshoot.",
        },
        {
          type: "paragraph",
          text: "POST /v1/scheduled-tasks/{id}/run requests an immediate run without changing recurrence. Inspect its checkout and output. A succeeded status means the turn finished, not that tests passed. An unavailable host records a failed occurrence. Missed fires while the server is down are not replayed. Pause the task while fixing inputs or permissions.",
        },
        {
          type: "links",
          items: [
            {
              label: "Coding-agent spending limits",
              href: "/answers/set-spending-limits-for-coding-agents",
            },
          ],
        },
      ],
    },
  ],
};

export const mobileAnswer = {
  id: "continue-a-session-on-your-phone",
  summary:
    "Continue a coding-agent task from your phone using remote terminal or session access. Compare options and configure Omnigent without moving laptop execution.",
  question:
    "How do I start a coding agent task on my laptop and continue it on my phone?",
  answer:
    "To continue a coding-agent task on your phone, connect to the same running session through a supported remote interface, rather than start a new conversation. Keep the execution host online and secure the connection. The phone can display results and send instructions; remote access does not move execution off your laptop.",
  checkedDate: "2026-10-23",
  checkedLabel: "Last checked against Omnigent v0.19.0 · 2026-10-23",
  introduction: [],
  sections: [
    {
      id: "remote-session",
      question: "What must stay online to use a coding agent from my phone?",
      blocks: [
        {
          type: "paragraph",
          text: "To continue a laptop coding-agent session on a phone, you need a reachable interface, access to the right account or terminal, and an execution machine that stays online. These are separate requirements. A remotely hosted chat page can remain readable after a laptop disconnects, even though the coding process on that laptop cannot do more work.",
        },
        {
          type: "paragraph",
          text: "Keep a known session link or terminal identifier. Starting a fresh chat with the same model does not restore the previous conversation. Before leaving, check the actual connection from your phone, confirm that you see the intended session, and decide whether new instructions may change files or need approval.",
        },
        {
          type: "paragraph",
          text: "For example, start investigating a failing parser test at your desk. From your phone, read the reported failure and ask whether the empty-input case also fails on the base revision, without changing files. That follow-up needs the original task state. It does not require running a coding CLI on the phone itself.",
        },
      ],
    },
    {
      id: "mobile-options",
      question: "How can I access a coding-agent session from my phone?",
      blocks: [
        {
          type: "paragraph",
          text: "SSH with a persistent terminal such as tmux is sufficient when you want the original CLI and can manage remote access. tmux lets you detach and reattach the terminal session; SSH supplies the connection. You still need to secure the host, keep it awake, and tolerate a terminal-sized interface on a small screen.",
        },
        {
          type: "paragraph",
          text: "Claude Code Remote Control is a native option for continuing a local Claude Code session through its supported web or mobile interface. Its documentation distinguishes remote access from cloud execution: the local environment still does the work. Check current account and version requirements rather than assuming every local CLI has an equivalent feature.",
        },
        {
          type: "paragraph",
          text: "Codex Cloud is another option when you want work in a configured cloud workspace, with web, mobile, or desktop continuation. That can run without the laptop, but it is a different execution environment, not remote access to an arbitrary existing local CLI process.",
        },
        {
          type: "paragraph",
          text: "Omnigent’s shared browser interface is an option when you work with multiple supported harnesses or want conversation-level navigation instead of SSH terminal access. Unlike a cloud task, opening a session on your phone does not move its execution environment. Compare what the interface exposes, how it authenticates, and which machine actually runs tools. For work that must survive a closed laptop, start on an appropriate always-on host or configured cloud environment; changing the viewing device is not migration.",
        },
        {
          type: "links",
          items: [
            {
              label: "tmux detach and attach behavior",
              href: "https://man.openbsd.org/tmux",
            },
            {
              label: "Claude Code Remote Control",
              href: "https://code.claude.com/docs/en/remote-control",
            },
            {
              label: "Codex Cloud execution and cross-device access",
              href: "https://learn.chatgpt.com/docs/cloud",
            },
          ],
        },
      ],
    },
    {
      id: "omnigent-fit",
      question: "How do I continue an Omnigent session on my phone?",
      blocks: [
        {
          type: "paragraph",
          text: "To continue a laptop coding-agent session on your phone through Omnigent, open the same reachable server in your phone browser and return to the existing session. Sign in to the same account when authentication is enabled. You can read the conversation and send follow-ups while the execution host remains available; the web interface also provides supported views of subagents, terminals, and files.",
        },
        {
          type: "paragraph",
          text: "On a trusted local network, configure the server’s LAN interface before starting the session, for example with omnigent server --host <LAN-IP>. The default bind is 127.0.0.1, which another device cannot reach. Non-loopback binds enable sign-in by default unless explicit authentication settings override it. Open the laptop’s LAN address, not localhost on the phone. Test access from your phone with the same account before starting work.",
        },
        {
          type: "paragraph",
          text: "Away from that network, use a securely configured reachable deployment or private network connection. Do not expose an unauthenticated development server just to reach it remotely. A page that will not load suggests a connection problem; a loaded server missing your session may be the wrong server or account.",
        },
        {
          type: "paragraph",
          text: "If a laptop-hosted session stops because the machine sleeps, opening it on your phone does not wake it or move the process elsewhere. A cloud-hosted server still depends on the laptop when that laptop is the execution host. Restore that connection or plan a new session on an always-on host with the repository and required inputs configured there.",
        },
        {
          type: "links",
          items: [
            {
              label: "Mobile access and connection setup",
              href: "/docs/interact/mobile",
            },
            {
              label: "Server and execution-host deployment",
              href: "/docs/deploy/overview",
            },
            {
              label: "Managed cloud sandbox hosts",
              href: "/docs/deploy/cloud-sandbox-host",
            },
            {
              label: "v0.19.0 phone and host setup",
              href: "https://github.com/omnigent-ai/omnigent/blob/d43340fec4e7d2d767f319d715e84aa82f4d1bc8/README.md#4-deploy-a-server-and-use-it-from-your-phone",
            },
          ],
        },
      ],
    },
  ],
};

export const budgetsAnswer = {
  id: "set-spending-limits-for-coding-agents",
  summary:
    "Set coding-agent budgets by choosing what to count and where to stop work. Compare alerts, billing controls, and Omnigent’s recorded-cost policy enforcement.",
  question: "How do I set spending limits for coding agents?",
  answer:
    "To set spending limits for coding agents, choose the scope to count, set warning and stop thresholds, and verify that an enforcement point can block new work. Combine agent-level controls with provider billing controls where available. An alert is not a stop, and recorded-cost gates may allow in-flight work to overshoot.",
  checkedDate: "2026-10-23",
  checkedLabel: "Last checked against Omnigent v0.19.0 · 2026-10-23",
  introduction: [],
  sections: [
    {
      id: "budget-options",
      question: "Which spending limits should I use for coding agents?",
      blocks: [
        {
          type: "paragraph",
          text: "Choose coding-agent spending controls by scope: a run limit for one task, an agent policy for managed sessions, or provider controls for account-wide spending. A per-session allowance does not cap every session a developer opens. An elapsed-time or turn limit can bound activity, but it is not equivalent to a dollar limit when models and request sizes differ.",
        },
        {
          type: "paragraph",
          text: "Provider controls cover a different boundary from agent controls. OpenAI documents both budget alerts and an optional enforced hard limit for organization or project spending. Alerts do not stop requests; enforcement can still lag and allow overshoot. These aggregate controls differ from a per-agent-run allowance. Check the configured mode rather than assuming the word “budget” means billing will stop.",
        },
        {
          type: "paragraph",
          text: "For a single headless Claude Code run, --max-budget-usd is a native estimated-cost limit; --max-turns bounds turns instead. Both have narrower scope than account spending. A per-response output-token limit is narrower again: it does not count every request in an agent loop.",
        },
        {
          type: "paragraph",
          text: "Omnigent’s contextual budget policies can pause or deny observed work at supported turn or tool-call gates, with session and cross-session user scopes. Compared with a single-run flag, they let you reuse spend rules across managed sessions; unlike provider controls, they cannot control unrelated clients using the same API key. For unattended work, verify both the usage data and the blocking behavior instead of relying on a dashboard number.",
        },
        {
          type: "links",
          items: [
            {
              label: "OpenAI API project alerts and enforced limits",
              href: "https://help.openai.com/en/articles/9186755-managing-projects-in-the-api-platform",
            },
            {
              label: "Claude Code native run-budget flags",
              href: "https://code.claude.com/docs/en/cli-reference",
            },
            {
              label: "Responses API per-response token limits",
              href: "https://developers.openai.com/api/reference/resources/responses/methods/create",
            },
          ],
        },
      ],
    },
    {
      id: "omnigent-cap",
      question: "How do I cap coding-agent spending in Omnigent?",
      blocks: [
        {
          type: "paragraph",
          text: "To cap a coding-agent session’s recorded spending in Omnigent, attach a cost_budget policy to the session, declare it in an agent specification, or use applicable administrator policies. Contextual policies let you structure limits per session or delegated subtree, apply user-wide daily or period budgets, and configure approval checkpoints or model-specific gates. Declaring a policy in an agent specification reuses it for that agent’s sessions; it does not create a single pooled allowance for every instance of the agent. This fragment requests a $5 session cap with $1 and $2.50 checkpoints; it belongs in an otherwise configured agent, not a standalone agent file.",
        },
        {
          type: "code",
          language: "yaml",
          text: "policies:\n  session_budget:\n    type: function\n    handler: omnigent.policies.builtins.cost.cost_budget\n    factory_params:\n      max_cost_usd: 5.0\n      ask_thresholds_usd: [1.0, 2.5]\n      expensive_models: []",
        },
        {
          type: "paragraph",
          text: "In v0.19.0, both an omitted value and [] select an all-model stop. A non-empty expensive_models list instead matches model-ID substrings case-insensitively. A list containing “opus” gates matching models over budget while allowing unmatched models. That is a downgrade gate, not a total-spend cap; it does not automatically switch models.",
        },
        {
          type: "links",
          items: [
            {
              label: "Budget-policy configuration",
              href: "/docs/policies/overview",
            },
            {
              label: "v0.19.0 cost resolver and enforcement",
              href: "https://github.com/omnigent-ai/omnigent/blob/d43340fec4e7d2d767f319d715e84aa82f4d1bc8/omnigent/policies/builtins/cost.py",
            },
          ],
        },
      ],
    },
    {
      id: "warning-versus-stop",
      question: "How do Omnigent spending checkpoints and hard caps work?",
      blocks: [
        {
          type: "paragraph",
          text: "An Omnigent session’s soft spending checkpoint returns ASK at the next supported gate; an all-model hard cap on the root session (the original conversation) returns DENY. Approval remembers the highest acknowledged checkpoint; declining blocks that attempt without acknowledging it. Approving $1 in this example allows progress toward $2.50, not beyond $5. The root cap covers the original session and its delegated agents.",
        },
        {
          type: "paragraph",
          text: "Checks gate new user turns and tool calls using reported usage; they do not gate every internal model API call. An in-flight turn can overshoot before the next check. Denying a native tool call does not itself terminate the turn. If tokens lack catalog pricing, the policy asks whether to continue untracked; approving permits spend that cannot count toward warnings or the cap.",
        },
      ],
    },
    {
      id: "budget-scope",
      question: "What spending does each Omnigent budget cover?",
      blocks: [
        {
          type: "paragraph",
          text: "Omnigent child-agent budgets cover a delegated subtree, user budgets span sessions, and scheduled-task caps are requested per firing, with best-effort attachment in v0.19.0. A root-session budget counts the original conversation and all agents it delegates to, directly or indirectly, and is checked by descendants too. A separate subagent_cost_budget counts one child and that child’s descendants. Its all-model over-cap path returns ASK to lift that child cap. Approval does not lift an inherited root-session cap; a non-empty expensive_models list instead uses model-specific DENY behavior.",
        },
        {
          type: "paragraph",
          text: "Use user_daily_cost_budget or user_period_cost_budget for spending across sessions. The daily policy uses a UTC day; the period policy supports configurable windows. A scheduled task’s max_cost_usd requests a cap for each firing, not one shared allowance. In v0.19.0, attachment is best-effort: a missing policy store or attachment error can leave a run without that cap. Verify the fired session’s policy.",
        },
        {
          type: "paragraph",
          text: "This is not a provider billing limit, an infrastructure budget, or control over agents launched outside managed sessions. Omnigent fits recorded-cost enforcement at its supported gates. Use separate provider-side controls where available, and check pricing and enforcement before relying on a cap unattended.",
        },
        {
          type: "links",
          items: [
            {
              label: "Schedule recurring agent tasks",
              href: "/answers/schedule-recurring-agent-tasks",
            },
            {
              label: "v0.19.0 inherited-budget regression cases",
              href: "https://github.com/omnigent-ai/omnigent/blob/d43340fec4e7d2d767f319d715e84aa82f4d1bc8/tests/server/integration/test_inherited_session_budget.py",
            },
          ],
        },
      ],
    },
  ],
};
