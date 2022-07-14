import { ClientConfig } from '../../interfaces';

import {
  DEF_KAFKA_BROKERS,
  DEF_KAFKA_GROUP_ID,
  DEF_KAFKA_PREFIX,
} from './constants';

/**
 * Возвращает объект опций для соединения
 */
export function getConfigFromEnv(envPrefix = 'ETS_'): ClientConfig {
  const brokers =
    process.env[`${envPrefix}KAFKA_BROKERS`]?.trim() || DEF_KAFKA_BROKERS;

  const groupId =
    process.env[`${envPrefix}KAFKA_GROUP_ID`]?.trim() || DEF_KAFKA_GROUP_ID;

  const prefix =
    process.env[`${envPrefix}KAFKA_PREFIX`]?.trim() || DEF_KAFKA_PREFIX;

  return { brokers: brokers.split(/ +/), groupId, prefix };
}
