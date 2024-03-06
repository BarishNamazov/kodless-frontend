<script setup lang="ts">
import { computed } from 'vue';
import ViewRenderer from './ViewRenderer.vue';
import type { ViewList } from '@/types';
import { evaluateWithCtx } from '@/util';

const { view, ctx } = defineProps<{
  view: ViewList;
  ctx: Object;
}>();

//console.log('ListRenderer', view, ctx);

const list = computed(() => {
  const l = evaluateWithCtx(view.value, ctx);
  //console.log(l[0]);
  return l;
});

const getCtx = (item: any) => {
  if (view.itemRef) {
    return { ...ctx, [view.itemRef]: item };
  }
  return ctx;
};
</script>

<template>
  <ul v-if="list.length">
    <li v-for="(item, i) in list" :key="i">
      <ViewRenderer :view="view.container" :ctx="getCtx(item)" />
    </li>
  </ul>
  <p v-else>No items found</p>
</template>
