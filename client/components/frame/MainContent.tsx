import React, { ReactNode } from 'react';

interface MainContentProps {
    children?: ReactNode;
}


const MainContent: React.FC<MainContentProps> = ({ children }) => {
    return (
        <div className="flex flex-col w-full">
            <div className="p-4 max-w-screen-2xl ">
                {children}
            </div></div>
    );
}

export default MainContent;