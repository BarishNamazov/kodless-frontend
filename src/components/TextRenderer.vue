<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { ViewText } from '@/types';
import { evaluateWithCtx } from '@/util';

const { view, ctx } = defineProps<{
  view: ViewText;
  ctx: Record<string, any>;
}>();

//console.log('Text', view, ctx);
const text = ref('...');

watchEffect(() => {
  text.value = evaluateWithCtx(view.text, ctx);
});
</script>

<template>
  <span>{{ text }}</span>
</template>
