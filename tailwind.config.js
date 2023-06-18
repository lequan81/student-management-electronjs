/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/index.html',
    './src/renderer/src/*.{js,ts,jsx,tsx}',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}'
  ],
  safelist: [
    {
      pattern: /bg-(red|green|sky|blue|orange)-(200|500|700|700\/20)/,
      variants: ['hover', 'group-hover']
    },
    {
      pattern: /text-(red|green|blue|purple|yellow|sky)-(500|600|700|700\/20)/
    },
    {
      pattern: /border-(red|green|sky)-(400|500|600|700|700\/20)/,
      variants: ['hover', 'group-hover']
    }
  ],
  theme: {
    extend: {
      keyframes: {
        blinker: {
          '50%': { opacity: 0 }
        },
        'fade-in': {
          '100%': {
            opacity: 1
          }
        },
        'faded-out': {
          '0%': {
            opacity: 1
          },
          '100%': {
            opacity: 0
          }
        },
        'custom-pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 1 }
        }
      }
    },
    animation: {
      blinker: 'blinker 1s linear infinite',
      faded: 'fade-in 1s ease-in forwards, fade-out 3s 1s ease-out forwards',
      'custom-pulse': 'custom-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }
  },
  plugins: []
}
