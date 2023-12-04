import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { setKV } from "~/utils/kv";

export const onRequest: RequestHandler = async (req) => {
  if (req.env.get("CF_PAGES")) {
    console.log("here", req.env.get("X1"));
    setKV(req.env.get("X1") as any);
  }
};

export const onGet: RequestHandler = async (req) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  req.cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
  if (!req.cookie.has("uuid")) {
    req.cookie.set("uuid", crypto.randomUUID(), {
      httpOnly: true,
      maxAge: [100, "days"],
      path: "/",
    });
  }
  // headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  // headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  // headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
};

export default component$(() => {
  return <Slot />;
});
