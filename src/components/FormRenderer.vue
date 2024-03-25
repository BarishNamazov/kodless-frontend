<script setup lang="ts">
import type { HrmlElement } from 'hrml/types';
import ChildrenRenderer from './ChildrenRenderer.vue';
import { ref } from 'vue';
import { separateParams } from '@/util';
import { evaluateWithCtx } from '@/eval';
import router from '@/router';

const { view, ctx } = defineProps<{ view: HrmlElement; ctx: Record<string, any> }>();

const { params } = separateParams(view.children);

const form = ref<HTMLFormElement | null>(null);
async function handleSubmit(e: Event) {
  e.preventDefault();
  let fields = Object.fromEntries(new FormData(form.value!).entries());

  const hiddenFields = Object.fromEntries(
    params.map((param) => {
      return [param.name, param.value ? evaluateWithCtx(param.value, ctx) : evaluateWithCtx(param.name, ctx)];
    })
  );

  const action = view.attributes.action;

  const { execute, setAdditionalParams } = ctx[action];

  setAdditionalParams(hiddenFields);
  await execute({ ...fields, ...hiddenFields });
  form.value!.reset();

  if (view.attributes.redirect) {
    router.push(view.attributes.redirect);
  }
}
</script>

<template>
  <form @submit="handleSubmit" ref="form" v-bind="view.attributes">
    <ChildrenRenderer :views="view.children" :ctx="ctx" />
  </form>
</template>
