// @ts-nocheck
import type { RequestEventBase } from "@builder.io/qwik-city";
import type { ChatCompletionMessageParam } from "openai/resources";
import zodToJsonSchema from "zod-to-json-schema";
import type { RunOptions } from "~/types";
import {
  LIBRARY_COMPONENTS_MAP,
  _randomUid,
  createComponentsSchema,
} from "~/utils/meta";
import { createOpenAI } from "~/utils/openai";

async function run(options: RunOptions, req: RequestEventBase) {
  const openAI = createOpenAI(req);
  const components_schema = createComponentsSchema(options);

  const context: ChatCompletionMessageParam[] = [
    {
      role: `system`,
      content:
        `Your task is to design a new ${options.query.framework} component for a web app, according to the user's request.\n` +
        `If you judge it is relevant to do so, you can specify pre-made library components to use in the task.\n` +
        `You can also specify the use of icons if you see that the user's request requires it.`,
    },
    {
      role: `user`,
      content:
        "Multiple library components can be used while creating a new component in order to help you do a better design job, faster.\n\nAVAILABLE LIBRARY COMPONENTS:\n```\n" +
        LIBRARY_COMPONENTS_MAP[options.query.framework][
          options.query.components
        ]
          .map((e) => {
            return `${e.name} : ${e.description};`;
          })
          .join("\n") +
        "\n```",
    },
    {
      role: `user`,
      content:
        "USER QUERY : \n```\n" +
        options.query.description +
        "\n```\n\n" +
        `Design the new ${options.query.framework} web component task for the user as the creative genius you are`,
    },
  ];

  let completion = "";
  console.log("here context", context);
  const stream = await openAI.chat.completions.create({
    model: req.env.get("OPENAI_MODEL")!,
    messages: context,
    functions: [
      {
        name: `design_new_component_api`,
        description: `generate the required design details to create a new component`,
        parameters: zodToJsonSchema(components_schema),
      },
    ],
    stream: true,
  });
  const writer = options.stream.getWriter();
  for await (const part of stream) {
    try {
      process.stdout.write(
        part.choices[0]?.delta?.function_call?.arguments || ""
      );
    } catch (e) {
      false;
    }
    try {
      const chunk = part.choices[0]?.delta?.function_call?.arguments || "";
      completion += chunk;
      writer.write(chunk);
    } catch (e) {
      false;
    }
  }
  writer.write(`\n`);
  writer.releaseLock();

  const component_design = {
    ...{
      new_component_name: false,
      new_component_description: false,
      new_component_icons_elements: false,
      use_library_components: false,
    },
    ...eval(`(${completion})`),
  };

  const component_task = {
    name: `${component_design.new_component_name}_${_randomUid(5)}`,
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
          (e) => e.toLowerCase()
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

export { run };
