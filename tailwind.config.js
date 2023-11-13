/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
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
      }
    }
  },
  daisyui:{
    themes:["cmyk"]
  },
  plugins: [require("daisyui")]
}

