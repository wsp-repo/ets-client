import { v4 as generateUuid } from 'uuid';

import { EtsCore } from './ets.core';
import { EtsFactorySpan, EtsSpan } from './ets.span';
import { EtsClientKafka } from '../kafka/client';

import {
  AnyObject,
  AttrUnit,
  EnvPrefix,
  InitTracerPayload,
  KafkaConfig,
  KafkaTopics,
  SpanContext,
} from '../interfaces';

export class EtsTracer extends EtsCore {
  private static instance: EtsTracer;

  private readonly tracerUuid!: string;

  private constructor(client: EtsClientKafka) {
    super(client);

    this.tracerUuid = generateUuid();
  }

  /**
   * Статический метод создания нового спана
   */
  public static async getTracer(options?: {
    kafka: EnvPrefix | KafkaConfig;
    tracer: {
      name: string;
      attrs?: AttrUnit[];
    };
  }): Promise<EtsTracer | undefined> {
    if (this.instance || !options) {
      return this.instance;
    }

    const { kafka, tracer } = options;

    const client = await EtsClientKafka.getClient(kafka);

    if (!client) return undefined;

    const { name, attrs } = tracer;

    this.instance = new EtsTracer(client);

    await this.instance.initTracer(name, attrs);

    return this.instance;
  }

  /**
   * Инициирует спан из контекста в рамках текущего трейсера
   */
  public loadSpan(context: SpanContext): EtsSpan {
    return EtsFactorySpan.loadSpan(
      { client: this.client, tracer: this.tracerUuid },
      context,
    );
  }

  /**
   * Создает новый корневой спан в рамках текущего трейсера
   */
  public startSpan(name: string, attrs?: AttrUnit[]): EtsSpan {
    return EtsFactorySpan.startSpan(
      { client: this.client, tracer: this.tracerUuid },
      name,
      attrs,
    );
  }

  /**
   * Базовые параметры для пайлоада
   */
  protected basePayload(): AnyObject {
    return { tracer: this.tracerUuid };
  }

  /**
   * Инициализирует трейсер
   */
  private async initTracer(name: string, attrs?: AttrUnit[]): Promise<void> {
    const payload = this.getPayload<InitTracerPayload>({ attrs, name });

    await this.client.send(KafkaTopics.InitTracer, payload);
  }
}
