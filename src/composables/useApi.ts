import { reactive, ref, watch } from 'vue';

type Func = (...args: any[]) => any;

const apiState = reactive({
  triggers: {} as Record<string, number>
});

export function refetchApi(key: string) {
  apiState.triggers[key] = (apiState.triggers[key] || 0) + 1;
}

export function useApi<F extends Func>(apiFunction: F, key: string, refreshes?: string[]) {
  return (options?: { silentFetch?: boolean; silentError?: boolean }) => {
    const o = options || {};
    o.silentFetch = o.silentFetch || true;
    o.silentError = o.silentError || false;

    const data = ref<Awaited<ReturnType<F>> | null>(null);
    const error = ref<string | null>(null);
    const loading = ref(false);
    let params: Parameters<F> | null = null;
    let firstRun = true;

    let additionalParams: Record<string, any> = {};
    const setAdditionalParams = (params: Record<string, any>) => {
      additionalParams = params;
    };

    const execute = async (...args: Parameters<F>): Promise<void> => {
      params = args;
      if (firstRun || !o.silentFetch) {
        loading.value = true;
      }
      firstRun = false;
      error.value = null;
      let err = null;
      try {
        data.value = await apiFunction(args, additionalParams);
      } catch (e) {
        error.value = e instanceof Error ? e.message : String(e);
        err = e;
      } finally {
        loading.value = false;
      }

      // Refresh other actions
      if (refreshes) {
        for (const refresh of refreshes) {
          refetchApi(refresh);
        }
      }

      // Throw error to be caught by the caller
      if (err && !o.silentError) {
        throw err;
      }
    };

    watch(
      () => apiState.triggers[key],
      async () => {
        if (params === null) {
          // usually the case when action is initialized for other views
          return;
        }
        void execute.call(null, ...params!);
      }
    );

    const handler: ProxyHandler<typeof data> = {
      get(target, prop, receiver) {
        if (firstRun) {
          if (params) {
            void execute.call(null, ...params!);
          } else {
            void execute.call(null);
          }
        }
        return Reflect.get(target, prop, receiver);
      }
    };

    const dataProxy = new Proxy(data, handler);

    return { data: dataProxy, error, loading, execute, setAdditionalParams };
  };
}
