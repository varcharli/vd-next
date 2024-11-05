import React, { useEffect, useState,useRef } from "react";
import { Button, Input } from "@nextui-org/react";
import { FaUndo, FaSave, FaTrash } from 'react-icons/fa';
// import { PlayList } from "@/services/models";

interface ItemManagerProps {
    item: Item;
    onUpdate: (item: Item) => void;
    onDelete: (id: number) => void;
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

const ItemManager: React.FC<ItemManagerProps> = ({ item, onUpdate, onDelete }) => {
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
        resetValues();
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
        onUpdate(item);
        setFields(fields);
        setIsEditing(false);
    }

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${item.fields[0]?.value}?`)) {
            onDelete(item.id);
        }
    };

    const handleUndo = () => {
        resetValues();
        setInputValues(inputValues);
        setIsEditing(false);
    }

    const Textbox = (text: string, index: number, size: number) => {
        const cssSize = size > 0 ? `w-${size}` : '';
        return <div key={index} className={`flex-1 ml-2 ${cssSize}`} >
            <h1>{text}</h1>
        </div>;
    }
    const InputBox = (index: number, size: number) => {
        const cssSize = size > 0 ? `w-${size}` : '';
        return <Input key={`{"input${index}"}`} value={inputValues[index]} 
        ref={index===0?firstInputRef:null}
        onChange={(e) => {
            const newInputValues = [...inputValues];
            newInputValues[index] = e.currentTarget.value;
            setInputValues(newInputValues);
        }} className={`flex-1 ${cssSize}`} />;
    }

    const iconSize = 16;
    return (
        <div className="flex items-center gap-1 my-1">
            {/* <Button isIconOnly onClick={handleEdit}
                className="text-blue-500 bg-transparent hover:bg-slate-200">
                {isEditing ? <FaSave size={iconSize} /> : <FaPen size={iconSize} />}
            </Button> */}

            <div className="flex-1 ">
                {isEditing ? (
                    <div className="flex gap-1">
                        {fields.map((field, index) => (
                            InputBox(index, field.size)
                        ))}
                    </div>)
                    : (
                        <div onClick={handleEdit}
                            className="text-black bg-transparent hover:bg-slate-100 py-1 rounded-lg h-full">
                            <div className="flex gap-1">
                                {fields.map((field, index) => (
                                    Textbox(field.value, index, field.size)
                                ))}
                            </div>
                        </div>
                    )}
            </div>

            {isEditing
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

export default ItemManager;