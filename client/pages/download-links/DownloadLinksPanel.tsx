import React from 'react';
import { DownloadLink } from '@/services/models';
import { Link } from '@nextui-org/react';
import { IconOpened } from '@/components/IconMorph';
// import { downloadLink } from '@/services/apiDownloadLink';
// import { MyTooltip } from '@/components';

interface DownloadLinksPanelProps {
    downloadLinks: DownloadLink[];
}

const DownloadLinksPanel: React.FC<DownloadLinksPanelProps> = ({ downloadLinks }) => {
    const [isOpened, setIsOpened] = React.useState(false);


    let isNull = false;
    if (!downloadLinks || !Array.isArray(downloadLinks)) {
        isNull = true;
    } else if (downloadLinks?.length === 0) {
        isNull = true;
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col border-b-1 py-2 gap-1 ">
                <div className="flex justify-between items-center px-2
                    text-slate-500 font-thin w-full">
                    <div className='flex items-center gap-5' >
                        Download Links
                        <div className='bg-slate-100 w-[30px] h-[30px] rounded-full
                            flex items-center justify-center '>
                            {downloadLinks?.length}
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
                            ? <div className="font-thin text-gray-500 p-2">No download links.</div>
                            : downloadLinks.map((link, index) => {
                                return (
                                    <div key={index} className="cursor-pointer hover:bg-slate-100 
                                        p-2 overflow-hidden whitespace-nowrap text-ellipsis 
                                        font-thin">
                                        <Link href={link.url} target='_blank'
                                            className='text-slate-900 '>
                                                {link.url}
                                        </Link>
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