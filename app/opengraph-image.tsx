import { ImageResponse } from "next/og";

export const alt = "Saif-Ul-llah, full-stack engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Satori can't decode WebP, so ask Cloudinary for a PNG face crop of the original photo.
  const photo =
    "https://res.cloudinary.com/djzi5j5u2/image/upload/c_fill,g_face,w_460,h_560,f_png/v1791652241/nextjs_uploads/zxuzoxhpspx0jo4svret.jpg";

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f5f4ef", color: "#141416", padding: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", width: 56, height: 56, borderRadius: 10, background: "#141416", color: "#f5f4ef", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700 }}>
              su/
            </div>
            <div style={{ fontSize: 26, color: "#5c5c62" }}>Full-stack engineer · Karachi</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            <span>Backends that hold.</span>
            <span>Products that ship.</span>
            <span style={{ color: "#4f46e5" }}>AI that works.</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>Saif-Ul-llah</div>
        </div>
        <div style={{ display: "flex", width: 400, height: 502, borderRadius: 16, overflow: "hidden", background: "#131316", alignSelf: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={photo} width={400} height={502} style={{ objectFit: "cover" }} />
        </div>
      </div>
    ),
    size
  );
}
