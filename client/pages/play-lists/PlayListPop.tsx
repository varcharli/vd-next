import React from "react";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,
    CheckboxGroup, Checkbox, Input
} from "@nextui-org/react";
import { Movie } from "@/services/apiMovie";
import models, { PlayList } from "@/services/models";
import { FaPlus } from 'react-icons/fa';


interface PlayListPopProps {
    movie: Movie;
    show: boolean;
    onClose: () => void;
}

export const PlayListPop: React.FC<PlayListPopProps> = ({ movie, show, onClose }) => {
    const size = "xs";
    const [playLists, setPlayLists] = React.useState<PlayList[]>([]);
    const [selectedLists, setSelectedLists] = React.useState<string[]>([]);


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

    return (
        <Modal size={size} placement="bottom-center" backdrop="opaque"
            isOpen={show} onClose={onClose} >
            <ModalContent>
                <ModalHeader>Play List</ModalHeader>
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
            </ModalContent>
        </Modal>
    );

}