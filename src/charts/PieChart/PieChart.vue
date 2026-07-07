<template><div ref="chartRef" class="pie-chart"></div></template>
<script setup lang="ts">
import type { TrafficData } from '@/types/dashboard';
import { usePieChart } from './usePieChart';
const props = defineProps<{ data: TrafficData[] }>();
const { chartRef } = usePieChart(() => props.data);
</script>
<style scoped lang="scss">
.pie-chart { width: 100%; height: 100%; min-height: 200px; }
</style>
