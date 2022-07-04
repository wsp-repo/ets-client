import { EtsClientKafka } from './clients/kafka';

import {
  AddEventPayload,
  AnyObject,
  AttrUnit,
  EventTypes,
  Patterns,
  SetAttrPayload,
} from '../interfaces';

export class EtsCore {
  constructor(protected readonly kafka: EtsClientKafka) {}

  /**
   * Выставляет атрибуты трейсера
   */
  public setAttrs(attrs: AttrUnit[]): void {
    const payload = attrs.map((attr: AttrUnit) => {
      return this.getPayload<SetAttrPayload>(attr);
    });

    this.kafka.emit(Patterns.SetAttrs, payload);
  }

  /**
   * Отправляет событие трейсера
   */
  public addEvent(name: string, data?: unknown, type = EventTypes.Event): void {
    const payload = this.getPayload<AddEventPayload>({ data, name, type });

    this.kafka.emit(Patterns.AddEvent, payload);
  }

  /**
   * Возвращает параметры с базовыми свойствами
   */
  protected getPayload<T = AnyObject>(params?: Partial<T>): T {
    return { ...params, ...this.basePayload() } as unknown as T;
  }

  /**
   * Базовые параметры для пайлоада
   * - переопределяется в наследниках
   */
  protected basePayload(): AnyObject {
    return {};
  }
}
