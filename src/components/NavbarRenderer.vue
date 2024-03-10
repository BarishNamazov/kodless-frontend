<script setup lang="ts">
import { defineProps } from 'vue';
import type { ViewNavbar } from '@/types';
import { RouterLink, useRoute } from 'vue-router';

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
        <router-link :to="item.href" :class="{ active: item.href === route.path }">{{ item.text }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.active {
  font-weight: bold;
}
</style>
