import Link from "next/link";

export const metadata = { title: "OS Sandbox" };

export default function Page() {
  return (
    <>
      <h1>OS Sandbox</h1>

      <p>
        The OS sandbox restricts what commands and file operations your agent can perform. It
        controls which files the agent can read and write, whether it can access the network, and
        which environment variables it sees.
      </p>

      <p>
        This is different from the <Link href="/docs/deploy/cloud-sandbox">cloud sandbox</Link>,
        which controls <em>where</em> the runner executes. The OS sandbox controls{" "}
        <em>what the agent can access</em>, regardless of where it runs.
      </p>

      <p>
        The OS sandbox applies to the built-in OS tools (<code>sys_os_read</code>,{" "}
        <code>sys_os_write</code>, <code>sys_os_edit</code>, <code>sys_os_shell</code>) and any
        terminals you declare in the agent config.
      </p>

      <div className="note">
        <p>
          <strong>Requirements:</strong> Linux: install bubblewrap (
          <code>apt install bubblewrap</code> or <code>dnf install bubblewrap</code>). macOS:{" "}
          <code>sandbox-exec</code> ships with stock macOS. If you ask for a sandbox and the backend
          isn&apos;t available, Omnigent errors rather than running unsandboxed.
        </p>
      </div>

      <h2>Minimal config</h2>

      <p>
        The smallest useful OS sandbox. Make the working directory writable and let Omnigent pick
        the backend for your platform:
      </p>

      <pre>
        <code>
          {`os_env:
  type: caller_process
  cwd: .
  sandbox:
    write_paths: [.]          # cwd is read-only by default; opt it back in
    allow_network: true`}
        </code>
      </pre>

      <p>
        On Linux, Omnigent uses bubblewrap (<code>bwrap</code>). On macOS, it uses Seatbelt (
        <code>sandbox-exec</code>). Omit <code>type</code> to auto-detect.
      </p>

      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Backend</th>
            <th>Mechanism</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Linux</td>
            <td><code>linux_bwrap</code></td>
            <td>Bubblewrap namespaces + seccomp</td>
          </tr>
          <tr>
            <td>macOS</td>
            <td><code>darwin_seatbelt</code></td>
            <td><code>sandbox-exec</code> SBPL profiles</td>
          </tr>
          <tr>
            <td>Other</td>
            <td><code>none</code></td>
            <td>No sandboxing (explicit opt-out)</td>
          </tr>
        </tbody>
      </table>

      <h2>What you can restrict</h2>

      <h3>Filesystem</h3>

      <p>
        By default, <code>cwd</code> is read-only on hardened backends. You opt in to writes
        explicitly.
      </p>

      <pre>
        <code>
          {`sandbox:
  read_paths: [~/.gitconfig, ~/.ssh]        # read-only access outside cwd
  write_paths: [.]                          # writable directories
  write_files: [~/.ssh/known_hosts]         # individual writable files
  cwd_allow_hidden: [.venv, .git, .env]     # dotfiles to allow (rest are masked)`}
        </code>
      </pre>

      <p>
        Dotfiles under <code>cwd</code> and <code>read_paths</code> are hidden by default unless
        listed in <code>cwd_allow_hidden</code>. This makes broad read grants safe: granting{" "}
        <code>~</code> doesn&apos;t expose <code>~/.aws/credentials</code> or{" "}
        <code>~/.ssh/id_rsa</code>. On macOS, <code>~/Library</code> is also denied by default.
      </p>

      <h3>Network</h3>

      <pre>
        <code>
          {`sandbox:
  allow_network: true                       # basic on/off
  egress_rules:                             # optional HTTP(S) allow-list
    - "GET api.github.com/repos/myorg/**"   # GET only, one org
    - "* pypi.org/**"                       # any method
    - "* *.github.com/**"                   # wildcard subdomain`}
        </code>
      </pre>

      <p>
        When <code>egress_rules</code> is set, all HTTP(S) traffic goes through a MITM proxy with
        default-deny. Only requests matching a rule are allowed. Requires a hardened backend (
        <code>linux_bwrap</code> or <code>darwin_seatbelt</code>).
      </p>

      <p>
        Each rule is <code>&quot;METHODS host/path-glob&quot;</code>: comma-separated HTTP verbs (or{" "}
        <code>*</code> for any), a hostname (or <code>*.domain</code> for subdomains), and a path
        glob where <code>**</code> matches any depth.
      </p>

      <p>
        By default, the proxy also blocks connections to private IPs (RFC1918, loopback, cloud
        metadata like <code>169.254.169.254</code>). Set{" "}
        <code>egress_allow_private_destinations: true</code> if your agent needs to reach internal
        services.
      </p>

      <h3>Environment</h3>

      <pre>
        <code>
          {`sandbox:
  env_passthrough: [GH_TOKEN, AWS_PROFILE]  # only these vars reach the agent`}
        </code>
      </pre>

      <p>
        The sandbox strips environment variables to a minimal default set (<code>PATH</code>,{" "}
        <code>HOME</code>, <code>USER</code>, <code>LANG</code>, etc.). Secrets only reach the
        agent if you name them explicitly.
      </p>

      <h2>Sharing a policy</h2>

      <p>Declare the sandbox once and reuse it with a YAML anchor:</p>

      <pre>
        <code>
          {`os_env:
  type: caller_process
  cwd: .
  sandbox: &shared
    write_paths: [.]
    read_paths: [~/.gitconfig, ~/.ssh]
    allow_network: true

terminals:
  zsh:
    command: zsh
    os_env:
      type: caller_process
      cwd: .
      sandbox: *shared              # same policy as sys_os_* tools`}
        </code>
      </pre>

      <p>
        Or use <code>os_env: inherit</code> on a terminal or sub-agent to inherit the parent&apos;s
        full environment including its sandbox.
      </p>

      <p>In a multi-harness setup, each sub-agent can have its own OS sandbox:</p>

      <pre>
        <code>
          {`tools:
  agents:
    - name: researcher
      os_env:
        sandbox:
          write_paths: [./research]
          allow_network: true
    - name: coder
      os_env:
        sandbox:
          write_paths: [./src]
          allow_network: false`}
        </code>
      </pre>

      <h2>What is and isn&apos;t sandboxed</h2>

      <p>
        The OS sandbox applies to <code>sys_os_*</code> tool calls and terminals that reference the
        policy. It does <strong>not</strong> apply to:
      </p>

      <ul>
        <li>
          <strong>MCP servers.</strong> The runner spawns MCP subprocesses outside the sandbox.
          Constrain an MCP server at its own configuration site.
        </li>
        <li>
          <strong>The Omnigent supervisor process.</strong> It runs the model loop and dispatches
          tools. Only the commands it issues through OS tools run inside the sandbox.
        </li>
      </ul>

      <p>
        If you ask for a sandbox (explicitly or via the default) and it can&apos;t be provided,
        Omnigent errors instead of quietly running unsandboxed. The only opt-out is{" "}
        <code>sandbox.type: none</code>.
      </p>

      <h2>Field reference</h2>

      <h3><code>os_env</code></h3>

      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>type</code></td>
            <td>string</td>
            <td><code>caller_process</code></td>
            <td>OS environment backend</td>
          </tr>
          <tr>
            <td><code>cwd</code></td>
            <td>string</td>
            <td><code>.</code></td>
            <td>Working directory</td>
          </tr>
          <tr>
            <td><code>sandbox</code></td>
            <td>block</td>
            <td>platform default</td>
            <td>Sandbox policy (see below)</td>
          </tr>
          <tr>
            <td><code>start_in_scratch</code></td>
            <td>bool</td>
            <td><code>false</code></td>
            <td>
              Start in a writable scratch tmpdir instead of <code>cwd</code>. Workspace bound
              read-only. Requires an active sandbox.
            </td>
          </tr>
        </tbody>
      </table>

      <h3><code>os_env.sandbox</code></h3>

      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>type</code></td>
            <td>string</td>
            <td>auto-detect</td>
            <td>
              <code>linux_bwrap</code>, <code>darwin_seatbelt</code>, or <code>none</code>
            </td>
          </tr>
          <tr>
            <td><code>write_paths</code></td>
            <td>string[]</td>
            <td><code>[]</code></td>
            <td>
              Writable directories. <code>cwd</code> is read-only by default.
            </td>
          </tr>
          <tr>
            <td><code>write_files</code></td>
            <td>string[]</td>
            <td><code>[]</code></td>
            <td>Individual writable files</td>
          </tr>
          <tr>
            <td><code>read_paths</code></td>
            <td>string[]</td>
            <td>none</td>
            <td>
              Read-only grants outside <code>cwd</code>
            </td>
          </tr>
          <tr>
            <td><code>allow_network</code></td>
            <td>bool</td>
            <td><code>true</code></td>
            <td>Network access on/off</td>
          </tr>
          <tr>
            <td><code>cwd_allow_hidden</code></td>
            <td>string[]</td>
            <td><code>[&quot;.venv&quot;]</code></td>
            <td>Dotfile basenames to allow</td>
          </tr>
          <tr>
            <td><code>cwd_hidden_scan_max_entries</code></td>
            <td>int</td>
            <td><code>50000</code></td>
            <td>Max entries for dotfile mask walk</td>
          </tr>
          <tr>
            <td><code>cwd_hidden_scan_overflow</code></td>
            <td>string</td>
            <td><code>warn</code></td>
            <td>
              <code>error</code>, <code>warn</code>, or <code>unlimited</code>
            </td>
          </tr>
          <tr>
            <td><code>env_passthrough</code></td>
            <td>string[]</td>
            <td>minimal set</td>
            <td>Env vars the agent can see</td>
          </tr>
          <tr>
            <td><code>egress_rules</code></td>
            <td>string[]</td>
            <td>none</td>
            <td>HTTP(S) allow-list. Default-deny when set.</td>
          </tr>
          <tr>
            <td><code>egress_allow_private_destinations</code></td>
            <td>bool</td>
            <td><code>false</code></td>
            <td>Allow connections to private/metadata IPs</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
