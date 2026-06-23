// Logo grid of OpenAI-/Anthropic-compatible gateways shown on the Models page.
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

export default function GatewayLogos() {
  return (
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
  );
}
