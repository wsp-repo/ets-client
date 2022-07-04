import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Client,
  ClientKafka,
  KafkaOptions,
  Transport,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { Patterns } from '../../interfaces';

/**
 * Возвращает объект опций kafka-клиента для соединения
 */
function getClientOptionsForKafkaTransport(): KafkaOptions {
  const envBrokers = process.env.KAFKA_BROKERS || 'localhost:9092';
  const groupId = process.env.KAFKA_GROUP_ID || 'ets-server';
  const sepBrokersList = /[ ,;]+/;

  const brokers = envBrokers
    .split(sepBrokersList)
    .map((b) => b.trim())
    .filter(Boolean);
  const retry = {};

  return {
    options: {
      client: { brokers, retry },
      consumer: { groupId },
    },
    transport: Transport.KAFKA,
  };
}

@Injectable()
export class EtsClientKafka implements OnModuleInit {
  @Client(getClientOptionsForKafkaTransport())
  private readonly client!: ClientKafka;

  /**
   * Отправка сообщения-запроса
   */
  public send(pattern: Patterns, params?: unknown): Promise<unknown> {
    return lastValueFrom(this.client.send(pattern, params));
  }

  /**
   * Отправка сообщения-события
   */
  public emit(pattern: Patterns, params?: unknown): void {
    this.client.emit(pattern, params);
  }

  /**
   * Обработчик события инициализации
   */
  public async onModuleInit(): Promise<void> {
    this.client.subscribeToResponseOf(Patterns.InitTracer);

    await this.client.connect();
  }
}
