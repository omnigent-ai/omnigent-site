import { providerKeys } from "@/lib/docs-component-data";

// API-key providers shown on the Models page, each with a logo and key source.
const providerLogoStyle = {
  display: "inline",
  verticalAlign: "middle",
  borderRadius: "4px",
  marginRight: "8px",
};

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
        {providerKeys.map((p) => (
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
