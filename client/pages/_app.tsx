import { Link, NextUIProvider } from '@nextui-org/react';
import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { Input } from '@nextui-org/react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Logo from '@/public/icons/logo.svg';
import Image from 'next/image';
import Head from 'next/head';

const menuButton = (name: string, href: string) => {
    return (
        <Link href={href}
            className="text-small-semi text-ui-fg-base  font-thin flex items-center gap-x-2 basis-0
         text-gray-700 hover:text-black">
            {name}
        </Link>
    );
};

const Header = () => {
    const router = useRouter();
    const handleSearch = () => {
        const searchQuery = document.getElementById('search_input') as HTMLInputElement;
        if (searchQuery) {
            router.push({
                pathname: '/movies',
                query: { title: searchQuery.value }
            });
        }
    }

    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className='mt-[65px]'>
            <header className="fixed top-0 left-0 w-full flex justify-between 
            items-center p-4 bg-white  border-b border-gray-300 z-50">
                <div className="flex gap-5 justify-end">
                    <Image src={Logo} alt="logo" width={32} height={32} />
                    <Input id="search_input"
                        placeholder="Type to search..."
                        size="md"
                        startContent={<FaSearch
                            onClick={() => handleSearch()}
                            className='text-slate-400 w-4 cursor-pointer' />}
                        type="search"
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="text-center" style={{ flex: 3 }} >
                    {/* <h1 className="text-2xl font-bold uppercase text-gray-600">Vd-Next</h1> */}
                </div>
                <div className='items-end' style={{ flex: 1 }} >
                    <div className='flex gap-3' style={{ flex: 1 }} >
                        {menuButton('Home', '/movies')}
                        {menuButton('History', '/history')}
                        {menuButton('List', '/lists')}
                    </div>
                </div>
            </header>
        </div>
    );
}

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="icon" href="/icons/logo.svg" />
                <title>VD-Next</title>
            </Head>
            <NextUIProvider>
                {Header()}
                <Component {...pageProps} />
                {/* {footer()} */}
            </NextUIProvider>
        </>
    );
}

export default MyApp;