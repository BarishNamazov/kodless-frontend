<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { evaluateWithCtx } from '@/eval';
import type { HrmlElement } from 'hrml/types';
import { listenToParams, separateParams } from '@/util';

import ChildrenRenderer from './ChildrenRenderer.vue';
import ForEachRenderer from './ForEachRenderer.vue';
import FormRenderer from './FormRenderer.vue';

// For these, we need to calculate params for each child separately
const TAGS_WITH_SPECIAL_CTX = ['foreach', 'tree'];

const { view, ctx: oldCtx } = defineProps<{ view: HrmlElement; ctx: Record<string, any> }>();

const ctx = { ...oldCtx };
for (const key in ctx) {
  if (ctx[key]?.__isAction) {
    ctx[key] = { ...ctx[key], ...ctx[key].apiFunc() };
  }
}

const { params, views: children } = separateParams(view.children);

let updater = ref(0);

if (!TAGS_WITH_SPECIAL_CTX.includes(view.tag)) {
  updater = listenToParams(params, ctx);
}

const show = computed(() => {
  if (!view.attributes.if) {
    return true;
  }
  return evaluateWithCtx(view.attributes.if, ctx);
});

const styles = computed(() => {
  // Combine evalutated sstyles with styles
  const cssToObj = (css: string) => {
    return css.split(';').reduce(
      (acc, curr) => {
        const [key, value] = curr.split(':');
        if (key && value) {
          acc[key.trim()] = value.trim();
        }
        return acc;
      },
      {} as Record<string, string>
    );
  };

  const styles = view.attributes.style ? cssToObj(view.attributes.style) : {};
  const sstyles = view.attributes.sstyle ? cssToObj(evaluateWithCtx(view.attributes.sstyle, ctx)) : {};
  return { ...styles, ...sstyles };
});

const thisRef = ref<HTMLElement | null>(null);
onMounted(() => {
  if (view.attributes.bind) {
    ctx[view.attributes.bind] = thisRef;
  }
});

if ('log' in view.attributes) {
  console.log(view, ctx);
}
</script>

<template>
  <template v-if="!!show">
    <template v-if="view.tag === 'foreach'" ref="thisRef">
      <ForEachRenderer :view :ctx :key="updater" />
    </template>

    <template v-else-if="view.tag === 'a'">
      <RouterLink :to="view.attributes.href" v-bind="view.attributes" :key="updater" :style="styles" ref="thisRef">
        <ChildrenRenderer :views="children" :ctx />
      </RouterLink>
    </template>

    <template v-else-if="view.tag === 'form'">
      <FormRenderer :view :ctx :key="updater" :style="styles" ref="thisRef" />
    </template>

    <!-- <template v-else-if="view.tag === 'toggle'">
      <ToggleRenderer :view :ctx :key="updater" :style="styles" />
    </template> -->

    <!-- <template v-else-if="view.tag === 'tree'">
      <TreeRenderer :view :ctx :key="updater" />
    </template> -->

    <component v-else :is="view.tag" v-bind="view.attributes" :key="updater" :style="styles" ref="thisRef">
      <ChildrenRenderer :views="children" :ctx />
    </component>
  </template>
</template>
