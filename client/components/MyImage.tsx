import React from 'react';
import { Image } from '@nextui-org/react';
// import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface MyImageProps {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    mode?: MyImageMode;
    // priority?: boolean;
    onClick?: () => void;
    className?: string;
    zoomed?: boolean;
    radius?: Radius;
}

type MyImageMode = 'full' | 'cover' | 'none';
type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full';
const MyImage: React.FC<MyImageProps> = ({ src, alt, width, height, mode, onClick,
    className, zoomed, radius = 'none' }) => {
    let content;
    if (mode == 'full') {
        content = (
            <Image
                src={src}
                alt={alt || ''}
                onClick={onClick}
                className={className}
                isZoomed={zoomed}
                referrerPolicy='no-referrer'
                radius={radius}
            />
        );
    }

    if (mode == 'cover') {
        content = (
            <Image src={src}
                alt={alt || ''}
                onClick={onClick}
                className={className}
                width={width}
                height={height}
                radius={radius}
                style={{ objectFit: 'cover' }}
                isZoomed={zoomed}
                referrerPolicy='no-referrer' />

        );
    }
    if (!content) {
        content = (
            <Image
                src={src}
                alt={alt || ''}
                width={width}
                height={height}
                onClick={onClick}
                className={className}
                referrerPolicy='no-referrer'
                radius={radius}
            />
        );
    }

    let classString = "";
    if (radius !== 'none') {
        let radiusClass = "";
        if (radius in ['sm', 'md', 'lg']) {
            radiusClass = "rounded-" + radius;
        }
        if (radius === 'full') {
            radiusClass = "rounded-2xl";
        }
        classString += "rounded-" + radiusClass ;
        classString += " overflow-clip ";
    }

    return (
        <div className={classString}>
            {content}
        </div>
    );
}

// interface MyLocalImageProps {
//     src: StaticImport;
//     alt?: string;
// }

// export const MyLocalImage: React.FC<MyLocalImageProps> = ({ src, alt }) => {
//     return (
//         </>
//         // <Image
//         //     src={src}
//         //     alt={alt || ''}
//         // />
//     );
// }

export default MyImage;