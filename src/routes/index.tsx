import { component$, useComputed$, useSignal } from "@builder.io/qwik";
import {
  DocumentHead,
  Link,
  useLocation,
  useNavigate,
} from "@builder.io/qwik-city";
import Loading from "~/components/Loading";
import EnterIcon from "~/media/icons/enter.png?jsx";
import MinimalBlogScreenshot from "~/media/screenshots/minimal-blog.png?jsx";
import BeautifulDashboardScreenshot from "~/media/screenshots/beautiful-dashboard.png?jsx";
import DashboardWithSidebarScreenshot from "~/media/screenshots/dashboard-with-sidebar.jpg?jsx";

// export const onGet: RequestHandler = async (req) => {
//   if (req.url.pathname === "/") {
//     throw req.redirect(302, "/t/" + crypto.randomUUID());
//   }
// };
export const head: DocumentHead = {
  // This will be used to resolve the <title> of the page
  title: "X1 | By XQuad",
  meta: [
    {
      name: "description",
      content: "The Open-Source Frontend Development Assistant",
    },
    // Open graph
    {
      property: "og:title",
      content: "X1 | By XQuad",
    },
    {
      property: "og:description",
      content: "The Open-Source Frontend Development Assistant",
    },
  ],
  links: [
    {
      rel: "canonical",
      href: "https://xquad.io",
    },
  ],
};

export default component$(() => {
  const nav = useNavigate();
  const location = useLocation();
  const uuid = crypto.randomUUID();

  const promptQuery = useSignal("");
  const url = useComputed$(
    () => `/t/${uuid}/?q=${encodeURIComponent(promptQuery.value)}`
  );
  return (
    <main class="font-sora min-h-70% w-full relative flex justify-center items-center">
      <div class="flex grow flex-col items-stretch max-md:max-w-full">
        <h1 class="text-white text-3xl font-semibold self-center text-center max-md:max-w-full">
          The Open-Source Frontend Development Assistant
        </h1>
        <form
          preventdefault:submit
          // When the user presses Enter
          onSubmit$={() => {
            nav(url.value, {
              forceReload: true,
            });
          }}
          class="border bg-stone-50 self-center flex w-[500px] max-w-full items-center justify-between gap-5 mt-8 pl-7 pr-5 py-3.5 rounded-[60px] border-solid border-neutral-400 max-md:flex-wrap max-md:px-5"
        >
          <input
            onChange$={(e) =>
              (promptQuery.value = encodeURIComponent(e.target.value))
            }
            name="prompt"
            placeholder="A Hello-World Application..."
            class="border-none text-black placeholder:text-neutral-400 text-lg grow shrink basis-auto my-auto focus:outline-none"
          />
          {/* for prefetching */}
          {location.isNavigating ? (
            <Loading />
          ) : (
            <>
              <link rel="prefetch" href={url.value} />
              <Link prefetch href={url.value}>
                <EnterIcon class=" border-none" />
              </Link>
            </>
          )}
        </form>
        <div class="mt-4rem max-md:max-w-full max-md:mt-10">
          <div class="gap-5 flex max-md:flex-col flex-wrap justify-center items-center">
            <div class="flex flex-col items-stretch w-278px max-md:ml-0">
              <a
                href="/t/a9d6ae45-43bf-4cf3-977c-4716f47565c5/"
                class="border bg-black flex grow flex-col items-stretch w-full px-4 py-4 border-solid border-slate-800"
              >
                <div class="text-white text-base font-semibold whitespace-nowrap">
                  minimal blog
                </div>
                <MinimalBlogScreenshot class="aspect-16/9 flex shrink-0 h-[133px] flex-col mt-3"></MinimalBlogScreenshot>
              </a>
            </div>
            <div class="flex flex-col items-stretch w-278px  max-md:ml-0">
              <a
                href="/t/e87d00b3-17cb-4ccd-b7db-6b6436690ec1/"
                class="border bg-black flex grow flex-col items-stretch w-full px-4 py-4 border-solid border-slate-800"
              >
                <div class="text-white text-base font-semibold whitespace-nowrap">
                  create a simple dashboard
                </div>
                <BeautifulDashboardScreenshot class="aspect-16/9 bg-zinc-300 flex shrink-0 h-[133px] flex-col mt-3"></BeautifulDashboardScreenshot>
              </a>
            </div>
            <div class="flex flex-col items-stretch w-278px  max-md:ml-0">
              <a
                href="/t/23d0e0ea-05ff-4fba-8055-0600d5a9af57/"
                class="border bg-black flex grow flex-col items-stretch w-full px-4 py-4 border-solid border-slate-800"
              >
                <div class="text-white text-base font-semibold whitespace-nowrap">
                  Dashboard with sidebar
                </div>
                <DashboardWithSidebarScreenshot class="aspect-16/9 bg-zinc-300 flex shrink-0 h-[133px] flex-col mt-3"></DashboardWithSidebarScreenshot>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});
