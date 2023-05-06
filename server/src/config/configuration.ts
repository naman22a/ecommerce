export default () => ({
    node_env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 5000,
    database_url: process.env.DATABASE_URL,
    cors_origin: process.env.CORS_ORIGIN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    sanity_project_id: process.env.SANITY_PROJECT_ID,
});
