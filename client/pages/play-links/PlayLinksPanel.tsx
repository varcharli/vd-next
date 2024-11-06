import React from 'react';
import { PlayLink } from '@/services/models';
import { Link } from '@nextui-org/react';


interface PlayLinksPanelProps {
    playLinks: PlayLink[];
}

const PlayLinksPanel: React.FC<PlayLinksPanelProps> = ({ playLinks }) => {
    let isNull = false;
    if (!playLinks || !Array.isArray(playLinks)) {
        isNull = true;
    } else
        if (playLinks.length === 0) {
            isNull = true;
        }

    return (
        <div className="flex flex-col gap-3" >
            {/* <h1 className="text-xl text-slate-500" >Play Links</h1> */}
            <div className="flex flex-col border-t-1" >
                {isNull
                    ? <div className="m-2 font-thin text-gray-500" >No play links.</div>
                    : playLinks.map((link, index) => {
                        return (
                            <div key={index}
                                className="flex gap-3 cursor-pointer hover:bg-slate-100 p-2 " >
                                <Link href={link.url} target='_blank' >{link.name}</Link>
                            </div>
                        );
                    })
                }
            </div>
        </div>);
}

export default PlayLinksPanel;