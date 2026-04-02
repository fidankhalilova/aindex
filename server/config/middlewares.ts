import type { Core } from "@strapi/strapi";

const config: Core.Config.Middlewares = [
  {
    name: "strapi::cors",
    config: {
      origin: [
        "http://localhost:3000",
        "https://your-app.vercel.app", // ← add your Vercel URL here
      ],
    },
  },
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];

export default config;
