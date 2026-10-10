import {
  siConvex,
  siDocker,
  siExpress,
  siFirebase,
  siFlutter,
  siGit,
  siGithubactions,
  siGooglegemini,
  siGraphql,
  siJest,
  siJsonwebtokens,
  siKubernetes,
  siLaravel,
  siLinux,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siQdrant,
  siReact,
  siReactquery,
  siRedis,
  siRedux,
  siSocketdotio,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWebrtc,
} from "simple-icons";

export const toolCategories = ["Frontend", "Backend", "Data", "AI", "Cloud & DevOps"] as const;
export type ToolCategory = (typeof toolCategories)[number];

/** Brand logo (Simple Icons path + hex) or, where none exists, a generic glyph name. */
export type Tool = {
  name: string;
  category: ToolCategory;
  icon?: { path: string; hex: string };
  glyph?: "cloud" | "database" | "sparkles" | "queue" | "store" | "mic";
};

const brand = (i: { path: string; hex: string }) => ({ path: i.path, hex: i.hex });

export const tools: Tool[] = [
  { name: "React", category: "Frontend", icon: brand(siReact) },
  { name: "Next.js", category: "Frontend", icon: brand(siNextdotjs) },
  { name: "TypeScript", category: "Frontend", icon: brand(siTypescript) },
  { name: "Tailwind CSS", category: "Frontend", icon: brand(siTailwindcss) },
  { name: "Redux Toolkit", category: "Frontend", icon: brand(siRedux) },
  { name: "React Query", category: "Frontend", icon: brand(siReactquery) },
  { name: "Zustand", category: "Frontend", glyph: "store" },
  { name: "Flutter", category: "Frontend", icon: brand(siFlutter) },

  { name: "Node.js", category: "Backend", icon: brand(siNodedotjs) },
  { name: "Express", category: "Backend", icon: brand(siExpress) },
  { name: "Socket.IO", category: "Backend", icon: brand(siSocketdotio) },
  { name: "WebRTC", category: "Backend", icon: brand(siWebrtc) },
  { name: "GraphQL", category: "Backend", icon: brand(siGraphql) },
  { name: "Prisma", category: "Backend", icon: brand(siPrisma) },
  { name: "JWT", category: "Backend", icon: brand(siJsonwebtokens) },
  { name: "Stripe", category: "Backend", icon: brand(siStripe) },
  { name: "BullMQ", category: "Backend", glyph: "queue" },
  { name: "Jest", category: "Backend", icon: brand(siJest) },
  { name: "Laravel", category: "Backend", icon: brand(siLaravel) },
  { name: "Python", category: "Backend", icon: brand(siPython) },

  { name: "MongoDB", category: "Data", icon: brand(siMongodb) },
  { name: "PostgreSQL", category: "Data", icon: brand(siPostgresql) },
  { name: "MySQL", category: "Data", icon: brand(siMysql) },
  { name: "Azure SQL", category: "Data", glyph: "database" },
  { name: "Redis", category: "Data", icon: brand(siRedis) },
  { name: "Convex", category: "Data", icon: brand(siConvex) },
  { name: "Supabase", category: "Data", icon: brand(siSupabase) },
  { name: "Firebase", category: "Data", icon: brand(siFirebase) },
  { name: "Qdrant", category: "Data", icon: brand(siQdrant) },

  { name: "Google Gemini", category: "AI", icon: brand(siGooglegemini) },
  { name: "OpenAI API", category: "AI", glyph: "sparkles" },
  { name: "RAG pipelines", category: "AI", glyph: "database" },
  { name: "Speech-to-Text", category: "AI", glyph: "mic" },

  { name: "AWS S3", category: "Cloud & DevOps", glyph: "cloud" },
  { name: "Azure", category: "Cloud & DevOps", glyph: "cloud" },
  { name: "Docker", category: "Cloud & DevOps", icon: brand(siDocker) },
  { name: "Kubernetes", category: "Cloud & DevOps", icon: brand(siKubernetes) },
  { name: "NGINX", category: "Cloud & DevOps", icon: brand(siNginx) },
  { name: "GitHub Actions", category: "Cloud & DevOps", icon: brand(siGithubactions) },
  { name: "Vercel", category: "Cloud & DevOps", icon: brand(siVercel) },
  { name: "Linux", category: "Cloud & DevOps", icon: brand(siLinux) },
  { name: "Git", category: "Cloud & DevOps", icon: brand(siGit) },
];

/** Near-black brand colors (Next.js, Express, Vercel…) vanish on dark tiles; those use the text color. */
export function isDarkBrand(hex: string) {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 70;
}
