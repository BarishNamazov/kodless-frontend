<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { ViewLink } from '@/types';

const { view, ctx } = defineProps<{
  view: ViewLink;
  ctx: Object;
}>();
//console.log('LinkRenderer', view, ctx);
</script>

<template>
  <router-link :to="view.href" :target="view.targetBlank ? '_blank' : undefined">{{ view.text }}</router-link>
</template>
