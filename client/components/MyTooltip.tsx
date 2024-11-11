import React from 'react';
import { Tooltip } from '@nextui-org/react';

interface MyTooltipProps {
    content: string;
    children: React.ReactNode;
}

const MyTooltip: React.FC<MyTooltipProps> = ({ content, children }) => {
    return (
        <Tooltip content={content} color='warning' className='text-slate-100' delay={1000}>
            {children}
        </Tooltip>
    );
}

export default MyTooltip;