import React, { ReactNode } from 'react';

interface MainFrameProps {
    children?: ReactNode;
}


const MainFrame: React.FC<MainFrameProps> = ({ children }) => {
    return (
        <div className="flex">
            {children}
        </div>
    );
}

export default MainFrame;