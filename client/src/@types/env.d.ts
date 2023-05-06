declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_API_ENDPOINT: string;
            NEXT_PUBLIC_SANITY_PROJECT_ID: string;
            NEXT_PUBLIC_SANITY_TOKEN: string;
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
        }
    }
}

export {};
