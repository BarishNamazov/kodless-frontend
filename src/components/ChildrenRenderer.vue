<script setup lang="ts">
import type { HrmlElement, View } from 'hrml/types';
import TextRenderer from './TextRenderer.vue';
import HrmlRenderer from './HrmlRenderer.vue';

const { views, ctx } = defineProps<{ views: View[]; ctx: Record<string, any> }>();

for (let i = 0; i < views.length; i++) {
  const view = views[i] as HrmlElement;
  if (typeof view === 'object') {
    if ('else' in view.attributes) {
      const prevView = views[i - 1] as HrmlElement;
      view.attributes.if = `!(${prevView.attributes.if})`;
      delete view.attributes.else;
    }
  }
}
</script>

<template>
  <template v-for="(view, i) in views" :key="i">
    <TextRenderer v-if="typeof view === 'string'" :view :ctx />
    <HrmlRenderer v-else :view :ctx />
  </template>
</template>
