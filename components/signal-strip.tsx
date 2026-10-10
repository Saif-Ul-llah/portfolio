const signals = [
  "Real-time chat & presence",
  "Streaming AI tutors",
  "RAG over private knowledge",
  "Stripe subscriptions & payouts",
  "Role-based multi-portal apps",
  "WebRTC peer-to-peer transfer",
  "Client-side encryption",
  "CI/CD & cloud deploys",
];

export function SignalStrip() {
  return (
    <section className="on-inverse marquee-mask overflow-hidden border-y border-inverse-line bg-inverse py-4 text-inverse-ink" aria-label="What I build">
      <ul className="flex w-max animate-marquee gap-10 pr-10 motion-reduce:animate-none">
        {[...signals, ...signals].map((s, i) => (
          <li key={i} aria-hidden={i >= signals.length} className="flex items-center gap-10 whitespace-nowrap text-sm">
            <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
