import React from "react";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,
    CheckboxGroup, Checkbox, Input
} from "@nextui-org/react";
import { Movie } from "@/services/apiMovie";
import models, { PlayList } from "@/services/models";
import {FaPlus} from 'react-icons/fa';


interface PlayListPopProps {
    movie: Movie;
    show: boolean;
    onClose: () => void;
}

export const PlayListPop: React.FC<PlayListPopProps> = ({ movie, show, onClose }) => {
    const size = "xs";
    const [playLists, setPlayLists] = React.useState<PlayList[]>([]);
    const [selectedLists, setSelectedLists] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const load = async () => {
            const lists = await models.playList.get();
            setPlayLists(lists);
            setLoading(false);
        }
        const selected = movie.playLists.map(list => String(list.id));
        setSelectedLists(selected);
        load();
    }, [movie]);

    React.useEffect(() => {
        if (!show) return;
        if (loading) return;
        models.movie.setPlayLists(movie.id, selectedLists.map(id => parseInt(id)))
    }, [selectedLists]);

    return (
        <Modal size={size} placement="bottom-center" backdrop="opaque"
            isOpen={show} onClose={onClose} >
            <ModalContent>
                <ModalHeader>Play List</ModalHeader>
                <ModalBody className="min-h-[200px]">
                    <CheckboxGroup value={selectedLists} onChange={setSelectedLists}>
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
                        <Button isIconOnly className="text-slate-500" >
                            <FaPlus/>
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