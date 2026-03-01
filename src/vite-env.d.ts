/// <reference types="vite/client" />

declare module "*.module.css" {
  const content: Record<string, string>;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
