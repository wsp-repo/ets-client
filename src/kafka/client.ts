import { Kafka, Message, Producer } from 'kafkajs';

import { ClientConfig, ClientTopics, KafkaConfig } from '../interfaces';

import { getKafkaConfig, getKafkaTopic } from './config';

export class EtsClientKafka {
  private static instance: EtsClientKafka;

  private client!: Kafka;

  private producer!: Producer;

  private constructor(private readonly config: KafkaConfig) {}

  /**
   * Статический метод создания подключения к кафке
   */
  public static async getClient(
    config?: ClientConfig<KafkaConfig>,
  ): Promise<EtsClientKafka | undefined> {
    if (this.instance || !config) return this.instance;

    this.instance = new this(getKafkaConfig(config));

    await this.instance.initClient();

    return this.instance;
  }

  /**
   * Отправка сообщения-запроса
   */
  public send(
    topic: ClientTopics,
    data?: unknown,
    timeout = 10000,
  ): Promise<unknown> {
    return this.producer.send({
      acks: -1,
      messages: this.getMessages(data),
      timeout,
      topic: getKafkaTopic(topic),
    });
  }

  /**
   * Отправка сообщения-события
   */
  public emit(topic: ClientTopics, data?: unknown): void {
    this.producer.send({
      acks: 1,
      messages: this.getMessages(data),
      topic: getKafkaTopic(topic),
    });
  }

  /**
   * Возвращает готовый массив сообщений
   */
  private getMessages(data?: unknown): Message[] {
    return data ? [{ value: JSON.stringify(data) }] : [];
  }

  /**
   * Инициализация соединения с кафкой
   */
  private async initClient(): Promise<void> {
    const { brokers } = this.config;

    this.client = new Kafka({ brokers });

    this.producer = this.client.producer({
      allowAutoTopicCreation: true,
      idempotent: true,
    });

    await this.producer.connect();
  }
}
