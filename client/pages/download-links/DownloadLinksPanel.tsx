import React from 'react';
import { DownloadLink } from '@/services/models';
import { IconOpened } from '@/components/IconMorph';
import { FaPlay } from 'react-icons/fa';
import { copyToClipboard, IconChanged } from '@/components';


interface DownloadLinksPanelProps {
    downloadLinks: DownloadLink[];
}

const DownloadLinksPanel: React.FC<DownloadLinksPanelProps> = ({ downloadLinks }) => {
    const [isOpened, setIsOpened] = React.useState(false);
    const [isCopied, setIsCopied] = React.useState<boolean[]>([]);


    let isNull = false;
    if (!downloadLinks || !Array.isArray(downloadLinks)) {
        isNull = true;
    } else if (downloadLinks?.length === 0) {
        isNull = true;
    }

    const handelIsCopied = (index: number, value: boolean) => {
        setIsCopied((prev) => {
            const newIsCopied = [...prev];
            newIsCopied[index] = value;
            return newIsCopied;
        });
    }

    const handelClickCopy = async (url: string, index: number) => {
        await copyToClipboard(url);
        handelIsCopied(index, true);
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col border-b-1 py-2 gap-1 ">
                <div className="flex justify-between items-center px-2
                    text-slate-500 font-thin w-full 
                    cursor-pointer hover:text-orange-500"
                    onClick={() => setIsOpened(!isOpened)}>
                    <div className='flex items-center gap-5' >
                        Download Links
                        <div className='bg-slate-100 w-[30px] h-[30px] rounded-full
                            flex items-center justify-center '>
                            {downloadLinks?.length}
                        </div>
                    </div>
                    <div >
                        <IconOpened isOpened={isOpened} />
                    </div>
                </div>
                {/* <div className={`transition duration-1000 transform ${isOpened ? "" : "h-[0px]" }`} > */}
                <div
                    className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isOpened ? 'max-h-96' : 'max-h-0'
                        }`} >
                    <div className='flex flex-col'>
                        {isNull
                            ? <div className="font-thin text-gray-500 p-2">No download links.</div>
                            : downloadLinks.map((link, index) => {
                                return (
                                    <div key={index}
                                        className="flex justify-between items-center
                                    cursor-pointer hover:text-orange-500
                                        p-2 overflow-hidden whitespace-nowrap text-ellipsis 
                                        font-thin"
                                    >
                                        <div className='w-full'
                                            onClick={() => handelClickCopy(link.url, index)}>
                                            {link.name || link.url}
                                        </div>
                                        <div className='flex items-center gap-3' >
                                            <div className='p-2 text-slate-500 hover:text-orange-500'
                                                onClick={() => window.open(link.url, '_blank')}>
                                                <FaPlay />
                                            </div>
                                            <div className='p-2 text-slate-500'
                                                onClick={() => handelClickCopy(link.url, index)} >
                                                <IconChanged
                                                    isStart={isCopied[index]} onFinished={() => { handelIsCopied(index, false) }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}




export default DownloadLinksPanel;