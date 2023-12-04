import { component$ } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async (req) => {
  if (req.url.pathname === "/") {
    throw req.redirect(302, "/t/" + crypto.randomUUID());
  }
};

export default component$(() => null);
