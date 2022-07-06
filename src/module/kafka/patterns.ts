export enum KafkaPatterns {
  InitTracer = 'init-tracer',
  StartSpan = 'start-span',
  StopSpan = 'stop-span',
  LoadSpan = 'load-span',
  SetAttrs = 'set-attrs',
  AddEvent = 'add-event',
}

/**
 * Возвращает паттерн с учетом префикса
 */
export function getPattern(pattern: KafkaPatterns): string {
  const prefix = String(process.env.KAFKA_PREFIX).trim();

  return `${prefix || 'wspro-ets'}:${pattern}`;
}
