function getEnvValue(value?: unknown, def?: string): string {
  return String(value || '').trim() || def || '';
}

export const KAFKA_BROKERS = getEnvValue(
  process.env.ETS_KAFKA_BROKERS,
  'localhost:9092',
).split(/ +/);

export const KAFKA_GROUP_ID = getEnvValue(
  process.env.ETS_KAFKA_GROUP_ID,
  'wsp-ets',
);

export const KAFKA_PREFIX = getEnvValue(
  process.env.ETS_KAFKA_PREFIX,
  'wsp-ets',
);
