import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

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
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/51786e997dd324e171fe04fd60f084ca18b0401a34b8d1db9fa0375af5cba109?"
            class="aspect-[3.8] object-contain object-center w-[76px] overflow-hidden shrink-0 "
          />
        </Link>
      </div>
      <div class="flex items-center gap-2.5">
        <Link href="https://twitter.com/xquadio">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7c22a4aae78f833d3b726d3cf0ae749630192495a5f8ccaff2735600af865b0e?"
            class="aspect-square object-contain object-center w-[26px] overflow-hidden shrink-0 max-w-full my-auto"
          />
        </Link>

        <Link href="https://github.com/xquad-io">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a536b45412c01c6ca2e165f78f60c01ceaf58f1e69fa4ebd9e0598f7e0f5be1?"
            class="aspect-square object-contain object-center w-8 overflow-hidden self-stretch shrink-0 max-w-full"
          />
        </Link>
      </div>
    </div>
  );
});
