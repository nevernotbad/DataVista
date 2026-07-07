<template>
  <header class="page-header">
    <div class="header-left">
      <h1 class="header-title">数据视界 <span class="header-subtitle">DataVista</span></h1>
    </div>
    <div class="header-center">
      <span class="header-time">{{ currentTime }}</span>
    </div>
    <div class="header-right">
      <button class="theme-btn" @click="toggleTheme">{{ isDark ? '🌙' : '☀️' }}</button>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useTheme } from '@/composables/useTheme';
const { isDark, toggle: toggleTheme } = useTheme();

const currentTime = ref('');
let timer: ReturnType<typeof setInterval>;
function updateTime() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  currentTime.value = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000); });
onUnmounted(() => clearInterval(timer));
</script>
<style scoped lang="scss">
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  height: 60px; padding: 0 24px;
  background: linear-gradient(180deg, rgba(0,212,255,0.08), transparent);
  border-bottom: 1px solid rgba(0,212,255,0.15);
}
.header-title { font-size: 24px; font-weight: 700; color: #e0e6f0; letter-spacing: 4px; }
.header-subtitle { font-size: 14px; font-weight: 400; color: rgba(0,212,255,0.6); margin-left: 12px; letter-spacing: 1px; }
.header-time { font-size: 18px; color: rgba(0,212,255,0.8); font-family: 'Consolas', monospace; letter-spacing: 2px; }
.theme-btn { background: none; border: 1px solid rgba(0,212,255,0.3); color: #e0e6f0; font-size: 18px; padding: 4px 12px; border-radius: 4px; cursor: pointer; transition: all 0.3s; }
.theme-btn:hover { border-color: #00d4ff; box-shadow: 0 0 10px rgba(0,212,255,0.3); }
</style>
