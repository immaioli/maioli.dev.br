'use client';
import { ThanosSnapTarget } from './effects/ChaosEngine';
import type { Dictionary } from '../i18n/dictionaries';
import type { AboutEntry } from '../lib/about';
import AboutCard from './about/AboutCard';

interface AboutSectionProps {
  dict: Dictionary;
  entries: Omit<AboutEntry, 'content'>[];
  lang: string;
}

export default function AboutSection({ dict, entries, lang }: AboutSectionProps) {
  const about = dict.about;
  if (!about) return null;

  return (
    <section className="w-full max-w-5xl mt-20 mb-12">
      <ThanosSnapTarget>
        <h3 className="text-3xl font-bold [color:color-mix(in_srgb,var(--theme-secondary)_15%,white)] [text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_0_8px_var(--theme-secondary)] mb-8 border-b border-(--theme-primary)/30 pb-4 flex items-center gap-3 transition-colors duration-500">
          <span className="w-2 h-8 bg-(--theme-primary) rounded-full"></span>
          {about.title}
        </h3>
      </ThanosSnapTarget>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {entries.map((entry) => (
          <AboutCard key={entry.slug} entry={entry} lang={lang} />
        ))}
      </div>
    </section>
  );
}
