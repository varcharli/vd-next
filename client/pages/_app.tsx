import { NextUIProvider } from '@nextui-org/react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AppTopbar } from './appTopbar';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="icon" href="/icons/logo.svg" />
                <title>VD-Next</title>
            </Head>
            <NextUIProvider>
                <AppTopbar />
                <Component {...pageProps} />
            </NextUIProvider>
        </>
    );
}

export default MyApp;