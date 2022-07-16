export interface ClientConfig<T> {
  clientConfig?: T;
  envPrefix?: string;
}

export enum ClientTopics {
  InitTracer = 'init-tracer',
  StartSpan = 'start-span',
  StopSpan = 'stop-span',
  LoadSpan = 'load-span',
  SetAttrs = 'set-attrs',
  AddEvent = 'add-event',
}
