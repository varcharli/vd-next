
import EmptyImage from '@/public/images/empty.svg';
import React from 'react';
import Image from 'next/image';

interface EmptyProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export const Empty: React.FC<EmptyProps> = ({ size, text }) => {
    size = size || 'md';

    function emptyImage(width: number) {
        return (
            <Image src={EmptyImage} alt="Empty" width={width} />
        );
    }

    function emptyText() {
        if (text == "") {
            return null;
        }
        return (
            <p className="text-gray-500">{text || 'No data found'}</p>
        );
    }

    switch (size) {
        case 'sm':
            return (
                <div className="flex flex-col items-center justify-center h-[300px]">
                    {emptyImage(200)}
                    {emptyText()}
                </div>
            );
        case 'lg':
            return (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    {emptyImage(400)}
                    {emptyText()}
                </div>
            );
    }

    return (
        <div className="flex flex-col items-center justify-center h-[50vh]">
            {emptyImage(300)}
            {emptyText()}
        </div>
    );
};