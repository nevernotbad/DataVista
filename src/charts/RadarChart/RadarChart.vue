<template>
  <div ref="chartRef" class="radar-chart" />
</template>
<script setup lang="ts">
import { useRadarChart } from './useRadarChart';
interface RadarItem { name: string; value: number; }
const props = defineProps<{ data: RadarItem[] }>();
const { chartRef } = useRadarChart(() => props.data);
</script>
<style scoped>
.radar-chart { width: 100%; height: 100%; min-height: 180px; }
</style>
