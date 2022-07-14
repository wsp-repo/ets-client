import { Kafka, Message, Producer } from 'kafkajs';

import { ClientConfig, KafkaTopics } from '../../interfaces';

import { getConfigFromEnv } from './config';

export class EtsClientKafka {
  private static instance: EtsClientKafka;

  private client!: Kafka;

  private producer!: Producer;

  private constructor(private readonly config: ClientConfig) {}

  /**
   * Статический метод создания подключения к кафке
   */
  public static async newClient(envPrefix: string): Promise<EtsClientKafka>;
  public static async newClient(config: ClientConfig): Promise<EtsClientKafka>;
  public static async newClient(options?: unknown): Promise<EtsClientKafka> {
    if (this.instance) return this.instance;

    const clientConfig: ClientConfig =
      typeof options === 'string'
        ? getConfigFromEnv(options || 'ETS_')
        : (options as ClientConfig);

    this.instance = new this(clientConfig);

    await this.instance.initModule();

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
   * Обработчик события инициализации
   */
  private async initModule(): Promise<void> {
    this.initClient();

    await this.initProducer();
  }

  /**
   * Инициализация продюсера
   */
  private async initProducer(): Promise<void> {
    this.producer = this.client.producer({
      allowAutoTopicCreation: true,
      idempotent: true,
    });

    await this.producer.connect();
  }

  /**
   * Инициализация соединения
   */
  private initClient(): void {
    const { brokers } = this.config;

    this.client = new Kafka({ brokers });
  }
}
