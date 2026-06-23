// API-key providers shown on the Models page, each with a logo and key source.
const providerLogoStyle = {
  display: "inline",
  verticalAlign: "middle",
  borderRadius: "4px",
  marginRight: "8px",
};

const providers = [
  { logo: "anthropic", name: "Anthropic", url: "https://console.anthropic.com", label: "console.anthropic.com" },
  { logo: "openai", name: "OpenAI", url: "https://platform.openai.com", label: "platform.openai.com" },
  { logo: "openrouter", name: "OpenRouter", url: "https://openrouter.ai", label: "openrouter.ai" },
  { logo: "groq", name: "Groq", url: "https://console.groq.com", label: "console.groq.com" },
  { logo: "deepseek", name: "DeepSeek", url: "https://platform.deepseek.com", label: "platform.deepseek.com" },
  { logo: "xai", name: "xAI", url: "https://console.x.ai", label: "console.x.ai" },
  { logo: "mistral", name: "Mistral", url: "https://console.mistral.ai", label: "console.mistral.ai" },
  { logo: "together", name: "Together AI", url: "https://api.together.xyz", label: "api.together.xyz" },
  { logo: "fireworks", name: "Fireworks AI", url: "https://fireworks.ai", label: "fireworks.ai" },
];

export default function ProviderKeyTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Provider</th>
          <th>Key source</th>
        </tr>
      </thead>
      <tbody>
        {providers.map((p) => (
          <tr key={p.logo}>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/providers/${p.logo}.png`}
                alt=""
                width="20"
                height="20"
                style={providerLogoStyle}
              />
              <strong>{p.name}</strong>
            </td>
            <td>
              <a href={p.url} target="_blank" rel="noreferrer">
                {p.label}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
