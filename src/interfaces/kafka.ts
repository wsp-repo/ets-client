export interface KafkaConfig {
  brokers: string[];
  groupId?: string;
  prefix: string;
}

export enum KafkaTopics {
  InitTracer = 'init-tracer',
  StartSpan = 'start-span',
  StopSpan = 'stop-span',
  LoadSpan = 'load-span',
  SetAttrs = 'set-attrs',
  AddEvent = 'add-event',
}
