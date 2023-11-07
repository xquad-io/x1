import type { Tiktoken } from "@dqbd/tiktoken/lite";
// import wasm from "~/../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?raw";
import model from "@dqbd/tiktoken/encoders/cl100k_base.json";
import { z } from "@builder.io/qwik-city";
console.log(model)

let _tiktokenEncoder: Tiktoken | null = null;
// console.log('here', btoa(unescape(encodeURIComponent(wasm))).slice(0, 100));
// console.log(await loadTiktoken())
// const wasmEncoded = Buffer.from(wasm, 'binary').toString('base64')

export async function loadTiktoken() {
  if (_tiktokenEncoder) {
    return _tiktokenEncoder
  }
  const {Tiktoken} = await import('@dqbd/tiktoken/lite')
  // const wasmResponsePromise = fetch(wasmUrl)
  // await init((imports) => WebAssembly.instantiate(Buffer.from(wasm, 'utf8'), imports));
  _tiktokenEncoder = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  );
  return _tiktokenEncoder
}

export const LIBRARY_COMPONENTS_MAP: Record<string, Record<string, ({name: string, description: string})[]>> = {};

Object.entries(import.meta.glob<any[]>("../../library/components/**/*/dump.json", { import: "default",eager: true }))
  .forEach(([k, v]) => {
    const [framework, component] = k.split(`/`).slice(4)
    LIBRARY_COMPONENTS_MAP[framework] = LIBRARY_COMPONENTS_MAP[framework] || {}
    LIBRARY_COMPONENTS_MAP[framework][component] = v.map((e) => {
      return {
        ...e,
        name: e.name,
        description: e.description,
      };
    });
  })

  // fs.readFileSync(
  //   `./library/components/${query.framework}/${query.components}/metadata.json`,
  //   `utf-8`,
  // ),
export const IMPORTS_LISTS: Record<string, Record<string, {import: string[]}>> = {}

Object.entries(import.meta.glob<any>("../../library/components/**/*/metadata.json", { import: "default",eager: true }))
  .forEach(([k, v]) => {
    const [framework, component] = k.split(`/`).slice(4)
    IMPORTS_LISTS[framework] = IMPORTS_LISTS[framework] || {}
    IMPORTS_LISTS[framework][component] = v
  })

export function _titleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function createComponentsSchema(options: any){
    return z.object({
        new_component_name: z.string(),
        new_component_description: z.string().describe(
            `Write a description for the ${_titleCase(
            options.query.framework,
            )} component update design task based on the user query. Stick strictly to what the user wants in their request - do not go off track`,
        ),
        new_component_icons_elements: z.object({
            does_new_component_need_icons_elements: z.boolean(),
            if_so_what_new_component_icons_elements_are_needed: z.array(z.string().optional()),
        }),
        use_library_components: z.array(
            z.object({
            library_component_name: z.enum(LIBRARY_COMPONENTS_MAP[options.query.framework][
                options.query.components
                ].map((e) => e.name) as [string, ...string[]]).optional(),
            library_component_usage_reason: z.string().optional(),
            }),
        ),
    })
}

export function _randomUid(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const FRAMEWORKS_EXTENSION_MAP = {
  react: `tsx`,
  next: `tsx`,
  svelte: `svelte`,
};
