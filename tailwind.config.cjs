/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-navy": "#fafafa",
        "green-correct": "#27ae60",
        "red-incorrect": "#ed7a73",
      },
    },
  },
  plugins: [],
};
