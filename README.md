# X1 (by [xquad.io](https://xquad.io))

A minimal front-end assistant for your new prototypes. Inspired by [v0](https://v0.dev) and forked from [openv0](https://github.com/raidendotai/openv0).

- Minimal
- Shareable/Forkable Designs
- Self-Hostable
- Edge Compatible ([Workers](https://workers.cloudflare.com)) and Affordable

You can try creating your new front-end [here](https://x1.xquad.io).

## Self-Host

You might clone this project and deploy it on your server easily.

`.env.local`:

```txt
API__GENERATE_ATTEMPTS=1
OPENAI_API_KEY=sk-... # You only need to change this
OPENAI_MODEL=gpt-4 # You can set different models here
OPENV0__API=https://api.openv0.com
OPENV0__COLLECT_UIRAY=1
PASS__CONTEXT__COMPONENTS_LIBRARY_EXAMPLES__TOKEN_LIMIT=500
```

Development/Build:

```sh
pnpm i
pnpm dev # or pnpm build
```

You need some help deploying X1? Let's schedule a call [here](https://calendly.com/xquadio/30min).

## Upcoming

- Open in Stackblitz/Codepen
- Custom OpenAI API KEY
- Custom OpenAI Model
- Real-time UI generation while the code is being generated, similar to what v0.dev has
- More libraries and frameworks (This can be easily implemented since openv0 already implemented this).

For the last one, what we would like to achieve is a script that analyzes the documentation and adds support.

## Technologies

- [Qwik](https://qwik.builder.io)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)
- [ESM.sh](https://esm.sh)
- [uno.css](https://unocss.dev/)

## Contribution

Any contribution is welcome!

## Xquad.io

Hire your best hire today with [Xquad.io](https://xquad.io)!

[![xquad.io](https://xquad.io/og.png)](https://xquad.io/)
