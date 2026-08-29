import { Locale } from './config';

const dictionaries = {
  'pt-BR': {
    avatarText: 'O mAIo é um chat inteligente projetado para consultar minhas informações e gerar respostas personalizadas, demonstrando a aplicação prática de IA generativa. <span class="text-[var(--theme-primary)] font-bold text-[15px]">Clique aqui no card</span> para acessar a plataforma e conversar com ele.',
    logoText: 'Plataforma em desenvolvimento. Em breve, este espaço será dedicado ao compartilhamento de projetos, estudos práticos e documentação sobre novas tecnologias.',
    altAvatar: 'Avatar do desenvolvedor mAIo',
    altLogo: 'Logo maioli.dev',
    themes: {
      label: 'E se o tema fosse...',
      universo: 'Universo (Padrão)',
      spiderMan: 'Homem-Aranha',
      ironMan: 'Homem de Ferro',
      captainAmerica: 'Capitão América',
      thor: 'Thor',
      hulk: 'Hulk',
      blackWidow: 'Viúva Negra',
      blackPanther: 'Pantera Negra',
      doctorStrange: 'Doutor Estranho',
      captainMarvel: 'Capitã Marvel',
      scarletWitch: 'Feiticeira Escarlate',
      deadpool: 'Deadpool',
      daredevil: 'Demolidor',
      xMen: 'X-Men',
      fantasticFour: 'Quarteto Fantástico',
      guardians: 'Guardiões da Galáxia',
      thanos: 'Thanos',
      loki: 'Loki',
      magneto: 'Magneto'
    },
    projects: {
      github: 'Ver no GitHub',
      production: 'Ver em Produção',
      back: 'Voltar para Home'
    }
  },
  'en-US': {
    avatarText: 'mAIo is an intelligent chat designed to query my information and generate personalized responses, demonstrating the practical application of generative AI. <span class="text-[var(--theme-primary)] font-bold text-[15px]">Click here on the card</span> to access the platform and chat with it.',
    logoText: 'Platform under development. Soon, this space will be dedicated to sharing projects, practical studies, and documentation on new technologies.',
    altAvatar: 'Developer mAIo avatar',
    altLogo: 'maioli.dev logo',
    themes: {
      label: 'What if the theme was...',
      universo: 'Universe (Default)',
      spiderMan: 'Spider-Man',
      ironMan: 'Iron Man',
      captainAmerica: 'Captain America',
      thor: 'Thor',
      hulk: 'Hulk',
      blackWidow: 'Black Widow',
      blackPanther: 'Black Panther',
      doctorStrange: 'Doctor Strange',
      captainMarvel: 'Captain Marvel',
      scarletWitch: 'Scarlet Witch',
      deadpool: 'Deadpool',
      daredevil: 'Daredevil',
      xMen: 'X-Men',
      fantasticFour: 'Fantastic Four',
      guardians: 'Guardians of the Galaxy',
      thanos: 'Thanos',
      loki: 'Loki',
      magneto: 'Magneto'
    },
    projects: {
      github: 'View on GitHub',
      production: 'View in Production',
      back: 'Back to Home'
    }
  },
  'es-LA': {
    avatarText: 'mAIo es un chat inteligente diseñado para consultar mi información y generar respuestas personalizadas, demostrando la aplicación práctica de IA generativa. <span class="text-[var(--theme-primary)] font-bold text-[15px]">Haz clic aquí en la tarjeta</span> para acceder a la plataforma y chatear con él.',
    logoText: 'Plataforma en desarrollo. Pronto, este espacio estará dedicado a compartir proyectos, estudios prácticos y documentación sobre nuevas tecnologías.',
    altAvatar: 'Avatar del desarrollador mAIo',
    altLogo: 'Logo de maioli.dev',
    themes: {
      label: '¿Y si el tema fuera...',
      universo: 'Universo (Predeterminado)',
      spiderMan: 'Spider-Man',
      ironMan: 'Iron Man',
      captainAmerica: 'Capitán América',
      thor: 'Thor',
      hulk: 'Hulk',
      blackWidow: 'Viuda Negra',
      blackPanther: 'Pantera Negra',
      doctorStrange: 'Doctor Strange',
      captainMarvel: 'Capitana Marvel',
      scarletWitch: 'Bruja Escarlata',
      deadpool: 'Deadpool',
      daredevil: 'Daredevil',
      xMen: 'X-Men',
      fantasticFour: 'Los Cuatro Fantásticos',
      guardians: 'Guardianes de la Galaxia',
      thanos: 'Thanos',
      loki: 'Loki',
      magneto: 'Magneto'
    },
    projects: {
      github: 'Ver en GitHub',
      production: 'Ver en Producción',
      back: 'Volver al Inicio'
    }
  }
};

export const getDictionary = async (locale: Locale) => dictionaries[locale] ?? dictionaries['pt-BR'];