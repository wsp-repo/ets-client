export enum EventTypes {
  Error = 'error',
  Event = 'event',
  Start = 'start',
  Stop = 'stop',
  Load = 'load',
}

export interface EventUnit {
  data?: unknown;
  name: string;
  type: EventTypes;
}

export interface AddEventPayload extends EventUnit {
  span: string;
  thread: string;
  tracer: string;
  time?: number;
}
