const readRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const getTableName = (): string => readRequiredEnv('TABLE_NAME');

export const getIndexName = (): string => process.env.INDEX_NAME ?? 'byDifficultyDistance';
