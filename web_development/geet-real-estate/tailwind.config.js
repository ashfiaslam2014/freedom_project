/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                obsidian: '#0D0D12',
                champagne: '#C9A84C',
                ivory: '#FAF8F5',
                slate: '#2A2A35',
                background: '#FAF8F5', // mapping standard tokens
                primary: '#0D0D12',
                accent: '#C9A84C',
            },
            fontFamily: {
                heading: ['Inter', 'sans-serif'],
                drama: ['"Playfair Display"', 'serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
                body: ['Inter', 'sans-serif'],
            },
            letterSpacing: {
                tight: '-0.02em',
                tighter: '-0.04em',
            },
            borderRadius: {
                '2rem': '2rem',
                '3rem': '3rem',
                '4rem': '4rem',
            }
        },
    },
    plugins: [],
}
