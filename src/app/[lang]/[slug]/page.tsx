import { MDXRemote } from 'next-mdx-remote/rsc';
import { getProjectBySlug, getSortedProjects } from '../../../lib/projects';
import { getAboutEntryBySlug, getSortedAboutEntries } from '../../../lib/about';
import { getDictionary } from '../../../i18n/dictionaries';
import { Locale } from '../../../i18n/config';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

// Generates static paths at build time for every project in every locale
export async function generateStaticParams() {
  const locales = ['pt-BR', 'en-US', 'es-LA'];
  const params: { lang: string; slug: string }[] = [];

  for (const lang of locales) {
    const projects = getSortedProjects(lang);
    for (const project of projects) {
      params.push({
        lang,
        slug: project.slug,
      });
    }

    for (const entry of getSortedAboutEntries(lang)) {
      params.push({ lang, slug: entry.slug });
    }
  }

  return params;
}

export default async function ContentPage({ params }: Props) {
  const { lang, slug } = await params;
  const project = getProjectBySlug(slug, lang);
  const aboutEntry = project ? null : getAboutEntryBySlug(slug, lang);
  const entry = project ?? aboutEntry;

  if (!entry) {
    notFound();
  }

  const dict = await getDictionary(lang as Locale);
  const { frontmatter, content } = entry;

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden pb-20">
      {/* Background glow base on active theme */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--theme-primary-glow)] rounded-full blur-[120px] -z-10 transition-colors duration-500 pointer-events-none"></div>

      <header className="fixed top-0 left-0 right-0 w-full flex items-center justify-between p-6 sm:px-12 z-50 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-md">
        <Link
          href={`/${lang}`}
          className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">{dict.projects.back}</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 pt-28 sm:p-12 sm:pt-32 relative z-10 w-full max-w-4xl mx-auto">
        <div className="w-full glass-card p-8 md:p-12">

          <div className="mb-12 border-b border-white/10 pb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {frontmatter.tags.map(tag => (
                <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full border border-[var(--theme-secondary)] text-[var(--theme-secondary)] bg-[var(--theme-primary)]/10">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {frontmatter.title}
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {frontmatter.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {project?.frontmatter.githubUrl && (
                <a
                  href={project.frontmatter.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 border border-white/5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  {dict.projects.github}
                </a>
              )}

              {project?.frontmatter.productionUrl && (
                <a
                  href={project.frontmatter.productionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--theme-primary)] hover:bg-[var(--theme-secondary)] text-white font-medium shadow-[0_0_15px_var(--theme-primary-glow)] transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {dict.projects.production}
                </a>
              )}
            </div>
          </div>

          <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[var(--theme-secondary)] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-[var(--theme-secondary)] prose-code:bg-[var(--theme-primary)]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
            <MDXRemote source={content} />
          </article>

        </div>
      </main>
    </div>
  );
}
