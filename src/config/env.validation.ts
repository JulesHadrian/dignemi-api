import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  POSTHOG_API_KEY: Joi.string().optional().allow(''), // Opcional para dev
  POSTHOG_HOST: Joi.string().default('https://app.posthog.com'),
});