<div align="center">
  <h1>🪐 maioli.dev.br</h1>

  <p>
    <strong>Portfólio multilíngue da empresa de desenvolvimento de software maioli.dev, com efeitos e temas interativos inspirados na Marvel.</strong>
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
      <img src="https://img.shields.io/badge/Demonstração_Ao_Vivo-maioli.dev.br-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Demonstração Ao Vivo" />
    </a>
  </p>
</div>

---

## 📖 Visão Geral

O **maioli.dev.br** é o portfólio oficial da empresa de desenvolvimento de software **maioli.dev**. Ele apresenta os projetos e a trajetória da equipe em três idiomas — `pt-BR`, `en-US` e `es-LA` — com conteúdo editorial mantido em Markdown/MDX e uma interface lúdica inspirada em heróis e vilões da Marvel. O site roda em **Next.js** (App Router) e é publicado como aplicação completa na Vercel.

## ✨ Principais Funcionalidades

- **🎨 Cápsulas temáticas da Marvel:** 20 temas alternáveis (Universo, Homem-Aranha, Homem de Ferro, Capitão América, Thor, Hulk, ...) com paletas primária/secundária, indicador de tema ativo (`✓`) posicionado à direita de um rótulo centralizado sem deslocar a cápsula, e fallbacks seguros de contraste.
- **🦹 Efeitos do Chaos Engine:** estalo do Thanos, rotação do Loki, névoa do Doutor Destino e a onda do Magneto comandados por um emissor de eventos leve — mantendo o tema ativo visualmente estável.
- **🌍 Internacionalização em 3 idiomas:** dicionários completos de interface para `pt-BR`, `en-US` e `es-LA`, além de rotas equivalentes e conteúdo localizado para cada página.
- **📝 Conteúdo via MDX:** projetos e a seção "Sobre" são arquivos Markdown/MDX validados no build com **Zod** (fail-fast em frontmatter inválido).
- **🤖 Testes E2E automatizados:** suítes do Playwright cobrindo o showcase, a seção Sobre e os efeitos do Chaos Engine (incluindo estabilidade, contraste e persistência de tema).

## 🏗️ Arquitetura e Stack Tecnológico

O projeto é uma única aplicação Next.js estruturada para manter **conteúdo separado de código** e **efeitos isolados do layout**.

### 📁 Estrutura do Projeto

```text
maioli.dev.br/
├── content/
│   ├── about/      # Conteúdo institucional localizado (quem somos, missão)
│   └── projects/   # Conteúdo de projetos localizado por idioma
├── e2e/            # Testes end-to-end do Playwright
├── public/         # Imagens e assets estáticos
├── scripts/        # Scripts de dev server e validação de conteúdo
└── src/
    ├── app/        # Páginas, layouts, proxy e estilos globais do App Router
    ├── components/ # Componentes de UI, layout, about, projetos e efeitos visuais
    ├── hooks/      # Hooks React compartilhados
    ├── i18n/       # Configuração de idiomas e dicionários de interface
    └── lib/        # Loaders de conteúdo, schemas Zod, temas e eventos do caos
```

### 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Framer Motion 13.
- **Conteúdo:** gray-matter, next-mdx-remote, Zod 4 (validação de frontmatter).
- **Testes:** Playwright (Chromium).
- **Ferramentas:** ESLint 9 + `eslint-config-next`, script de dev com `kill-port`.

## 🚀 Como Começar

### Pré-requisitos

- Node.js 20 ou superior.
- npm.

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/immaioli/maioli.dev.br.git
   cd maioli.dev.br
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

### Executando o Projeto

**Iniciar o servidor de desenvolvimento (libera a porta 3000 antes):**
```bash
npm run dev
```
A aplicação fica disponível em `http://localhost:3000/pt-BR/`.

**Build e execução de produção:**
```bash
npm run build
npm run start
```

### Executando Validação e Testes E2E

```bash
npm run validate:content   # valida frontmatter MDX/MDX com Zod
npm run lint               # executa o ESLint
npm run build              # build de produção
npx playwright test        # testes E2E no Chromium
```

## ⚙️ Variáveis de Ambiente

Nenhum secret ou variável de ambiente é necessário. A aplicação lê todo o conteúdo do repositório e funciona sem configuração adicional.

## 🧠 Decisões Arquiteturais

*   **Por que Next.js App Router + conteúdo em MDX?** As rotas são geradas estaticamente por idioma (`generateStaticParams`), o que mantém o site rápido e publicável na Vercel enquanto o conteúdo permanece editável em arquivos simples — sem CMS ou banco de dados para manter.
*   **Por que fail-fast com Zod?** O frontmatter é validado tanto pelo `validate:content` quanto no carregamento, então um arquivo inválido aborta o build em vez de publicar uma página quebrada.
*   **Por que pares de cores primary/secondary?** Cada cápsula usa um par distinto para continuar identificável pela cor, mas o estado ativo adiciona um indicador `✓` e um contorno, para não depender apenas da cor.
*   **Por que rótulo centralizado com coluna reservada para o checkmark?** O checkmark ocupa uma coluna fixa de `1em` (spacer à esquerda, `✓` à direita), de modo que trocar o tema ativo nunca desloca o rótulo nem altera a largura da cápsula.

## 🤝 Contribuindo

1. Faça o Fork do Projeto.
2. Crie sua Branch de Feature (`git checkout -b feature/FeatureIncrivel`).
3. Faça o Commit das suas Mudanças (`git commit -m 'Adiciona uma FeatureIncrivel'`).
4. Faça o Push para a Branch (`git push origin feature/FeatureIncrivel`).
5. Abra um Pull Request. Certifique-se de que todos os testes do Playwright passam e os princípios de Clean Code sejam rigorosamente seguidos.

## 📜 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.
