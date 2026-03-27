import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary (Cyan)
        'primary': '#00F2FF',
        'primary-dark': '#00363a',
        
        // Secondary (Purple)
        'secondary': '#7701d0',
        
        // Surfaces
        'surface': '#131314',
        'surface-low': '#1c1b1c',
        'surface-high': '#353436',
        'surface-variant': '#2a2a2a',
        
        // Text
        'on-surface': '#ffffff',
        'on-surface-variant': '#a8a8a8',
        'outline-variant': '#3a3a3a',
        
        // Semantic
        'success': '#00F2FF',
        'warning': '#FFB800',
        'error': '#FF4444',
        'info': '#00F2FF',
      },
      fontFamily: {
        'system': ['Space Grotesk', 'monospace'],
        'functional': ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['3rem', { lineHeight: '1.3', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.3', fontWeight: '700' }],
        'headline-lg': ['2rem', { lineHeight: '1.4', fontWeight: '700' }],
        'headline-md': ['1.75rem', { lineHeight: '1.4', fontWeight: '700' }],
        'headline-sm': ['1.5rem', { lineHeight: '1.4', fontWeight: '700' }],
        'title-lg': ['1.375rem', { lineHeight: '1.5', fontWeight: '600' }],
        'title-md': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        'title-sm': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'label-md': ['0.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'label-sm': ['0.625rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
        '4xl': '4rem',
      },
      borderRadius: {
        'none': '0px',
      },
      boxShadow: {
        'bloom': '0 0 20px rgba(0, 242, 255, 0.4), 0 0 40px rgba(119, 1, 208, 0.2)',
        'bloom-lg': '0 0 40px rgba(0, 242, 255, 0.6)',
        'bloom-xl': '0 0 60px rgba(0, 242, 255, 0.8)',
      },
      backdropFilter: {
        'glass': 'blur(12px)',
      },
    },
  },
  plugins: [],
}

export default config