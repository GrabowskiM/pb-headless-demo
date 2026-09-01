# pb-headless-demo

A TanStack Start application that renders an Ibexa Page Builder landing page through
[`@ibexa/react-headless`](https://github.com/ibexa/frontend-kit), used to exercise the
published packages the way an integrator would.

## Requirements

`@ibexa/react-headless` is published to GitHub Packages, which requires authentication
even for reads. Export a personal access token with the `read:packages` scope before
installing:

```sh
export GH_PACKAGES_TOKEN=<your token>
npm install
```

`.npmrc` maps the `@ibexa` scope to `https://npm.pkg.github.com` and reads the token from
that variable, so nothing secret lives in the repository.

## Running

```sh
npm run dev      # development server on http://localhost:3000
npm run build    # client bundle and SSR server
npm run preview  # serve the production build
```
