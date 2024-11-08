import React from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface MyImageProps {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    mode?: MyImageMode;
    priority?: boolean;
    onClick?: () => void;
    className?: string;
    zoomed?: boolean;
}

type MyImageMode = 'full' | 'cover' | 'none';

const MyImage: React.FC<MyImageProps> = ({ src, alt, width, height, mode, priority, onClick, className, zoomed }) => {
    let content;
    if (mode == 'full') {
        content = (
            <Image
                src={src}
                alt={alt || ''}
                sizes='100vw'
                style={{ width: '100%', height: 'auto' }}
                width={width || 0}
                height={height || 0}
                priority={priority || true}
                onClick={onClick}
                className={className}
            />
        );
    }

    if (mode == 'cover') {
        content = (
            <div className={className} >
                <div className={`w-[${width}px] h-[${height}px] relative`} >
                    <Image src={src} className='object-cover'
                        alt={alt || ''}
                        fill
                        sizes='100vw 100vh'
                        onClick={onClick}
                        // objectFit='cover'
                        priority={priority || true}
                    />
                </div>
            </div>
        );
    }
    if (!content) {
        content = (
            <Image
                src={src}
                alt={alt || ''}
                width={width}
                height={height}
                priority={priority || true}

            />
        );
    }

    if(zoomed){
        return (
            <div className=' transition-transform duration-500 ease-in-out transform 
            hover:shadow-xl hover:shadow-slate-800/50 '>
                {content}
            </div>
        );
    } else {
        return content;
    }
}

interface MyLocalImageProps {
    src: StaticImport;
    alt?: string;
}

export const MyLocalImage: React.FC<MyLocalImageProps> = ({ src, alt }) => {
    return (
        <Image
            src={src}
            alt={alt || ''}
        />
    );
}

export default MyImage;