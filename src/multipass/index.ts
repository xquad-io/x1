import PRESETS_MAP from "./presets/index.js";

const multipasses = Object.fromEntries(
  Object.entries(import.meta.glob("./passes/**/index.js", { import: "run",eager: true }))
    .map(([k, v]) => [k.split("/")[2], v]),
);
console.log(multipasses);

async function run(options) {
  /*
    req : {
      stream ,
      query {text?,framework,components,icons},
      passes ,
      preset? //for log only
    }
  */

  /* console.dir({
    module: `multipass/run`,
    status: `starting`,
    query: options.query,
    preset: options.preset ? options.preset : false,
    passes: options.passes,
  });

  let execution_multipass = {
    passes: {},
    stages: {},
  };
  for (let [index, pass] of options.passes.entries()) {
    console.log(`> pass ${index}/${options.passes.length - 1}`);
    const response = await require(`./passes/${pass}/index.js`).run({
      stream: options.stream,
      query: options.query,
      pipeline: execution_multipass,
    });
    const execution_pass = {
      index,
      response,
    };
    execution_multipass.passes[pass] = execution_pass;
    execution_multipass.stages[response.type] = {
      success: response.success,
      data: response.data,
    };
  }

  console.dir({
    module: `multipass/run`,
    status: `done`,
  }); */

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

async function preset(options) {
  /* req : {stream,preset``,query{...}} */
  /* console.dir({
    module: `multipass/preset`,
    preset: {
      name: options.preset,
      description: PRESETS_MAP[options.preset].description,
    },
  });
  return await run({
    stream: options.stream,
    preset: {
      name: options.preset,
      description: PRESETS_MAP[options.preset].description,
    }, // <- for log only
    query: options.query,
    passes: PRESETS_MAP[options.preset].passes,
  }); */
}

export default {
  preset,
  run,
};
