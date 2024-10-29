import { useState, useEffect } from 'react';
import { Loading } from '@/components';
import models from '@/services/models';
import type { PlayList } from '@/services/models';
import { GoTriangleRight } from 'react-icons/go';

const PlayListNav = () => {
    const [lists, setLists] = useState<PlayList[]>([]);
    const [currentList, setCurrentList] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            const lists = await models.playList.get();
            setLists(lists);
            setIsLoading(false);
        }
        load();
    }, []);

    const handleChange = (listId: number) => {
        setCurrentList(listId);
    }

    const listItem = (listId: number, listName: string) => {
        return (
            <li className="py-2"  >
                <GoTriangleRight className={`inline-block mb-1 mr-1
                    ${currentList === listId ? "text-black-500" : "text-transparent"}`} />
                <button onClick={() => handleChange(listId)}
                    className={`${currentList === listId ? "text-black-500" : "text-gray-500"} font-thin`} >
                    {listName}
                </button>
            </li>
        );
    }



    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className='mt-8' >
            <h1 className="text-2xl font-thin text-gray-700 my-4">Play List</h1>
            <ul>
            {lists.map(list => (
                listItem(list.id, list.name)
            ))}
            </ul>
        </div>
    );
}

export default PlayListNav;