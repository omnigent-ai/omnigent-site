/* eslint-disable @next/next/no-img-element */
// This route renders an off-DOM image via Satori; next/image does not apply here.
import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

const assets = (f) => join(process.cwd(), "lib/og-assets", f);

const fontRegular = readFileSync(assets("Inter-400.woff"));
const fontBold = readFileSync(assets("Inter-700.woff"));
const bg = `data:image/png;base64,${readFileSync(assets("bg.png")).toString("base64")}`;
const mark = `data:image/png;base64,${readFileSync(assets("mark.png")).toString("base64")}`;

const SIZE = { width: 1200, height: 630 };

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Omnigent").slice(0, 100);
  const description = (searchParams.get("desc") || "").slice(0, 200);
  const eyebrow = (searchParams.get("eyebrow") || "").slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          fontFamily: "Inter",
          color: "#F4F6FB",
          backgroundColor: "#1A2746",
          backgroundImage: `url(${bg})`,
          backgroundSize: "1200px 630px",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* large faint starfish watermark */}
        <img
          src={mark}
          width={520}
          alt=""
          height={520}
          style={{ position: "absolute", top: 30, right: -40, opacity: 0.1 }}
        />

        {/* top-right logo lockup */}
        <div
          style={{
            position: "absolute",
            top: 64,
            right: 72,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <img src={mark} width={56} height={56} alt="" />
          <span style={{ fontSize: 36, fontWeight: 700, color: "#FEFEFE" }}>
            Omnigent
          </span>
        </div>

        {/* divider above the content block */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 1,
            backgroundColor: "#2C3E66",
            marginBottom: 36,
          }}
        />

        {eyebrow ? (
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#FF4FB3",
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            maxWidth: 1000,
            color: "#FFFFFF",
          }}
        >
          {title}
        </div>

        {description ? (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 400,
              lineHeight: 1.35,
              color: "#AAB4CC",
              marginTop: 24,
              maxWidth: 940,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
      ],
    }
  );
}
