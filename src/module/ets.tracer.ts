import { Injectable } from '@nestjs/common';
import { v4 as generateUuid } from 'uuid';

import { EtsCore } from './ets.core';
import { EtsFactorySpan, EtsSpan } from './ets.span';
import { EtsClientKafka } from './kafka/client';
import { KafkaPatterns } from './kafka/patterns';

import {
  AnyObject,
  AttrUnit,
  InitTracerPayload,
  SpanContext,
} from '../interfaces';

@Injectable()
export class EtsTracer extends EtsCore {
  private tracerInited = false;

  private readonly tracerUuid!: string;

  constructor(protected readonly kafka: EtsClientKafka) {
    super(kafka);

    this.tracerUuid = generateUuid();
  }

  /**
   * Инициирует спан из контекста в рамках текущего трейсера
   */
  public loadSpan(context: SpanContext): EtsSpan {
    this.checkInited();

    return EtsFactorySpan.loadSpan(
      { kafka: this.kafka, tracer: this.tracerUuid },
      context,
    );
  }

  /**
   * Создает новый корневой спан в рамках текущего трейсера
   */
  public startSpan(name: string, attrs?: AttrUnit[]): EtsSpan {
    this.checkInited();

    return EtsFactorySpan.startSpan(
      { kafka: this.kafka, tracer: this.tracerUuid },
      name,
      attrs,
    );
  }

  /**
   * Инициализирует трейсер
   */
  public async initTracer(name: string, attrs?: AttrUnit[]): Promise<void> {
    const payload = this.getPayload<InitTracerPayload>({ attrs, name });

    await this.kafka.send(KafkaPatterns.InitTracer, payload);

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
