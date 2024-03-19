import { HTMLElement, parse } from 'node-html-parser';
import { Action, HRMLParserResult, HrmlElement, PageElement } from './types';

export default function hrmlParser(code: string): HRMLParserResult {
  const parsed = parse(code);

  const headHTML = parsed.getElementsByTagName('head')[0]?.innerHTML.trim();
  if (!headHTML) {
    console.warn('No head tag found in the HRML file. Usign default head.');
  }

  const actionsContainer = parsed.getElementsByTagName('actions')[0];
  const actions = actionsContainer.getElementsByTagName('action').map((action) => {
    const { refreshOn, ...attrs } = action.attributes;
    if (!attrs.name || !attrs.method || !attrs.path) {
      throw new Error(`Action must have name, method, and path attributes. Found:\n ${action.outerHTML}`);
    }

    return {
      ...attrs,
      noCredentials: 'noCredentials' in action.attributes,
      refreshOn: action
        .getAttribute('refreshOn')
        ?.split(',')
        .map((s) => s.trim())
    } as Action;
  });

  const toastParams = actionsContainer
    .getElementsByTagName('toast')
    .map((toast) => toast.getAttribute('param') ?? '')
    .filter((param) => param.length > 0);

  const pagesContainer = parsed.getElementsByTagName('pages')[0];
  if (!pagesContainer) {
    throw new Error('No pages tag found in the HRML file.');
  }

  const processElement = (element: HTMLElement): HrmlElement => {
    let children = element.childNodes.map((child) => {
      if (child instanceof HTMLElement) {
        return processElement(child);
      }
      return child.rawText.trim();
    });

    children = children.filter((child) => typeof child === 'object' || child.trim().length > 0);

    return {
      tag: element.tagName.toLowerCase(),
      attributes: element.attributes,
      children
    };
  };

  const pages = processElement(pagesContainer);
  if (typeof pages === 'string') {
    throw new Error('Put in some tags inside pages :(');
  }

  return {
    head: headHTML,
    actions,
    toastParams,
    baseUrl: actionsContainer.getAttribute('baseUrl'),
    pages: pages.children as PageElement[]
  };
}
