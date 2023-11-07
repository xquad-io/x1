import {
  $,
  component$,
  NoSerialize,
  noSerialize,
  useOnWindow,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type DocumentHead, server$ } from "@builder.io/qwik-city";
import * as multipass from "../multipass/index";
import { WebContainer } from "@webcontainer/api";

const startMarker = "```tsx";
const endMarker = "```";

const generateDescription = server$(async function* ({
  description,
}: {
  description: string;
}) {
  const { writable, readable } = new TransformStream<string, string>();
  try {
    multipass
      .preset(
        {
          stream: writable,
          preset: `componentNew_description`,
          query: {
            description: description,
            framework: "react",
            components: "nextui",
            // icons: req.body.icons,
          },
        },
        this
      )
      .then(() => writable.close());
  } catch {
    true;
  }

  // this.signal.addEventListener("abort", () => {
  //   writable.close();
  // });

  const reader = readable.getReader();
  try {
    while (!this.signal.aborted) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    !reader.closed && reader.releaseLock();
    // writable.getWriter().releaseLock()
  }

  // console.log('here')

  // console.log(wasmUrl)
  //     const duplexStream = new PassThrough();
  //     duplexStream.pipe(res);
  //     const generated = await multipass.preset({
  //     stream: duplexStream,
  //     preset: `componentNew_description`,
  //     query: {
  //         description: req.body.description,
  //         framework: req.body.framework,
  //         components: req.body.components,
  //         icons: req.body.icons,
  //     },
  //     });
});

export default component$(() => {
  const urlSignal = useSignal<string>();
  const text = useSignal("");
  const wcInstance = useSignal<NoSerialize<WebContainer>>();
  const code = useSignal("");

  // console.log('here', generateDescription())

  useVisibleTask$(async () => {
    console.log("here");
    const { installDependencies, startDevServer } = await import("~/wc");
    const exitCode = await installDependencies();
    if (exitCode !== 0) {
      throw new Error("Installation failed");
    }
    const webcontainerInstance = await startDevServer();
    wcInstance.value = noSerialize(webcontainerInstance);

    webcontainerInstance.on("server-ready", (port, url) => {
      urlSignal.value = url;
      wcInstance.value?.fs.writeFile("App.tsx", code.value);
    });
  });
  return (
    <>
      <form
        preventdefault:submit
        onSubmit$={async (e) => {
          console.log(e?.target.description.value);
          const response = await generateDescription({
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
              // wcInstance.value?.fs.writeFile("App.tsx", code.value);
            }
          }
          wcInstance.value?.fs.writeFile("App.tsx", code.value);
        }}
      >
        <input name="description" placeholder="description" />
        <button type="submit">submit</button>
      </form>
      {urlSignal.value ? (
        <iframe style={{ width: "100%" }} src={urlSignal.value}></iframe>
      ) : (
        "loading baby"
      )}

      <code style={{whiteSpace: 'pre-wrap'}}>{code.value}</code>
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
