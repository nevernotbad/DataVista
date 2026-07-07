<template>
  <div class="border-box" :class="{ 'no-padding': !padding }">
    <!-- Outer glow -->
    <div class="bb-glow"></div>
    <!-- Corner ornaments -->
    <div class="bb-corners">
      <span class="corner corner-tl">
        <i class="corner-arm h"></i><i class="corner-arm v"></i>
        <i class="corner-deco"></i>
      </span>
      <span class="corner corner-tr">
        <i class="corner-arm h"></i><i class="corner-arm v"></i>
        <i class="corner-deco"></i>
      </span>
      <span class="corner corner-bl">
        <i class="corner-arm h"></i><i class="corner-arm v"></i>
        <i class="corner-deco"></i>
      </span>
      <span class="corner corner-br">
        <i class="corner-arm h"></i><i class="corner-arm v"></i>
        <i class="corner-deco"></i>
      </span>
    </div>
    <!-- Header -->
    <div class="bb-header" v-if="title || $slots.header">
      <slot name="header">
        <span class="bb-title">{{ title }}</span>
      </slot>
    </div>
    <!-- Body -->
    <div class="bb-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string; padding?: boolean }>(), { padding: true });
</script>

<style scoped lang="scss">
.border-box {
  @include glass-panel;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  // Extra glow on hover
  &:hover .bb-glow { opacity: 0.6; }
}

.bb-glow {
  position: absolute; inset: -1px; z-index: 0; pointer-events: none;
  border-radius: inherit;
  box-shadow: 0 0 12px rgba(0,180,216,0.15), inset 0 0 8px rgba(0,180,216,0.05);
  opacity: 0.3; transition: opacity $transition-normal;
}

.bb-corners { pointer-events: none; z-index: 2; }
.corner { position: absolute; }
.corner-arm {
  position: absolute; background: $color-primary;
  &.h { width: 16px; height: 1px; }
  &.v { width: 1px; height: 16px; }
}
.corner-deco {
  position: absolute; width: 4px; height: 4px;
  background: $color-gold; border-radius: 50%;
}

.corner-tl {
  top: -1px; left: -1px;
  .h { top: 0; left: 0; }
  .v { top: 0; left: 0; }
  .corner-deco { top: 4px; left: 4px; }
}
.corner-tr {
  top: -1px; right: -1px;
  .h { top: 0; right: 0; }
  .v { top: 0; right: 0; }
  .corner-deco { top: 4px; right: 4px; }
}
.corner-bl {
  bottom: -1px; left: -1px;
  .h { bottom: 0; left: 0; }
  .v { bottom: 0; left: 0; background: linear-gradient(0deg, $color-primary, rgba(0,180,216,0.3)); }
  .corner-deco { bottom: 4px; left: 4px; }
}
.corner-br {
  bottom: -1px; right: -1px;
  .h { bottom: 0; right: 0; }
  .v { bottom: 0; right: 0; background: linear-gradient(0deg, $color-primary, rgba(0,180,216,0.3)); }
  .corner-deco { bottom: 4px; right: 4px; }
}

.bb-header { padding: 10px 16px 0; flex-shrink: 0; position: relative; z-index: 1; }
.bb-title { @include panel-title; }

.bb-body {
  flex: 1; padding: 8px 12px 12px; overflow: hidden; position: relative; z-index: 1;
  @include scrollbar;
}

.no-padding .bb-body { padding: 0; }
</style>
