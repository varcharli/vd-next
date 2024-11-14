import React from 'react';
import { DownloadLink } from '@/services/models';
import { Link, Button } from '@nextui-org/react';
// import { MyTooltip } from '@/components';

interface DownloadLinksPanelProps {
    downloadLinks: DownloadLink[];
}

const DownloadLinksPanel: React.FC<DownloadLinksPanelProps> = ({ downloadLinks }) => {
    let isNull = false;
    if (!downloadLinks || !Array.isArray(downloadLinks)) {
        isNull = true;
    } else if (downloadLinks.length === 0) {
        isNull = true;
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col border-t-1">
                <div className="flex content-between p-2 text-slate-500 font-thin w-full">
                    <div> Download Links</div>
                    <Button isIconOnly></Button>
                </div>
                {isNull
                    ? <div className="m-2 font-thin text-gray-500">No download links.</div>
                    : downloadLinks.map((link, index) => {
                        return (
                            <div key={index} className="cursor-pointer hover:bg-slate-100 p-2 overflow-hidden whitespace-nowrap text-ellipsis">
                                <Link href={link.url} target='_blank'>{link.url}</Link>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default DownloadLinksPanel;