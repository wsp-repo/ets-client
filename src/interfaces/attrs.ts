export interface AttrUnit {
  name: string;
  value: unknown;
}

export interface SetAttrPayload extends AttrUnit {
  span?: string;
  thread?: string;
  tracer: string;
}
