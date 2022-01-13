import { registerAs } from '@nestjs/config';

export type Environment = 'local' | 'development' | 'staging' | 'production';

/**
 * Set default value for local
 */
export const EnvironmentConfig = registerAs('env', () => ({
  port: parseInt(process.env.PORT, 10) || 9000,
  nodeEnv: (process.env.NODE_ENV || 'local') as Environment,
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'nestjs-with-gcp',
}));
