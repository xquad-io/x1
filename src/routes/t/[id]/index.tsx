import type { Signal } from "@builder.io/qwik";
import {
  $,
  component$,
  useSignal,
  useStyles$,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  DocumentHead,
  routeLoader$,
  server$,
  useLocation,
} from "@builder.io/qwik-city";
// import "highlight.js/styles/dark.min.css";
import hljs from "highlight.js";
import tsx from "highlight.js/lib/languages/typescript";
import { generate, iterate } from "~/services";
import { addProject, forkProject, getProject, updateProject } from "~/utils/kv";
import "~/entry.ssr";
import Loading from "~/components/Loading";
import EnterIcon from "~/media/icons/enter.png?jsx";
import darkMin from "highlight.js/styles/dark.min.css?inline";
import Preloads from "~/components/preloads";

hljs.registerLanguage("typescript", tsx);

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
    defined: !!project,
    isAuthor: req.cookie.get("uuid")!.value === project?.author,
  };
});

export const head: DocumentHead = ({ resolveValue, params }) => {
  const projectInfo = resolveValue(useGetProjectInfo);
  return {
    title: `${projectInfo.description} | X1`,
    meta: [
      {
        name: "description",
        content: projectInfo.description,
      },
      {
        property: "og:title",
        content: `${projectInfo.description} | X1`,
      },
      {
        property: "og:description",
        content: projectInfo.description,
      },
      {
        name: "id",
        content: params.id,
      },
    ],
  };
};
export default component$(() => {
  useStyles$(darkMin);
  const location = useLocation();
  const query = location.url.searchParams.get("q")!;
  const currentTab = useSignal<"result" | "code">("result");

  const projectInfo = useGetProjectInfo();
  const text = useSignal("");
  const prevDescription = useSignal(
    projectInfo.value.isAuthor
      ? projectInfo.value.lastUpdate
      : projectInfo.value.description
  );
  const code = useSignal(projectInfo.value.code ?? "");
  const isFinal = useSignal(!!projectInfo.value.code || false);
  const loading = useSignal(false);
  const isIterate = useSignal<boolean>(!!projectInfo.value.code || false);

  const shareText = useSignal("Share");
  const startDotsLoading = $((clear?: boolean) => {
    let i = 0;
    let alreadyStopped = false;
    const prevCode = code.value;
    const loadingComment = "// loading";
    code.value = loadingComment;
    const interval = setInterval(() => {
      if (alreadyStopped) {
        return;
      }
      i++;
      if (i === 4) {
        i = 0;
        code.value = loadingComment;
        return;
      }
      code.value += ".";
    }, 300);

    return () => {
      if (alreadyStopped) {
        return;
      }
      alreadyStopped = true;
      clearInterval(interval);
      code.value = clear ? "" : prevCode;
    };
  });

  const iterateHandler = $(async (e: any) => {
    const value = e?.target.prompt.value;
    if (loading.value) {
      return;
    }
    isFinal.value = false;

    loading.value = true;
    const prevCode = code.value;
    const prevDesc = prevDescription.value;
    prevDescription.value = value;
    const stopDotsLoading = await startDotsLoading(true);
    const response = await iterate({
      description: value,
      component: {
        description: prevDesc ?? "",
        code: prevCode,
        name: "App",
      },
    });
    prevDescription.value = value;
    // code.value = "";

    for await (const value of response) {
      text.value += value;

      const startIndex = text.value.lastIndexOf(startMarker);
      const endIndex = text.value.lastIndexOf(endMarker);

      if (startIndex !== -1) {
        stopDotsLoading();
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

    await server$(async function () {
      await updateProject(location.params.id, value, code.value);
    })();
    loading.value = true;
    isFinal.value = true;
  });
  const generateHandler = $(async () => {
    if (loading.value) {
      return;
    }
    // removeing $ from this function would cause error, should be reported to qwikjs
    loading.value = true;
    isFinal.value = false;
    const stopDotsLoading = await startDotsLoading();
    // @ts-ignore
    window.root.innerHTML = "";
    const response = await generate({
      description: query,
    });
    for await (const value of response) {
      text.value += value;

      const startIndex = text.value.lastIndexOf(startMarker);
      const endIndex = text.value.lastIndexOf(endMarker);

      if (startIndex !== -1) {
        stopDotsLoading();
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
    prevDescription.value = query;
    await server$(async function () {
      await addProject(location.params.id, {
        description: prevDescription.value!,
        lastUpdate: prevDescription.value!,
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
  useTask$(({ track }) => {
    track(loading);

    if (loading.value) {
      currentTab.value = "code";
    } else {
      currentTab.value = "result";
    }
  });

  useVisibleTask$(function () {
    window.loading = loading;

    window.history.pushState({}, document.title, window.location.pathname);
    if (projectInfo.value.defined) {
      return;
    }
    generateHandler();
  });

  return (
    <main class="clip-pa font-sora w-full h-full max-w-[1263px] px-5">
      <Preloads />
      <h2 class="text-1xl font-italic">
        <span class="font-bold">{">"}</span>{" "}
        {projectInfo.value.description ?? query}
      </h2>
      {projectInfo.value.isAuthor || !projectInfo.value.defined ? (
        <form
          preventdefault:submit
          onSubmit$={iterateHandler}
          class="font-medium border bg-stone-50 self-center flex max-w-full items-center justify-between gap-5 mt-8 pl-7 pr-5 py-3.5 rounded-[60px] border-solid border-neutral-400 max-md:flex-wrap max-md:px-5"
        >
          <input
            name="prompt"
            value={prevDescription.value || query}
            placeholder="Edit..."
            class="border-none text-black placeholder:text-neutral-400 grow shrink basis-auto my-auto focus:outline-none"
          />
          {loading.value ? (
            <Loading />
          ) : (
            <button type="submit" class="border-none bg-white">
              <EnterIcon class="aspect-square object-contain object-center w-8 overflow-hidden self-stretch shrink-0 max-w-full" />
            </button>
          )}{" "}
        </form>
      ) : null}
      <div class="my-4 flex justify-between border-b border-gray-200 dark:border-gray-700">
        <ul
          class="flex flex-wrap -mb-px text-sm font-medium text-center"
          id="default-tab"
          data-tabs-toggle="#default-tab-content"
          role="tablist"
        >
          <li class="me-2" role="presentation">
            <button
              class={[
                "inline-block p-4 rounded-t-lg ",
                currentTab.value === "result"
                  ? "border-b-2"
                  : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
              ]}
              id="profile-tab"
              data-tabs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
              onClick$={() => (currentTab.value = "result")}
            >
              Result
            </button>
          </li>
          <li class="me-2" role="presentation">
            <button
              class={[
                "inline-block p-4 rounded-t-lg ",
                currentTab.value === "code"
                  ? "border-b-2"
                  : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
              ]}
              id="dashboard-tab"
              data-tabs-target="#dashboard"
              type="button"
              role="tab"
              aria-controls="dashboard"
              aria-selected="false"
              onClick$={() => (currentTab.value = "code")}
            >
              Code
            </button>
          </li>
        </ul>
        <ul class="flex flex-wrap items-center -mb-px text-sm font-medium text-center">
          <li class="me-2 ">
            <button
              onClick$={$(() => {
                window.navigator.clipboard.writeText(location.url.href);
                shareText.value = "Copied!";
                setTimeout(() => {
                  shareText.value = "Share";
                }, 1500);
              })}
              class="p-4"
            >
              {shareText.value}
            </button>
          </li>
          <li class="me-2">
            <button class="p-4" onClick$={forkHandler}>
              Fork
            </button>
          </li>

          <li class="me-2">
            <a
              href="/"
              class="p-4 bg-#00ff68 px-4 text-#1C413C flex items-center cursor-pointer transition duration-300 active:duration-100 relative rounded clip-path-polygon-default h-10"
            >
              New
            </a>
          </li>
        </ul>
      </div>
      <div class="relative min-w-full h-70%">
        <div
          class={[
            `min-w-full min-h-full max-h-full overflow-y-auto absolute rounded-lg bg-gray-50 dark:bg-gray-800`,
            currentTab.value === "result" ? "" : "-left-1000%",
            loading.value ? "overflow-hidden" : "",
          ]}
          role="tabpanel"
        >
          {loading.value ? (
            <div class="bg-#00ff68 absolute z-100 w-full h-full flex justify-center items-center">
              <div class="load-3 -mt-4">
                <div class="line w-1rem! h-1rem!"></div>
                <div class="line w-1rem! h-1rem!"></div>
                <div class="line w-1rem! h-1rem!"></div>
              </div>
            </div>
          ) : null}
          <div id="root" class="min-w-full  h-full"></div>
          {code.value && isFinal.value ? (
            <script
              type="module"
              dangerouslySetInnerHTML={`
            import build from "https://esm.sh/build";
            import * as React from 'react'  
            import { NextUIProvider } from '@nextui-org/react'
            import { createRoot } from 'react-dom/client'

            try {
              const ret = await build({
                dependencies: {
                  "react": "18.2.0",
                  // "react-dom": "18.2.0",
                  "@nextui-org/react": "^2.2.4",
                  "framer-motion": "^10.16.2"
                },
                code: ${JSON.stringify(code.value)}
                ,
              });
              const { default: App } = await import(ret.url)

              createRoot(window.root).render(React.createElement(NextUIProvider, null, React.createElement(App, {})))
            } catch (e) {
              console.log(e)
              window.root.innerHTML = e?.toString() + '\\n' + e?.stack
            } finally {
              window.loading.value = false
            }
            

          `}
            />
          ) : null}
        </div>
        <div
          class={[
            `border min-w-full min-h-full max-h-full overflow-y-auto absolute p-4 rounded-lg bg-black`,
            currentTab.value === "code" ? "" : "-left-1000%",
          ]}
          role="tabpanel"
        >
          <code
            class="select-text language-ts min-w-full min-h-5rem"
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={
              hljs.highlight(
                code.value,

                { language: "tsx" }
              ).value
            }
          ></code>
        </div>
      </div>
      {/* <script src="/prism.js" /> */}
    </main>
  );
});
