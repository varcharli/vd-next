import { useState, useEffect } from 'react';
// import { Loading } from '@/components';
import models from '@/services/models';
import type { PlayList } from '@/services/models';
import { GoTriangleRight } from 'react-icons/go';

interface PlayListNavProps {
    onPlayListChange: (id?: number) => void;
    playListId?: number;
}

const PlayListNav: React.FC<PlayListNavProps> = ({ onPlayListChange,playListId }) => {
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
            <li key={listId} className="py-2"  >
                <GoTriangleRight className={`inline-block mb-1 mr-1
                    ${currentList == listId ? "text-black-500" : "text-transparent"}`} />
                <button onClick={() => handleChange(listId)}
                    className={`${currentList == listId ? "" : "font-thin"}`} >
                    {listName}
                </button>
            </li>
        );
    }



    if (isLoading) {
        // return <Loading />;
    }

    return (
        <div>
            
            <div className='mt-8' >
                <h1 className="text-2xl font-thin text-gray-700 my-4">Play List</h1>
                <ul>
                    {lists.map(list => (
                        listItem(list.id, list.name)
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PlayListNav;