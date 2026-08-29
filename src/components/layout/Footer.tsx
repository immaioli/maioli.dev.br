'use client';
import { ThanosSnapTarget } from '../effects/ChaosEngine';
import type { Dictionary } from '../../i18n/dictionaries';

export default function Footer({ contact }: { contact: Dictionary['contact'] }) {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/554491271183?text=${encodeURIComponent(contact.whatsappMessage)}`;

  return (
    <footer className="w-full mt-24 border-t border-white/10 bg-black/40 backdrop-blur-md relative z-40">
      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col items-center justify-center gap-6">
        <ThanosSnapTarget>
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-xl font-bold tracking-wide text-(--theme-primary) [text-shadow:0_1px_4px_rgba(255,255,255,0.55)]">
              {contact.title}
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={contact.whatsapp} title={contact.whatsapp} className="p-3 rounded-full bg-white/5 hover:bg-(--theme-secondary) hover:text-(--theme-primary) text-gray-400 transition-all duration-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26C2.168 6.443 6.603 2.01 12.055 2.01c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.9 7.005c-.003 5.45-4.438 9.884-9.892 9.884M20.52 3.49A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.52 3.49Z" />
              </svg>
            </a>
            <a href="mailto:maioli.dev@outlook.com" aria-label={contact.email} title={contact.email} className="p-3 rounded-full bg-white/5 hover:bg-(--theme-secondary) hover:text-(--theme-primary) text-gray-400 transition-all duration-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
            <a href="https://github.com/immaioli" target="_blank" rel="noopener noreferrer" aria-label={contact.github} title={contact.github} className="p-3 rounded-full bg-white/5 hover:bg-(--theme-secondary) hover:text-(--theme-primary) text-gray-400 transition-all duration-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://www.linkedin.com/in/irineu-marcelo-maioli/" target="_blank" rel="noopener noreferrer" aria-label={contact.linkedin} title={contact.linkedin} className="p-3 rounded-full bg-white/5 hover:bg-(--theme-secondary) hover:text-(--theme-primary) text-gray-400 transition-all duration-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            </div>
          </div>
        </ThanosSnapTarget>

        <ThanosSnapTarget>
          <p className="text-gray-500 text-sm mt-4">
            © {currentYear} maioli.dev. {contact.rights}
          </p>
        </ThanosSnapTarget>
      </div>
    </footer>
  );
}
