<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { ViewText } from '@/types';
import { evaluateWithCtx } from '@/eval';

const { view, ctx } = defineProps<{
  view: ViewText | string;
  ctx: Record<string, any>;
}>();

const text = ref('...');

watchEffect(() => {
  text.value = evaluateWithCtx(typeof view === 'string' ? view : view.text, ctx);
});
</script>

<template>
  <span>{{ text }}</span>
</template>
