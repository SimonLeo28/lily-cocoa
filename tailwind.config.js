export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        blush: "#FBD8D8",
        rose: "#E89AAE",
        chocolate: "#6B3F2A",
        caramel: "#D9A066",
        sage: "#9CAF88",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(107, 63, 42, 0.08)",
      },
    },
  },
  plugins: [],
};