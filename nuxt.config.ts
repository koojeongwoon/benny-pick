// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],

  css: ["~/assets/css/main.css"],

  // 👇 [추가됨] Cloudflare Pages 배포를 위한 핵심 설정입니다.
  // 로컬 개발 시에는 주석 처리, 배포 시 활성화
  // nitro: {
  //   preset: "cloudflare-pages",
  // },

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
