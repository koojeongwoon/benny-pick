import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],

  css: ["~/assets/css/main.css"],

<<<<<<< Updated upstream
  // 로컬 개발: 백엔드 API(localhost:8000)로 프록시
  // /api/chat/... → http://localhost:8000/chat/...
  nitro: {
    // preset: "cloudflare-pages",
    devProxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },

=======
>>>>>>> Stashed changes
  runtimeConfig: {
    // ⚠️ 수정 제안: import.meta.env 대신 process.env를 쓰거나 빈 값으로 두는 게 안전합니다.
    // 실제 값은 .dev.vars 파일(로컬)이나 Cloudflare 대시보드(배포)에서 주입됩니다.
    googleApiKey: "",
  },

  app: {
    head: {
      title: "Benny Pick - 숨은 정부 지원금 찾기",
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
        },
      ],
    },
  },
});
