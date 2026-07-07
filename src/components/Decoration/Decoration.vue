<template>
  <div class="decoration">
    <div v-for="n in 3" :key="n" class="decoration-line" />
  </div>
</template>
<style scoped lang="scss">
.decoration {
  display: flex; flex-direction: column; gap: 4px; padding: 8px 0;
  &-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.4), rgba(0,212,255,0.8), rgba(0,212,255,0.4), transparent);
    &:nth-child(2) { margin: 0 20%; }
    &:nth-child(3) { margin: 0 40%; }
  }
}
</style>
