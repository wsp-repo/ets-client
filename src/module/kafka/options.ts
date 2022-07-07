import { KafkaOptions, Transport } from '@nestjs/microservices';

import { KAFKA_BROKERS, KAFKA_GROUP_ID } from './constants';

/**
 * Возвращает объект опций kafka-клиента для соединения
 */
export function getKafkaOptions(): KafkaOptions {
  return {
    options: {
      client: {
        brokers: KAFKA_BROKERS,
      },
      consumer: {
        allowAutoTopicCreation: true,
        groupId: KAFKA_GROUP_ID,
      },
      producer: {
        allowAutoTopicCreation: true,
        idempotent: true,
      },
    },
    transport: Transport.KAFKA,
  };
}
