import { component$ } from "@builder.io/qwik";

export default component$(() => (
  <>
    <script type="module" src="https://esm.sh/run" async></script>
    <script
      type="module"
      dangerouslySetInnerHTML={`
import {nextui} from '@nextui-org/react'

tailwind.config =  {
  content: [
    './App.tsx',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
}
        
        `}
    ></script>

    <script
      async
      type="module"
      dangerouslySetInnerHTML={`
            import build from "https://esm.sh/build";
            import *as React from 'react'  
            import { createRoot } from 'react-dom/client'

            const ret = await build({
              dependencies: {
                "react": "18.2.0",
                // "react-dom": "18.2.0",
                "@nextui-org/react": "^2.2.4",
                "framer-motion": "^10.16.2"
              },
              code: \`
                import '@nextui-org/react'
                import 'framer-motion'
              \`,
            });
            await import(ret.url)
          `}
    />
  </>
));
