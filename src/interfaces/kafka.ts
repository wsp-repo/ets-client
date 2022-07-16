export interface KafkaConfig {
  brokers: string[];
  groupId?: string;
  prefix: string;
}
