import { AttrUnit } from './attrs';

export interface SpanContext {
  parent?: string;
  span: string;
  thread: string;
}

export interface StartSpanPayload extends SpanContext {
  attrs?: AttrUnit[];
  name: string;
}

export interface LoadSpanPayload extends SpanContext {
  attrs?: AttrUnit[];
}

export type StopSpanPayload = SpanContext;
