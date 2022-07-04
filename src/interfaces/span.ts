import { AttrUnit } from './attrs';

export interface SpanContext {
  parent?: string;
  span: string;
  tracer: string;
}

export interface StartSpanPayload extends SpanContext {
  attrs?: AttrUnit[];
  name: string;
  thread: string;
}

export interface LoadSpanPayload extends SpanContext {
  attrs?: AttrUnit[];
  thread: string;
}

export interface StopSpanPayload extends SpanContext {
  thread: string;
}
