const readRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const getTableName = (): string => readRequiredEnv('TABLE_NAME');

export const getIndexName = (): string => process.env.INDEX_NAME ?? 'byDifficultyDistance';

export const getGuardTableName = (): string => readRequiredEnv('GUARD_TABLE_NAME');

export const getIpHashSalt = (): string => readRequiredEnv('IP_HASH_SALT');

export const getSubmitCooldownSeconds = (): number => {
  const raw = process.env.SUBMIT_COOLDOWN_SECONDS ?? '10';
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error('SUBMIT_COOLDOWN_SECONDS must be a positive integer');
  }
  return parsed;
};
