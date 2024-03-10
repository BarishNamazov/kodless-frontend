<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { View } from '@/types';

import ContainerRenderer from './ContainerRenderer.vue';
import TextRenderer from './TextRenderer.vue';
import LinkRenderer from './LinkRenderer.vue';
import ListRenderer from './ListRenderer.vue';
import ImageRenderer from './ImageRenderer.vue';
import FormRenderer from './FormRenderer.vue';
import NavbarRenderer from './NavbarRenderer.vue';

const { view, ctx } = defineProps<{
  view: View;
  ctx: Record<string, any>;
}>();

let newCtx = { ...ctx };
if (typeof view !== 'string' && !Array.isArray(view)) {
  if (view.params) {
    newCtx = { ...ctx, ...view.params };
  }
}

for (const key in newCtx) {
  if (newCtx[key].__isAction) {
    newCtx[key] = { ...newCtx[key], ...newCtx[key].apiFunc({ options: { silentFetch: true } }) };
  }
}

const component = computed(() => {
  if (typeof view === 'string') {
    return TextRenderer;
  }
  if (Array.isArray(view)) {
    return ContainerRenderer;
  }
  switch (view.type) {
    case 'text':
      return TextRenderer;
    case 'container':
      return ContainerRenderer;
    case 'link':
      return LinkRenderer;
    case 'list':
      return ListRenderer;
    case 'image':
      return ImageRenderer;
    case 'form':
      return FormRenderer;
    case 'navbar':
      return NavbarRenderer;
    default:
      // console.error(`Unknown view type: ${view.type ?? 'hh'}`);
      return 'div';
  }
});

const styles = computed(() => {
  if (typeof view !== 'string' && !Array.isArray(view)) {
    return view.styles ?? {};
  }
  return {};
});
</script>

<template>
  <component :is="component" :view :ctx="newCtx" :style="styles" />
</template>
