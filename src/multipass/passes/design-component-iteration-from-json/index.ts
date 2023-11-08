// @ts-nocheck
import { LIBRARY_COMPONENTS_MAP, _titleCase, createComponentsSchema } from "~/utils/meta";
import zodToJsonSchema from "zod-to-json-schema";
import type { RequestEventBase } from "@builder.io/qwik-city";
import { createOpenAI } from "~/utils/openai";
import type { ChatCompletionMessageParam } from "openai/resources";
import type { RunOptions } from "~/types";

async function run(options: RunOptions, req: RequestEventBase) {

  const openAI = createOpenAI(req)
  const json_query =
    typeof options.query.json === "string"
      ? options.query.json
      : JSON.stringify(options.query.json, null, `\t`);

  const components_schema = createComponentsSchema(options)

  const context: ChatCompletionMessageParam[] = [
    {
      role: `system`,
      content:
        `Your task is to modify a ${_titleCase(
          options.query.framework,
        )} component for a web app, according to the user's request.\n` +
        `If you judge it is relevant to do so, you can specify pre-made library components to use in the component update.\n` +
        `You can also specify the use of icons if you see that the user's update request requires it.`,
    },
    {
      role: `user`,
      content:
        "Multiple library components can be used while creating a new component update in order to help you do a better design job, faster.\n\nAVAILABLE LIBRARY COMPONENTS:\n```\n" +
        LIBRARY_COMPONENTS_MAP[options.query.framework][options.query.components]
          .map((e) => {
            return `${e.name} : ${e.description};`;
          })
          .join("\n") +
        "\n```",
    },
    {
      role: `user`,
      content:
        `- Component name : ${options.query.component?.name}\n` +
        "- Component description : `" +
        options.query.component?.description +
        "`\n" +
        "- New component updates query : \n```json\n" +
        json_query +
        "\n```\n\n- The provided user query is an object on which the new web component update is based\n" +
        "- Look at all the provided data, and come up with an updated web component version that would be relevant for the data\n" +
        "- Your task is to be highly creative, analytical and insightful, in order to design an updated version of the described web component that is relevant to the newly provided data\n" +
        "- Take a deep breathe, and think of a new version of the described web component that would be relevant to provided object\n" +
        `- Design the new version of the ${options.query.framework} web component task for the user as the creative genius you are`,
    },
  ];

  let completion = "";
  const stream = await openAI.chat.completions.create({
    model: req.env.get('OPENAI_MODEL')!,
    messages: context,
    functions: [
      {
        name: `design_updated_component_api`,
        description: `generate the required design details to updated the provided component`,
        parameters: zodToJsonSchema(components_schema),
      },
    ],
    stream: true,
  });
  const writer = options.stream.getWriter();
  for await (const part of stream) {
    try {
      const chunk = part.choices[0]?.delta?.function_call?.arguments || "";
      completion += chunk;
      writer.write(chunk);
    } catch (e) {
      false;
    }
  }

  writer.write(`\n`);
  writer.releaseLock()

  const component_design = {
    ...{
      new_component_name: false,
      new_component_description: false,
      new_component_icons_elements: false,
      use_library_components: false,
    },
    ...JSON.parse(`${completion}`),
  };

  const component_task = {
    name: options.query.component?.name,
    description: {
      user: options.query.description,
      llm: component_design.new_component_description,
    },
    icons: !component_design.new_component_icons_elements
      ? false
      : !(
          component_design.new_component_icons_elements
            .does_new_component_need_icons_elements &&
          component_design.new_component_icons_elements
            .if_so_what_new_component_icons_elements_are_needed &&
          component_design.new_component_icons_elements
            .if_so_what_new_component_icons_elements_are_needed.length
        )
      ? false
      : component_design.new_component_icons_elements.if_so_what_new_component_icons_elements_are_needed.map(
          (e) => e.toLowerCase(),
        ),
    components: !component_design.use_library_components
      ? false
      : component_design.use_library_components.map((e) => {
          return {
            name: e.library_component_name,
            usage: e.library_component_usage_reason,
          };
        }),
  };

  return {
    type: `component-design-task`,
    success: true,
    data: component_task,
  };
}

export {
  run,
};
