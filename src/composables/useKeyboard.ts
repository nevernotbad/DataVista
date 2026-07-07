import { onMounted, onUnmounted } from 'vue';

type KeyHandler = (e: KeyboardEvent) => void;

interface KeyBinding {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: KeyHandler;
  description: string;
}

const bindings: KeyBinding[] = [];

export function useKeyboard() {
  function bind(key: string, handler: KeyHandler, description = '', opts?: { ctrl?: boolean; shift?: boolean; alt?: boolean }) {
    bindings.push({ key: key.toLowerCase(), handler, description, ...opts });
  }

  function unbind(key: string) {
    const idx = bindings.findIndex(b => b.key === key.toLowerCase());
    if (idx >= 0) bindings.splice(idx, 1);
  }

  function onKeyDown(e: KeyboardEvent) {
    // 忽略输入框内的按键
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

    for (const b of bindings) {
      if (
        e.key.toLowerCase() === b.key &&
        !!e.ctrlKey === !!b.ctrl &&
        !!e.shiftKey === !!b.shift &&
        !!e.altKey === !!b.alt
      ) {
        e.preventDefault();
        b.handler(e);
        return;
      }
    }
  }

  onMounted(() => document.addEventListener('keydown', onKeyDown));
  onUnmounted(() => document.removeEventListener('keydown', onKeyDown));

  return { bind, unbind, bindings };
}
