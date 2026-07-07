<template>
  <div v-if="visible" class="loading-overlay">
    <div class="loading-ring" />
    <p class="loading-text">数据加载中...</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{ visible: boolean }>();
</script>
<style scoped lang="scss">
.loading-overlay {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; background: rgba(10,26,46,0.85); z-index: 100;
}
.loading-ring {
  width: 48px; height: 48px; border: 3px solid rgba(0,212,255,0.2);
  border-top-color: #00d4ff; border-radius: 50%; animation: spin 0.8s linear infinite;
}
.loading-text { margin-top: 16px; color: rgba(0,212,255,0.8); font-size: 14px; letter-spacing: 2px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
