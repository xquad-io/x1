/*
  simple pass through for now; augment later

  picks from `component-validation-fix` pass
  returns `component` type, with name / version (timestamp) etc

*/

async function run(req) {
  return {
    type: `component`,
    success: req.pipeline.stages[`component-validation-fix`].success,
    data: {
      version: `${Date.now()}`,
      code: req.pipeline.stages[`component-validation-fix`].data.code,
    },
  };
}

export {
  run,
};
