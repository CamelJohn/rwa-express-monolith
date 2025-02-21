import dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
    NODE_ENV: str(),
    SERVER_PORT: port({ default: 8080 }),

    POSTGRES_HOST: str(),
    POSTGRES_PORT: port({ default: 5432 }),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),

    JWT_SECRET: str(),
});

export const isRunningInDocker = (): boolean => {
    return env.NODE_ENV === 'docker';
  };
  
  export const isProduction = (): boolean => {
    return env.NODE_ENV === 'production';
  };

export default env;