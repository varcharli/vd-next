import React from 'react';


const LinkButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
    return (
        <div onClick={onClick}
            className="text-slate-500 flex items-center gap-x-2 basis-0
            cursor-pointer text-lg
          hover:text-black">
            {children}
        </div>
    );
}

export default LinkButton;