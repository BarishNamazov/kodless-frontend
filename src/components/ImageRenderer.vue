<script setup lang="ts">
import type { ViewImage } from '@/types';

const { view, ctx } = defineProps<{
  view: ViewImage;
  ctx: Object;
}>();
//console.log('ImageRenderer', view, ctx);
</script>

<template>
  <img :src="view.url" :alt="view.alt" />
</template>
