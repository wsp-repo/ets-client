import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { getClientOptionsForKafkaTransport } from './options';
import { getPattern, KafkaPatterns } from './patterns';

@Injectable()
export class EtsClientKafka implements OnModuleInit {
  @Client(getClientOptionsForKafkaTransport())
  private readonly client!: ClientKafka;

  /**
   * Отправка сообщения-запроса
   */
  public send(pattern: KafkaPatterns, params?: unknown): Promise<unknown> {
    return lastValueFrom(this.client.send(getPattern(pattern), params));
  }

  /**
   * Отправка сообщения-события
   */
  public emit(pattern: KafkaPatterns, params?: unknown): void {
    this.client.emit(getPattern(pattern), params);
  }

  /**
   * Обработчик события инициализации
   */
  public async onModuleInit(): Promise<void> {
    this.client.subscribeToResponseOf(getPattern(KafkaPatterns.InitTracer));

    await this.client.connect();
  }
}
