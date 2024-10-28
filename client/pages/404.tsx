import { Link } from '@nextui-org/react';
import I404 from '@/public/images/404.svg';
import Image from 'next/image';

const Custom404 = () => {
    return (
        <div className='flex flex-col justify-center min-h-[600px]  items-center' >
            <Image src={I404} alt='404' width={300} />
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="/" color="primary" className='p-6' >
                Go back to home
            </Link>
        </div>
    );
};

export default Custom404;