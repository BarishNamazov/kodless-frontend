<script setup lang="ts">
import { watchEffect, ref } from 'vue';
import { evaluateWithCtx } from '@/eval';
import { listenToParams, separateParams } from '@/util';
import type { HrmlElement } from 'hrml/types';
import ChildrenRenderer from './ChildrenRenderer.vue';

const { view, ctx } = defineProps<{ view: HrmlElement; ctx: Record<string, any> }>();

const { params, views } = separateParams(view.children);

const list = ref([]);
watchEffect(() => {
  list.value = evaluateWithCtx(view.attributes.items, ctx);
});

const getCtx = (item: any) => {
  const childCtx = { ...ctx, [view.attributes.item]: item };
  listenToParams(params, childCtx);
  return childCtx;
};
</script>

<template>
  <template v-if="Array.isArray(list)">
    <template v-for="(item, i) in list" :key="i">
      <ChildrenRenderer :views :ctx="getCtx(item)" />
    </template>
    <p v-if="list.length === 0">No items to display</p>
  </template>
  <p v-else>Invalid list, value resolved to: {{ list }}</p>
</template>
