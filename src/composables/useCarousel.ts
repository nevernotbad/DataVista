import { ref, onUnmounted } from 'vue';

export function useCarousel(total: number, interval = 5000) {
  const activeIndex = ref(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  function start() {
    stop();
    timer = setInterval(() => { activeIndex.value = (activeIndex.value + 1) % total; }, interval);
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function next() { activeIndex.value = (activeIndex.value + 1) % total; }
  function prev() { activeIndex.value = (activeIndex.value - 1 + total) % total; }
  function goTo(i: number) { activeIndex.value = i; }

  onUnmounted(stop);

  return { activeIndex, start, stop, next, prev, goTo };
}
