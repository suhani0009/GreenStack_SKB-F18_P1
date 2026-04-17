/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111c",
        moss: "#114232",
        lime: "#d8ff7e",
        mist: "#eff7f1",
        fog: "#9db4a5",
      },
      boxShadow: {
        panel: "0 18px 50px rgba(8, 17, 28, 0.12)",
      },
      fontFamily: {
        sans: ["'Segoe UI'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
