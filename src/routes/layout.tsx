import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import Navbar from "~/components/Navbar";
import { QParticlesBgCanvas } from "~/components/canvas";
import { setKV } from "~/utils/kv";

export const onRequest: RequestHandler = async (req) => {
  if (req.env.get("CF_PAGES")) {
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
  return (
    <>
      <div class="z-7 absolute min-h-full w-full h-full flex-col flex items-center">
        <Navbar />
        <Slot />
      </div>
      <div class="absolute w-full h-full bg-black"></div>
      <div class="h-full w-full fixed z-0 overflow-hidden top-0 left-0 opacity-60">
        <div class="absolute top-0 left-0 z-1 w-full h-full shadow-[0px_0px_200px_3vw_black_inset]" />
        <QParticlesBgCanvas client:idle />
      </div>
    </>
  );
});
