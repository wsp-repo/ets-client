import { KafkaConfig } from './kafka';

export interface ClientConfig<T = KafkaConfig> {
  config?: T;
  envPrefix?: string;
}
