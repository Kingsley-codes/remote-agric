import Link from "next/link";
import type { ReactNode } from "react";

type Section = {
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
};

export default function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return (
    <section className="min-h-screen bg-[#f6f8f6] py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <header className="rounded-3xl bg-primary px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/85">{intro}</p>
          <p className="mt-6 text-xs text-white/65">Last updated: 3 September 2026</p>
        </header>

        <article className="mt-8 rounded-3xl bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
          <p className="text-sm leading-7 text-slate-600">
            These terms apply to your use of the Remote Agric website, app, and related services. Please read them carefully. For questions, visit our <Link className="font-medium text-primary underline underline-offset-2" href="/contact">contact page</Link>.
          </p>
          <div className="mt-9 space-y-9">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">{section.content}</div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
