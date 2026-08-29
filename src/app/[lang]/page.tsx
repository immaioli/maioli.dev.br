import { getDictionary } from '../../i18n/dictionaries';
import { Locale } from '../../i18n/config';
import Header from '../../components/layout/Header';
import HeroSection from '../../components/HeroSection';
import ProjectsSection from '../../components/projects/ProjectsSection';
import AboutSection from '../../components/AboutSection';
import DoctorDoomFog from '../../components/effects/DoctorDoomFog';
import Footer from '../../components/layout/Footer';
import { getSortedProjects } from '../../lib/projects';
import { getSortedAboutEntries } from '../../lib/about';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const projects = getSortedProjects(lang);
  const aboutEntries = getSortedAboutEntries(lang);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Header lang={lang} altLogo={dict.altLogo} altAvatar={dict.altAvatar} />

      <main className="flex-1 flex flex-col items-center p-6 sm:p-12 pt-32 relative z-10 w-full max-w-6xl mx-auto">
        <HeroSection lang={lang} dict={dict} />
        <AboutSection dict={dict} entries={aboutEntries} lang={lang} />
        <ProjectsSection projects={projects} lang={lang} sectionTitle={dict.projects.sectionTitle} emptyMessage={dict.projects.empty} />
      </main>

      <DoctorDoomFog message={dict.fog?.message} />

      <Footer contact={dict.contact} />
    </div>
  );
}
