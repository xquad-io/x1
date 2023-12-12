// @ts-nocheck
import { validate as validate_check } from "../validate-check-generated-component/index.js";
import {
  _titleCase,
  FRAMEWORKS_EXTENSION_MAP,
  loadTiktoken,
} from "~/utils/meta";
import { createOpenAI } from "~/utils/openai.js";
import type { RequestEventBase } from "@builder.io/qwik-city";
import type { RunOptions } from "~/types.js";

/*
  returns `component-validation-fix` type , which will be picked by post processing pass

  uses data from `validate-check-generated-component` pass
    if success:true in that pass, return `component-code` from the previous pass data.code
    if not, prompt llm to fix, then call `validate-check-generated-component` validate() method
      if rewritten component passes validation, return rewritten+validate code in `component-code`
      else, return success:false

*/

function error_badSyntax(query) {
  // query : { code , error_data : {error , code , code_with_line_numbers } }

  return (
    "## error type :\n" +
    query.error_data.error.toString() +
    "\n---\n" +
    "## error details :\n" +
    JSON.stringify(query.error_data.error, null, "\t") +
    "\n---\n" +
    "## part of the code where error was found :\n" +
    query.error_data.code_with_line_numbers
      .split(`\n`)
      .slice(
        Math.max(0, query.error_data.error.loc.line - 3),
        query.error_data.error.loc.line + 3
      )
      .join(`\n`)
  );
}
function error_missingImports(query) {
  // query : { code , error_data : { imports_lists {components,icons,code} , component_imports[] , component_used_nodes[]  } }

  return (
    "## error type :\n" +
    `Missing Imports : Some external components were used inside this component, but were not imported\n` +
    "\n---\n" +
    "## error details :\n" +
    `List of components that were used without being imported :\n` +
    query.error_data.component_used_nodes
      .filter(
        (_used_node) =>
          !query.error_data.component_imports
            .map((e) => e.imported)
            .flat()
            .includes(_used_node)
      )
      .map((e) => `* ${e}`)
      .join(`\n`) +
    "\n---\n" +
    "## suggested fixes :\n" +
    `either remove the elements, or rewrite them using standard elements that do not need to be imported from an external package, while keeping a similar UI formatting`
  );
}
function error_illegalImports(query) {
  // query : { code , error_data : { imports_lists , allowed_imports_prefixes[] , component_imports_checks{Component:boolean} , component_imports  } }

  // console.dir({ error_illegalImports : query},{depth:null})

  const illegal_imports = query.error_data.component_imports.filter((c) =>
    Object.keys(query.error_data.component_imports_checks)
      .filter((k) => !query.error_data.component_imports_checks[k])
      .includes(c.from)
  );

  return (
    "## error type :\n" +
    `Illegal Imports : Some external components/packages were used in this component, but should not be, either because :\n` +
    `- they use an external package that is not allowed to be installed in this project\n` +
    `- they refer to a local component which does not exist\n` +
    "\n---\n" +
    "## error details :\n" +
    illegal_imports
      .map((e, idx) => {
        const suffix = e.imported.filter((e) => e != `default`).length
          ? `\n  * was used to import elements : ${e.imported
              .filter((e) => e != "default")
              .join(" , ")}`
          : "";
        return (
          `* non-allowed import (${idx + 1}/${illegal_imports.length}) : ${
            e.from
          }` + suffix
        );
      })
      .join(`\n\n`) +
    "\n---\n" +
    "## suggested fixes :\n" +
    `- remove all the non-allowed imports, as well as the elements that were imported from them and that were used inside the code\n` +
    `- rewrite the code without the non-allowed imported elements.\n` +
    `- when you fix the non allowed-imports, DO NOT USE ANY EXTERNAL IMPORTS OR PACKAGES - THE PROJECT DISABLES ANY COMPONENT INSTALL OUTSIDE OF WHAT IS PROVIDED AND IT WILL CRASH IT\n`
  );
}

const ERRORS_MAP = {
  "bad-syntax": error_badSyntax,
  "missing-imports": error_missingImports,
  "illegal-imports": error_illegalImports,
};

async function run(options: RunOptions, req: RequestEventBase) {
  const openAI = createOpenAI(req);
  const tiktokenEncoder = await loadTiktoken(req);
  if (options.pipeline.stages[`component-validation-check`].success) {
    return {
      type: `component-validation-fix`,
      success: true,
      data: options.pipeline.stages[`component-validation-check`].data,
    };
  } else {
    // try to fix code by prompting

    const errors_context_entries = options.pipeline.stages[
      `component-validation-check`
    ].data.validation_errors.map((_validation_error, _error_idx) => {
      return {
        role: `user`,
        content:
          `# Component Error (${_error_idx + 1}/${
            options.pipeline.stages[`component-validation-check`].data
              .validation_errors.length
          })\n` +
          `---\n` +
          ERRORS_MAP[_validation_error.error]({
            error_data: _validation_error.data,
            code: options.pipeline.stages[`component-validation-check`].data
              .code,
          }),
      };
    });

    // req.pipeline.stages[`component-validation-check`].data.code

    /*
    console.dir({
      debug__validate_fix_generated_component : errors_context_entries
    },{depth:null})
    */

    const context = [
      {
        role: `system`,
        content:
          `You are an expert at writing ${_titleCase(
            options.query.framework
          )} components and fixing ${_titleCase(
            options.query.framework
          )} code with errors.\n` +
          `Your task is to fix the code of a ${_titleCase(
            options.query.framework
          )} component for a web app, according to the provided detected component errors.\n` +
          `Also, the ${_titleCase(
            options.query.framework
          )} component you write can make use of Tailwind classes for styling.\n` +
          `You will write the full ${_titleCase(
            options.query.framework
          )} component code, which should include all imports.` +
          `The fixed code you generate will be directly written to a .${
            FRAMEWORKS_EXTENSION_MAP[options.query.framework]
          } ${_titleCase(
            options.query.framework
          )} component file and used directly in production.`,
      },
      ...errors_context_entries,
      {
        role: `user`,
        content:
          `- Current ${_titleCase(
            options.query.framework
          )} component code which has errors :\n\n` +
          "```" +
          FRAMEWORKS_EXTENSION_MAP[options.query.framework] +
          "\n" +
          options.pipeline.stages[`component-validation-check`].data.code +
          "\n```\n\n" +
          `Rewrite the full code to fix and update the provided ${_titleCase(
            options.query.framework
          )} web component\n` +
          "The full code of the new " +
          _titleCase(options.query.framework) +
          " component that you write will be written directly to a ." +
          FRAMEWORKS_EXTENSION_MAP[options.query.framework] +
          " file inside the " +
          _titleCase(options.query.framework) +
          " project. Make sure all necessary imports are done, and that your full code is enclosed with ```" +
          FRAMEWORKS_EXTENSION_MAP[options.query.framework] +
          " blocks.\n" +
          "Answer with generated code only. DO NOT ADD ANY EXTRA TEXT DESCRIPTION OR COMMENTS BESIDES THE CODE. Your answer contains code only ! component code only !\n" +
          `Important :\n` +
          `- Make sure you import the components libraries` +
          // and icons
          `that are provided to you only and do not use components or imports that are not defined (if you use them) !\n` +
          `- Tailwind classes should be written directly in the elements class tags (or className in case of React). DO NOT WRITE ANY CSS OUTSIDE OF CLASSES\n` +
          `- Do not use libraries or imports except what is provided in this task; otherwise it would crash the component because not installed. Do not import extra libraries besides what is provided !\n` +
          `- Make sure "React" keyword is always defined and imported !\n` +
          `- Make sure you do not import any css file !\n` +
          `- Do not have ANY dynamic data! Components are meant to be working as is without supplying any variable to them when importing them ! Only write a component that render directly with placeholders as data, component not supplied with any dynamic data.\n` +
          `- Fix all errors according to the provided errors data\n` +
          `- You are allowed to remove any problematic part of the code and replace it\n` +
          `- Only write the code for the component; Do not write extra code to import it! The code will directly be stored in an individual ${_titleCase(
            options.query.framework
          )} .${FRAMEWORKS_EXTENSION_MAP[options.query.framework]} file !\n\n` +
          `${
            options.query.framework != "svelte"
              ? "- Very important : Your component should be exported as default !\n"
              : ""
          }` +
          `Fix and write the updated version of the ${_titleCase(
            options.query.framework
          )} component code as the creative genius and ${_titleCase(
            options.query.framework
          )} component genius you are.\n`,
      },
    ];

    console.dir({
      context: context.map((e) => {
        return { role: e.role, content: e.content.slice(0, 200) + " ..." };
      }),
    });

    const context_prompt_tokens = tiktokenEncoder.encode(
      context.map((e) => e.content).join("")
    ).length;
    console.log(
      `> total context prompt tokens (estimate) : ${context_prompt_tokens}`
    );

    let completion = "";
    const stream = await openAI.chat.completions.create({
      model: req.env.get("OPENAI_MODEL")!,
      messages: context,
      stream: true,
    });
    const writer = options.stream.getWriter();
    for await (const part of stream) {
      try {
        const chunk = part.choices[0]?.delta?.content || "";
        completion += chunk;
        writer.write(chunk);
      } catch (e) {
        false;
      }
    }

    writer.write(`\n`);
    writer.releaseLock();

    let generated_code = ``;
    let start = false;
    for (const l of completion.split("\n")) {
      let skip = false;
      if (
        [
          "```",
          ...Object.values(FRAMEWORKS_EXTENSION_MAP).map((e) => "```" + e),
        ].includes(l.toLowerCase().trim())
      ) {
        start = !start;
        skip = true;
      }
      if (start && !skip) generated_code += `${l}\n`;
    }
    generated_code = generated_code.trim();

    const validate_new_code_response = await validate_check({
      // framework: options.query.framework,
      // components: options.query.components,
      // icons: options.query.icons,
      code: generated_code,
    });

    console.dir(
      {
        debug__validate_fix__validate_new_code: {
          type: `component-validation-fix`,
          success: validate_new_code_response.success,
          data: validate_new_code_response.data,
        },
      },
      { depth: null }
    );

    return {
      type: `component-validation-fix`,
      success: validate_new_code_response.success,
      data: validate_new_code_response.data,
    };
  }

  return {
    type: `component-validation-fix`,
    success: false,
    data: {},
  };
}

export { run };
