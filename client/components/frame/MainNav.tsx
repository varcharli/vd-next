import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface NavItemProps {
    onClick: () => void;
    actived: boolean;
    text: string;
}

export const MainNavItem: React.FC<NavItemProps> = ({ onClick, actived, text }) => {
    // const arrowRight = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <path d="M9.00378 5.99561L15.004 11.9959L9.00024 17.9996" strokeWidth="null" strokeLinecap="round" strokeLinejoin="round" ></path>
    // </svg>
    return (
        <div onClick={onClick}
            className={`flex items-center h-[32px] font-thin cursor-pointer `}>
                <div className={`pl-[1px]  ${actived ? " border-l-3 border-orange-500 ":"" }`} >
                <div className={`h-[32px] w-[12px]  ${actived ? "":" border-l-1 " }`} />
                </div>
            {/* <div className='w-[24px]  stroke-orange-500'> {actived && arrowRight} </div> */}
            <div className={actived ? 'text-orange-500 ' : 'pl-[3px] '} > {text}</div>
        </div>
    );
}

export const MainNavTitle: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className='text-2xl font-thin text-slate-400 my-4'>{text}</div>
    );
}


interface NavBarProps {
    children?: ReactNode;
}

export const MainNav: React.FC<NavBarProps> = ({ children }) => {
    // const homePath = '/';
    const moviePath = '/movies';
    const actorPath = '/actors';
    const logPath = '/logs';
    const router = useRouter();

    function handleRouter(path: string) {
        router.push(path);
    }

    function item(path: string, text: string) {
        // check current path to highlight if it is begin with the path
        const currentPath = router.pathname;
        const isCurrent = currentPath.startsWith(path);
        return <MainNavItem key={path} onClick={() => handleRouter(path)} actived={isCurrent} text={text} />
    }

    return (
        <div className="w-[200px] p-4" >
            <div className='mt-0'>
                <MainNavTitle text='VD-Next' />
                {item(moviePath, 'Movies')}
                {item(actorPath, 'Actors')}
                {item(logPath, 'Logs')}
            </div>
            <div className='flex flex-col' >
                {children}
            </div>
        </div>
    );
}