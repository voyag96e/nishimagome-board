import { ImageResponse } from "next/og";

// Node.jsランタイムでのWindows file URL問題を回避するためedgeを指定
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#111827",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            background: "#0284c7",
            borderRadius: "16px",
            width: "68px",
            height: "84px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "60px",
            fontWeight: "900",
          }}
        >
          1
        </div>
        <div
          style={{
            background: "#f97316",
            borderRadius: "16px",
            width: "68px",
            height: "84px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "60px",
            fontWeight: "900",
          }}
        >
          2
        </div>
      </div>
    ),
    { ...size }
  );
}
