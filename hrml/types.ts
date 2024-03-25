export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type HrmlElement = {
  tag: string;
  attributes: Record<string, string>;
  children: Array<View>;
};

export type Text = string;

export type View = HrmlElement | Text;

export interface PageElement extends HrmlElement {
  tag: 'k-page';
  attributes: {
    pageTitle?: string;
    path: string;
  };
  children: Array<View>;
  params?: Record<string, string>;
}

export type Action = {
  name: string;
  method: HttpMethod;
  path: string;

  params?: string;
  returns?: string;
  refreshOn?: string[];
  noCredentials?: boolean;
};

export type HRMLParserResult = {
  head: string;

  actions: Array<Action>;
  toastParams: string[];
  'base-url'?: string;

  pages: Array<PageElement>;
};

export const ACTIONS_TAG = 'k-actions';
export const ACTION_TAG = 'k-action';
export const TOAST_TAG = 'k-toast';

export const PAGE_TAG = 'k-page';
export const PARAM_TAG = 'k-param';
export const FOREACH_TAG = 'k-foreach';

export const IF_ATTR = 'k-if';
export const ELSE_ATTR = 'k-else';
export const STYLE_ATTR = 'k-style';
