// 📁 File: tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // ...
  plugins: [
    require("daisyui"),
    require('@tailwindcss/aspect-ratio'), // ✅ এই লাইনটি যোগ করুন
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "primary": "#7209b7",   // Violet
          "secondary": "#f72585", // Bold Pink
          "base-100": "#ffffff",
          "base-200": "#f5f5f5",
          "base-300": "#E5E7EB",
          "base-content": "#1F2937",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "primary": "#9d4edd",   // Lighter Violet
          "secondary": "#f75a9e", // Lighter Pink
          "base-100": "#1a1a1a",
          "base-200": "#2a2a2a",
          "base-300": "#3d4451",
          "base-content": "#E5E7EB",
        },
      },
    ],
  },
}