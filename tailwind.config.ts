import { withUt } from "uploadthing/tw";
const config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",     // for Next.js App Router
        "./pages/**/*.{js,ts,jsx,tsx}",   // for Next.js Pages Router
        "./components/**/*.{js,ts,jsx,tsx}", // shared components
        "./src/**/*.{js,ts,jsx,tsx}",     // if you store code under /src
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    };

export default withUt(config);

