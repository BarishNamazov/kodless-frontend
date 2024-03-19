<script setup lang="ts">
import type { HrmlElement } from 'hrml/types';
import { ref, type Ref } from 'vue';
import ChildrenRenderer from './ChildrenRenderer.vue';

const { view } = defineProps<{
  view: HrmlElement;
  ctx: Record<string, any>;
}>();

let toggle = view.attributes.default === 'show' ? ref(true) : ref(false);
</script>

<template>
  <button @click="toggle = !toggle">{{ view.attributes.text }}</button>
  <div v-show="toggle">
    <ChildrenRenderer :views="view.children" :ctx />
  </div>
</template>
