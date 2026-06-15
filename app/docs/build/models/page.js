import { pageMeta } from "@/lib/og";
import Link from "next/link";

export const metadata = pageMeta("Models & Credentials", "Declare your model in agent YAML and let Omnigent manage the credentials that authenticate to each provider.", {
  eyebrow: "Build",
});

const providerLogoStyle = {
  display: "inline",
  verticalAlign: "middle",
  borderRadius: "4px",
  marginRight: "8px",
};

const gateways = [
  { logo: "databricks", name: "Databricks Unity AI Gateway" },
  { logo: "mlflow", name: "MLflow AI Gateway" },
  { logo: "openrouter", name: "OpenRouter" },
  { logo: "litellm", name: "LiteLLM" },
  { logo: "portkey", name: "Portkey" },
  { logo: "helicone", name: "Helicone" },
  { logo: "cloudflare", name: "Cloudflare AI Gateway" },
  { logo: "kong", name: "Kong AI Gateway" },
  { logo: "vercel", name: "Vercel AI Gateway" },
  { logo: "azure", name: "Azure OpenAI" },
  { logo: "ollama", name: "Ollama" },
  { logo: "lmstudio", name: "LM Studio" },
  { logo: "vllm", name: "vLLM" },
  { logo: "localai", name: "LocalAI" },
  { logo: "huggingface", name: "TGI (Hugging Face)" },
  { logo: "gpt4all", name: "GPT4All" },
];

export default function Page() {
  return (
    <>
      <h1>Models &amp; Credentials</h1>

      <p>
        Every harness needs a model to run and credentials to reach it. You declare the model in
        your agent YAML, and Omnigent manages the credentials that authenticate to each provider.
      </p>

      <h2>Choose a model</h2>

      <p>Declare the model in your agent YAML:</p>

      <pre>
        <code>
          {`executor:
  harness: claude-sdk
  model: claude-sonnet-4-6`}
        </code>
      </pre>

      <p>Override it at runtime without editing the file:</p>

      <pre>
        <code>
          {`omni run agent.yaml --model claude-sonnet-4-6`}
        </code>
      </pre>

      <h3>Switch models mid-session</h3>

      <p>
        Use the <code>/model</code> command inside any running session to switch models on the fly.
        The agent keeps its conversation history and tool state – only the underlying model changes.
      </p>

      <h2>Credentials</h2>

      <p>Omnigent needs credentials to talk to a model provider.</p>

      <pre>
        <code>
          {`omni setup`}
        </code>
      </pre>

      <p>
        The setup wizard walks you through adding a credential, setting a default, or removing one.
        It also auto-detects credentials already on your machine (API keys in environment variables,
        logged-in CLIs, and local servers) so you can confirm them with one tap.
      </p>

      <h2>Credential types</h2>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>What it is</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>API key</strong></td>
            <td>A first-party provider key (Anthropic, OpenAI, OpenRouter, and more)</td>
          </tr>
          <tr>
            <td><strong>Subscription</strong></td>
            <td>
              A Claude Pro/Max or ChatGPT Plus/Pro plan, via the official <code>claude</code> /{" "}
              <code>codex</code> CLIs
            </td>
          </tr>
          <tr>
            <td><strong>Gateway</strong></td>
            <td>Bring your own proxy or local model. Just paste a base URL and key.</td>
          </tr>
          <tr>
            <td><strong>Databricks</strong></td>
            <td>
              A Databricks workspace profile, routing through the{" "}
              <a
                href="https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/"
                target="_blank"
                rel="noreferrer"
              >
                Foundation Model API
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>API key</h3>

      <p>
        Get a key from your provider&apos;s dashboard and add it via <code>omni setup</code>.
        Supported providers:
      </p>

      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Key source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/providers/anthropic.png"
                alt=""
                width="20"
                height="20"
                style={providerLogoStyle}
              />
              <strong>Anthropic</strong>
            </td>
            <td>
              <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">
                console.anthropic.com
              </a>
            </td>
          </tr>
          <tr>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/providers/openai.png"
                alt=""
                width="20"
                height="20"
                style={providerLogoStyle}
              />
              <strong>OpenAI</strong>
            </td>
            <td>
              <a href="https://platform.openai.com" target="_blank" rel="noreferrer">
                platform.openai.com
              </a>
            </td>
          </tr>
          <tr>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/providers/openrouter.png"
                alt=""
                width="20"
                height="20"
                style={providerLogoStyle}
              />
              <strong>OpenRouter</strong>
            </td>
            <td>
              <a href="https://openrouter.ai" target="_blank" rel="noreferrer">
                openrouter.ai
              </a>
            </td>
          </tr>
          <tr>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/providers/groq.png"
                alt=""
                width="20"
                height="20"
                style={providerLogoStyle}
              />
              <strong>Groq</strong>
            </td>
            <td>
              <a href="https://console.groq.com" target="_blank" rel="noreferrer">
                console.groq.com
              </a>
            </td>
          </tr>
          <tr>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/providers/deepseek.png"
                alt=""
                width="20"
                height="20"
                style={providerLogoStyle}
              />
              <strong>DeepSeek</strong>
            </td>
            <td>
              <a href="https://platform.deepseek.com" target="_blank" rel="noreferrer">
                platform.deepseek.com
              </a>
            </td>
          </tr>
          <tr>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/providers/xai.png"
                alt=""
                width="20"
                height="20"
                style={providerLogoStyle}
              />
              <strong>xAI</strong>
            </td>
            <td>
              <a href="https://console.x.ai" target="_blank" rel="noreferrer">
                console.x.ai
              </a>
            </td>
          </tr>
          <tr>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/providers/mistral.png"
                alt=""
                width="20"
                height="20"
                style={providerLogoStyle}
              />
              <strong>Mistral</strong>
            </td>
            <td>
              <a href="https://console.mistral.ai" target="_blank" rel="noreferrer">
                console.mistral.ai
              </a>
            </td>
          </tr>
          <tr>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/providers/together.png"
                alt=""
                width="20"
                height="20"
                style={providerLogoStyle}
              />
              <strong>Together AI</strong>
            </td>
            <td>
              <a href="https://api.together.xyz" target="_blank" rel="noreferrer">
                api.together.xyz
              </a>
            </td>
          </tr>
          <tr>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/providers/fireworks.png"
                alt=""
                width="20"
                height="20"
                style={providerLogoStyle}
              />
              <strong>Fireworks AI</strong>
            </td>
            <td>
              <a href="https://fireworks.ai" target="_blank" rel="noreferrer">
                fireworks.ai
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Subscription</h3>

      <p>
        If you have a <strong>Claude Pro/Max</strong> or <strong>ChatGPT Plus/Pro</strong> plan,
        Omnigent can use your existing CLI login. No API key needed. Just make sure you&apos;re
        logged in:
      </p>

      <pre>
        <code>
          {`claude auth login    # for Claude Pro/Max
codex login          # for ChatGPT`}
        </code>
      </pre>

      <p>
        <code>omni setup</code> auto-detects an active CLI login and offers it as a one-tap option.
      </p>

      <h3>Gateway</h3>

      <p>
        Omnigent works with any <strong>OpenAI-compatible</strong> or{" "}
        <strong>Anthropic-compatible</strong> gateway:
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", margin: "16px 0" }}>
        {gateways.map((gateway) => (
          <div
            key={gateway.logo}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              width: "90px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/gateways/${gateway.logo}.png`}
              alt={gateway.name}
              width="40"
              height="40"
              style={{ borderRadius: "4px" }}
            />
            <span style={{ fontSize: "11px", textAlign: "center", lineHeight: "1.2" }}>
              {gateway.name}
            </span>
          </div>
        ))}
      </div>

      <p>
        <code>omni setup</code> asks for a <strong>base URL</strong> and a <strong>key</strong>. The
        base URL differs depending on the agent:
      </p>

      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>For</th>
            <th>Base URL</th>
            <th>Key</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>OpenRouter</strong></td>
            <td>Claude Code</td>
            <td><code>https://openrouter.ai/api</code></td>
            <td>your OpenRouter key (<code>sk-or-...</code>)</td>
          </tr>
          <tr>
            <td><strong>OpenRouter</strong></td>
            <td>Codex / OpenAI agents</td>
            <td><code>https://openrouter.ai/api/v1</code></td>
            <td>your OpenRouter key (<code>sk-or-...</code>)</td>
          </tr>
          <tr>
            <td><strong>Ollama</strong> (local)</td>
            <td>Codex / OpenAI agents</td>
            <td><code>http://localhost:11434/v1</code></td>
            <td>any value (Ollama ignores it)</td>
          </tr>
        </tbody>
      </table>

      <div className="note">
        <p>
          <strong>Note:</strong> For Claude Code, point at OpenRouter&apos;s Anthropic-compatible
          endpoint (<code>.../api</code>, <strong>not</strong> <code>.../api/v1</code>); for Codex
          and the OpenAI-agents harness, use the OpenAI-compatible <code>.../api/v1</code>.
        </p>
      </div>

      <h3>Databricks</h3>

      <p>
        Route models through your Databricks workspace using the{" "}
        <a
          href="https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/"
          target="_blank"
          rel="noreferrer"
        >
          Foundation Model API
        </a>
        . Omnigent resolves credentials from your <code>~/.databrickscfg</code> profile.
      </p>

      <pre>
        <code>
          {`executor:
  harness: claude-sdk
  model: databricks-claude-sonnet-4-6
  auth:
    type: databricks
    profile: <your-profile>`}
        </code>
      </pre>

      <p>
        Model names are prefixed with <code>databricks-</code> so Omnigent routes them through your
        workspace automatically. See the{" "}
        <a
          href="https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/supported-models"
          target="_blank"
          rel="noreferrer"
        >
          Databricks Foundation Model API docs
        </a>{" "}
        for the full list of available models.
      </p>
    </>
  );
}
