import React, { useEffect, useState, useRef } from "react";
import { Button, Input } from "@nextui-org/react";
import { FaUndo, FaSave, FaTrash, FaPlus } from 'react-icons/fa';
// import { PlayList } from "@/services/models";

type ItemManagerStatus = 'create' | 'manage' | 'editing';

interface ItemManagerProps {
    item: Item;
    onUpdate?: (item: Item) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
    onCreate?: (item: Item) => Promise<void>;
    status?: ItemManagerStatus;
}

interface ItemField {
    name: string;
    value: string;
    size: number;
}

export interface Item {
    id: number;
    fields: ItemField[];
}

const ItemManager: React.FC<ItemManagerProps> = ({ item, onUpdate, onDelete, onCreate, status }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [fields, setFields] = useState(item.fields);
    const [inputValues, setInputValues] = useState<string[]>([]);
    const firstInputRef = useRef<HTMLInputElement>(null);

    const resetValues = () => {
        inputValues.length = 0;
        fields.map((field) => {
            inputValues.push(field.value);
        });
        // setInputValues(inputValues);    
    }

    useEffect(() => {
        if (status === 'create') {
            setIsEditing(true);
        }

        if (status === 'manage') {
            setIsEditing(false);
        }

        if (status === 'editing') {
            setIsEditing(true);
        }
    }, [status]);

    useEffect(() => {
        resetValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields]);

    useEffect(() => {
        if (isEditing && firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, [isEditing]);

    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleSave = () => {
        inputValues.map((value, index) => {
            fields[index].value = value;
        });
        if (onUpdate) { onUpdate(item); }
        setFields(fields);
        setIsEditing(false);
    }

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${item.fields[0]?.value}?`)) {
            if (onDelete) { onDelete(item.id); }
        }
    };

    const handleUndo = () => {
        resetValues();
        setInputValues(inputValues);
        setIsEditing(false);
    }

    const handleCreate = async () => {
        inputValues.map((value, index) => {
            item.fields[index].value = value;
        });
        if (onCreate) {
            console.log('onCreate:', item);
            await onCreate(item);
        }
        inputValues.map((value, index) => {
            inputValues[index] = '';
        });

        console.log('handleCreate:', item);
    }


    const Textbox = (text: string, index: number, size: number) => {
        return <div key={index} style={{ flex: size }}
            className="ml-2 overflow-hidden " >
            <h1 className="text-ellipsis whitespace-nowrap overflow-hidden">{text}</h1>
        </div>;
    }
    const InputBox = (index: number, size: number) => {

        return <div key={`{"input${index}"}`} className={`flex-1 `}
            style={{ flex: size }}>
            <Input value={inputValues[index]}
                ref={index === 0 ? firstInputRef : null}
                onChange={(e) => {
                    const newInputValues = [...inputValues];
                    newInputValues[index] = e.currentTarget.value;
                    setInputValues(newInputValues);
                }} />
        </div>
    }
    const iconSize = 16;

    return (
        <div className="flex items-center  ">
            <div className="flex-1 h-11 flex flex-col justify-center mr-1">
                {isEditing ? (
                    <div className="flex gap-1 ">
                        {fields.map((field, index) => (
                            InputBox(index, field.size)
                        ))}
                    </div>)
                    : (
                        <div onClick={handleEdit}
                            className="text-black bg-transparent hover:bg-slate-100 py-2
                            rounded-lg ">
                            <div className="flex gap-1">
                                {fields.map((field, index) => (
                                    Textbox(field.value, index, field.size)
                                ))}
                            </div>
                        </div>
                    )}
            </div>

            {status === 'create' ? <div className="flex">
                <Button isIconOnly onClick={handleCreate}
                    className="text-blue-500 bg-slate-200 hover:bg-slate-200 ">
                    <FaPlus size={iconSize} />
                </Button>
                <Button isIconOnly className='bg-transparent' disabled />
            </div> :
                isEditing
                    ? (
                        <div className="flex">
                            <Button isIconOnly onClick={handleUndo}
                                className="text-blue-500 bg-transparent hover:bg-slate-200">
                                <FaUndo size={iconSize} />
                            </Button>
                            <Button isIconOnly onClick={handleSave}
                                className="text-blue-500 bg-transparent hover:bg-slate-200">
                                <FaSave size={iconSize} />
                            </Button></div>)
                    : (
                        <div className="flex">
                            <Button isIconOnly className='bg-transparent' disabled />
                            <Button isIconOnly onClick={handleDelete}
                                className="text-red-500 bg-transparent hover:bg-slate-200">
                                <FaTrash size={iconSize} />
                            </Button></div>)}
        </div>
    );
};


export const ItemManagerTitle: React.FC<{ fields: ItemField[] }> = ({ fields }) => {
    return (
        <div className="flex items-center mt-3 border-b-1  ">
            <div className="flex-1 flex flex-col justify-center mr-1">
                <div className="flex gap-1 ">
                    {fields.map((field, index) => (
                        <div key={index} style={{ flex: field.size }}
                            className="ml-2 overflow-hidden " >
                            <h1 className="text-ellipsis whitespace-nowrap overflow-hidden font-thin ">
                                {field.name}
                            </h1>
                        </div>
                    )
                    )}
                </div>
            </div>
            <div className="flex">
                <Button isIconOnly className='bg-transparent' disabled />
                <Button isIconOnly className='bg-transparent' disabled />
            </div>
        </div>
    );
}



export default ItemManager;