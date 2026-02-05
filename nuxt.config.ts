// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],

  css: ["~/assets/css/main.css"],

  // 로컬 개발: 백엔드 API(localhost:8000)로 프록시
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: "/api",
    },
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
