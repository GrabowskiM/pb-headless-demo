import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

const config = defineConfig(({ command }) => ({
  resolve: { tsconfigPaths: true },
  // Bundle every server dependency into the production build so the platform.sh
  // deploy runs without installing anything; the dev server keeps them external.
  ssr: command === 'build' ? { noExternal: true } : {},
  plugins: [tanstackStart(), viteReact()],
}))

export default config
