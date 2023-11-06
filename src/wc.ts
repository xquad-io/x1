import { WebContainer } from "@webcontainer/api";

export const files = {
  "package.json": {
    file: {
      contents: `
      {
        "name": "vite-react-tailwind-starter",
        "private": true,
        "version": "0.0.0",
        "type": "module",
        "scripts": {
          "start": "vite"
        },
        "dependencies": {
          "clsx": "^2.0.0",
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
        },
        "devDependencies": {
          "@types/node": "^20.8.6",
          "@types/react": "^18.2.15",
          "@types/react-dom": "^18.2.7",
          "@vitejs/plugin-react": "^4.0.3",
          "autoprefixer": "^10.4.16",
          "postcss": "^8.4.31",
          "tailwindcss": "^3.3.3",
          "typescript": "^5.0.2",
          "framer-motion": "^10.16.2",
          "@nextui-org/react": "^2.2.4",
          "vite": "^4.4.5"
        }
      }
      `,
    },
  },
  'vite.config.ts': {
    file:{
        contents: `
        import react from "@vitejs/plugin-react";
        import path from "path";
        import { defineConfig } from "vite";
        
        // https://vitejs.dev/config/
        export default defineConfig({
          plugins: [react()],
          resolve: {
            alias: {
              "@": path.resolve(__dirname, "./src"),
            },
          },
        });
        `
    } 
  },
  'tailwind.config.js': {
    file: {
        contents: `
        import { nextui } from "@nextui-org/react"


        /** @type {import('tailwindcss').Config} */
        export default {
          content: [
            // ...
            "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
          ],
          theme: {
            extend: {},
          },
          darkMode: "class",
          plugins: [nextui()]
        }
        `
    }

  },
  'postcss.config.js': {
    file: {
        contents: `
        export default {
            plugins: {
              tailwindcss: {},
              autoprefixer: {},
            },
          }`,
        }
    },
    'main.tsx': {
        file: {
            contents: `
            import React from 'react'
import ReactDOM from 'react-dom/client'
import {NextUIProvider} from '@nextui-org/react'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
        <App />
    </NextUIProvider>
  </React.StrictMode>,
)

            `
        }
    }, 
    'App.tsx': {
        file: {
            contents: `
            function App() {
                return (
                  <main className="flex flex-col items-center justify-center min-h-screen space-y-20">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                      Vite, React, Tailwind minimal starter
                    </h1>
                    <a
                      href="https://github.com/moinulmoin/vite-react-tailwind-starter"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="text-xl hover:underline underline-offset-2">Star on GitHub</span>&nbsp;:)
                    </a>
                  </main>
                );
              }
              
              export default App;
            `
        }
    },
    'index.css': {
        file: {
            contents: `
            @tailwind base;
            @tailwind components;
            @tailwind utilities;
            `
        }
    },
    'index.html': {
        file: {
            contents: `
            <!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite + React + TS + Tailwind</title>
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/main.tsx"></script>
</body>

</html>`
        }
    }
};

// Call only once
export const webcontainerInstance = await WebContainer.boot();
await webcontainerInstance.mount(files);

export async function installDependencies() {
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn("npm", ["install"]);
  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  // Wait for install command to exit
  return installProcess.exit;
}
// let url: string | null = null

export async function startDevServer() {
  // Run `npm run start` to start the Express app
  const proccess = await webcontainerInstance.spawn("npm", ["run", "start"]);
  proccess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  console.log('start', proccess)
//   return webcontainerInstance

  // Wait for `server-ready` event
  webcontainerInstance.on('port', (port, _url) => {
    console.log('loaded')
      // url = _url
  });
  return webcontainerInstance
}
