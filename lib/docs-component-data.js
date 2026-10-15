// Plain data behind docs components that render lists or tables. Kept in a
// JSX-free module so scripts/generate-llms-files.mjs can derive the llms.txt
// text from the same source the page renders from.

// /install.sh rewrites to the GitHub install script (see next.config.mjs)
export const cliTabs = (origin) => [
  {
    label: "installer",
    code: `curl -fsSL ${origin}/install.sh | sh\n\n# install an optional integration\ncurl -fsSL ${origin}/install.sh | sh -s -- --extra databricks,modal`,
  },
  {
    label: "uv",
    code: `uv tool install omnigent\n\n# install an optional integration\nuv tool install "omnigent[databricks,modal]"`,
  },
  {
    label: "pip",
    code: `pip install omnigent\n\n# install an optional integration\npip install "omnigent[databricks,modal]"`,
  },
  { label: "Homebrew", code: "brew install omnigent-ai/tap/omnigent" },
];

// API-key providers shown on the Models page, each with a logo and key source.
export const providerKeys = [
  {
    logo: "anthropic",
    name: "Anthropic",
    url: "https://console.anthropic.com",
    label: "console.anthropic.com",
  },
  {
    logo: "openai",
    name: "OpenAI",
    url: "https://platform.openai.com",
    label: "platform.openai.com",
  },
  {
    logo: "openrouter",
    name: "OpenRouter",
    url: "https://openrouter.ai",
    label: "openrouter.ai",
  },
  {
    logo: "groq",
    name: "Groq",
    url: "https://console.groq.com",
    label: "console.groq.com",
  },
  {
    logo: "deepseek",
    name: "DeepSeek",
    url: "https://platform.deepseek.com",
    label: "platform.deepseek.com",
  },
  {
    logo: "xai",
    name: "xAI",
    url: "https://console.x.ai",
    label: "console.x.ai",
  },
  {
    logo: "mistral",
    name: "Mistral",
    url: "https://console.mistral.ai",
    label: "console.mistral.ai",
  },
  {
    logo: "together",
    name: "Together AI",
    url: "https://api.together.xyz",
    label: "api.together.xyz",
  },
  {
    logo: "fireworks",
    name: "Fireworks AI",
    url: "https://fireworks.ai",
    label: "fireworks.ai",
  },
];

// OpenAI-/Anthropic-compatible gateways shown on the Models page.
export const gateways = [
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
