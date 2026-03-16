module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          'Space Grotesk',
          'Montserrat',
          'Poppins',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
        body: [
          'Space Grotesk',
          'Montserrat',
          'Poppins',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        mainbg: '#101d12',
        panel: '#e6e9d8',
        card: '#1a2b1f',
        header: '#101d12',
        primary: '#3cff5e',
        accent: '#ffb347',
        heading: '#ffffff',
        heading2: '#3cff5e',
        body: '#e6e9d8',
        dark: '#101d12',
        light: '#e6e9d8',
        orange: '#ffb347',
        green: '#3cff5e',
      },
    },
  },
  plugins: [],
} 