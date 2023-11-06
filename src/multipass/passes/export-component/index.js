async function run(req) {
  if (!req.pipeline.stages[`component`].success) {
    return {
      type: `component-export`,
      success: false,
      data: {},
    };
  }

  const export_response = (await import(
    `./export_${req.query.framework}.js`
  )).export_component(req);
  return {
    type: `component-export`,
    success: true,
    data: export_response,
  };
}

export {
  run,
};
