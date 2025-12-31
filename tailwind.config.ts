module.exports = {
    plugins: [
        require('tailwind-scrollbar-hide'),
    ],
    content: [
        "./src/**/*.{js,ts,jsx,tsx,html}",
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            width: {
                '5xs': '4rem',
                '4xs': '6rem',
                '3xs': '8rem',
                '2xs': '12rem',
                'xs': '20rem',
            },
            maxWidth: {
                '5xs': '4rem',
                '4xs': '6rem',
                '3xs': '8rem',
                '2xs': '12rem',
                'xs': '20rem',
            },
            colors: {
                'night-blue': '#210B8D',
                'teal-blue': '#33BFFF',
                'theme-3': '#91EEFF',
                'theme-2': '#91FFD9',
                'theme-1': '#91FFA2',
            },
        },
    },
}
