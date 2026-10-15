import { gateways } from "@/lib/docs-component-data";

// Logo grid of OpenAI-/Anthropic-compatible gateways shown on the Models page.
export default function GatewayLogos() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        margin: "16px 0",
      }}
    >
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
          <span
            style={{ fontSize: "11px", textAlign: "center", lineHeight: "1.2" }}
          >
            {gateway.name}
          </span>
        </div>
      ))}
    </div>
  );
}
