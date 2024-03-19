<script setup lang="ts">
import app from './config';
import { useRoute } from 'vue-router';
import { computed, onBeforeMount } from 'vue';

import { useApi } from './composables/useApi';
import { useFetchy } from './composables/useFetchy';
import { listenToParams, separateParams } from './util';

import HrmlRenderer from './components/HrmlRenderer.vue';
import TextRenderer from './components/TextRenderer.vue';

const route = useRoute();

const { params, views } = separateParams(app.pages);
const pages = app.pages.filter((view) => typeof view === 'object' && view.tag === 'page');

const ctx: Record<string, any> = {};

function handleActions() {
  // Get a list of actions that should be refreshed when another action is called
  const refreshes: Record<string, string[]> = {};
  for (const action of app.actions) {
    for (const refresh of action.refreshOn ?? []) {
      if (!refreshes[refresh]) {
        refreshes[refresh] = [];
      }
      refreshes[refresh].push(action.name);
    }
  }

  // Initialize the actions in the context
  for (const action of app.actions) {
    const path = new URL(action.path, app.baseUrl).toString();
    const apiFunc = (args: Record<string, any>, additionalParams: Record<string, any>) => {
      return useFetchy(path, action.method, {
        body: args[0] ?? {},
        additionalParams,
        includeCredentials: !action.noCredentials
      });
    };
    ctx[action.name] = { apiFunc: useApi(apiFunc, action.name, refreshes[action.name]), __isAction: true };
    ctx[action.name] = { ...ctx[action.name], ...ctx[action.name].apiFunc() };
  }
}

handleActions();

// TODO:
// Optimize this piece. Right now, for global state change, it
// will re-render all the components and make the API calls again
const updater = listenToParams(params, ctx);

let title: string;
onBeforeMount(() => {
  if (app.head) {
    document.head.innerHTML = app.head;
  }
  title = document.title;
});

const currentPage = computed(() => {
  const path = route.path;
  if (window.location.pathname !== path) {
    return undefined;
  }
  const page = pages.find((page) => page.attributes.path === path);
  if (!page) {
    return undefined;
  }
  if (page?.attributes.pageTitle) {
    document.title = page.attributes.pageTitle;
  } else {
    document.title = title;
  }
  return page;
});
</script>

<template>
  <template v-for="view in views" :key="updater">
    <TextRenderer v-if="typeof view === 'string'" :view :ctx />
    <HrmlRenderer v-else-if="view.tag !== 'page'" :view :ctx />
    <HrmlRenderer v-else-if="view === currentPage" :view :ctx />
  </template>
</template>
