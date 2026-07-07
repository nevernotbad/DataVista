import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export function useAutoResize(
  wrapperRef: Ref<HTMLElement | undefined>,
  designWidth = 1920,
  designHeight = 1080,
) {
  const scale = ref(1);

  function calcScale() {
    const el = wrapperRef.value;
    if (!el) return;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const s = Math.min(ww / designWidth, wh / designHeight);
    scale.value = s;
    el.style.width = `${designWidth}px`;
    el.style.height = `${designHeight}px`;
    el.style.transform = `scale(${s})`;
    el.style.transformOrigin = 'left top';
    el.style.position = 'absolute';
    el.style.left = `${(ww - designWidth * s) / 2}px`;
    el.style.top = `${(wh - designHeight * s) / 2}px`;
  }

  onMounted(() => {
    calcScale();
    window.addEventListener('resize', calcScale);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', calcScale);
  });

  return { scale };
}
