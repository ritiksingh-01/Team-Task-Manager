export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        background: '#f8fafc', // slate-50
        surface: '#ffffff',
        surfaceHover: '#f1f5f9', // slate-100
        border: '#e2e8f0', // slate-200
        textMain: '#0f172a', // slate-900
        textMuted: '#64748b', // slate-500
        ink: '#0f172a', // keep for backwards compatibility
        mist: '#f8fafc',
        line: '#e2e8f0',
        brand: '#4f46e5', // update to primary-600
        leaf: '#10b981', // emerald-500
        ember: '#ef4444', // red-500
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  plugins: []
};
