'use client';
import { Project } from '../../lib/projects';
import { ThanosSnapTarget } from '../effects/ChaosEngine';
import ProjectCard from './ProjectCard';

interface ProjectsSectionProps {
  projects: Omit<Project, 'content'>[];
  lang: string;
  sectionTitle: string;
  emptyMessage: string;
}

export default function ProjectsSection({ projects, lang, sectionTitle, emptyMessage }: ProjectsSectionProps) {
  return (
    <div className="w-full flex flex-col items-center mt-8">
      <div className="w-full max-w-5xl">
        <ThanosSnapTarget>
          <h3 className="text-3xl font-bold [color:color-mix(in_srgb,var(--theme-secondary)_15%,white)] [text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_0_8px_var(--theme-secondary)] mb-8 border-b border-(--theme-primary)/30 pb-4 flex items-center gap-3 transition-colors duration-500">
            <span className="w-2 h-8 bg-(--theme-primary) rounded-full"></span>
            {sectionTitle}
          </h3>
        </ThanosSnapTarget>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              lang={lang}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 text-gray-400 border border-dashed border-white/10 rounded-2xl">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
