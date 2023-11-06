import { $, component$, useOnWindow, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { server$, type DocumentHead } from "@builder.io/qwik-city";
import * as multipass from '../multipass/index'

const generateDescription = server$(async function* () {
    console.log('here')
    const {writable, readable} = new TransformStream<string, string>()

    console.log(multipass)
    multipass.preset({
      stream: writable,
      preset: `componentNew_description`,
      query: {
          description: "generate a small dashboard component",
          framework: 'react',
          components: 'nextui',
          // icons: req.body.icons,
      },
    },this);

    const reader = readable.getReader()
    try {
        while (true) {
            const {done, value} = await reader.read()
            if (done) return
            yield value
        }
    } finally {
      reader.releaseLock()
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

})



export default component$(() => {
  const urlSignal = useSignal<string>();
  // console.log('here', generateDescription())

  useVisibleTask$(async () => {
    console.log('here')
    const {installDependencies, startDevServer} = await import('~/wc')
    const exitCode = await installDependencies();
    if (exitCode !== 0) {
      throw new Error("Installation failed");
    }
    const webcontainerInstance = await startDevServer()
    console.log(webcontainerInstance)

    webcontainerInstance.on('server-ready', (port, url) => {
      console.log('here', url)
      urlSignal.value = url
    });
  })
  return (
    <>
      <form preventdefault:submit onSubmit$={async (e) => {
        console.log(SharedArrayBuffer)
        const response = await generateDescription()
        for await (const value of response) {
          console.log(value)
        }
//         setInterval(() => {
// console.log(response)

//         }, 30) 

      }}>
        <input name="description" placeholder="description"  />
        <button type="submit">submit</button>
      </form>
      {urlSignal.value ?<iframe style={{width: '100%'}} src={urlSignal.value}></iframe>:'loading baby' } 

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
