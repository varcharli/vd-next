import React from "react";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,
    CheckboxGroup, Checkbox, Input, Tooltip
} from "@nextui-org/react";
import { Movie } from "@/services/apiMovie";
import models, { PlayList } from "@/services/models";
import { FaPlus } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import ItemManager,{Item} from "../../components/ItemManager";


interface PlayListPopProps {
    movie: Movie;
    show: boolean;
    onClose: () => void;
}

const castPlayListToItem = (list: PlayList): Item => {
    return {
        id: list.id,
        fields: [
            { name: 'Name', value: list.name, size: 1 }
        ]
    }
}



const PlayListPop: React.FC<PlayListPopProps> = ({ movie, show, onClose }) => {
    const size = "xs";
    const [playLists, setPlayLists] = React.useState<PlayList[]>([]);
    const [selectedLists, setSelectedLists] = React.useState<string[]>([]);
    const [isShowManager, setIsShowManager] = React.useState(false);


    React.useEffect(() => {
        const load = async () => {
            const lists = await models.playList.get();
            setPlayLists(lists);
        }
        const selected = movie.playLists.map(list => String(list.id));
        setSelectedLists(selected);
        load();
    }, [movie]);

    // React.useEffect(() => {
    //     if (!show) return;
    //     if (loading) return;
    //     models.movie.setPlayLists(movie.id, selectedLists.map(id => parseInt(id)))
    // }, [selectedLists]);

    const handleSelectedLists = async (lists: string[]) => {
        await models.movie.setPlayLists(movie.id, lists.map(id => parseInt(id)))
        movie.playLists = lists.map(id => (
            {
                id: parseInt(id),
                name: "",
                totalCount: 0,
                posterUrl: "",
                isSys: false,
                updatedAt: new Date()
            }));
        setSelectedLists(lists);
    }

    const handleNewPlayList = async () => {
        const input = document.getElementById('newPlayList') as HTMLInputElement;
        if (input.value) {
            const listName = input.value;
            const newPlayList = await models.playList.create(listName);
            setPlayLists([...playLists, newPlayList]);
        }
    }

    const handleShowManager = () => {
        setIsShowManager(true);
    }
    const handleCloseManager = () => {
        setIsShowManager(false);
    }

    const handleUpdatePlayList = async (item:Item) => {
        const list = playLists.find(list => list.id === item.id);
        if (list) {
            list.name = item.fields[0].value;
            const re = await models.playList.update(list.id, list.name);
            if (re) {
                setPlayLists([...playLists]);
            } else {
                prompt('Update failed');
            }
        }
    }

    const handleDeletePlayList = async (id: number) => {
        await models.playList.delete(id);
        setSelectedLists(selectedLists.filter(item => item !== String(id)));
    }



    const managerContent = () => {
        return <ModalContent>
            <ModalHeader>
                Play List Manager
            </ModalHeader>
            <ModalBody className="min-h-[200px]">
                {playLists.map(list => (
                    <ItemManager
                        key={list.id}
                        item={ castPlayListToItem(list) }
                        onUpdate={handleUpdatePlayList}
                        onDelete={handleDeletePlayList}
                    />
                ))}
                <div className="text-center font-thin text-slate-500">Click item to edit</div>
            </ModalBody>
            <ModalFooter>
                <Button fullWidth onPress={handleCloseManager}>
                    Return
                </Button>
            </ModalFooter>
        </ModalContent>;
    }

    const playListContent = () => {
        return <ModalContent>
            <ModalHeader>
                Play List
                <Tooltip content="Play List Manager" color="secondary" placement="top">
                    <div className="ml-4 flex flex-col justify-center cursor-pointer ho"
                        onClick={handleShowManager} >
                        <FaGear className="text-sm  text-slate-500 hover:text-blue-500" />
                    </div>
                </Tooltip>
            </ModalHeader>
            <ModalBody className="min-h-[200px]">
                <CheckboxGroup value={selectedLists} onChange={handleSelectedLists}>
                    {playLists.map(list => (
                        <Checkbox key={list.id} value={String(list.id)} >
                            {list.name}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            </ModalBody>
            <ModalFooter className="flex flex-col gap-5">
                <div className="flex gap-2">
                    <Input id="newPlayList" placeholder="New Play List" className="text-slate-500" />
                    <Button isIconOnly className="text-slate-500"
                        onClick={handleNewPlayList} >
                        <FaPlus />
                    </Button>
                </div>
                <Button fullWidth onPress={onClose}>
                    Close
                </Button>
            </ModalFooter>
        </ModalContent>;
    }

    return (
        <Modal size={size} placement="bottom-center" backdrop="opaque"
            isOpen={show} onClose={onClose}  >
            {isShowManager ? managerContent() : playListContent()}
        </Modal>
    );

}

export default PlayListPop;