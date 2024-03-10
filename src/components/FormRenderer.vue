<script setup lang="ts">
import type { FormField, ViewForm } from '@/types';
import { h } from 'vue';
import app from '@/config';
import { evaluateWithCtx } from '@/eval';

const { view, ctx } = defineProps<{
  view: ViewForm;
  ctx: Record<string, any>;
}>();

const form = app.forms.find((form) => form.name === view.form);

const renderFormField = (field: FormField) => {
  switch (field.type) {
    case 'text':
      return h('label', [
        field.label,
        h('input', { placeholder: field.placeholder, name: field.name, required: field.required })
      ]);
    case 'textarea':
      return h('label', [
        field.label,
        h('textarea', { placeholder: field.placeholder, name: field.name, required: field.required })
      ]);
    // TODO: Add more field types
    case 'submit':
      return h('button', field.label);
    default:
      return h('div', `Unknown field type: ${field.type}`);
  }
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);

  let params: Record<string, any> = Object.fromEntries(formData.entries());
  const formParams = Object.fromEntries(
    Object.entries(view.params).map(([key, value]) => [
      key,
      typeof value === 'string' ? evaluateWithCtx(value, ctx) : value
    ])
  );

  params = { ...params, ...formParams };
  const { execute, setAdditionalParams } = ctx[form!.action];
  setAdditionalParams(formParams);
  await execute(params);
  (e.target as HTMLFormElement).reset();
};
</script>

<template>
  <p v-if="!form">Form not found: {{ view.form }}</p>
  <form v-else @submit="handleSubmit">
    <h3 v-if="form.title">{{ form.title }}</h3>
    <div v-for="(field, i) in form.fields" :key="i">
      <component :is="renderFormField(field)" />
    </div>
  </form>
</template>
