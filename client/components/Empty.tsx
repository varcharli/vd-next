
import EmptyImage from '@/public/images/empty.svg';
import React from 'react';
import Image from 'next/image';

export const Empty = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh]">
            <Image src={EmptyImage} alt="Empty" width={400} />
            <p className="text-gray-500">No data found</p>
        </div>
    );
};