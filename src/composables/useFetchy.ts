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
 * @param options.alert Whether to alert the user of the response message (default: true)
 * @returns The response body
 * @throws An error if the response is not ok
 */
export async function useFetchy(
  url: string,
  method: HttpMethod,
  options?: {
    query?: Record<string, string>;
    body?: BodyT;
    alert?: boolean;
    additionalParams?: Record<string, any>;
  }
) {
  options = options ?? {};
  options.alert = options.alert ?? true;

  // Check if url contains parameters like :id and replace them with the actual values from additionalParams
  if (options.additionalParams) {
    // find all needed keys from url, but after the first /
    const keys = url.match(/\/:([a-zA-Z0-9]+)/g) ?? [];
    // replace all keys with the actual values
    keys.forEach((key) => {
      const keyName = key.slice(2);
      let val = evaluateWithCtx(keyName, options.additionalParams);
      val = evaluateWithCtx(val, options.additionalParams);
      url = url.replace(key, '/' + val);
    });
  }

  if (options.body && JSON.stringify(options.body) === '{}') {
    options.body = null;
  }

  const queryString = new URLSearchParams(options.query).toString();
  const fullUrl = `${url}?${queryString}`;

  if ((method === 'GET' || method === 'DELETE') && options.body) {
    throw new Error(`Cannot have a body with a ${method} request`);
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
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

  if (options.alert && result.msg) {
    //console.log(result.msg);
    // TODO: alert the user
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
