import { v4 as generateUuid } from 'uuid';

import { EtsClientKafka } from './clients/kafka';
import { EtsCore } from './ets.core';

import {
  AnyObject,
  AttrUnit,
  LoadSpanPayload,
  Patterns,
  SpanContext,
  StartSpanPayload,
} from '../interfaces';
import { EtsCoreTracer } from '../interfaces/cores';

interface SpanDeps {
  kafka: EtsClientKafka;
  tracer: EtsCoreTracer;
  parent?: string;
  thread?: string;
}

export class EtsSpan extends EtsCore {
  protected parentUuid?: string;

  protected threadUuid!: string;

  protected spanUuid!: string;

  protected constructor(
    protected readonly kafka: EtsClientKafka,
    protected readonly tracer: EtsCoreTracer,
    options: { thread?: string; span?: string; parent?: string },
  ) {
    super(kafka);

    const { thread, span, parent } = options;

    this.threadUuid = thread || generateUuid();
    this.spanUuid = span || generateUuid();
    this.parentUuid = parent;
  }

  /**
   * Возвращает объект контекста
   */
  public getContext(): SpanContext {
    return {
      parent: this.parentUuid,
      span: this.spanUuid,
      tracer: this.tracer.getUuid(),
    };
  }

  /**
   * Возвращает новый дочерний спан
   */
  public startSpan(name: string, attrs?: AttrUnit[]): EtsSpan {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return EtsFactorySpan.startSpan(
      {
        kafka: this.kafka,
        parent: this.spanUuid,
        thread: this.threadUuid,
        tracer: this.tracer,
      },
      name,
      attrs,
    );
  }

  /**
   * Отправляет трек останова спана
   */
  public stopSpan(): void {
    this.kafka.emit(Patterns.StopSpan, this.getPayload());
  }

  /**
   * Базовые параметры для пайлоада
   */
  protected basePayload(): AnyObject {
    return { ...this.getContext(), thread: this.threadUuid };
  }
}

/**
 * Фабричный класс для использования "под капотом"
 */
export class EtsFactorySpan extends EtsSpan {
  private constructor(
    protected readonly kafka: EtsClientKafka,
    protected readonly tracer: EtsCoreTracer,
    options: { thread?: string; span?: string; parent?: string },
  ) {
    super(kafka, tracer, options);
  }

  /**
   * Статический метод создания нового спана
   */
  public static startSpan(
    deps: SpanDeps,
    name: string,
    attrs?: AttrUnit[],
  ): EtsSpan {
    const { kafka, tracer, parent, thread } = deps;

    const options = { parent, thread };
    const newSpan = new EtsFactorySpan(kafka, tracer, options);

    newSpan.onStartSpan(name, attrs);

    return newSpan as EtsSpan;
  }

  /**
   * Статический метод для восстановления спана из контекста
   */
  public static loadSpan(deps: SpanDeps, context: SpanContext): EtsSpan {
    const { kafka, tracer, thread } = deps;
    const { parent, span } = context;

    const options = { parent, span, thread };
    const newSpan = new EtsFactorySpan(kafka, tracer, options);

    newSpan.onLoadSpan();

    return newSpan as EtsSpan;
  }

  /**
   * Обработчик события создания нового спана
   */
  private onStartSpan(name: string, attrs?: AttrUnit[]): void {
    const payload = this.getPayload<StartSpanPayload>({ attrs, name });

    this.kafka.emit(Patterns.StartSpan, payload);
  }

  /**
   * Обработчик события загрузки спана по контексту
   */
  private onLoadSpan(): void {
    const payload = this.getPayload<LoadSpanPayload>();

    this.kafka.emit(Patterns.LoadSpan, payload);
  }
}
