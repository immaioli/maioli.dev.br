import Link from 'next/link';
import type { AboutEntry } from '../../lib/about';
import { ThanosSnapTarget } from '../effects/ChaosEngine';

type AboutCardProps = {
  entry: Omit<AboutEntry, 'content'>;
  lang: string;
};

export default function AboutCard({ entry, lang }: AboutCardProps) {
  return (
    <ThanosSnapTarget>
      <Link
        href={`/${lang}/${entry.slug}`}
        className="glass-card p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:bg-black/45 hover:shadow-[0_8px_30px_var(--theme-primary-glow)] hover:border-(--theme-secondary) hover:-translate-y-1 focus-visible:bg-black/45 focus-visible:shadow-[0_8px_30px_var(--theme-primary-glow)] focus-visible:border-(--theme-secondary) group h-full"
      >
        <h4 className="text-xl font-bold text-[color-mix(in_srgb,var(--theme-secondary)_15%,white)] group-hover:text-[color-mix(in_srgb,var(--theme-secondary)_5%,white)] group-hover:[text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_8px_var(--theme-secondary)] group-focus-visible:text-[color-mix(in_srgb,var(--theme-secondary)_5%,white)] group-focus-visible:[text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_8px_var(--theme-secondary)] transition-all duration-300">
          {entry.frontmatter.title}
        </h4>

        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
          {entry.frontmatter.excerpt}
        </p>

      </Link>
    </ThanosSnapTarget>
  );
}
