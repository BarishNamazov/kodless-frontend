export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type HrmlElement = {
  tag: string;
  attributes: Record<string, string>;
  children: Array<View>;
};

export type Text = string;

export type View = HrmlElement | Text;

export type PageElement = {
  tag: 'page';
  attributes: {
    pageTitle?: string;
    path: string;
  };
  children: Array<View>;
};

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
  baseUrl?: string;

  pages: Array<PageElement>;
};
