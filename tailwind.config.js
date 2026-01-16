// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: [
//         "./src/**/*.{js,jsx,ts,tsx}", // <--- THIS LINE IS CRITICAL
//     ],
//     theme: {
//         extend: {},
//     },
//     plugins: [],
// }
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'pawsense-blue': '#00BFFF',
            },
            boxShadow: {
                neon: "0 14px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
            },
        },
    },
    plugins: [],
};
