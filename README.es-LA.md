<div align="center">
  <h1>🪐 maioli.dev.br</h1>

  <p>
    <strong>Portafolio multilingüe de la empresa de desarrollo de software maioli.dev, con temas y efectos interactivos inspirados en Marvel.</strong>
  </p>

  <p>
    🌍 <a href="README.md">English</a> |
    🇧🇷 <a href="README.pt-BR.md">Português</a> |
    🇪🇸 <a href="README.es-LA.md">Español</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  </p>

  <p align="center">
    <a href="https://maioli.dev.br" target="_blank">
      <img src="https://img.shields.io/badge/Demostración_en_Vivo-maioli.dev.br-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Demostración en Vivo" />
    </a>
  </p>
</div>

---

## 📖 Visión General

El **maioli.dev.br** es el portafolio oficial de la empresa de desarrollo de software **maioli.dev**. Presenta los proyectos y la trayectoria del equipo en tres idiomas — `pt-BR`, `en-US` y `es-LA` — con contenido editorial mantenido en Markdown/MDX y una interfaz lúdica inspirada en héroes y villanos de Marvel. El sitio se ejecuta en **Next.js** (App Router) y se publica como aplicación completa en Vercel.

## ✨ Características Principales

- **🎨 Cápsulas temáticas de Marvel:** 20 temas conmutables (Universo, Spider-Man, Iron Man, Capitán América, Thor, Hulk, ...) con paletas primaria/secundaria, indicador de tema activo (`✓`) colocado a la derecha de una etiqueta centrada sin desplazar la cápsula, y alternativas seguras de contraste.
- **🦹 Efectos del Chaos Engine:** chasquido de Thanos, rotación de Loki, niebla de Doctor Doom y la onda de Magneto controlados por un emisor de eventos ligero — manteniendo el tema activo visualmente estable.
- **🌍 Internacionalización en 3 idiomas:** diccionarios completos de interfaz para `pt-BR`, `en-US` y `es-LA`, además de rutas equivalentes y contenido localizado para cada página.
- **📝 Contenido vía MDX:** los proyectos y la sección "Sobre nosotros" son archivos Markdown/MDX validados en el build con **Zod** (fail-fast ante frontmatter inválido).
- **🤖 Pruebas E2E automatizadas:** suites de Playwright que cubren el showcase, la sección Sobre y los efectos del Chaos Engine (incluyendo estabilidad, contraste y persistencia del tema).

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto es una única aplicación Next.js estructurada para mantener **el contenido separado del código** y **los efectos aislados del layout**.

### 📁 Estructura del Proyecto

```text
maioli.dev.br/
├── content/
│   ├── about/      # Contenido institucional localizado (quiénes somos, misión)
│   └── projects/   # Contenido de proyectos localizado por idioma
├── e2e/            # Pruebas end-to-end de Playwright
├── public/         # Imágenes y assets estáticos
├── scripts/        # Scripts de dev server y validación de contenido
└── src/
    ├── app/        # Páginas, layouts, proxy y estilos globales del App Router
    ├── components/ # Componentes de UI, layout, about, proyectos y efectos visuales
    ├── hooks/      # Hooks React compartidos
    ├── i18n/       # Configuración de idiomas y diccionarios de interfaz
    └── lib/        # Loaders de contenido, schemas Zod, temas y eventos del caos
```

### 🛠️ Stack Tecnológico

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Framer Motion 13.
- **Contenido:** gray-matter, next-mdx-remote, Zod 4 (validación de frontmatter).
- **Testing:** Playwright (Chromium).
- **Herramientas:** ESLint 9 + `eslint-config-next`, script de dev con `kill-port`.

## 🚀 Cómo Empezar

### Requisitos Previos

- Node.js 20 o superior.
- npm.

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/immaioli/maioli.dev.br.git
   cd maioli.dev.br
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecutando el Proyecto

**Iniciar el servidor de desarrollo (libera el puerto 3000 primero):**
```bash
npm run dev
```
La aplicación está disponible en `http://localhost:3000/pt-BR/`.

**Build y ejecución de producción:**
```bash
npm run build
npm run start
```

### Ejecutando Validación y Pruebas E2E

```bash
npm run validate:content   # valida frontmatter MDX/MDX con Zod
npm run lint               # ejecuta ESLint
npm run build              # build de producción
npx playwright test        # pruebas E2E en Chromium
```

## ⚙️ Variables de Entorno

No se requieren secretos ni variables de entorno. La aplicación lee todo el contenido del repositorio y funciona sin configuración adicional.

## 🧠 Decisiones Arquitectónicas

*   **¿Por qué Next.js App Router + contenido en MDX?** Las rutas se generan estáticamente por idioma (`generateStaticParams`), lo que mantiene el sitio rápido y publicable en Vercel mientras el contenido sigue siendo editable en archivos simples — sin CMS ni base de datos que mantener.
*   **¿Por qué fail-fast con Zod?** El frontmatter se valida tanto con `validate:content` como en la carga, de modo que un archivo inválido aborta el build en lugar de publicar una página rota.
*   **¿Por qué pares de colores primary/secondary?** Cada cápsula usa un par distinto para seguir siendo identificable por color, pero el estado activo añade un indicador `✓` y un contorno, para no depender solo del color.
*   **¿Por qué etiqueta centrada con columna reservada para la marca de verificación?** La marca ocupa una columna fija de `1em` (spacer a la izquierda, `✓` a la derecha), de modo que cambiar el tema activo nunca desplaza la etiqueta ni cambia el ancho de la cápsula.

## 🤝 Contribuyendo

1. Haz un Fork del Proyecto.
2. Crea tu Rama de Característica (`git checkout -b feature/CaracteristicaIncreible`).
3. Confirma tus Cambios (`git commit -m 'Añade alguna CaracteristicaIncreible'`).
4. Sube la Rama (`git push origin feature/CaracteristicaIncreible`).
5. Abre un Pull Request. Asegúrate de que todas las pruebas de Playwright pasen y de seguir estrictamente los principios de Clean Code.

## 📜 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.
