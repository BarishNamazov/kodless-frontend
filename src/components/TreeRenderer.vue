<script setup lang="ts">
import ChildrenRenderer from './ChildrenRenderer.vue';
import ForEachRenderer from './ForEachRenderer.vue';
import { watchEffect, ref, h } from 'vue';
import { evaluateWithCtx } from '@/eval';
import type { HrmlElement, View } from 'hrml/types';
import HrmlRenderer from './HrmlRenderer.vue';

const { view, ctx } = defineProps<{ view: HrmlElement; ctx: Record<string, any> }>();

const content = view.children;

// Find the element with tag 'children' in the content
const findChildren = (view: HrmlElement): HrmlElement | undefined => {
  const children = view.children.find((child) => typeof child === 'object' && child.tag === 'children');
  if (!children) {
    for (const child of view.children) {
      if (typeof child === 'object') {
        const searchRet = findChildren(child);
        if (searchRet) {
          return searchRet;
        }
      }
    }
  }
  return children as HrmlElement;
};

// const list = ref([]);
// watchEffect(() => {
//   list.value = evaluateWithCtx(view.attributes.items, ctx);
// });

const render = (): HrmlElement => {
  const s: HrmlElement = {
    tag: 'foreach',
    attributes: {
      items: view.attributes.items,
      item: 'item'
    },
    children: [
      {
        tag: 'param',
        attributes: {
          name: view.attributes.item,
          value: 'item.' + view.attributes.item
        },
        children: []
      }
    ]
  };

  s.children.push({
    tag: 'div',
    attributes: {},
    children: [
      {
        tag: 'param',
        attributes: {
          name: view.attributes.items,
          value: 'item.' + view.attributes.children
        },
        children: []
      },
      s
    ]
  });

  return s;
};
</script>

<template>
  <HrmlRenderer :view="render()" :ctx />
</template>
