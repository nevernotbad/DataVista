import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';

export function useTheme() {
  const store = useThemeStore();
  return { isDark: computed(() => store.isDark), toggle: store.toggleTheme };
}
