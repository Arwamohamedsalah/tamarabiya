/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        english: ['Montserrat', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
        /** @deprecated use font-arabic — kept for existing class names */
        cairo: ['Tajawal', 'sans-serif'],
      },
      colors: {
        /* البنية التحتية / الأعمال المدنية - احترافية وقوة */
        'infra': {
          DEFAULT: '#4B4B4B',
          light: '#6B6B6B',
          dark: '#333333',
        },
        /* اللاندسكيب - طبيعة وحياة خضراء */
        'landscape': {
          DEFAULT: '#27AE60',
          light: '#2ecc71',
          dark: '#1e8449',
        },
        /* الهياكل المعدنية - حداثة وصلابة */
        'metal': {
          DEFAULT: '#2C3E50',
          light: '#34495e',
          dark: '#1a252f',
          silver: '#BDC3C7',
        },
        /* CTA وتفاعل - برتقالي */
        'cta': {
          DEFAULT: '#F39C12',
          hover: '#e67e22',
          light: '#f5b041',
        },
        /* نص رئيسي */
        'text-primary': '#333333',
      },
    },
  },
  plugins: [],
};
