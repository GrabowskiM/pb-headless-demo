/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PB_ORIGIN: string;
    readonly VITE_IBEXA_REST_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
