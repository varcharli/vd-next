import React from 'react';
import { PlayLink } from '@/services/models';
import { Link } from '@nextui-org/react';
import { MyTooltip } from '@/components';
import { IconOpened } from '@/components/IconMorph';


interface PlayLinksPanelProps {
    playLinks: PlayLink[];
}

const PlayLinksPanel: React.FC<PlayLinksPanelProps> = ({ playLinks }) => {
    const [isOpened, setIsOpened] = React.useState(false);

    let isNull = false;
    if (!playLinks || !Array.isArray(playLinks)) {
        isNull = true;
    } else
        if (playLinks.length === 0) {
            isNull = true;
        }

    return (
        <div className="flex flex-col gap-3" >
            <div className="flex flex-col border-t-1 border-b-1 py-2 gap-1 ">
                <div className="flex justify-between items-center px-2
                    text-slate-500 font-thin w-full">
                    <div className='flex items-center gap-5' >
                        Play Links
                        <div className='bg-slate-100 w-[30px] h-[30px] rounded-full
                            flex items-center justify-center '>
                            {playLinks.length}
                        </div>
                    </div>
                    <div onClick={() => setIsOpened(!isOpened)} >
                        <IconOpened isOpened={isOpened} />
                    </div>
                </div>
                {/* <div className={`transition duration-1000 transform ${isOpened ? "" : "h-[0px]" }`} > */}
                <div
                    className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isOpened ? 'max-h-96' : 'max-h-0'
                        }`} >
                    <div className='flex flex-col'>
                        {isNull
                            ? <div className="m-2 font-thin text-gray-500" >No play links.</div>
                            : playLinks.map((link, index) => {
                                return (
                                    <MyTooltip key={index} content={`URL: ${link.url}`}  >
                                        <div className="flex gap-3 cursor-pointer hover:bg-slate-100 p-2 font-thin " >
                                            <Link href={link.url} target='_blank' className='text-slate-900'>
                                                {link.name}
                                            </Link>
                                        </div>
                                    </MyTooltip>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>);
}

export default PlayLinksPanel;