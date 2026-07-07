<template>
  <div class="digital-scroll">
    <span class="digital-scroll-label">{{ label }}</span>
    <span class="digital-scroll-value">{{ displayValue }}</span>
    <span v-if="unit" class="digital-scroll-unit">{{ unit }}</span>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
const props = defineProps<{ label: string; value: number; unit?: string; duration?: number }>();
const displayValue = ref(0);
const dur = props.duration ?? 1500;

function animate() {
  const start = performance.now();
  const from = displayValue.value;
  const to = props.value;
  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / dur, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    displayValue.value = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

onMounted(() => { if (props.value > 0) animate(); });
watch(() => props.value, () => { if (props.value !== displayValue.value) animate(); });
</script>
<style scoped lang="scss">
.digital-scroll {
  display: flex; align-items: baseline; gap: 6px; padding: 12px 16px;
  background: rgba(0,212,255,0.05); border-radius: 4px;
  &-label { font-size: 14px; color: rgba(224,230,240,0.7); }
  &-value { font-size: 32px; font-weight: 700; color: #00d4ff; font-family: 'DIN Alternate', 'Consolas', monospace; text-shadow: 0 0 20px rgba(0,212,255,0.5); }
  &-unit { font-size: 14px; color: rgba(224,230,240,0.5); }
}
</style>
