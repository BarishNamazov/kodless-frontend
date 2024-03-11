<script setup lang="ts">
import { defineProps, computed, watchEffect, ref, reactive } from 'vue';
import type { View } from '@/types';

import ContainerRenderer from './ContainerRenderer.vue';
import TextRenderer from './TextRenderer.vue';
import LinkRenderer from './LinkRenderer.vue';
import ListRenderer from './ListRenderer.vue';
import ImageRenderer from './ImageRenderer.vue';
import FormRenderer from './FormRenderer.vue';
import NavbarRenderer from './NavbarRenderer.vue';
import ToggleRenderer from './ToggleRenderer.vue';

import { evaluateWithCtx } from '@/eval';

const { view, ctx } = defineProps<{
  view: View;
  ctx: Record<string, any>;
}>();

let newCtx = { ...ctx };

for (const key in newCtx) {
  if (newCtx[key]?.__isAction) {
    newCtx[key] = { ...newCtx[key], ...newCtx[key].apiFunc() };
  }
}

let updater = ref(0);
if (typeof view !== 'string' && !Array.isArray(view)) {
  if (view.params) {
    for (const [param, value] of Object.entries(view.params)) {
      if (value && typeof value === 'string') {
        watchEffect(() => {
          const oldVal = newCtx[param];
          newCtx[param] = evaluateWithCtx(value, newCtx);
          if (oldVal !== newCtx[param]) {
            updater.value++;
          }
        });
      }
    }
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
    case 'toggle':
      return ToggleRenderer;
    default:
      return 'div';
  }
});

const styles = computed(() => {
  if (typeof view !== 'string' && !Array.isArray(view)) {
    return view.styles ?? {};
  }
  return {};
});

const showIf = computed(() => {
  if (typeof view !== 'string' && !Array.isArray(view) && view.showIf) {
    return evaluateWithCtx(view.showIf, newCtx);
  }
  return true;
});
</script>

<template>
  <component v-if="showIf" :is="component" :view :ctx="newCtx" :style="styles" :key="updater" />
</template>
