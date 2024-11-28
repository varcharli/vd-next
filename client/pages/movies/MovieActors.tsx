import React, { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input } from '@nextui-org/react';
import { Empty } from '@/components';
import models, { Actor } from '@/services/models';
import { GrAdd, GrUnlink, GrEdit } from 'react-icons/gr';

interface MovieActorsProps {
    isOpen: boolean;
    movieId: number;
    onClose: () => void;
    curActors: Actor[];
    onUpdate: (actors: Actor[]) => void;
}

const MovieActors: React.FC<MovieActorsProps> = ({ isOpen, movieId, onClose, curActors, onUpdate }) => {
    const [actors, setActors] = useState<Actor[]>(curActors);
    const [searchActors, setSearchActors] = useState<Actor[]>([]);
    // const [isSearching, setIsSearching] = React.useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputedId, setInputedId] = useState<number | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [newActor, setNewActor] = useState<Actor>({} as Actor);
    const [addError, setAddError] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);

    async function saveActors(actors: Actor[]) {
        const actorIds = actors.map(a => a.id);
        const re = await models.movie.setActors(movieId, actorIds);
        if (re.data) {
            const newActors = [...actors];
            await onUpdate(newActors);
            setActors(newActors);
            return true;
        } else {
            return false;
        }
    }

    const handleSearchInputChange = async (value: string) => {
        // setIsSearching(true);
        if (!value) {
            setSearchActors([]);
            return;
        }
        await getActors(value);
        setInputValue(value);
    }

    const getActors = async (title: string) => {
        const re = await models.actor.get({ title, limit: 10 });
        if (re.data && re.data.length > 0) {
            setSearchActors(re.data[0]);
        }
    }

    // const handleSave = async () => {
    //     await saveActors(actors);
    //     onClose();
    // }

    const handleCancel = () => {
        onClose();
    }

    const handleToCreateMode = () => {
        const newOne = {
            id: -1,
            name: inputValue,
            photoUrl: '',
            description: ''
        };
        setNewActor(newOne);
        setIsCreateMode(true);
    }

    const handleAdd = async () => {
        const find = searchActors.find(a => a.name === inputValue);
        if (find) {
            const actor = find; //searchActors.find(a => a.id === selectedId);
            if (actor && !actors.find(a => a.id === inputedId)) {
                actors.push(actor);
                await saveActors(actors);
            }
        } else {
            handleToCreateMode();
        }
    }

    function fieldInput(keyValue: string, value?: string) {
        const title = keyValue.charAt(0).toUpperCase() + keyValue.slice(1);
        return (
            <div>
                <label className='text-slate-500' >{title}</label>
                <Input value={value}
                    onChange={(e) => setNewActor({ ...newActor, [keyValue]: e.target.value })} />
            </div>
        );
    }

    async function addActor(actor: Actor) {
        if (!actors.find(a => a.id === actor.id)) {
            actors.push(actor);
            await saveActors(actors);
        }
    }

    const handleAddSave = async () => {
        if (!newActor.name) {
            setAddError('Name is required');
            return;
        }
        if (newActor.id > 0) {
            const re = await models.actor.update(newActor.id, newActor);
            if (re.data) {
                actors.filter(a => a.id === newActor.id).map(a => {
                    a.name = newActor.name;
                    a.photoUrl = newActor.photoUrl;
                    a.description = newActor.description;
                });
                saveActors(actors);
            }
        } else {
            const re = await models.actor.create(newActor);
            if (re.data) {
                newActor.id = re.data.id;
            }
            await addActor(newActor);
        }
        setIsCreateMode(false);
    }

    const handleAddCancel = () => {
        setIsCreateMode(false);
    }

    const handleRemove = async (actorId: number) => {
        const newActors = actors.filter(a => a.id !== actorId);
        await saveActors(newActors);
    }

    const handleEdit = async (actorId: number) => {
        const editActor = actors.find(a => a.id === actorId);
        setNewActor(editActor as Actor);
        setIsCreateMode(true);
    }

    function createPanel() {
        return (
            <ModalContent>
                <ModalHeader>Create Actor & Add to Movie</ModalHeader>
                <ModalBody>
                    {fieldInput('name', newActor.name)}
                    {fieldInput('photoUrl', newActor.photoUrl)}
                    {fieldInput('description', newActor.description)}
                    <div className='text-red-500'>{addError}</div>
                </ModalBody>
                <ModalFooter>
                    <div className="mt-5 flex justify-between w-full" >
                        <Button onClick={handleAddCancel} className='text-orange-500 w-[150px]'>Cancel & Return</Button>
                        <Button onClick={handleAddSave} className='text-blue-500 w-[150px]'>Save {newActor.id>0 ? "Edit" : "New" }</Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        );
    }

    function managePanel() {
        return (
            <ModalContent>
                <ModalHeader>Add actors</ModalHeader>
                <ModalBody className=' min-h-[300px]' >
                    <div className='flex gap-1'>
                        <Autocomplete
                            allowsCustomValue={true}
                            placeholder="Search actors"
                            onSelectionChange={(id) => setInputedId(
                                id ? parseInt(id as string, 10) : null
                            )}
                            onInputChange={handleSearchInputChange}>
                            {searchActors?.map(actor => (
                                <AutocompleteItem key={actor.id} value={actor.id}>
                                    {actor.name}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Button isIconOnly onClick={handleAdd} ><GrAdd /></Button>
                    </div>
                    <div className='text-slate-500 p-1'>
                        You can create new actor by typing name.Click Actor down here to edit or remove.
                    </div>
                    {/* <div>{`Selected: ${selectedId} inputValue: ${inputValue}`}</div> */}
                    <div className='flex flex-col gap-2'>
                        {actors.length === 0 ? <Empty size='sm' /> :
                            actors.map(actor => {
                                return (
                                    <div key={actor.id}
                                        onClick={() => {
                                            setSelectedId(actor.id);
                                        }}
                                        className={`flex items-center w-full justify-between
                                        cursor-pointer hover:text-orange-500 ${selectedId === actor.id ? "text-orange-500" : ""} `}>
                                        <div className='flex gap-2 items-center'>
                                            <Avatar src={actor.photoUrl} className='h-10 w-10' alt={actor.name} />
                                            <div>{actor.name}</div></div>
                                        {selectedId === actor.id &&
                                            <div className='flex gap-1'>
                                                <Button isIconOnly onClick={() => { handleEdit(actor.id) }}
                                                    className='text-blue-500 bg-slate-100' >
                                                    <GrEdit size={16} />
                                                </Button>
                                                <Button isIconOnly onClick={() => { handleRemove(actor.id) }}
                                                    className='text-orange-500 bg-slate-100' >
                                                    <GrUnlink size={16} />
                                                </Button>
                                            </div>
                                        }
                                    </div>
                                );
                            }
                            )}
                    </div>

                </ModalBody>
                <ModalFooter>
                    <div className="mt-5" />

                    <Button onClick={handleCancel} className='w-full text-orange-500'>Return</Button>
                    {/* <Button onClick={handleSave} className='w-[150px] text-blue-500'>Save</Button> */}


                </ModalFooter>
            </ModalContent>);
    }

    useEffect(() => {
        setIsCreateMode(false);
    }, [isOpen]);

    return (
        <Modal size="lg" placement="bottom-center" backdrop="opaque"
            isOpen={isOpen} onClose={onClose}>
            {isCreateMode ? createPanel() : managePanel()}
        </Modal>
    );
}
export default MovieActors;