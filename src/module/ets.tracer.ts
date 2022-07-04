import { Injectable } from '@nestjs/common';
import { v4 as generateUuid } from 'uuid';

import { EtsClientKafka } from './clients/kafka';
import { EtsCore } from './ets.core';
import { EtsFactorySpan, EtsSpan } from './ets.span';

import {
  AnyObject,
  AttrUnit,
  InitTracerPayload,
  Patterns,
  SpanContext,
} from '../interfaces';
import { EtsCoreTracer } from '../interfaces/cores';

@Injectable()
export class EtsTracer extends EtsCore implements EtsCoreTracer {
  private tracerInited = false;

  private readonly tracerUuid!: string;

  constructor(protected readonly kafka: EtsClientKafka) {
    super(kafka);

    this.tracerUuid = generateUuid();
  }

  /**
   * Возвращает uuid трейсера
   */
  public getUuid(): string {
    return this.tracerUuid;
  }

  /**
   * Инициирует спан из контекста в рамках текущего трейсера
   */
  public loadSpan(context: SpanContext): EtsSpan {
    this.checkInited();

    return EtsFactorySpan.loadSpan(
      { kafka: this.kafka, tracer: this },
      context,
    );
  }

  /**
   * Создает новый корневой спан в рамках текущего трейсера
   */
  public startSpan(name: string, attrs?: AttrUnit[]): EtsSpan {
    this.checkInited();

    return EtsFactorySpan.startSpan(
      { kafka: this.kafka, tracer: this },
      name,
      attrs,
    );
  }

  /**
   * Инициализирует трейсер
   */
  public async initTracer(name: string, attrs?: AttrUnit[]): Promise<void> {
    const payload = this.getPayload<InitTracerPayload>({ attrs, name });

    await this.kafka.send(Patterns.InitTracer, payload);

    this.tracerInited = true;
  }

  /**
   * Базовые параметры для пайлоада
   */
  protected basePayload(): AnyObject {
    return { tracer: this.tracerUuid };
  }

  /**
   * Проверяет инициализацию трейсера
   */
  private checkInited(): void {
    if (!this.tracerInited) throw new Error('Not inited');
  }
}
