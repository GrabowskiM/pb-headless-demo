# pb-headless-demo (vanilla JS)

A minimal headless Ibexa Page Builder integration: one landing page, plain
TypeScript, no UI framework.

- **Visitors** get the page from REST (`src/main.ts`): resolve the location, read
  the Page field through the `page-field` endpoint, render zones and blocks into
  the DOM.
- **Inside Page Builder** the app notices it is framed and loads `src/editor.ts`,
  which announces itself over postMessage, receives the field value from the editor
  and re-renders on every change. It declares the capabilities the editor needs for
  full editing: block geometry, selection by click, scroll-to-block, removal,
  drag-and-drop with a drop placeholder and pointer tracking. The postMessage
  bridge, protocol negotiation, geometry tracking and drop position helper come from
  the published [`@ibexa/utils`](https://github.com/ibexa/frontend-kit) package.
  The editor chrome (zone frames, drop placeholder, dragged block) uses the
  stylesheet that `@ibexa/react-headless` ships as `styles/preview.css`; that package
  is installed for this file alone, without its React peer dependencies
  (`legacy-peer-deps` in `.npmrc`).

Only the rich text block has a renderer; every other block type renders its name.

## Requirements

`@ibexa/utils` is published to GitHub Packages, which requires authentication even for
reads. Export a personal access token with the `read:packages` scope before installing:

```sh
export GH_PACKAGES_TOKEN=<your token>
npm install
```

Copy `.env.example` to `.env` and point it at an Ibexa instance and a landing page.

## Running

```sh
npm run dev       # development server on http://localhost:5173
npm run build     # static bundle in dist/
npm run ts:check  # type-check
```
