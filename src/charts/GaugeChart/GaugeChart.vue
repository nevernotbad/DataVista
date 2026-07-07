<template><div ref="chartRef" class="gauge-chart" /></template>
<script setup lang="ts">
import type { EfficiencyData } from '@/types/dashboard';
import { useGaugeChart } from './useGaugeChart';
const props = defineProps<{ data: EfficiencyData[] }>();
const { chartRef } = useGaugeChart(() => props.data);
</script>
<style scoped lang="scss">
.gauge-chart { width: 100%; height: 100%; min-height: 200px; }
</style>
