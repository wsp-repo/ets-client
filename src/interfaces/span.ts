import { AttrUnit } from './attrs';

export interface SpanContext {
  parent?: string;
  span: string;
}

export interface BaseSpanPayload {
  thread: string;
  tracer: string;
}

export interface StartSpanPayload extends BaseSpanPayload {
  attrs?: AttrUnit[];
  name: string;
}

export interface LoadSpanPayload extends BaseSpanPayload {
  attrs?: AttrUnit[];
}

export type StopSpanPayload = BaseSpanPayload;
