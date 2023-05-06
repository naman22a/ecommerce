declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'testing';
            PORT: string;
            DATABASE_URL: string;
            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
            CORS_ORIGIN: string;
            STRIPE_SECRET_KEY: string;
            SANITY_PROJECT_ID: string;
        }
    }
}

export {};
