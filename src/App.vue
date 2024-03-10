<script setup lang="ts">
import { useRoute } from 'vue-router';
import app from './config';
import { computed, onBeforeMount, onMounted } from 'vue';
import ViewRenderer from './components/ViewRenderer.vue';
import type { View } from './types';
import { useApi } from './composables/useApi';
import { useFetchy } from './composables/useFetchy';

const route = useRoute();

const view = computed<View>(() => {
  // Need to wait for the route to be updated
  if (route.fullPath !== window.location.pathname) {
    return {
      type: 'text',
      text: 'Loading...'
    };
  }

  const path = route.fullPath;
  const view = app.pages.find((page) => page.path === path)?.view;
  if (!view) {
    console.error(`No view found for path: ${path}`);
    return {
      type: 'text',
      text: '404 Not Found'
    };
  }
  return view;
});

const ctx: { [key: string]: any } = {};
for (const action of app.actions) {
  const apiFunc = (args: Record<string, any>, additionalParams: Record<string, any>) => {
    return useFetchy(action.path, action.method, {
      body: args[0] ?? {},
      additionalParams
    });
  };
  ctx[action.name] = { apiFunc: useApi(apiFunc, action.name, action.refreshes), __isAction: true };
}

onBeforeMount(() => {
  document.title = app.name;
  if (app.favicon) {
    document.querySelector('link[rel="icon"]')?.setAttribute('href', app.favicon);
  }
});
</script>

<template>
  <main>
    <ViewRenderer :view :ctx :key="$route.fullPath" />
  </main>
</template>

<style scoped>
main {
  padding: 0;
  margin: 0 auto;
  max-width: 40em;
}
</style>
