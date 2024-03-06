function safeValue(x: any) {
  return !x ? x : x.value;
}

// TODO: do something about this ...
function createReactiveContext(ctx: Record<string, any>) {
  return new Proxy(ctx, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (value && value.__isAction) {
        if (!value.data) {
          return value;
        }
        value.setAdditionalParams(ctx);
        return {
          ...value,
          data: safeValue(value.data),
          loading: safeValue(value.loading),
          error: safeValue(value.error)
        };
      }
      return value;
    }
  });
}

function evaluateStrWithCtx(str: string, ctx: Record<string, any>) {
  return str.replace(/\{\{([^}]+)\}\}/g, (_, expression) => {
    return evaluateExpWithCtx(expression, ctx);
  });
}

function evaluateExpWithCtx(expression: string, ctx: Record<string, any>) {
  const ctxProxy = createReactiveContext(ctx);
  const func = new Function('ctx', `with(ctx) { return ${expression}; }`);
  return func(ctxProxy);
}

export function evaluateWithCtx(thing: string, ctx: Record<string, any>) {
  if (thing.includes('{{')) {
    return evaluateStrWithCtx(thing, ctx);
  }
  try {
    return evaluateExpWithCtx(thing, ctx);
  } catch (_) {
    return thing;
  }
}
