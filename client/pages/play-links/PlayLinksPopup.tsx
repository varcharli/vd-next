import React,{useEffect} from 'react';
import models, { PlayLink } from '@/services/models';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, ModalContent } from '@nextui-org/react';
import ItemManager, { Item,ItemManagerTitle } from '@/components/ItemManager';

interface PlayLinksPopupProps {
    movieId: number;
    playLinks: PlayLink[];
    setPlayLinks: (links: PlayLink[]) => void;
    onClose: () => void;
    isOpen: boolean;
}

const castPlayLinkToItem = (link: PlayLink): Item => {
    return {
        id: link.id,
        fields: [
            { name: 'Name', value: link.name, size: 1 },
            { name: 'URL', value: link.url, size: 2 }
        ]
    }
}

const castItemToPlayLink = (item: Item): PlayLink => {
    return {
        id: item.id,
        name: item.fields[0].value,
        url: item.fields[1].value
    } as PlayLink;
}


export const PlayLinksPopup: React.FC<PlayLinksPopupProps> = ({ isOpen, movieId, playLinks,setPlayLinks, onClose }) => {
    // const [newName, setNewName] = React.useState('');
    // const [newUrl, setNewUrl] = React.useState('');
    const [items, setItems] = React.useState(
        playLinks.map((link) => {
            return castPlayLinkToItem(link);;
        }
        )
    );
    const newItem = castPlayLinkToItem({ id: 0, name: '', url: '' } as PlayLink);

    const updatePlayLinks= () => {
        const newPlayLinks= items.map((item) => {
            return castItemToPlayLink(item);
        });
        setPlayLinks(newPlayLinks);
    }

    useEffect(() => {
        updatePlayLinks();
    }
    , [items]);


    const handleUpdate = async (item: Item) => {
        const id = item.id;
        const name = item.fields[0].value;
        const url = item.fields[1].value;
        const playLink = { id, name, url } as PlayLink
        await models.playLink.update(id, playLink);
        const index = items.findIndex((item) => item.id === id);
        items[index].fields[0].value = name;
        items[index].fields[1].value = url;
        setItems([...items]);
       
    }

    const handleDelete = async (id: number) => {
        await models.playLink.delete(id);
        setItems(items.filter(item => item.id !== id));
    }

    const handleCreate = async (item: Item) => {
        const name = item.fields[0].value;
        const url = item.fields[1].value;
        const re = await models.playLink.create({
            name,
            movie: { id: movieId },
            url
        } as PlayLink);
        const playLink = re.data;
        playLinks.push(playLink);
        const newItem = castPlayLinkToItem(playLink);
        setItems([...items, newItem]);
    }


    return (
        <Modal size='lg' placement="bottom-center" backdrop="opaque"
            isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Play Links</ModalHeader>
                <ModalBody className='min-h-64'>
                    <div className='flex flex-col'>
                        <div>
                            <ItemManager key={0} item={newItem}
                                status='create'
                                onCreate={async (item) => {
                                    await handleCreate(item);
                                }}
                            />
                        </div>
                        <ItemManagerTitle fields={newItem.fields} />
                        <div className='flex flex-col mt-5'>
                            {items.map((item) => {
                                return <ItemManager key={item.id} item={item}
                                    onUpdate={async (item) => {
                                        await handleUpdate(item)
                                    }}
                                    onDelete={async (id) => { handleDelete(id) }}
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

