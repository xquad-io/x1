// @ts-nocheck
import { createOpenAI } from "~/utils/openai";
import { _titleCase, FRAMEWORKS_EXTENSION_MAP, loadTiktoken } from "~/utils/meta";
import type { RunOptions } from "~/types";

async function run(options: RunOptions, req: RequestEventBase) {
  const openAI = createOpenAI(req)
  const tiktokenEncoder = await loadTiktoken()

  const design_task = options.pipeline.stages["component-design-task"].data;
  const context = [
    {
      role: `system`,
      content:
        `You are an expert at writing ${_titleCase(
          options.query.framework,
        )} components.\n` +
        `Your task is to write a new ${_titleCase(
          options.query.framework,
        )} component for a web app, according to the provided task details.\n` +
        `The ${_titleCase(
          options.query.framework,
        )} component you write can make use of Tailwind classes for styling.\n` +
        `If you judge it is relevant to do so, you can use library components and icons.\n\n` +
        `You will write the full ${_titleCase(
          options.query.framework,
        )} component code, which should include all imports.` +
        `Your generated code will be directly written to a .${
          FRAMEWORKS_EXTENSION_MAP[options.query.framework]
        } ${_titleCase(
          options.query.framework,
        )} component file and used in production.`,
    },
    ...options.pipeline.stages[`component-design-context`].data,
    {
      role: `user`,
      content:
        `- COMPONENT NAME : ${design_task.name}\n\n` +
        `- COMPONENT DESCRIPTION :\n` +
        "```\n" +
        design_task.description.user +
        "\n```\n\n" +
        `- additional component suggestions :\n` +
        "```\n" +
        design_task.description.llm +
        "\n```\n\n\n" +
        `Write the full code for the new ${options.query.framework} web component, which uses Tailwind classes if needed (add tailwind dark: classes too if you can; backgrounds in dark: classes should be black), and optionally, library components and icons, based on the provided design task.\n` +
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
        `- Make sure you import provided components libraries and icons that are provided to you if you use them !\n` +
        `- Tailwind classes should be written directly in the elements class tags (or className in case of React). DO NOT WRITE ANY CSS OUTSIDE OF CLASSES. DO NOT USE ANY <style> IN THE CODE ! CLASSES STYLING ONLY !\n` +
        `- Do not use libraries or imports except what is provided in this task; otherwise it would crash the component because not installed. Do not import extra libraries besides what is provided above !\n` +
        `- DO NOT HAVE ANY DYNAMIC DATA OR DATA PROPS ! Components are meant to be working as is without supplying any variable to them when importing them ! Only write a component that render directly with placeholders as data, component not supplied with any dynamic data.\n` +
        `- DO NOT HAVE ANY DYNAMIC DATA OR DATA PROPS ! ` +
        `- Only write the code for the component; Do not write extra code to import it! The code will directly be stored in an individual ${_titleCase(
          options.query.framework,
        )} .${FRAMEWORKS_EXTENSION_MAP[options.query.framework]} file !\n` +
        `${
          options.query.framework != "svelte"
            ? "- Very important : Your component should be exported as default !\n"
            : ""
        }` +
        `Write the ${_titleCase(
          options.query.framework,
        )} component code as the creative genius and ${_titleCase(
          options.query.framework,
        )} component genius you are - with good ui formatting.\n`,
    },
  ];

  console.dir({
    context: context.map((e) => {
      return { role: e.role, content: e.content.slice(0, 200) + " ..." };
    }),
  });

  const context_prompt_tokens = tiktokenEncoder.encode(
    context.map((e) => e.content).join(""),
  ).length;
  console.log(
    `> total context prompt tokens (estimate) : ${context_prompt_tokens}`,
  );

  let completion = "";
  const stream = await openAI.chat.completions.create({
    model: req.env.get('OPENAI_MODEL')!,
    messages: context,
    stream: true,
  });
  const writer = options.stream.getWriter()
  for await (const part of stream) {
    process.stdout.write(part.choices[0]?.delta?.content || "");
    try {
      const chunk = part.choices[0]?.delta?.content || "";
      completion += chunk;
      writer.write(chunk);
    } catch (e) {
      false;
    }
  }

  writer.write(`\n`);
  writer.releaseLock()

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

  return {
    type: `component-code`,
    success: true,
    data: generated_code,
  };
}

export {
  run,
};
