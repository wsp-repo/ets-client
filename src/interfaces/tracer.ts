import { AttrUnit } from './attrs';

export interface InitTracerPayload {
  attrs?: AttrUnit[];
  name: string;
  tracer: string;
}
