import '@/styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Layout } from '@/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Ecommerce</title>
                <link rel="icon" type="image/png" href="/favicon-32x32.png" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                {/* <ReactQueryDevtools /> */}
            </QueryClientProvider>
        </>
    );
}
