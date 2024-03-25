import { ref, watchEffect, type Ref } from 'vue';
import { IF_ATTR, PARAM_TAG, type View } from '../hrml/types';
import { evaluateWithCtx } from './eval';

export function separateParams(hrmlElements: View[]) {
  const params: { name: string; value: string; kIf?: string }[] = [];
  const views: View[] = [];

  for (const child of hrmlElements) {
    if (typeof child === 'object' && child.tag === PARAM_TAG) {
      params.push({ name: child.attributes.name, value: child.attributes.value, kIf: child.attributes[IF_ATTR] });
    } else {
      views.push(child);
    }
  }

  return { params, views };
}

export function listenToParams(
  params: { name: string; value: string; kIf?: string }[],
  ctx: Record<string, any>
): Ref<number> {
  const updater = ref(0);

  for (const { name, value, kIf } of params) {
    if (!value) {
      continue;
    }
    if (kIf && !evaluateWithCtx(kIf, ctx)) {
      continue;
    }

    watchEffect(() => {
      const oldValue = ctx[name];
      ctx[name] = evaluateWithCtx(value, ctx);
      if (oldValue != ctx[name]) {
        updater.value++;
      }
    });
  }
  return updater;
}
