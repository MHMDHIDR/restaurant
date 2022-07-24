module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '480px',
        standalone: { raw: '(display-mode: standalone)' }
      },
      animation: {
        cursor: 'cursor .6s linear infinite alternate',
        type: 'type 4s ease-out .8s 1 normal both',
        'type-reverse': 'type 4s ease-out 0s infinite alternate-reverse both'
      },
      keyframes: {
        type: {
          '0%': { width: '0ch' },
          '5%, 10%': { width: '1ch' },
          '10%, 20%': { width: '10ch' },
          '20%, 35%': { width: '15ch' },
          '30%, 40%': { width: '20ch' },
          '40%, 60%': { width: '30ch' },
          '75%, 90%': { width: '34.4ch' }
        }
      }
    }
  },
  plugins: []
}
