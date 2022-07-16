import { Storage } from '@wspro/core';

import { ClientConfig, ClientTopics, KafkaConfig } from '../interfaces';

import {
  DEF_ENV_PREFIX,
  DEF_KAFKA_BROKERS,
  DEF_KAFKA_GROUP_ID,
  DEF_KAFKA_PREFIX,
} from './constants';

/**
 * Инстанс хранения конфига
 */
const configStorage = new Storage<Required<KafkaConfig>>();

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

  configStorage.set(
    clientConfig
      ? getPreparedConfig(clientConfig)
      : getConfigFromEnv(envPrefix),
  );

  return configStorage.get();
}

/**
 * Возвращает полный топик
 */
export function getKafkaTopic(topic: ClientTopics): string {
  const { prefix } = configStorage.get();

  return `${prefix}::${topic}`;
}
