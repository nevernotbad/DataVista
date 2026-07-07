import { ref, onMounted, onUnmounted, type Ref } from 'vue';

interface ResizeResult {
  scaleX: Ref<number>;
  scaleY: Ref<number>;
  scale: Ref<number>;
}

export function useAutoResize(
  wrapperRef: Ref<HTMLElement | undefined>,
  designWidth = 1920,
  designHeight = 1080,
): ResizeResult {
  const scaleX = ref(1);
  const scaleY = ref(1);
  const scale = ref(1);

  function calcScale() {
    const el = wrapperRef.value;
    if (!el) return;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    scaleX.value = ww / designWidth;
    scaleY.value = wh / designHeight;
    scale.value = Math.min(scaleX.value, scaleY.value);
    el.style.transform = `scale(${scale.value})`;
    el.style.transformOrigin = 'left top';
  }

  onMounted(() => { calcScale(); window.addEventListener('resize', calcScale); });
  onUnmounted(() => { window.removeEventListener('resize', calcScale); });

  return { scaleX, scaleY, scale };
}
