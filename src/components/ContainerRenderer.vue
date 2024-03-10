<script setup lang="ts">
import { compile, defineProps } from 'vue';
import type { View, ViewContainer } from '@/types';
import ViewRenderer from './ViewRenderer.vue';

const { view, ctx } = defineProps<{
  view: ViewContainer;
  ctx: Record<string, any>;
}>();

const children = Array.isArray(view) ? view : view.children;
</script>

<template>
  <div class="container">
    <ViewRenderer v-for="(child, i) in children" :key="i" :view="child" :ctx />
  </div>
</template>
