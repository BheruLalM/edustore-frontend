/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563eb',
                    dark: '#1d4ed8',
                    light: '#3b82f6',
                },
                secondary: {
                    DEFAULT: '#4f46e5',
                    dark: '#4338ca',
                    light: '#6366f1',
                },
                accent: {
                    DEFAULT: '#7c3aed',
                    dark: '#6d28d9',
                    light: '#8b5cf6',
                },
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(to right, #2563eb, #4f46e5)',
                'gradient-secondary': 'linear-gradient(to right, #4f46e5, #7c3aed)',
                'gradient-full': 'linear-gradient(to right, #2563eb, #4f46e5, #7c3aed)',
                'gradient-radial': 'radial-gradient(circle at center, #4f46e5, #2563eb)',
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(79, 70, 229, 0.2)',
                'glow-md': '0 0 20px rgba(79, 70, 229, 0.3)',
                'glow-lg': '0 0 30px rgba(79, 70, 229, 0.4)',
                'glow-indigo': '0 0 20px rgba(79, 70, 229, 0.5)',
                'neumorphic': '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.7)',
                'neumorphic-dark': '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)',
            },
            animation: {
                'typing': 'typing 2s steps(20, end)',
                'blink': 'blink 1s step-end infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'float': 'float 3s ease-in-out infinite',
                'breathe': 'breathe 6s ease-in-out infinite',
            },
            keyframes: {
                typing: {
                    'from': { width: '0' },
                    'to': { width: '100%' },
                },
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 10px rgba(79, 70, 229, 0.3)' },
                    '50%': { boxShadow: '0 0 20px rgba(79, 70, 229, 0.6)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                breathe: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.04)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
