import { evaluateWithCtx } from '@/eval';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type BodyT = string | Date | number | boolean | null | undefined | BodyT[] | { [key: string]: BodyT };

/**
 * A wrapper around fetch that handles errors and alerts the messages to the user.
 *
 * @param url The url to fetch from
 * @param method The HTTP method to use
 * @param options.query The query parameters to add to the url
 * @param options.body The body to send
 * @param options.toastParams If the response has a property with the name of one of these, alert the user
 * @returns The response body
 * @throws An error if the response is not ok
 */
export async function useFetchy(
  url: string,
  method: HttpMethod,
  options: {
    query?: Record<string, string>;
    body?: BodyT;
    toastParams?: string[];
    additionalParams?: Record<string, any>;
    includeCredentials?: boolean;
  }
) {
  options = options ?? {};
  options.toastParams = options.toastParams ?? [];
  options.includeCredentials = options.includeCredentials ?? true;

  const additionalParams = options.additionalParams;
  // Check if url contains parameters like :id and replace them with the actual values from additionalParams
  if (additionalParams) {
    // find all needed keys from url, but after the first /
    const keys = url.match(/\/:([a-zA-Z0-9]+)/g) ?? [];
    // replace all keys with the actual values
    keys.forEach((key) => {
      const keyName = key.slice(2);
      let val = evaluateWithCtx(keyName, additionalParams);
      // val = evaluateWithCtx(val, additionalParams);
      url = url.replace(key, '/' + val);
    });
  }

  if (options.body && JSON.stringify(options.body) === '{}') {
    options.body = null;
  }

  const queryString = new URLSearchParams(options.query).toString();
  const fullUrl = `${url}?${queryString}`;

  if (method === 'GET' && options.body) {
    throw new Error(`Cannot have a body with a ${method} request`);
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: options.includeCredentials ? 'include' : 'omit'
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(fullUrl, fetchOptions);

  if (response.status === 500) {
    console.error('Internal server error');
    throw new Error('Something went wrong.');
  }

  const result = await response.json();

  for (const param of options.toastParams) {
    if (result[param]) {
      alert(result[param]);
    }
  }

  if (!response.ok) {
    throw new Error(result.msg ?? 'Something went wrong.');
  }

  return result;
}

declare global {
  interface Window {
    fetchy: typeof useFetchy;
  }
}

window.fetchy = useFetchy;
