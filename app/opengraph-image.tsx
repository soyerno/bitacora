import { ImageResponse } from "next/og";

export const alt = "Erno × MODO — Hernán De Souza · Sr AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** OG image dinámica branded MODO (verde #008859). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#008859",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 90, fontWeight: 700, letterSpacing: "-0.03em" }}>
          Erno × MODO
        </div>
        <div style={{ marginTop: 24, fontSize: 38, opacity: 0.9 }}>
          Hernán De Souza · Sr AI Engineer
        </div>
        <div style={{ marginTop: 12, fontSize: 30, opacity: 0.75 }}>
          Decks · RFCs · R&D · Skills
        </div>
      </div>
    ),
    size,
  );
}
