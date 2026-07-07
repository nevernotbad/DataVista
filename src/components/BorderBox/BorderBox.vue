<template>
  <div class="border-box">
    <div class="border-box-title" v-if="title">{{ title }}</div>
    <div class="border-box-content"><slot /></div>
    <span class="border-line border-top"></span>
    <span class="border-line border-right"></span>
    <span class="border-line border-bottom"></span>
    <span class="border-line border-left"></span>
    <span class="border-corner corner-tl"></span>
    <span class="border-corner corner-tr"></span>
    <span class="border-corner corner-bl"></span>
    <span class="border-corner corner-br"></span>
  </div>
</template>
<script setup lang="ts">
defineProps<{ title?: string }>();
</script>
<style scoped lang="scss">
.border-box {
  position: relative;
  padding: 8px;
  background: rgba(6, 30, 60, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.15);
  overflow: hidden;
  &-title {
    @include panel-title;
    margin-bottom: 4px;
  }
  &-content {
    height: calc(100% - 36px);
  }
}
.border-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
  &.border-top, &.border-bottom { left: 10%; width: 80%; height: 1px; }
  &.border-left, &.border-right { top: 10%; width: 1px; height: 80%; }
  &.border-top { top: 0; }
  &.border-right { right: 0; background: linear-gradient(180deg, transparent, #00d4ff, transparent); }
  &.border-bottom { bottom: 0; }
  &.border-left { left: 0; background: linear-gradient(180deg, transparent, #00d4ff, transparent); }
}
.border-corner {
  position: absolute; width: 12px; height: 12px;
  &.corner-tl { top: 0; left: 0; border-top: 2px solid #00d4ff; border-left: 2px solid #00d4ff; }
  &.corner-tr { top: 0; right: 0; border-top: 2px solid #00d4ff; border-right: 2px solid #00d4ff; }
  &.corner-bl { bottom: 0; left: 0; border-bottom: 2px solid #00d4ff; border-left: 2px solid #00d4ff; }
  &.corner-br { bottom: 0; right: 0; border-bottom: 2px solid #00d4ff; border-right: 2px solid #00d4ff; }
}
</style>
