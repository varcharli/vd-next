import React from 'react';
import models, { PlayLink } from '@/services/models';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Input, ModalContent } from '@nextui-org/react';
import ItemManager, { Item } from '@/components/ItemManager';
import { FaPlus } from 'react-icons/fa';

interface PlayLinksPopupProps {
    movieId: number;
    playLinks: PlayLink[];
    onClose: () => void;
    isOpen: boolean;
}

const castPlayLinkToItem = (link: PlayLink): Item => {
    return {
        id: link.id,
        fields: [
            { name: 'name', value: link.name, size: 1 },
            { name: 'url', value: link.url, size: 2 }
        ]
    }
}

export const PlayLinksPopup: React.FC<PlayLinksPopupProps> = ({ isOpen, movieId, playLinks, onClose }) => {
    const [newName, setNewName] = React.useState('');
    const [newUrl, setNewUrl] = React.useState('');
    const [items, setItems] = React.useState(
        playLinks.map((link) => {
            return castPlayLinkToItem(link);;
        }
    )
    );

    const handleUpdate = async (item: Item) => {
        const id = item.id;
        const name = item.fields[0].value;
        const url = item.fields[1].value;
        const playLink = { id, name, url } as PlayLink
        await models.playLink.update(id, playLink);
        const index = items.findIndex((item) => item.id === id);
        items[index].fields[0].value = name;
        items[index].fields[1].value = url;
    }

    const handleDelete = async (id: number) => {
        await models.playLink.delete(id);
        setItems(items.filter(item => item.id !== id));
    }

    const handleCreate = async (name: string, url: string) => {
        const re = await models.playLink.create({
            name,
            movie: { id: movieId },
            url
        } as PlayLink);
        const playLink = re.data;
        playLinks.push(playLink);
        const newItem= castPlayLinkToItem(playLink);
        setItems([...items, newItem]);
    }


    return (
        <Modal size='lg' placement="bottom-center" backdrop="opaque"
            isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Play Links</ModalHeader>
                <ModalBody className='min-h-64'>
                    <div className='flex flex-col'>
                        <div className='flex gap-1'>
                            <Input value={newName} onChange={
                                (e) => setNewName(e.currentTarget.value)} />
                            <Input value={newUrl} onChange={
                                (e) => setNewUrl(e.currentTarget.value)}
                                placeholder="Add new play link" />

                            <Button isIconOnly onClick={() => {
                                handleCreate(newName, newUrl);
                                setNewName('');
                                setNewUrl('');
                            }}>
                                <FaPlus />
                            </Button>
                            <Button isIconOnly className='bg-transparent' disabled />
                        </div>
                        <div className='flex flex-col mt-5'>
                            {items.map((item) => {
                                return <ItemManager key={item.id} item={item}
                                    onUpdate={(item) => {
                                        handleUpdate(item)
                                    }}
                                    onDelete={(id) => { handleDelete(id) }}
                                />
                            })}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className='flex w-full mt-3'>
                        <Button className='w-full'
                            onClick={onClose}>
                            Close
                        </Button></div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

