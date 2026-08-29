<div align="center">
  <h1>maioli.dev.br</h1>
  <p><strong>The gateway to the mAIo Interactive Portfolio ecosystem.</strong></p>
</div>

---

Welcome to the central landing page for the **mAIo Assistant Chat** portfolio. 

While the actual interactive AI chat lives on a dedicated subdomain (`maio.maioli.dev.br`) powered by Next.js and Vercel AI SDK, this repository serves as the highly optimized static entry point.

## ✨ Ecosystem Integration

This project is part of a larger microservices architecture:

1. **Static Landing Page** (`maioli.dev.br`): The face of the portfolio, ensuring instant load times and perfect SEO.
2. **mAIo Chat App** (`chat-rag-personal`): The core Next.js application handling the actual conversational UI and vector database retrieval.
3. **Classifier API** (`chat-rag-personal-classifier-api`): A Node.js fallback microservice ensuring the assistant remains online even if external LLM providers fail.

## 🚀 Recent Updates & Resilience

To guarantee a premium user experience across the ecosystem, this repository orchestrates automated **Keep-Alive** routines:
- **GitHub Actions Cron Jobs**: A workflow runs every 10 minutes to ping the external `chat-rag-personal` and `classifier-api` services running on Render's free tier. This completely eliminates "Cold Start" delays, ensuring the AI responds instantly to visitors coming from this landing page.

## 🛠️ Tech Stack

- **Framework:** Next.js (Static Export)
- **Styling:** Tailwind CSS & Glassmorphism UI
- **Deployment:** cPanel via automated FTP GitHub Actions
- **Resilience:** CI/CD Keep-Alive Cron Jobs

---

**Irineu Marcelo Maioli**  
`<Full-Stack Engineer>`
