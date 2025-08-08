<p align="center">
  <img src="public/logo.svg" alt="NuxSaaS Logo" width="160" height="160"/>
</p>

<h1 align="center">NuxSaaS</h1>

<p align="center">
  <a href="https://nuxsaas.com" target="_blank">Website</a> ·
  <a href="https://docs.nuxsaas.com" target="_blank">Documentation</a> ·
  <a href="https://discord.gg/8V4kSu43MW" target="_blank">Discord</a> ·
  <a href="https://www.youtube.com/watch?v=u1H8ChQ5Pl8" target="_blank">Youtube</a> ·
  <a href="https://x.com/cyanhall" target="_blank">
    @Cyanhall
  </a>
</p>

<p align="center">
  <a href="https://nuxt.com/" target="_blank">
    <img alt="Built with Nuxt 4" src="https://img.shields.io/badge/Built%20with-Nuxt%204-00DC82?style=flat-square&logo=nuxt.js" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img alt="Language TypeScript" src="https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript" />
  </a>
  <a href="https://www.postgresql.org/" target="_blank">
    <img alt="Database PostgreSQL" src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square&logo=postgresql" />
  </a>
  <a href="https://tailwindcss.com/" target="_blank">
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css" />
  </a>
  <a href="https://github.com/NuxSaaS/NuxSaaS/blob/main/LICENSE" target="_blank">
    <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" />
  </a>
</p>

<p align="center">
  <b>Nuxt.js Full-Stack SaaS Starter Kit - Free & Open Source</b>
  <br />
  Modern, Production-Ready, and Developer-Friendly
</p>

## ✨ Features

- 🚀 **Modern Tech Stack** - Built with Nuxt 4, Vue 3, TypeScript
- 🔒 **Secure Auth** - Better Auth with OAuth2 social logins
- 💾 **Enterprise Database** - PostgreSQL with Drizzle ORM
- 💳 **Payment Ready** - Stripe/Polar integration for subscription
- 📧 **Email Integration** - Built-in Resend support
- 📊 **Beautiful Dashboard** - Admin panel with charts
- 🌐 **I18n Ready** - Multi-language support out of the box
- 📱 **Responsive** - Mobile-first design approach
- 🎯 **Developer Experience** - ESLint + TypeScript for better DX

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/NuxSaaS/NuxSaaS.git
cd NuxSaaS

# 2. Use Node.js v22 LTS
nvm use

# 3. Install dependencies
npm install

# 4. Setup environment variables
cp .env.example .env

# 5. Generate and apply database migrations
npm run db:generate
npm run db:migrate

# 6. Start development server
npm run dev
```

## 🚀 Deployment
#### Node.js Server
```bash
# Deploy to self host server
npm run build
npm run serve
```

#### Cloudflare Worker
```bash
# Deploy to Cloudflare Worker
npm run build
cp wrangler.example.toml wrangler.toml
npm run deploy
```

## 🌟 Support

If you find this project helpful, please consider:
- Giving it a star ⭐
- [Becoming a sponsor on GitHub](https://github.com/sponsors/Cyanhall) 💖

Your support helps maintain and improve NuxSaaS!

## 🙏 Credits
This project is built upon these amazing open source projects:
- [Nuxt](https://nuxt.com) - The Progressive Web Framework
- [Nuxt UI](https://ui.nuxt.com) - Fully styled and customizable components
- [Better Auth](https://github.com/better-auth/better-auth) -The most comprehensive authentication framework for TypeScript
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) - TypeScript ORM
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- [nuxt-echarts](https://github.com/kingyue737/nuxt-echarts): Nuxt module for Apache ECharts™
- [nuxthub-better-auth](https://github.com/atinux/nuxthub-better-auth): A demo of using Better Auth with Nuxt

## 📜 License
This project is licensed under the [MIT License](LICENSE).
