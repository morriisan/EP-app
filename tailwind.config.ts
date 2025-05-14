import { withUt } from "uploadthing/tw";

const config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",     // for Next.js App Router
        "./pages/**/*.{js,ts,jsx,tsx}",   // for Next.js Pages Router
        "./components/**/*.{js,ts,jsx,tsx}", // shared components
        "./src/**/*.{js,ts,jsx,tsx}",     // if you store code under /src
    ],
    theme: {
        extend: {
            screens: {
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
            },
        },
    },
    plugins: [],
};

export default withUt(config);

