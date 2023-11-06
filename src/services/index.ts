import { server$ } from "@builder.io/qwik-city";
// import * as multipass from '../multipass/index'

console.log('here')
export const generateDescription = server$(async function* () {
    console.log('here')
    const {writable, readable} = new TransformStream<string, string>()
    writable.getWriter().write('here')
    setInterval(() => {
        if (!writable.getWriter().closed) writable.getWriter().write('here')
        
    }, 20)
    setInterval(() => {
        writable.close()
    }, 200)
    

    try {
        while (true) {
            const {done, value} = await readable.getReader().read()
            console.log('here 2', value)
            if (done) return
            yield value
        }
    } finally {
        readable.getReader().releaseLock()
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
