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

        const params: Record<string, string> = {};
        for (const key of value.__params) {
          if (target[key]) {
            params[key] = target[key];
          }
        }

        value.setAdditionalParams(params);
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

export function evaluateStrWithCtx(str: string, ctx: Record<string, any>) {
  return str.replace(/\{\{([^}]+)\}\}/g, (_, expression) => {
    try {
      return evaluateExpWithCtx(expression, ctx);
    } catch (_) {
      return `{{${expression}}}`;
    }
  });
}

export function evaluateExpWithCtx(expression: string, ctx: Record<string, any>) {
  const ctxProxy = createReactiveContext(ctx);
  const func = new Function('ctx', `with(ctx) { return ${expression}; }`);
  return func(ctxProxy);
}

export function evaluateWithCtx(thing: string, ctx: Record<string, any>) {
  let count = 0;
  while (true) {
    let result;
    if (thing.includes('{{')) {
      try {
        result = evaluateStrWithCtx(thing, ctx);
      } catch (_) {
        result = thing;
      }
    } else {
      try {
        result = evaluateExpWithCtx(thing, ctx);
        if (result === undefined) {
          result = thing;
        }
      } catch (_) {
        result = thing;
      }
    }
    if (result === thing || typeof result !== 'string') {
      return result;
    }
    thing = result;
    count++;
    if (count > 10) {
      throw new Error('evaluateWithCtx: infinite loop detected');
    }
  }
}
