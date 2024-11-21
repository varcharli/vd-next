import { useState, useEffect } from 'react';
import models from '@/services/models';
import type { PlayList } from '@/services/models';
import { NavItem, NavTitle } from '../home/NavBar';

interface PlayListNavProps {
    onPlayListChange: (id?: number) => void;
    playListId?: number;
}

const PlayListNav: React.FC<PlayListNavProps> = ({ onPlayListChange, playListId }) => {
    const [lists, setLists] = useState<PlayList[]>([]);
    const [currentList, setCurrentList] = useState(playListId);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setCurrentList(playListId);
        const load = async () => {
            setIsLoading(true);
            const lists = await models.playList.get();
            setLists(lists);
            setIsLoading(false);
        }
        load();
    }, [playListId]);

    const handleChange = (listId: number) => {
        setCurrentList(listId);
        onPlayListChange(listId);
    }

    const listItem = (listId: number, listName: string) => {
        return (
            <NavItem key={listId}
                onClick={() => handleChange(listId)}
                actived={currentList == listId}
                text={listName} />
        );
    }



    if (isLoading) {
        // return <Loading />;
    }

    return (
        <div>
            <NavTitle text='Playlists' />
            <ul>
                {lists.map(list => (
                    listItem(list.id, list.name)
                ))}
            </ul>
        </div>
    );
}

export default PlayListNav;