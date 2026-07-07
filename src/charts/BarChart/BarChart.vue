<template><div ref="chartRef" class="bar-chart" /></template>
<script setup lang="ts">
import type { SalesData } from '@/types/dashboard';
import { useBarChart } from './useBarChart';
const props = defineProps<{ data: SalesData[] }>();
const { chartRef } = useBarChart(() => props.data);
</script>
<style scoped lang="scss">
.bar-chart { width: 100%; height: 100%; min-height: 200px; }
</style>
