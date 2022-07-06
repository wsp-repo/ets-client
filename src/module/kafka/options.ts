import { KafkaOptions, Transport } from '@nestjs/microservices';

/**
 * Возвращает объект опций kafka-клиента для соединения
 */
export function getClientOptionsForKafkaTransport(): KafkaOptions {
  const envBrokers = process.env.KAFKA_BROKERS || 'localhost:9092';
  const groupId = process.env.KAFKA_GROUP_ID || 'wspro-ets';
  const sepBrokersList = /[ ,;]+/;

  const brokers = envBrokers
    .split(sepBrokersList)
    .map((b) => b.trim())
    .filter(Boolean);

  return {
    options: {
      client: { brokers },
      consumer: {
        allowAutoTopicCreation: true,
        groupId,
      },
      producer: {
        allowAutoTopicCreation: true,
        idempotent: true,
      },
    },
    transport: Transport.KAFKA,
  };
}
