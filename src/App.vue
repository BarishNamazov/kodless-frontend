<script setup lang="ts">
import app from './config';
import { useRoute } from 'vue-router';
import { computed, onBeforeMount, ref, toRaw } from 'vue';

import { useApi } from './composables/useApi';
import { useFetchy } from './composables/useFetchy';
import { listenToParams, separateParams } from './util';

import HrmlRenderer from './components/HrmlRenderer.vue';
import TextRenderer from './components/TextRenderer.vue';
import { PAGE_TAG } from '../hrml/types';
import router from './router';

const route = useRoute();

const { params, views } = separateParams(app.pages);
const pages = app.pages.filter((view) => typeof view === 'object' && view.tag === PAGE_TAG);

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
    const path = new URL(action.path, app['base-url']);
    const apiFunc = (args: Record<string, any>, additionalParams: Record<string, any>) => {
      return useFetchy(path.toString(), action.method, {
        body: args[0] ?? {},
        additionalParams,
        includeCredentials: !action.noCredentials
      });
    };

    const pathParams = path.pathname.match(/:[a-zA-Z0-9]+/g);
    let params = action.params?.split(',').map((param) => param.trim()) ?? [];
    if (pathParams) {
      params = [...new Set([...params, ...pathParams.map((param) => param.slice(1))])];
    }

    ctx[action.name] = {
      apiFunc: useApi(apiFunc, action.name, refreshes[action.name]),
      __isAction: true,
      params
    };

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

const pageParams = ref({});
const setupPage = () => {
  pageParams.value = {};
  const { pathname, search } = window.location;

  const page = pages.find((page) => {
    const pagePathname = new URL(page.attributes.path, window.location.origin).pathname;
    if (pagePathname === pathname) {
      return true;
    }

    const target = page.attributes.path;
    const pathnames = pathname.split('/');
    const targets = target.split('/');
    if (pathnames.length !== targets.length) {
      return false;
    }
    let match = true;
    const params: Record<string, string> = {};
    for (let i = 0; i < pathnames.length; i++) {
      if (targets[i].startsWith(':')) {
        params[targets[i].slice(1)] = pathnames[i];
        continue;
      }
      if (pathnames[i] !== targets[i]) {
        match = false;
        break;
      }
    }
    if (match) {
      page.params = params;
      return true;
    }
    return false;
  });

  if (page) {
    const searchPage = new URL(page.attributes.path, window.location.origin).search;

    const qCurrent = Object.fromEntries(new URLSearchParams(search).entries());
    const qBase = Object.fromEntries(new URLSearchParams(searchPage).entries());

    const q: Record<string, string> = {};
    for (const key in qBase) {
      q[key] = qCurrent[key] ?? qBase[key];
    }

    pageParams.value = { ...page.params, ...q };
    document.title = page.attributes.pageTitle ?? title;
  }

  return page;
};

let currentPage = ref(setupPage());
router.afterEach(() => {
  const oldPageParams = pageParams.value;
  currentPage.value = setupPage();
  // Very inefficient -- do better later
  if (JSON.stringify(oldPageParams) !== JSON.stringify(pageParams.value)) {
    updater.value++;
  }
});
</script>

<template>
  <div id="k-body">
    <template v-for="view in views" :key="updater">
      <TextRenderer v-if="typeof view === 'string'" :view :ctx />
      <HrmlRenderer v-else-if="view.tag !== PAGE_TAG" :view :ctx />
      <HrmlRenderer v-else-if="view === toRaw(currentPage)" :view :ctx="{ ...ctx, ...pageParams }" />
    </template>
  </div>
</template>
