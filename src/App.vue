<script setup lang="ts">
import { useRoute } from 'vue-router';
import app from './config';
import { computed, onMounted } from 'vue';
import ViewRenderer from './components/ViewRenderer.vue';
import type { View } from './types';
import { useApi } from './composables/useApi';
import { useFetchy } from './composables/useFetchy';

const route = useRoute();

const view = computed<View>(() => {
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
    //console.log('HERE', args, additionalParams);
    return useFetchy(action.path, action.method, {
      body: args[0] ?? {},
      additionalParams
    });
  };
  ctx[action.name] = { ...useApi(apiFunc, action.name, action.refreshes)(), __isAction: true };
}

//console.log('App', view);
</script>

<template>
  <ViewRenderer :view :ctx :key="$route.fullPath" />
</template>
