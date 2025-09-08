const colors = require('tailwindcss/colors');

module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: colors.blue,
                secondary: colors.green,
                accent: colors.purple,
                neutral: colors.gray,
                'base-100': colors.white,
                info: colors.blue,
                success: colors.green,
                warning: colors.amber,
                error: colors.red
            }
        }
    },
    plugins: []
};