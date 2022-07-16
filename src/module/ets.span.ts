import { v4 as generateUuid } from 'uuid';

import { EtsCore } from './ets.core';
import { EtsClientKafka } from '../kafka/client';

import {
  AnyObject,
  AttrUnit,
  KafkaTopics,
  LoadSpanPayload,
  SpanContext,
  StartSpanPayload,
} from '../interfaces';

interface SpanDeps {
  client: EtsClientKafka;
  tracer: string;
  parent?: string;
  thread?: string;
}

export class EtsSpan extends EtsCore {
  protected tracerUuid!: string;

  protected parentUuid?: string;

  protected threadUuid!: string;

  protected spanUuid!: string;

  protected constructor(
    protected readonly client: EtsClientKafka,
    options: {
      tracer: string;
      thread?: string;
      span?: string;
      parent?: string;
    },
  ) {
    super(client);

    const { thread, span, parent, tracer } = options;

    this.threadUuid = thread || generateUuid();
    this.spanUuid = span || generateUuid();
    this.tracerUuid = tracer;
    this.parentUuid = parent;
  }

  /**
   * Возвращает объект контекста
   */
  public getContext(): SpanContext {
    return {
      parent: this.parentUuid,
      span: this.spanUuid,
    };
  }

  /**
   * Возвращает новый дочерний спан
   */
  public startSpan(name: string, attrs?: AttrUnit[]): EtsSpan {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return EtsFactorySpan.startSpan(
      {
        client: this.client,
        parent: this.spanUuid,
        thread: this.threadUuid,
        tracer: this.tracerUuid,
      },
      name,
      attrs,
    );
  }

  /**
   * Отправляет трек останова спана
   */
  public stopSpan(): void {
    this.client.emit(KafkaTopics.StopSpan, this.getPayload());
  }

  /**
   * Базовые параметры для пайлоада
   */
  protected basePayload(): AnyObject {
    return { ...this.getContext() };
  }
}

/**
 * Фабричный класс для использования "под капотом"
 */
export class EtsFactorySpan extends EtsSpan {
  private constructor(
    protected readonly client: EtsClientKafka,
    options: {
      thread?: string;
      span?: string;
      parent?: string;
      tracer: string;
    },
  ) {
    super(client, options);
  }

  /**
   * Статический метод создания нового спана
   */
  public static startSpan(
    deps: SpanDeps,
    name: string,
    attrs?: AttrUnit[],
  ): EtsSpan {
    const { client, tracer, parent, thread } = deps;

    const options = { parent, thread, tracer };
    const newSpan = new EtsFactorySpan(client, options);

    newSpan.onStartSpan(name, attrs);

    return newSpan as EtsSpan;
  }

  /**
   * Статический метод для восстановления спана из контекста
   */
  public static loadSpan(deps: SpanDeps, context: SpanContext): EtsSpan {
    const { client, tracer, thread } = deps;
    const { parent, span } = context;

    const options = { parent, span, thread, tracer };
    const newSpan = new EtsFactorySpan(client, options);

    newSpan.onLoadSpan();

    return newSpan as EtsSpan;
  }

  /**
   * Обработчик события создания нового спана
   */
  private onStartSpan(name: string, attrs?: AttrUnit[]): void {
    const payload = this.getPayload<StartSpanPayload>({ attrs, name });

    this.client.emit(KafkaTopics.StartSpan, payload);
  }

  /**
   * Обработчик события загрузки спана по контексту
   */
  private onLoadSpan(): void {
    const payload = this.getPayload<LoadSpanPayload>();

    this.client.emit(KafkaTopics.LoadSpan, payload);
  }
}
