import { ImageResponse } from "next/og";

export const alt = "Celentroft — Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const tags = ["Python", "TypeScript", "Rust", "Go"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#06030d",
          color: "#ffffff",
        }}
      >
        {/* glows */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 88% 0%, rgba(124,58,237,0.6) 0%, rgba(6,3,13,0) 52%), radial-gradient(circle at 0% 100%, rgba(91,33,182,0.45) 0%, rgba(6,3,13,0) 48%)",
          }}
        />
        {/* grid */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(139,92,246,0.09) 1px, rgba(0,0,0,0) 1px), linear-gradient(to bottom, rgba(139,92,246,0.09) 1px, rgba(0,0,0,0) 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: 72,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
              celentroft<span style={{ color: "#8b5cf6", marginLeft: -4 }}>_</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 24,
                color: "#c4b5fd",
                border: "1px solid rgba(139,92,246,0.45)",
                background: "rgba(13,8,25,0.8)",
                borderRadius: 999,
                padding: "10px 24px",
              }}
            >
              <div
                style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: "#a78bfa" }}
              />
              Open to opportunities
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 168,
                fontWeight: 700,
                letterSpacing: -6,
                lineHeight: 1,
              }}
            >
              Celentroft<span style={{ color: "#8b5cf6", marginLeft: -14 }}>.</span>
            </div>
            <div style={{ display: "flex", marginTop: 20, fontSize: 48, color: "#a78bfa" }}>
              Software Developer
            </div>
            <div style={{ display: "flex", marginTop: 14, fontSize: 30, color: "#9b93b3" }}>
              Discord bots · Automation · Web applications
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  fontSize: 26,
                  color: "#ddd6fe",
                  border: "1px solid rgba(139,92,246,0.4)",
                  background: "rgba(21,13,39,0.9)",
                  borderRadius: 14,
                  padding: "10px 22px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
