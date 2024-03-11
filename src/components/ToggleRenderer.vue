<script setup lang="ts">
import ViewRenderer from './ViewRenderer.vue';
import type { ViewToggle } from '@/types';
import { ref } from 'vue';

const { view, ctx } = defineProps<{
  view: ViewToggle;
  ctx: Record<string, any>;
}>();

const toggle = ref(false);
</script>

<template>
  <button @click="toggle = !toggle">{{ view.text }}</button>
  <ViewRenderer v-if="toggle" :view="view.view" :ctx />
</template>
