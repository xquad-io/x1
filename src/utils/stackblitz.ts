import sdk from '@stackblitz/sdk'
import type { Project } from '@stackblitz/sdk'

const reactDefaults: Project = {
    template: "node",
    title: 'X1 Project',
    description: 'A basic Node.js project',
    files: {
        'App.tsx': '',
        'main.tsx': `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

        `,
        'index.html': `
        <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>

        `,
        'package.json': JSON.stringify({
            "name": "vite-react-typescript-starter",
            "private": true,
            "version": "0.0.0",
            "type": "module",
            "scripts": {
              "dev": "vite",
              "build": "tsc && vite build",
              "preview": "vite preview"
            },
            "dependencies": {
              "react": "^18.2.0",
              "react-dom": "^18.2.0"
            },
            "devDependencies": {
              "@types/react": "^18.2.43",
              "@types/react-dom": "^18.2.17",
              "@vitejs/plugin-react": "^4.2.1",
              "typescript": "^5.2.2",
              "vite": "^5.0.8"
            }
          }, null, 2),
          'tsconfig.json': JSON.stringify({
            "compilerOptions": {
              "target": "ES2020",
              "useDefineForClassFields": true,
              "lib": ["ES2020", "DOM", "DOM.Iterable"],
              "module": "ESNext",
              "skipLibCheck": true,
          
              /* Bundler mode */
              "moduleResolution": "bundler",
              "allowImportingTsExtensions": true,
              "resolveJsonModule": true,
              "isolatedModules": true,
              "noEmit": true,
              "jsx": "react-jsx",
          
              /* Linting */
              "strict": true,
              "noUnusedLocals": true,
              "noUnusedParameters": true,
              "noFallthroughCasesInSwitch": true
            },
            "include": ["src"],
            "references": [{ "path": "./tsconfig.node.json" }]
          }
          , null, 2), 
          'tsconfig.node.json': JSON.stringify({
            "compilerOptions": {
              "composite": true,
              "skipLibCheck": true,
              "module": "ESNext",
              "moduleResolution": "bundler",
              "allowSyntheticDefaultImports": true
            },
            "include": ["vite.config.ts"]
          }
          ,null, 2),
          'vite.config.ts': `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
`
          
    }
}


export function openProjectInNewTab(id: string, appContent: string) {
    sdk.openProject({...reactDefaults, title: `${id} | X1`, files: {...reactDefaults.files, 'App.tsx': appContent}}, {newWindow: true})
}