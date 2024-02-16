/** @type {import('tailwindcss').Config} */

const light = require("daisyui/src/theming/themes")["[data-theme=cmyk]"];
const dark = require("daisyui/src/theming/themes")["[data-theme=dark]"];

module.exports = {
  content: [
    "index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
      },
      minWidth: {
        '1/2': "50vw",        
        '1/4': "25vw",        
        '3/4': "75vw"
      },
      maxWidth: {
        '1/2': "50vw",        
        '1/4': "25vw",        
        '3/4': "75vw"
      },
      minHeight: {
        'display': "calc(100dvh - 6.5rem)",
        'content': "calc(100dvh - 11rem)"
      },
      maxHeight: {
        'display': "calc(100dvh - 6.5rem)",
        'content': "calc(100dvh - 11rem)"
      },
      keyframes: {
        fadeIn: {
          '0%': { display: "none", opacity: 0 },
          '1%': { display: "auto" },
          '100%': { opacity: "100%" }
        },
        fadeOut: {
          '0%': { opacity: "100%" },
          '1%': { opacity: 0 },
          '100%': { display: "none", opacity: 0 }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s linear',
        'fade-out': 'fadeOut 0.5s linear 1 normal forwards',
      }
    }
  },
  daisyui:{
    themes:[
      {
        light,
        dark: {
          ...dark,
          "primary": light["primary"],
          "secondary": light["secondary"],
          "accent": light["accent"],
          "info": light["info"],
          "success": light["success"],
          "warning": light["warning"],
          "error": light["error"],
          "neutral": light["neutral"],
        }
      }
    ]
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui")
  ]
}

