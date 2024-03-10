export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}

export type JSONTypeLiteralBase = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

export type JSONObjectTypeLiteral = {
  [key: string]: JSONTypeLiteral;
};

export type JSONTypeLiteral = JSONTypeLiteralBase | JSONObjectTypeLiteral;

export interface Action {
  name: string; // unique name of the action, e.g., getPosts
  method: HttpMethod;
  path: string; // path of the API, might contain path params, e.g., /posts/:_id

  params: Record<string, JSONTypeLiteral>; // the shape of the request, e.g., { id: 'number' }

  returns: JSONTypeLiteral | Record<string, JSONTypeLiteral>; // the shape of the response, e.g., { posts: 'array' }

  refreshes?: string[]; // name of the actions to refresh once action is done, e.g., ['getPosts'] if this action is 'createPost'
}

export interface Form {
  name: string; // unique name of the form, e.g., createPost
  title?: string; // title of the form, e.g., 'Create Post'
  params: Record<string, JSONTypeLiteral>; // "hidden" fields of this form, e.g., [{ id: 123 }]
  fields: Array<FormField>; // visible fields of this form, e.g., [{ name: 'title', label: 'Title', required: true, type: 'text' }]
  action: string; // name of the action to call when the form is submitted, e.g., 'createPost'
}

// FormParam is a hidden field in the form
export interface FormParam {
  name: string;
  value: JSONValue;
}

// FormField is a visible field in the form
export interface FormFieldBase {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'password'
    | 'checkbox'
    | FormFieldWithOptions['type']
    | FormFieldSubmitAction['type'];
}

// FormFieldWithOptions is a visible field in the form with options
export interface FormFieldWithOptions extends FormFieldBase {
  type: 'select' | 'radio';
  options: Array<string>;
}

// FormFieldSubmitAction is a visible field in the form that submits the form to the given action
export interface FormFieldSubmitAction extends FormFieldBase {
  type: 'submit';
}

export type FormField = FormFieldBase | FormFieldWithOptions | FormFieldSubmitAction;

export interface ViewBase {
  name?: string;
  type: string;
  params?: Record<string, JSONValue>;
  styles?: Partial<CSSStyleDeclaration>;
}

// ViewText is a view that renders text
interface ViewTextT extends ViewBase {
  type: 'text';
  text: string;
}

export interface ViewLink extends ViewBase {
  type: 'link';
  href: string;
  text: string;
  targetBlank?: boolean;
}

// ViewImage is a view that renders an image
export interface ViewImage extends ViewBase {
  type: 'image';
  url: string;
  alt: string;
}

// ViewList is a view that renders a list of items
// Each child is a view that is rendered for each item in the list
export interface ViewList extends ViewBase {
  type: 'list';
  value: string;
  itemRef?: string;
  container: ViewContainer;
}

// ViewContainer is a view that contains other views
interface ViewContainerT extends ViewBase {
  type: 'container';
  children: Array<View>;
}

export interface ViewNavbar extends ViewBase {
  type: 'navbar';
  links: Array<ViewLink>;
}

// ViewForm is a view that renders a form
export interface ViewForm extends ViewBase {
  type: 'form';
  form: string; // name of the form to render
  params: Record<string, JSONValue>; // params to pass to the form (i.e., the hidden fields of the form)
  inline?: boolean; // whether to render the form inline
}

export type ViewText = ViewTextT | string;
export type ViewContainer = ViewContainerT | Array<View>;

export type View = ViewText | ViewLink | ViewImage | ViewList | ViewContainer | ViewForm | ViewNavbar;

// Page is a collection of views
export interface Page {
  name: string;
  path: string;
  view: View;
}

// App is a collection of pages, actions, and forms
export interface App {
  name: string;
  favicon?: string;
  pages: Array<Page>;
  actions: Array<Action>;
  forms: Array<Form>;
}
