<template>
  <div class="border-box" :class="{ 'no-padding': !padding }">
    <!-- Inner top highlight (glass morphism enhancement) -->
    <div class="bb-inner-highlight" />
    <!-- Outer glow -->
    <div class="bb-glow" />
    <!-- Corner ornaments -->
    <div class="bb-corners">
      <span class="corner corner-tl">
        <i class="corner-arm h" /><i class="corner-arm v" />
        <i class="corner-gem" />
      </span>
      <span class="corner corner-tr">
        <i class="corner-arm h" /><i class="corner-arm v" />
        <i class="corner-gem" />
      </span>
      <span class="corner corner-bl">
        <i class="corner-arm h" /><i class="corner-arm v" />
        <i class="corner-gem" />
      </span>
      <span class="corner corner-br">
        <i class="corner-arm h" /><i class="corner-arm v" />
        <i class="corner-gem" />
      </span>
    </div>
    <!-- Header -->
    <div v-if="title || $slots.header" class="bb-header">
      <slot name="header">
        <span class="bb-title">
          <span v-if="icon" class="bb-icon">{{ icon }}</span>
          <span class="bb-title-text">{{ title }}</span>
        </span>
      </slot>
    </div>
    <!-- Title gradient underline -->
    <div v-if="title || $slots.header" class="bb-title-underline" />
    <!-- Body -->
    <div class="bb-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ title?: string; icon?: string; padding?: boolean }>(),
  { title: '', icon: '', padding: true }
);
</script>

<style scoped lang="scss">
.border-box {
  @include glass-panel;
  // Stronger glass morphism — bump blur
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  // Subtle inner top shadow
  box-shadow: $glass-shadow, inset 0 2px 8px rgba(255, 255, 255, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: transform $transition-normal, border-color $transition-normal,
    box-shadow $transition-slow;

  // Hover: subtle scale-up, brighter border, intensified glow
  &:hover {
    transform: scale(1.005);
    border-color: $glass-border-hover;
    box-shadow: $glass-shadow, inset 0 2px 8px rgba(255, 255, 255, 0.03),
      inset 0 1px 0 rgba(255, 255, 255, 0.06), $glow-md;
    .bb-glow {
      opacity: 0.8;
    }
    .bb-inner-highlight {
      opacity: 0.8;
    }
    .corner-gem {
      box-shadow: 0 0 6px rgba($color-accent, 0.8), 0 0 12px rgba($color-accent, 0.3);
    }
  }
}

// Inner top highlight — subtle light streak across the top
.bb-inner-highlight {
  position: absolute;
  top: 0;
  left: 1px;
  right: 1px;
  height: 1px;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.06) 25%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.06) 75%,
    transparent 100%
  );
  opacity: 0.5;
  transition: opacity $transition-normal;
}

// Outer glow — pulses subtly
.bb-glow {
  position: absolute;
  inset: -1px;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: 0 0 16px rgba($color-primary, 0.18),
    inset 0 0 10px rgba($color-primary, 0.06);
  opacity: 0.35;
  transition: opacity $transition-normal;
  animation: bb-glow-pulse 4s ease-in-out infinite;
}

@keyframes bb-glow-pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.45;
  }
}

// ============================================================
// Corner ornaments — L-shaped glowing lines + diamond gems
// ============================================================
.bb-corners {
  pointer-events: none;
  z-index: 2;
}
.corner {
  position: absolute;
}
.corner-arm {
  position: absolute;
  background: $color-primary;
  box-shadow: 0 0 4px rgba($color-primary, 0.6),
    0 0 8px rgba($color-primary, 0.25);
  &.h {
    width: 18px;
    height: 1px;
  }
  &.v {
    width: 1px;
    height: 18px;
  }
}

// Diamond/gem at each corner (replaces the old .corner-deco dot)
.corner-gem {
  position: absolute;
  width: 5px;
  height: 5px;
  background: $color-accent;
  transform: rotate(45deg);
  box-shadow: 0 0 4px rgba($color-accent, 0.6),
    0 0 8px rgba($color-accent, 0.2);
  transition: box-shadow $transition-normal;
  animation: gem-pulse 3s ease-in-out infinite;
}

@keyframes gem-pulse {
  0%, 100% { box-shadow: 0 0 4px rgba($color-accent, 0.6), 0 0 8px rgba($color-accent, 0.2); }
  50% { box-shadow: 0 0 6px rgba($color-accent, 0.9), 0 0 14px rgba($color-accent, 0.4); }
}

// ---- top-left ----
.corner-tl {
  top: 0;
  left: 0;
  .h {
    top: 0;
    left: 0;
    background: linear-gradient(
      90deg,
      $color-primary,
      rgba($color-primary, 0.2)
    );
  }
  .v {
    top: 0;
    left: 0;
    background: linear-gradient(
      180deg,
      $color-primary,
      rgba($color-primary, 0.2)
    );
  }
  .corner-gem {
    top: 5px;
    left: 5px;
  }
}

// ---- top-right ----
.corner-tr {
  top: 0;
  right: 0;
  .h {
    top: 0;
    right: 0;
    background: linear-gradient(
      270deg,
      $color-primary,
      rgba($color-primary, 0.2)
    );
  }
  .v {
    top: 0;
    right: 0;
    background: linear-gradient(
      180deg,
      $color-primary,
      rgba($color-primary, 0.2)
    );
  }
  .corner-gem {
    top: 5px;
    right: 5px;
  }
}

// ---- bottom-left (fading gradient) ----
.corner-bl {
  bottom: 0;
  left: 0;
  .h {
    bottom: 0;
    left: 0;
    background: linear-gradient(
      90deg,
      rgba($color-primary, 0.7),
      rgba($color-primary, 0.05)
    );
  }
  .v {
    bottom: 0;
    left: 0;
    background: linear-gradient(
      0deg,
      rgba($color-primary, 0.7),
      rgba($color-primary, 0.05)
    );
  }
  .corner-gem {
    bottom: 5px;
    left: 5px;
    background: rgba($color-accent, 0.6);
    box-shadow: 0 0 3px rgba($color-accent, 0.35),
      0 0 6px rgba($color-accent, 0.12);
  }
}

// ---- bottom-right (fading gradient) ----
.corner-br {
  bottom: 0;
  right: 0;
  .h {
    bottom: 0;
    right: 0;
    background: linear-gradient(
      270deg,
      rgba($color-primary, 0.7),
      rgba($color-primary, 0.05)
    );
  }
  .v {
    bottom: 0;
    right: 0;
    background: linear-gradient(
      0deg,
      rgba($color-primary, 0.7),
      rgba($color-primary, 0.05)
    );
  }
  .corner-gem {
    bottom: 5px;
    right: 5px;
    background: rgba($color-accent, 0.6);
    box-shadow: 0 0 3px rgba($color-accent, 0.35),
      0 0 6px rgba($color-accent, 0.12);
  }
}

// ============================================================
// Header & Title
// ============================================================
.bb-header {
  padding: 10px 16px 0;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.bb-title {
  @include panel-title;
}

.bb-icon {
  font-size: 0.9em;
  line-height: 1;
  flex-shrink: 0;
  filter: drop-shadow(0 0 4px rgba($color-primary, 0.3));
}

.bb-title-text {
  // Inherits panel-title styles
}

// Subtle gradient underline beneath the title bar
.bb-title-underline {
  height: 1px;
  margin: 4px 16px 0;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba($color-primary, 0.15) 20%,
    rgba($color-primary, 0.3) 50%,
    rgba($color-primary, 0.15) 80%,
    transparent 100%
  );
}

// ============================================================
// Body
// ============================================================
.bb-body {
  flex: 1;
  padding: 8px 12px 12px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  @include scrollbar;
}

.no-padding .bb-body {
  padding: 0;
}
</style>
