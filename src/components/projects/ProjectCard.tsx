import Link from 'next/link';
import { Project } from '../../lib/projects';
import { ThanosSnapTarget } from '../effects/ChaosEngine';

type ProjectCardProps = {
  project: Omit<Project, 'content'>;
  lang: string;
};

export default function ProjectCard({ project, lang }: ProjectCardProps) {
  return (
    <ThanosSnapTarget>
      <Link
        href={`/${lang}/${project.slug}`}
        className="glass-card p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:bg-black/45 hover:shadow-[0_8px_30px_var(--theme-primary-glow)] hover:border-(--theme-secondary) hover:-translate-y-1 focus-visible:bg-black/45 focus-visible:shadow-[0_8px_30px_var(--theme-primary-glow)] focus-visible:border-(--theme-secondary) group h-full"
      >
        <div className="flex justify-between items-start gap-4">
          <h4 className="text-xl font-bold text-[color-mix(in_srgb,var(--theme-secondary)_15%,white)] group-hover:text-[color-mix(in_srgb,var(--theme-secondary)_5%,white)] group-hover:[text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_8px_var(--theme-secondary)] group-focus-visible:text-[color-mix(in_srgb,var(--theme-secondary)_5%,white)] group-focus-visible:[text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_8px_var(--theme-secondary)] transition-all duration-300">
            {project.frontmatter.title}
          </h4>
          <span className="text-xs font-bold drop-shadow-md text-(--theme-primary) bg-(--theme-secondary) px-2 py-1 rounded-md shrink-0">
            {new Date(project.frontmatter.date).toLocaleDateString(lang, { year: 'numeric', month: 'short' })}
          </span>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
          {project.frontmatter.excerpt}
        </p>

        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          {project.frontmatter.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full border border-white/20 text-gray-200 bg-white/10 group-hover:border-[var(--theme-primary)] group-hover:text-white transition-colors duration-300">
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </ThanosSnapTarget>
  );
}
