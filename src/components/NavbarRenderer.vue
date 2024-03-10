<script setup lang="ts">
import { defineProps } from 'vue';
import type { ViewNavbar } from '@/types';
import { useRoute } from 'vue-router';
import ViewRenderer from './ViewRenderer.vue';

const { view, ctx } = defineProps<{
  view: ViewNavbar;
  ctx: Record<string, any>;
}>();

const route = useRoute();
</script>

<template>
  <nav>
    <ul>
      <li v-for="(item, i) in view.links" :key="i">
        <ViewRenderer :view="item" :ctx="ctx" :class="{ active: item.href === route.path }" />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.active {
  font-weight: bold;
}

ul {
  margin: 1em auto;
}
</style>
