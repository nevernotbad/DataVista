declare module '*.vue' { import type { DefineComponent } from 'vue'; const c: DefineComponent<object, object, unknown>; export default c; }
declare module '*.scss' { const content: Record<string, string>; export default content; }
