<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { evaluateStrWithCtx } from '@/eval';
const { view, ctx: oldCtx } = defineProps<{ view: string; ctx: Record<string, any> }>();

const ctx = { ...oldCtx };
for (const key in ctx) {
  if (ctx[key]?.__isAction) {
    ctx[key] = { ...ctx[key], ...ctx[key].apiFunc() };
  }
}

const text = ref(view);
watchEffect(() => {
  text.value = evaluateStrWithCtx(view, ctx);
});
</script>

<template>
  {{ text }}
</template>
