import { ClientConfig, KafkaConfig } from '../interfaces';

import {
  DEF_ENV_PREFIX,
  DEF_KAFKA_BROKERS,
  DEF_KAFKA_GROUP_ID,
  DEF_KAFKA_PREFIX,
} from './constants';

/**
 * Возвращает готовый объект конфига клиента
 */
function getPreparedConfig(
  config: Partial<KafkaConfig>,
): Required<KafkaConfig> {
  const { brokers, groupId, prefix } = config;

  return {
    brokers: brokers && brokers.length > 0 ? brokers : DEF_KAFKA_BROKERS,
    groupId: groupId && groupId.length > 0 ? groupId : DEF_KAFKA_GROUP_ID,
    prefix: typeof prefix === 'string' ? prefix : DEF_KAFKA_PREFIX,
  };
}

/**
 * Возвращает конфига клиента через переменные окружения
 */
function getConfigFromEnv(envPrefix = DEF_ENV_PREFIX): Required<KafkaConfig> {
  return getPreparedConfig({
    brokers: process.env[`${envPrefix}KAFKA_BROKERS`]?.trim().split(/ +/),
    groupId: process.env[`${envPrefix}KAFKA_GROUP_ID`]?.trim(),
    prefix: process.env[`${envPrefix}KAFKA_PREFIX`]?.trim(),
  });
}

/**
 * Возвращает объект конфига для клиента
 */
export function getKafkaConfig(
  config: ClientConfig<KafkaConfig>,
): Required<KafkaConfig> {
  const { envPrefix, clientConfig } = config;

  return clientConfig
    ? getPreparedConfig(clientConfig)
    : getConfigFromEnv(envPrefix);
}
