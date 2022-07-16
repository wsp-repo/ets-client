import { Kafka, Message, Producer } from 'kafkajs';

import { ClientConfig, KafkaConfig, KafkaTopics } from '../interfaces';

import { getConfigFromEnv } from './config';

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

    const { envPrefix = 'ETS_', config: kafkaConfig } = config;

    this.instance = new this(kafkaConfig || getConfigFromEnv(envPrefix));

    await this.instance.initClient();

    return this.instance;
  }

  /**
   * Отправка сообщения-запроса
   */
  public send(
    topic: KafkaTopics,
    data?: unknown,
    timeout = 10000,
  ): Promise<unknown> {
    return this.producer.send({
      acks: 0,
      messages: this.getMessages(data),
      timeout,
      topic: this.getTopic(topic),
    });
  }

  /**
   * Отправка сообщения-события
   */
  public emit(topic: KafkaTopics, data?: unknown): void {
    this.producer.send({
      acks: 1,
      messages: this.getMessages(data),
      topic: this.getTopic(topic),
    });
  }

  /**
   * Возвращает полный топик
   */
  private getTopic(topic: KafkaTopics): string {
    const { prefix = 'wsp-ets' } = this.config;

    return `${prefix}:${topic}`;
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
