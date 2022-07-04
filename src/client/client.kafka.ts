import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { Patterns } from '../interfaces';

const options = {
  client: { brokers: ['localhost:9092'] },
  consumer: { groupId: 'ets' },
};

@Injectable()
export class EtsClientKafka implements OnModuleInit {
  @Client({ options, transport: Transport.KAFKA })
  private readonly client!: ClientKafka;

  /**
   * Отправка сообщения-запроса
   */
  public send(pattern: Patterns, params?: unknown): Promise<unknown> {
    const request = this.client.send(pattern, params);
    return lastValueFrom(request);
  }

  /**
   * Отправка сообщения-события
   */
  public emit(pattern: Patterns, params?: unknown): void {
    this.client.emit(pattern, params);
  }

  /**
   * Обработчик события инициализации
   */
  public async onModuleInit(): Promise<void> {
    this.client.subscribeToResponseOf(Patterns.InitTracer);

    await this.client.connect();
  }
}
