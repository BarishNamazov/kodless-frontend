<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import ViewRenderer from './ViewRenderer.vue';
import type { ViewBase, ViewList } from '@/types';
import { evaluateWithCtx } from '@/eval';

const { view, ctx } = defineProps<{
  view: ViewList;
  ctx: Record<string, any>;
}>();

if (view.emptyText === undefined) {
  view.emptyText = 'No items found';
}

const list = ref([]);

watchEffect(() => {
  list.value = evaluateWithCtx(view.value, ctx);
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

const container = Array.isArray(view.container)
  ? view.container
  : {
      ...view.container,
      styles: { ...styles, ...containerStyles }
    };

watchEffect(() => {
  if (list.value.length) {
    console.log('ListRenderer', list.value);
    console.log(ctx);
    console.log(container);
  }
});
</script>

<template>
  <ul v-if="list.length">
    <li v-for="(item, i) in list" :key="i">
      <ViewRenderer :view="container" :ctx="getCtx(item)" />
    </li>
  </ul>
  <p v-else-if="view.emptyText">{{ view.emptyText }}</p>
</template>
