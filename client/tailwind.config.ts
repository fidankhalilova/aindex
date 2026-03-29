/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1B1464",
        blue: "#2E4BC6",
        "blue-light": "#4A6DE0",
        cyan: "#00C2CB",
        "cyan-light": "#33D4DC",
        accent: "#7B5CF5",
        surface: "#F8F9FF",
        muted: "#E8EAFF",
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        display: ["Syne", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grad-primary":
          "linear-gradient(135deg,#1B1464 0%,#2E4BC6 55%,#00C2CB 100%)",
        "grad-card":
          "linear-gradient(135deg,rgba(27,20,100,.04) 0%,rgba(0,194,203,.06) 100%)",
        "grad-hero":
          "linear-gradient(135deg,#1B1464 0%,#2E4BC6 60%,#4A8FD4 100%)",
        "grad-btn": "linear-gradient(135deg,#2E4BC6,#00C2CB)",
        "grad-text":
          "linear-gradient(135deg,#1B1464 0%,#2E4BC6 50%,#00C2CB 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(27,20,100,.08)",
        "card-lg": "0 8px 40px rgba(27,20,100,.14)",
        glow: "0 0 28px rgba(0,194,203,.35)",
        "glow-blue": "0 0 28px rgba(46,75,198,.3)",
      },
      animation: {
        "fade-up": "fadeUp .55s ease both",
        "fade-in": "fadeIn .4s ease both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "none" },
        },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
