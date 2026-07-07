<template><div ref="chartRef" class="line-chart"></div></template>
<script setup lang="ts">
import type { SalesData } from '@/types/dashboard';
import { useLineChart } from './useLineChart';
const props = defineProps<{ data: SalesData[] }>();
const { chartRef } = useLineChart(() => props.data);
</script>
<style scoped lang="scss">
.line-chart { width: 100%; height: 100%; min-height: 200px; }
</style>
