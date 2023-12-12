import { server$ } from "@builder.io/qwik-city";
import * as multipass from "../multipass/index";

export const generate = server$(async function* ({
  description,
}: {
  description: string;
}) {
  const { writable, readable } = new TransformStream<string, string>();
  try {
    multipass
      .preset(
        {
          stream: writable,
          preset: `componentNew_description`,
          query: {
            description: description,
            framework: "react",
            components: "nextui",
            icons: "lucide",
          },
        },
        this
      )
      .then(() => writable.close());
  } catch (e) {
    console.log(e);
  }

  const reader = readable.getReader();
  try {
    while (!this.signal.aborted) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
});

export const iterate = server$(async function* ({
  description,
  component,
}: {
  description: string;
  component: {
    name: string;
    description: string;
    code: string;
  };
}) {
  const { writable, readable } = new TransformStream<string, string>();
  try {
    multipass
      .preset(
        {
          stream: writable,
          preset: `componentIterate_description`,
          query: {
            description,
            component,
            framework: "react",
            components: "nextui",
            icons: "lucide",
          },
        },
        this
      )
      .then(() => writable.close());
  } catch (e) {
    console.log(e);
  }

  const reader = readable.getReader();
  try {
    while (!this.signal.aborted) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
});
