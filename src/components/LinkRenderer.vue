<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { ViewLink } from '@/types';

const { view, ctx } = defineProps<{
  view: ViewLink;
  ctx: Record<string, any>;
}>();
</script>

<template>
  <router-link :to="view.href" :target="view.targetBlank ? '_blank' : undefined">{{ view.text }}</router-link>
</template>
