import { defineConfig, globalIgnores } from 'eslint/config'
import ibexa from '@ibexa/eslint-config'

export default defineConfig([
    globalIgnores(['dist', 'src/routeTree.gen.ts']),
    ...ibexa(),
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
        },
        settings: {
            react: { version: 'detect' },
        },
    },
])
