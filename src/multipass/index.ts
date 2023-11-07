// @ts-nocheck
import type { ExecutionPass, Pipeline, RunFunction} from "~/types.js";
import PRESETS_MAP from "./presets/index.js";
import type { RequestEventBase } from "@builder.io/qwik-city";

const multipasses = Object.fromEntries(
  Object.entries(import.meta.glob<RunFunction>("./passes/**/index.{js,ts}", { import: "run",eager: true }))
    .map(([k, v]) => [k.split("/")[2], v]),
);
console.log(multipasses);

async function run(options, req: RequestEventBase) {
  /*
    req : {
      stream ,
      query {text?,framework,components,icons},
      passes ,
      preset? //for log only
    }
  */

  console.dir({
    module: `multipass/run`,
    status: `starting`,
    query: options.query,
    preset: options.preset ? options.preset : false,
    passes: options.passes,
  });

  const pipeline: Pipeline = {
    passes: {},
    stages: {},
  };
  for (const [index, pass] of options.passes.entries()) {
    console.log(pass)
    const response = await multipasses[pass]({
      stream: options.stream,
      query: options.query,
      pipeline: pipeline,
    }, req);
    const execution_pass: ExecutionPass = {
      index,
      response,
    };
    pipeline.passes[pass] = execution_pass;
    pipeline.stages[response.type] = {
      success: response.success,
      data: response.data,
    };
  }

  console.dir({
    module: `multipass/run`,
    status: `done`,
  });

  /*
  console.log(
    `*********************** multipass debug *************************`,
  );
  console.dir({ execution_multipass }, { depth: null });
  require("fs").writeFileSync(
    `_multipass_output_example_${Date.now()}.json`,
    JSON.stringify(execution_multipass, null, "\t"),
  );
  */
}

async function preset(options, req: RequestEventBase) {
  /* req : {stream,preset``,query{...}} */
  console.dir({
    module: `multipass/preset`,
    preset: {
      name: options.preset,
      description: PRESETS_MAP[options.preset].description,
    },
  });
  return await run({
    stream: options.stream,
    query: options.query,
    passes: PRESETS_MAP[options.preset].passes,
  }, req);
}

export {
  preset,
  run,
};
