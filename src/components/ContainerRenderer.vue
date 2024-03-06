<script setup lang="ts">
import { defineProps } from 'vue';
import type { ViewContainer } from '@/types';
import ViewRenderer from './ViewRenderer.vue';

const { view, ctx } = defineProps<{
  view: ViewContainer;
  ctx: Record<string, any>;
}>();
//console.log('ContainerRenderer', view, ctx);
</script>

<template>
  <div class="container">
    <ViewRenderer v-for="(child, i) in view.children" :key="i" :view="child" :ctx />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>
