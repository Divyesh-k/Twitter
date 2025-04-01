// import daisyui from "daisyui";
// import daisyUIThemes from "daisyui/src/theming/themes";
// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       backdropFilter: {
//         none: "none",
//         blur: "blur(20px)",
//       },
//     },
//   },
//   variants: {
//     extend: {
//       backdropFilter: ["responsive"],
//     },
//   },
//   plugins: [daisyui],

//   daisyui: {
//     themes: [
//       "light",
//       {
//         black: {
//           ...daisyUIThemes["black"],
//           primary: "rgb(29, 155, 240)",
//           secondary: "rgb(24, 24, 24)",
//         },
//       },
//     ],
//   },
// };





import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
      },
    },
  },
  variants: {
    extend: {
      backdropFilter: ["responsive"],
    },
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      // Custom "light" theme with personalized colors
      {
        light: {
          ...daisyUIThemes["light"], // Use default light theme as base
          primary: "#1d9bf0", // Custom primary color (Twitter blue)
          secondary: "#f0f0f0", // Light gray for secondary elements
          accent: "#ffa726", // Orange accent for important buttons
          neutral: "#ffffff", // White for backgrounds
          "base-100": "#f5f5f5", // Slightly off-white background
          info: "#29b6f6", // Info color for notifications
          success: "#66bb6a", // Green for success messages
          warning: "#ffca28", // Yellow for warnings
          error: "#ef5350", // Red for errors
        },
      },
      // Custom "black" theme that you have already created
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(29, 155, 240)", // Twitter-like blue for primary
          secondary: "rgb(24, 24, 24)", // Dark gray for secondary
          accent: "rgb(29, 185, 84)", // Green accent
          neutral: "#111827", // Dark background
          "base-100": "#000000", // Black base color
          info: "#3ABFF8", // Light blue for info
          success: "#36D399", // Light green for success
          warning: "#FBBD23", // Yellow for warnings
          error: "#F87272", // Red for errors
        },
      },
    ],
  },
};
