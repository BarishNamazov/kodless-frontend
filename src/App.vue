<script setup lang="ts">
import { useRoute } from 'vue-router';
import app from './config';
import { computed, onBeforeMount, onMounted, ref, watchEffect } from 'vue';
import ViewRenderer from './components/ViewRenderer.vue';
import type { View } from './types';
import { useApi } from './composables/useApi';
import { useFetchy } from './composables/useFetchy';
import { evaluateWithCtx } from './eval';

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
      additionalParams,
      includeCredentials: action.includeCredentials ?? true
    });
  };
  ctx[action.name] = { apiFunc: useApi(apiFunc, action.name, action.refreshes), __isAction: true };
  ctx[action.name] = { ...ctx[action.name], ...ctx[action.name].apiFunc() };
}

// TODO: this is a hacky way to force a re-render when a param changes
// VERY inefficient, but it works for now
// WILL MAKE a lot of unnecessary API calls sometimes
const updater = ref(0);
for (const [param, value] of Object.entries(app.params ?? {})) {
  if (value && typeof value === 'string') {
    watchEffect(() => {
      const oldVal = ctx[param];
      ctx[param] = evaluateWithCtx(value, ctx);
      if (oldVal !== ctx[param]) {
        updater.value++;
      }
    });
  }
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
    <ViewRenderer :view :ctx :key="$route.fullPath + updater" />
  </main>
</template>

<style scoped>
main {
  padding: 0;
  margin: 0 auto;
  max-width: 40em;
}
</style>
