import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import XquadIcon from "~/media/icons/xquad.svg?jsx";
import TwitterIcon from "~/media/icons/twitter.svg?jsx";
import GithubIcon from "~/media/icons/github.svg?jsx";

export default component$(() => {
  return (
    <div class="font-sora py-7 flex w-full max-w-[1263px] justify-between gap-5 items-start max-md:max-w-full max-md:flex-wrap px-5">
      <div class="flex items-start gap-3.5 ">
        <Link
          href="/"
          class="text-white outline-none text-4xl font-bold grow whitespace-nowrap"
        >
          <span class="font-light">X</span>
          <span class="font-bold">1</span>
        </Link>
        <Link class="max-w-full mb-1.5 self-end" href="https://xquad.io">
          <XquadIcon class="aspect-[3.8] object-contain object-center w-[76px] overflow-hidden shrink-0 " />
        </Link>
      </div>
      <div class="flex items-center gap-2.5">
        <Link href="https://twitter.com/xquadio">
          <TwitterIcon class="aspect-square object-contain object-center w-[26px] overflow-hidden shrink-0 max-w-full my-auto" />
        </Link>

        <Link href="https://github.com/xquad-io">
          <GithubIcon class="aspect-square object-contain object-center w-8 overflow-hidden self-stretch shrink-0 max-w-full" />
        </Link>
      </div>
    </div>
  );
});
