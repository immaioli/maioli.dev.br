import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '../../i18n/dictionaries';
import { Locale } from '../../i18n/config';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import HeroSection from '../../components/HeroSection';
import { getSortedProjects } from '../../lib/projects';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const projects = getSortedProjects(lang);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 w-full flex items-center justify-between px-12 py-4 border-b border-white/10 bg-black/20 backdrop-blur-md z-50 transition-colors duration-500 h-24">
        {/* Usando w-1/3 para garantir que as bordas da tela se mantenham bem divididas, centralizando o meio se tivesse um,
            e deixando o logo a esquerda e idiomas a direita alinhados. */}
        <div className="flex-1">
          {/* Logo container configurado para preencher quase o height do header e fluir o SVG via tag nativa img, escapando do resize bug do Next Image component */}
          <Link href={`/${lang}`} className="relative z-50 inline-block h-full py-1">
            <img
              src="/logo-maioli.dev.svg"
              alt={dict.altLogo}
              className="h-14 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
        <div className="flex justify-end flex-1">
          <LanguageSwitcher />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center p-6 sm:p-12 pt-32 relative z-10 w-full max-w-6xl mx-auto">
        <HeroSection lang={lang} dict={dict} />

        {/* Projects Showcase Section */}
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <h3 className="text-3xl font-bold text-white mb-8 border-b border-[var(--theme-primary)]/30 pb-4 flex items-center gap-3 transition-colors duration-500">
              <span className="w-2 h-8 bg-[var(--theme-primary)] rounded-full"></span>
              Projetos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/${lang}/${project.slug}`}
                  className="glass-card p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_var(--theme-primary-glow)] hover:border-[var(--theme-primary)]/40 hover:-translate-y-1 group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-xl font-bold text-white group-hover:text-[var(--theme-secondary)] transition-colors duration-300">
                      {project.frontmatter.title}
                    </h4>
                    <span className="text-xs font-mono text-[var(--theme-primary)] bg-[var(--theme-primary-glow)] px-2 py-1 rounded-md shrink-0">
                      {new Date(project.frontmatter.date).toLocaleDateString(lang, { year: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                    {project.frontmatter.excerpt}
                  </p>

                  <div className="mt-auto pt-4 flex flex-wrap gap-2">
                    {project.frontmatter.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full border border-white/10 text-gray-400 bg-white/5 group-hover:border-[var(--theme-primary)]/30 transition-colors duration-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-12 text-gray-400 border border-dashed border-white/10 rounded-2xl">
                Nenhum projeto encontrado.
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}