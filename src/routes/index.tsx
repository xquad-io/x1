import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { QParticlesBgCanvas } from "~/components/canvas";

// export const onGet: RequestHandler = async (req) => {
//   if (req.url.pathname === "/") {
//     throw req.redirect(302, "/t/" + crypto.randomUUID());
//   }
// };

export default component$(() => {
  const nav = useNavigate();
  return (
    <main class="font-sora min-h-70% w-full relative flex justify-center items-center">
      <div class="flex grow flex-col items-stretch max-md:max-w-full">
        <h1 class="text-white text-3xl font-semibold self-center whitespace-nowrap max-md:max-w-full">
          Your new frontend assistant
        </h1>
        <form
          preventdefault:submit
          onSubmit$={(e) => {
            const promptQuery = encodeURIComponent(e.target.prompt.value);
            console.log("here", promptQuery);
            nav(`/t/${crypto.randomUUID()}?q=${promptQuery}`, {
              forceReload: true,
            });
          }}
          class="border bg-stone-50 self-center flex w-[500px] max-w-full items-center justify-between gap-5 mt-8 pl-7 pr-5 py-3.5 rounded-[60px] border-solid border-neutral-400 max-md:flex-wrap max-md:px-5"
        >
          <input
            name="prompt"
            placeholder="A dashboard with a sidebar"
            class=" text-black placeholder:text-neutral-400 text-lg grow shrink basis-auto my-auto focus:outline-none"
          />
          <button type="submit">
            <img
              loading="lazy"
              srcSet="/enter-icon.svg"
              class="aspect-square object-contain object-center w-8 overflow-hidden self-stretch shrink-0 max-w-full"
            />
          </button>
        </form>
        <div class="hidden mt-56 max-md:max-w-full max-md:mt-10">
          <div class="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div class="flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0">
              <div class="border bg-black flex grow flex-col items-stretch w-full px-4 py-4 border-solid border-slate-800">
                <div class="text-white text-base font-semibold whitespace-nowrap">
                  A list of top customers
                </div>
                <div class="bg-zinc-300 flex shrink-0 h-[133px] flex-col mt-3"></div>
              </div>
            </div>
            <div class="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div class="border bg-black flex w-[300px] shrink-0 max-w-full h-[189px] flex-col mx-auto border-solid border-slate-800"></div>
            </div>
            <div class="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div class="border bg-black flex w-[299px] shrink-0 max-w-full h-[189px] flex-col mx-auto border-solid border-slate-800"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});
