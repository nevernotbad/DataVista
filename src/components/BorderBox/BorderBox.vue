<template>
  <div class="border-box" :class="{ 'no-padding': !padding }">
    <div class="bb-corners">
      <span class="corner corner-tl">
        <i class="corner-arm h"></i><i class="corner-arm v"></i>
      </span>
      <span class="corner corner-tr">
        <i class="corner-arm h"></i><i class="corner-arm v"></i>
      </span>
      <span class="corner corner-bl">
        <i class="corner-arm h"></i><i class="corner-arm v"></i>
      </span>
      <span class="corner corner-br">
        <i class="corner-arm h"></i><i class="corner-arm v"></i>
      </span>
    </div>
    <div class="bb-header" v-if="title || $slots.header">
      <slot name="header">
        <span class="bb-title">{{ title }}</span>
      </slot>
    </div>
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

  &.no-padding .bb-body { padding: 0; }
}

.bb-corners {
  pointer-events: none;
  .corner { position: absolute; z-index: 2; }
  .corner-arm {
    position: absolute;
    background: linear-gradient(90deg, $color-primary, rgba(0,180,216,0.2));
    &.h { width: 14px; height: 1px; }
    &.v { width: 1px; height: 14px; }
  }
  .corner-tl { top: 0; left: 0; .h { top: 0; left: 0; } .v { top: 0; left: 0; } }
  .corner-tr { top: 0; right: 0;
    .h { top: 0; right: 0; background: linear-gradient(270deg, $color-primary, rgba(0,180,216,0.2)); }
    .v { top: 0; right: 0; }
  }
  .corner-bl { bottom: 0; left: 0;
    .h { bottom: 0; left: 0; }
    .v { bottom: 0; left: 0; background: linear-gradient(0deg, $color-primary, rgba(0,180,216,0.2)); }
  }
  .corner-br { bottom: 0; right: 0;
    .h { bottom: 0; right: 0; background: linear-gradient(270deg, $color-primary, rgba(0,180,216,0.2)); }
    .v { bottom: 0; right: 0; background: linear-gradient(0deg, $color-primary, rgba(0,180,216,0.2)); }
  }
}

.bb-header {
  padding: 10px 16px 0;
  flex-shrink: 0;
}

.bb-title {
  @include panel-title;
}

.bb-body {
  flex: 1;
  padding: 8px 12px 12px;
  overflow: hidden;
  @include scrollbar;
}
</style>
