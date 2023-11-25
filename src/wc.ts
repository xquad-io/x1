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
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
        },
        "devDependencies": {
          "@vitejs/plugin-react": "^4.0.3",
          "autoprefixer": "^10.4.16",
          "postcss": "^8.4.31",
          "tailwindcss": "^3.3.3",
          "framer-motion": "^10.16.2",
          "@nextui-org/react": "^2.2.4",
          "vite": "^4.4.5"
        }
      }
      `,
    },
  },
  "vite.config.ts": {
    file: {
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
        `,
    },
  },
  "tailwind.config.js": {
    file: {
      contents: `
import {nextui} from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
module.exports = {
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
        `,
    },
  },
  "postcss.config.js": {
    file: {
      contents: `
        export default {
            plugins: {
              tailwindcss: {},
              autoprefixer: {},
            },
          }`,
    },
  },
  "main.tsx": {
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

            `,
    },
  },
  "App.tsx": {
    file: {
      contents: `
import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';

export default function DashboardComponent_CJWNM() {
  return (
    <div className="dark:bg-black flex flex-col gap-8 p-8 max-w-7xl m-auto">
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-lg font-semibold">Users</CardHeader>
          <CardBody className="dark:text-white text-3xl">1450</CardBody>
          <CardFooter>
            <Button color="primary" auto className="m-auto">
              More Details
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="text-lg font-semibold">Sales</CardHeader>
          <CardBody className="dark:text-white text-3xl">$49083</CardBody>
          <CardFooter>
            <Button color="primary" auto className="m-auto">
              More Details
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="text-lg font-semibold">Profit</CardHeader>
          <CardBody className="dark:text-white text-3xl">$42983</CardBody>
          <CardFooter>
            <Button color="primary" auto className="m-auto">
              More Details
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <span className="text-lg font-semibold">Revenue</span>
            <Button
              color="primary"
              auto
              onClick={() => console.log('Refreshed')}
            >
              Refresh
            </Button>
          </CardHeader>
          <CardBody>
            <Progress aria-label="Loading.." value={75} color="primary" />
          </CardBody>
          <CardFooter>
            <span className="mb-2 text-lg">75%</span>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <span className="text-lg font-semibold">ROI</span>
            <Button
              color="primary"
              auto
              onClick={() => console.log('Refreshed')}
            >
              Refresh
            </Button>
          </CardHeader>
          <CardBody>
            <Progress aria-label="Loading.." value={90} color="green" />
          </CardBody>
          <CardFooter>
            <span className="mb-2 text-lg">90%</span>
          </CardFooter>
        </Card>
      </div>
      <Card fluid>
        <CardHeader className="text-lg font-semibold">Top Products</CardHeader>
        <Table aria-label="Top Products">
          <TableHeader>
            <TableColumn>Product</TableColumn>
            <TableColumn>Sales</TableColumn>
            <TableColumn>Stock</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>iPhone 12 Pro Max</TableCell>
              <TableCell>1023</TableCell>
              <TableCell>50</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Galaxy S21 Ultra</TableCell>
              <TableCell>789</TableCell>
              <TableCell>40</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PlayStation 5</TableCell>
              <TableCell>567</TableCell>
              <TableCell>0</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <CardFooter>
          <Button color="primary" auto className="m-auto">
            More Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
            `,
    },
  },
  "index.css": {
    file: {
      contents: `
            @tailwind base;
            @tailwind components;
            @tailwind utilities;
            `,
    },
  },
  "index.html": {
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

</html>`,
    },
  },
};

// Call only once
export let webcontainerInstance: WebContainer;

export async function installDependencies(stream: WritableStream) {
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn("pnpm", ["install"]);
  installProcess.output.pipeTo(stream);
  // Wait for install command to exit
  return installProcess.exit;
}
// let url: string | null = null

export async function startDevServer() {
  const proccess = await webcontainerInstance.spawn("pnpm", ["run", "start"]);
  proccess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  return webcontainerInstance;
}
