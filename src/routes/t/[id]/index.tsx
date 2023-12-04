import type { Signal } from "@builder.io/qwik";
import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  server$,
  type DocumentHead,
  useLocation,
  routeLoader$,
  useNavigate,
} from "@builder.io/qwik-city";
import { generate, iterate } from "~/services";
import { addProject, forkProject, getProject, updateProject } from "~/utils/kv";
import "~/entry.ssr";

const startMarker = "```tsx";
const endMarker = "```";

declare global {
  interface Window {
    loading: Signal<boolean>;
  }
}
export const useGetProjectInfo = routeLoader$(async (req) => {
  const project = await getProject(req.params.id);
  return {
    ...project,
    isAuthor: req.cookie.get("uuid")!.value === project?.author,
  };
});

export default component$(() => {
  const projectInfo = useGetProjectInfo();
  const urlSignal = useSignal<string>();
  const text = useSignal("");
  const prevDescription = useSignal(projectInfo.value.description ?? "");
  const terminalOutput = useSignal("");
  const code = useSignal(projectInfo.value.code ?? "");
  const isFinal = useSignal(!!projectInfo.value.code || false);
  const loading = useSignal(false);
  const isIterate = useSignal<boolean>(!!projectInfo.value.code || false);

  const shareText = useSignal("Share");

  const location = useLocation();
  useVisibleTask$(async () => {
    window.loading = loading;
  });

  const iterateHandler = $(async (e: any) => {
    isFinal.value = false;
    loading.value = true;
    const response = await iterate({
      description: e?.target.description.value,
      component: {
        description: prevDescription.value,
        code: code.value,
        name: "App",
      },
    });

    for await (const value of response) {
      text.value += value;

      const startIndex = text.value.lastIndexOf(startMarker);
      const endIndex = text.value.lastIndexOf(endMarker);

      if (startIndex !== -1) {
        code.value = text.value
          .slice(
            startIndex + startMarker.length,
            endIndex === -1 || endIndex === startIndex
              ? text.value.length - 1
              : endIndex
          )
          .trim();
      }
    }

    server$(function () {
      updateProject(location.params.id, code.value);
    })();
    loading.value = true;
    isFinal.value = true;
  });
  const generateHandler = $(async (e: any) => {
    // removeing $ from this function would cause error, should be reported to qwikjs
    loading.value = true;
    code.value = "";
    isFinal.value = false;
    // @ts-ignore
    window.root.innerHTML = "";
    const response = await generate({
      description: e?.target.description.value,
    });
    for await (const value of response) {
      text.value += value;

      const startIndex = text.value.lastIndexOf(startMarker);
      const endIndex = text.value.lastIndexOf(endMarker);

      if (startIndex !== -1) {
        code.value = text.value
          .slice(
            startIndex + startMarker.length,
            endIndex === -1 || endIndex === startIndex
              ? text.value.length - 1
              : endIndex
          )
          .trim();
      }
    }
    prevDescription.value = e?.target.description.value;
    server$(function () {
      addProject(location.params.id, {
        description: prevDescription.value,
        code: code.value,
        author: this.cookie.get("uuid")!.value,
      });
    })();

    isFinal.value = true;
    isIterate.value = true;
  });
  const forkHandler = $(async () => {
    const url = await server$(async function () {
      return `/t/${await forkProject(
        location.params.id,
        this.cookie.get("uuid")!.value
      )}`;
    })();
    window.location.replace(url);
  });
  return (
    <>
      <div class="bg-black text-white p-10 space-y-6 shadow-lg">
        <a
          href="/"
          class="text-4xl underline font-extrabold mb-6 text-gray-100"
        >
          X1
        </a>
        <h2 class="text-2xl font-semibold mb-6 text-gray-300">
          You do not need designers for your application
        </h2>
        {projectInfo.value.isAuthor ? (
          <form
            class="flex items-center space-x-3 border-b-2 border-gray-800 py-3"
            preventdefault:submit
            onSubmit$={isIterate.value ? iterateHandler : generateHandler}
          >
            <input
              name="description"
              class="flex h-10 border border-input px-3 text-sm ring-offset  border-0 bg-transparent text-sm font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full !bg-gray-800 text-white rounded-lg border-none placeholder-gray-500"
              placeholder="A SaaS admin dashboard"
              value={prevDescription.value}
              type="text"
            />
            <button
              class="h-10 inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 bg-gray-200 hover:bg-gray-300 text-black rounded-lg px-5"
              type="submit"
              disabled={loading.value}
            >
              {loading.value
                ? "Loading..."
                : isIterate.value
                ? "Iterate"
                : "Submit"}
            </button>
          </form>
        ) : null}
        <div class="flex gap-10px">
          <button
            onClick$={$(() => {
              window.navigator.clipboard.writeText(location.url.href);
              shareText.value = "Copied!";
              setTimeout(() => {
                shareText.value = "Share";
              }, 1500);
            })}
            class="h-10 inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 bg-gray-200 hover:bg-gray-300 text-black rounded-lg px-5"
          >
            {shareText.value}
          </button>
          <button
            onClick$={forkHandler}
            class="h-10 inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 bg-gray-200 hover:bg-gray-300 text-black rounded-lg px-5"
          >
            Fork
          </button>
        </div>

        <div
          class="w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden shadow-inner"
          id="c75j79mcgyg"
        >
          <div id="root" class="w-full overflow-scroll h-full"></div>
          {code.value && isFinal.value ? (
            <script
              type="module"
              dangerouslySetInnerHTML={`
            import build from "https://esm.sh/build";
            import * as React from 'react'  
            import { createRoot } from 'react-dom/client'

            try {
              const ret = await build({
                dependencies: {
                  "react": "18.2.0",
                  // "react-dom": "18.2.0",
                  "@nextui-org/react": "^2.2.4",
                  "framer-motion": "^10.16.2"
                },
                code: \`
                  ${code.value}
                \`,
              });
              const { default: App } = await import(ret.url)

              createRoot(window.root).render(React.createElement(App, {}))
            } catch (e) {
              console.log(e)
              window.root.innerHTML = e?.toString() + '\\n' + e?.stack
            } finally {
              window.loading.value = false
            }
            

          `}
            />
          ) : null}
          <div
            style={{ display: urlSignal.value ? "none" : undefined }}
            class="flex flex-col items-center justify-center border-4 border-red-500 rounded-lg p-4"
          >
            <span>
              Loading webcontainers for results, meanwhile write your
              description and submit baby...
            </span>

            <code style={{ whiteSpace: "pre-wrap" }}>
              {terminalOutput.value}
            </code>
          </div>
        </div>
        <div class="w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden shadow-inner">
          <pre class="w-full h-full text-gray-400 p-6 overflow-scroll">
            <code style={{ whiteSpace: "pre-wrap" }}>{code.value}</code>
          </pre>
        </div>
        <p class="text-right mt-6 text-gray-500">Built by Xquad</p>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
