import { LIBRARY_COMPONENTS_MAP } from "~/utils/meta";

async function run(query) {
  // query : { components : ['component_suggested_by_llm',...] , framework : 'react', library : 'nextui' }

  if (!query.components || !query.components.length) return [];

  // (LIBRARY_COMPONENTS_MAP[query.framework][query.library])
  // const components_library = require(
  //   `../../../../library/components/${query.framework}/${query.library}/dump.json`,
  // );

  return LIBRARY_COMPONENTS_MAP[query.framework][query.library].filter((e) => {
    return query.components
      .map((c) => c.toLowerCase())
      .includes(e.name.toLowerCase());
  });
}

export {
  run,
};
