declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';

    SERVER_PORT: string;

    MYSQL_HOST: string;
    MYSQL_PORT: string;
    MYSQL_USERNAME: string;
    MYSQL_PASSWORD: string;
    MYSQL_DATABASE: string;
    MYSQL_TABLE_PREFIX: string;

    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_DB: string;
    REDIS_PASSWORD: string;
    REDIS_KEY_PREFIX: string;
    REIDS_CONNECT_TIMEOUT: string;

    GOOGLE_OAUTH2_CLIENT_ID: string;
    GOOGLE_OAUTH2_CLIENT_SECRET: string;
    GOOGLE_RECAPTCHA_SECRET: string;

    HTTPS_PROXY?: string;
  }
}
