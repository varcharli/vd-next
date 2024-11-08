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
}

type MyImageMode = 'full' | 'cover' | 'none';

const MyImage: React.FC<MyImageProps> = ({ src, alt, width, height, mode, priority, onClick, className }) => {

    if (mode == 'full') {
        return (
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
        return (
            <div className={className} >
                <div className={`w-[${width}px] h-[${height}px] relative`} >
                    <Image src={src}
                        alt={alt || ''}
                        fill
                        onClick={onClick}
                        objectFit='cover'
                        priority={priority || true}
                    />
                </div>
            </div>
        );

        // return (<div className={`w-[${width}px] h-[${height}px] relative` } >
        //     <Image 
        //         src={src}
        //         alt={alt || ''}
        //         width={width || 0}
        //         height={height || 0}
        //         objectFit='cover'
        //         // style={{ maxWidth: `{${width}px}` , maxHeight: `{${height}px}`,width:'100%',height:'100%' }}
        //         priority={priority || true}
        //         onClick={onClick}
        //     /></div>
        // );
    }

    return (
        <Image
            src={src}
            alt={alt || ''}
            width={width}
            height={height}
            priority={priority || true}

        />
    );
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