/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Toss-like Premium Palette
        primary: {
          DEFAULT: "#3182F6", // Toss Blue
          hover: "#1B64DA",
          light: "#E8F3FF",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F2F4F6", // Background
          200: "#E5E8EB", // Border
          300: "#D1D6DB",
          400: "#B0B8C1", // Icon
          500: "#8B95A1", // Text Secondary
          600: "#6B7684",
          700: "#4E5968", // Text Primary
          800: "#333D4B", // Heading
          900: "#191F28", // Black
        },
        // Semantic Colors
        success: "#34C759",
        error: "#FF3B30",
        warning: "#FF9500",
      },
      fontFamily: {
        sans: ["Pretendard", "Inter", "sans-serif"],
        display: ["Pretendard", "Inter", "sans-serif"],
      },
      boxShadow: {
        toss: "0 4px 24px 0 rgba(0, 0, 0, 0.04)",
        card: "0 2px 12px 0 rgba(0, 0, 0, 0.06)",
        floating: "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
};
