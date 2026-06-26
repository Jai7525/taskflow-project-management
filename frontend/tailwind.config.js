/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: 'var(--bg-primary)',
        bgSecondary: 'var(--bg-secondary)',
        sidebar: 'var(--sidebar)',
        topNav: 'var(--top-nav)',
        card: 'var(--card)',
        drawer: 'var(--drawer)',
        inputBg: 'var(--input-bg)',
        borderTheme: 'var(--border)',
        borderInput: 'var(--border-input)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted: 'var(--text-muted)',
        textDisabled: 'var(--text-disabled)',
        accent: 'var(--accent)',
        accentHover: 'var(--accent-hover)',
        accentActive: 'var(--accent-active)',
        successTheme: 'var(--success)',
        warningTheme: 'var(--warning)',
        dangerTheme: 'var(--danger)',
        dangerThemeHover: 'var(--danger-hover)',
        hoverOverlay: 'var(--hover-overlay)',
        activeOverlay: 'var(--active-overlay)',
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Locked Indigo Accent
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        workspace: {
          bg: '#F6F8FB',
          sidebar: '#111827',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',   // Buttons, inputs, dropdowns
        '2xl': '16px',  // Cards
      },
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
      },
    },
  },
  plugins: [],
}
