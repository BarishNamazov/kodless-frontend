import type { HRMLParserResult } from './hrml/types';

// hrml.d.ts
declare module '*.hrml' {
  const content: HRMLParserResult;
  export default content;
}
