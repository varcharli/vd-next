import { Link, NextUIProvider } from '@nextui-org/react';
import '@/styles/globals.css';

import type { AppProps } from 'next/app';


const menuButton = (name: string, href: string) => {
    return (
        <Link href={href}
            className="text-small-semi text-ui-fg-base  font-thin flex items-center gap-x-2 basis-0
         text-gray-700 hover:text-black">
            {name}
        </Link>
    );
};

// const footer = () => {
//     return (
//         <footer className="bottom-0 left-0 w-full flex justify-between 
//         items-center p-4  border-t border-gray-300 z-50">
//             <div style={{ flex: 1 }} >
//                 {menuButton('Movies', '/movies')}
//             </div>
//             <div style={{ flex: 1 }} >
//                 {menuButton('History', '/history')}
//             </div>
//             <div style={{ flex: 1 }} >
//                 {menuButton('List', '/lists')}
//             </div>
//         </footer>
//     );
// }

const header = () => {
    return (
        <div className='mt-[65px]'>
            <header className="fixed top-0 left-0 w-full flex justify-between 
            items-center p-4 bg-white  border-b border-gray-300 z-50">
                {/* bg-gray-100 */}
                <div style={{ flex: 1 }} >
                    {menuButton('Menu', '/')}
                </div>
                <div className="text-center" style={{ flex: 3 }} >
                    <h1 className="text-2xl font-bold uppercase text-gray-600">Vd Next</h1>
                </div>
                <div className='items-end' style={{ flex: 1 }} >
                    <div className="flex gap-5 justify-end">
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
        <NextUIProvider>
            {header()}
            <Component {...pageProps} />
            {/* {footer()} */}
        </NextUIProvider>
    );
}

export default MyApp;