export const SITE_URL = "https://portfolio-ybmr.vercel.app";

import fallbackProjects from "./projects.fallback.json";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://portfolio-api-three-zeta.vercel.app/api";

export const profile = {
  name: "Saif-Ul-llah",
  fullName: "Saif Ul llah Hammad Fazil",
  shortName: "Saif",
  role: "Full-Stack Engineer",
  location: "Karachi, Pakistan",
  timeZone: "Asia/Karachi",
  email: "saifhammad411@gmail.com",
  github: "https://github.com/Saif-Ul-llah/",
  linkedin: "https://www.linkedin.com/in/saif-hammad-952a94219",
  cv: "https://drive.google.com/file/d/1GfbcTzZnrckifc1ilsO9iqNsamgbOfD2/view?usp=sharing",
  photo:
    "https://res.cloudinary.com/djzi5j5u2/image/upload/v1791652241/nextjs_uploads/zxuzoxhpspx0jo4svret.jpg",
  cutout: "/saif-cutout.webp",
};

export type Project = {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  repoUrl: string;
  createdAt?: string;
  details?: {
    challenge?: string;
    solution?: string;
    features?: string[];
    technologies?: string[];
    results?: string;
  };
};

export type Experience = {
  _id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  responsibilities?: string[];
  createdAt?: string;
};

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Newest first by day; projects added on the same day keep their API order.
 * Falls back to a snapshot so the Work section is never empty if the API is down.
 */
export async function getProjects(): Promise<Project[]> {
  const fetched = await getJson<Project[]>("/projects");
  const data = fetched?.length ? fetched : (fallbackProjects as unknown as Project[]);
  return data
    .map((p, i) => ({ p, i }))
    .sort((a, b) => {
      const da = (a.p.createdAt ?? "").slice(0, 10);
      const db = (b.p.createdAt ?? "").slice(0, 10);
      return db.localeCompare(da) || a.i - b.i;
    })
    .map(({ p }) => p);
}

/** Newest role first. */
export async function getExperiences(): Promise<Experience[]> {
  const data = (await getJson<Experience[]>("/experiences")) ?? fallbackExperiences;
  return [...data].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

const BULLET_START = /^(?:[A-Z][a-z]+(?:ed|ing)|Build|Built|Create|Design|Lead|Led|Collaborate|Own|Ship)\b/;

/**
 * Experience descriptions come from a CV with hard line wraps. Re-join wrapped
 * lines and split on real sentence/bullet boundaries.
 */
export function toBullets(text: string): string[] {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const bullets: string[] = [];
  for (const line of lines) {
    const prev = bullets[bullets.length - 1];
    const startsNew = !prev || /[.!?]$/.test(prev) || BULLET_START.test(line);
    if (startsNew) bullets.push(line);
    else bullets[bullets.length - 1] = `${prev} ${line}`;
  }
  return bullets.map((b) => b.replace(/\.$/, ""));
}

export const capabilities = [
  {
    title: "Product platforms",
    body: "Multi-portal SaaS with role-based access, admin consoles and clean, typed APIs that a team can grow into.",
    tags: ["RBAC", "Next.js", "Node.js", "TypeScript"],
  },
  {
    title: "Real-time systems",
    body: "Chat, presence, live sessions and peer-to-peer transfer. Event-driven backends that stay fast under load.",
    tags: ["Socket.IO", "WebRTC", "Redis", "BullMQ"],
  },
  {
    title: "AI features that ship",
    body: "Streaming LLM tutors, RAG over private knowledge, speech-to-text pipelines and usage-metered AI plans.",
    tags: ["Gemini", "RAG", "Qdrant", "Speech-to-Text"],
  },
  {
    title: "Payments & infrastructure",
    body: "Stripe subscriptions and payouts, cloud deploys, scheduled jobs, CI/CD and supply-chain security.",
    tags: ["Stripe", "AWS", "Azure", "Docker"],
  },
];

export const processSteps = [
  { n: "01", title: "Map", body: "Users, roles, data and the one flow that has to work on day one." },
  { n: "02", title: "Architect", body: "Schema, API contracts and infrastructure, written down before code." },
  { n: "03", title: "Build", body: "Typed, validated and reviewed. Working demos every week, not every month." },
  { n: "04", title: "Ship & run", body: "CI/CD, monitoring and a handover your team can actually maintain." },
];

export const faqs = [
  {
    q: "What kind of work do you take on?",
    a: "Full-stack products end to end, or the backend on its own: APIs, real-time features, AI integrations, payments and deployment. I'm open to full-time roles, contracts and fixed-scope projects.",
  },
  {
    q: "Can you join an existing codebase?",
    a: "Yes. Most of my work has been inside existing teams. I start by reading the code and the data model, then ship small, reviewed changes before anything large.",
  },
  {
    q: "What time zone do you work in?",
    a: "Pakistan Standard Time (UTC+5). I overlap comfortably with Europe and the Gulf, and keep a few hours of overlap with US mornings.",
  },
  {
    q: "How do we start?",
    a: "Send a few lines about the product and where it's stuck using the form below or email. I'll reply within a day with questions or a short plan.",
  },
];

/** Used only when the API is unreachable at build time. */
const fallbackExperiences: Experience[] = [
  {
    _id: "hashone",
    role: "Full Stack Developer",
    company: "HashOne Global",
    location: "Karachi, Pakistan",
    period: "Jan 2026 - Present",
    description:
      "Design, develop and maintain scalable MERN applications from front-end UI to back-end services.\nBuild and integrate RESTful APIs, optimize database performance and ship responsive interfaces.\nCollaborate with cross-functional teams, manage deployments and keep code quality high.",
    responsibilities: ["Backend Development", "Frontend Development", "DevOps", "Lead Backend", "System Designer"],
    createdAt: "2026-02-28",
  },
  {
    _id: "progziel",
    role: "MERN Stack Developer",
    company: "Progziel Technologies (Pvt.) Ltd",
    location: "Karachi, Pakistan",
    period: "Nov 2024 - Dec 2025",
    description:
      "Developed the backend for a ride-sharing application using Node.js, Express and PostgreSQL.\nBuilt a complete trading web application with secure SFTP integration for data exchange.\nDesigned and implemented backend services for a CRM system.",
    responsibilities: ["Backend Development", "Frontend Development", "DevOps", "Lead Backend", "System Designer"],
    createdAt: "2025-09-09T17:51",
  },
  {
    _id: "nixaam",
    role: "React Developer",
    company: "Nixaam LLC",
    location: "Karachi, Pakistan",
    period: "Jan 2024 - Nov 2024",
    description:
      "Developed a multi-portal management web application for hospitals, split into portals by user role and permission.",
    responsibilities: ["Frontend Development", "Backend Development"],
    createdAt: "2025-09-09T17:48",
  },
  {
    _id: "coderatory",
    role: "React Developer",
    company: "Coderatory",
    location: "Karachi, Pakistan",
    period: "Jun 2023 - Dec 2023",
    description:
      "Developed a web platform for managing sports competitions and a real-time soccer management system.\nImplemented player rankings and personalized dashboards.\nCreated a cryptocurrency tracking website similar to CoinGecko.",
    responsibilities: ["Frontend Development"],
    createdAt: "2025-09-09T17:45",
  },
];
