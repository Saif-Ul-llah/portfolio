import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Anton, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SITE_URL, profile } from "@/lib/data";
import { CHAT_SCRIPT, CHAT_USER_ID } from "@/lib/chat";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
// Condensed display face for the giant hero name
const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const description =
  "Saif-Ul-llah is a full-stack engineer in Karachi building product platforms, real-time systems and AI features with Next.js, Node.js and TypeScript.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Saif-Ul-llah | Full-Stack Engineer",
    template: "%s | Saif-Ul-llah",
  },
  description,
  keywords: [
    "Full-Stack Engineer",
    "MERN Stack Developer",
    "Next.js Developer",
    "Node.js Backend",
    "AI Integration",
    "Karachi",
    "Saif-Ul-llah",
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Saif-Ul-llah | Full-Stack Engineer",
    description,
    siteName: "Saif-Ul-llah",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saif-Ul-llah | Full-Stack Engineer",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0d",
};

// Applied before paint so the theme never flashes. Dark is the default; a stored choice wins.
const themeScript = `(function(){document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');var d=t?t==='dark':true;document.documentElement.classList.toggle('dark',d);if(localStorage.getItem('motion')==='off')document.documentElement.classList.add('motion-off')}catch(e){}})()`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.fullName,
  jobTitle: profile.role,
  url: SITE_URL,
  image: profile.photo,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ["Next.js", "React", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "AI integration", "Real-time systems"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${sans.variable} ${mono.variable} ${serif.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        {children}
        {/* AI assistant launcher; loads at idle so it never competes with the page */}
        <Script src={CHAT_SCRIPT} data-user={CHAT_USER_ID} strategy="lazyOnload" />
      </body>
    </html>
  );
}
