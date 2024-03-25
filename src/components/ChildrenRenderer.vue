<script setup lang="ts">
import { type HrmlElement, type View } from 'hrml/types';
import { IF_ATTR, ELSE_ATTR } from '@/../hrml/types';
import TextRenderer from './TextRenderer.vue';
import HrmlRenderer from './HrmlRenderer.vue';

const { views, ctx } = defineProps<{ views: View[]; ctx: Record<string, any> }>();

for (let i = 0; i < views.length; i++) {
  const view = views[i] as HrmlElement;
  if (typeof view === 'object') {
    if (ELSE_ATTR in view.attributes) {
      const prevView = views[i - 1] as HrmlElement;
      view.attributes[IF_ATTR] = `!(${prevView.attributes[IF_ATTR]})`;
      delete view.attributes[ELSE_ATTR];
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
