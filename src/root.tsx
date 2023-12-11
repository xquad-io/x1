import "virtual:uno.css";
import "./global.css";
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
        {/* This is conflicting with unocss, any solution */}
        <script src="https://cdn.tailwindcss.com"></script>
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
        <RouterHead />
      </head>
      <body lang="en" class="antialiased text-white select-none">
        <ServiceWorkerRegister />
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
