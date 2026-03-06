/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                deepvoid: '#0A0A14',
                plasma: '#7B61FF',
                ghost: '#F0EFF4',
                graphite: '#18181B',
                background: '#0A0A14', // Using deep void for dark Vapor Clinic look
                primary: '#F0EFF4',    // Ghost for primary text
                accent: '#7B61FF',     // Plasma for accents
                cardbg: '#18181B',     // Graphite for cards/surfaces
            },
            fontFamily: {
                heading: ['Sora', 'sans-serif'],
                drama: ['"Instrument Serif"', 'serif'],
                mono: ['"Fira Code"', 'monospace'],
                body: ['Sora', 'sans-serif'],
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
