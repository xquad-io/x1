import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {generateDescription} from '~/services/index'

generateDescription.bind
export default component$(() => {
  return (
    <>
      <form preventdefault:submit onSubmit$={(e) => {
        console.log(e.target.description.value)

      }}>
        <input name="description" placeholder="description"  />
        <button type="submit">submit</button>
      </form>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
