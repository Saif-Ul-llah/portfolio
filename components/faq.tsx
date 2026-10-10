import { Plus } from "lucide-react";
import { faqs } from "@/lib/data";

export function Faq() {
  return (
    <section id="faq" className="page-x py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow reveal">FAQ</p>
          <h2 className="display reveal mt-4 text-4xl sm:text-6xl">
            Fair <span className="accent-word">questions.</span>
          </h2>
        </div>
        <div className="divide-y divide-line border-y border-line lg:col-span-8">
          {faqs.map((f) => (
            <details key={f.q} className="reveal group">
              <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 py-5 text-lg font-medium sm:text-xl">
                {f.q}
                <Plus size={20} className="faq-icon shrink-0 text-muted transition-transform duration-300" />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
