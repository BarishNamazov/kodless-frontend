<script setup lang="ts">
import { computed } from 'vue';
import ViewRenderer from './ViewRenderer.vue';
import type { ViewBase, ViewList } from '@/types';
import { evaluateWithCtx } from '@/eval';

const { view, ctx } = defineProps<{
  view: ViewList;
  ctx: Record<string, any>;
}>();

const list = computed(() => {
  const l = evaluateWithCtx(view.value, ctx);
  return l;
});

const getCtx = (item: any) => {
  if (view.itemRef) {
    return { ...ctx, [view.itemRef]: item };
  }
  return ctx;
};

const styles: ViewBase['styles'] = {
  border: '1px solid var(--color-bg-secondary)',
  borderRadius: 'var(--border-radius)',
  padding: '1em'
};

const containerStyles = Array.isArray(view.container) ? {} : view.container.styles ?? {};

const container = {
  ...view.container,
  styles: { ...styles, ...containerStyles }
};
</script>

<template>
  <ul v-if="list.length">
    <li v-for="(item, i) in list" :key="i">
      <ViewRenderer :view="container" :ctx="getCtx(item)" />
    </li>
  </ul>
  <p v-else>No items found</p>
</template>
