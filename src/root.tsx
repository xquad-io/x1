// import "virtual:uno.css";
import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preload" href="/global.css" as="style" />
        <link rel="preload" href="virtual:uno.css" as="style" />

        <RouterHead />
      </head>
      <body lang="en" class="antialiased text-white select-none">
        <ServiceWorkerRegister />
        <script
          async
          type="importmap"
          dangerouslySetInnerHTML={`
  {
    "imports": {
      "react": "https://esm.sh/react@18.2.0",
      "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
      "@nextui-org/react": "https://esm.sh/@nextui-org/react@^2.2.4",
      "framer-motion": "https://esm.sh/framer-motion@^10.16.2"
    }
  }
`}
        ></script>
        <script type="module" src="https://esm.sh/run" async></script>
        <script src="https://cdn.tailwindcss.com" async></script>
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

        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
