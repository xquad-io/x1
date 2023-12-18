import { component$ } from "@builder.io/qwik";

export default component$(() => (
  <>
    <script type="module" src="https://esm.sh/run" async></script>
    <script
      type="module"
      dangerouslySetInnerHTML={`
// import {nextui} from '@nextui-org/react'

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
  // plugins: [nextui()],
}
        
        `}
    ></script>
  </>
));
