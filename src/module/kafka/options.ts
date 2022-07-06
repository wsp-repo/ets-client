import { KafkaOptions, Transport } from '@nestjs/microservices';

import { DEF_KAFKA_BROKERS, DEF_KAFKA_GROUP_ID } from './constants';

/**
 * Возвращает объект опций kafka-клиента для соединения
 */
export function getClientOptionsForKafkaTransport(): KafkaOptions {
  const envBrokers = String(process.env.KAFKA_BROKERS || '').trim();
  const groupId = String(process.env.KAFKA_GROUP_ID || '').trim();
  const sepBrokersList = /[ ,;]+/;

  const brokers = new Set<string>(
    envBrokers
      .split(sepBrokersList)
      .map((b) => b.trim())
      .filter(Boolean),
  );

  if (brokers.size === 0) {
    brokers.add(DEF_KAFKA_BROKERS);
  }

  return {
    options: {
      client: {
        brokers: [...brokers],
      },
      consumer: {
        allowAutoTopicCreation: true,
        groupId: groupId || DEF_KAFKA_GROUP_ID,
      },
      producer: {
        allowAutoTopicCreation: true,
        idempotent: true,
      },
    },
    transport: Transport.KAFKA,
  };
}
