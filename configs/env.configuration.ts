import * as dotenv from 'dotenv';
import * as Joi from 'joi';

const envConfig = dotenv.config().parsed!;

interface DatabaseIF {
  DATABASE_URL: string;
}

export interface JwtIF {
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRE: string;
  JWT_REFRESH_TOKEN_EXPIRE: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  SALT_ROUNDS: number;
}

export interface AppConfiguration {
  database: DatabaseIF;
  jwt: JwtIF;
}

export const env: AppConfiguration = {
  database: {
    DATABASE_URL: envConfig?.DATABASE_URL,
  },
  jwt: {
    JWT_ACCESS_TOKEN_SECRET: envConfig.JWT_ACCESS_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRE: envConfig.JWT_ACCESS_TOKEN_EXPIRE,
    JWT_REFRESH_TOKEN_SECRET: envConfig.JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRE: envConfig.JWT_REFRESH_TOKEN_EXPIRE,
    SALT_ROUNDS: +envConfig.SALT_ROUNDS,
  },
};

const validationSchema = Joi.object({
  database: {
    DATABASE_URL: Joi.string().required(),
  },
  jwt: {
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRE: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRE: Joi.string().required(),
    SALT_ROUNDS: Joi.number().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  },
});

export default (): AppConfiguration => {
  return env;
};

export function validateEnv() {
  const { error } = validationSchema.validate(env);
  if (error) {
    throw new Error(error.message);
  }
}
