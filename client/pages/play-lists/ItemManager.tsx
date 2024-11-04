import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { FaUndo, FaSave, FaTrash } from 'react-icons/fa';
// import { PlayList } from "@/services/models";

interface ItemManagerProps {
    item: { id: number, name: string };
    onUpdate: (id: number, name: string) => void;
    onDelete: (id: number) => void;
}

const ItemManager: React.FC<ItemManagerProps> = ({ item, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(item.name);

    const handleEdit = () => {
        if (isEditing) {
            onUpdate(item.id, name);
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
            onDelete(item.id);
        }
    };

    const handleUndo = () => {
        setName(item.name);
        setIsEditing(false);
    }

    const iconSize = 16;
    return (
        <div className="flex items-center gap-1">
            {/* <Button isIconOnly onClick={handleEdit}
                className="text-blue-500 bg-transparent hover:bg-slate-200">
                {isEditing ? <FaSave size={iconSize} /> : <FaPen size={iconSize} />}
            </Button> */}

            <div className="flex-1 ">
                {isEditing ? (
                    <Input
                        value={name} onChange={(e) => setName(e.target.value)} />
                ) : (
                    <div onClick={handleEdit}
                        className="text-black bg-transparent hover:bg-slate-100 p-2 rounded-lg h-full">
                        <span >{item.name}</span></div>
                )}
            </div>

            {isEditing
                ? (
                <div className="flex">
                <Button isIconOnly onClick={handleUndo}
                    className="text-blue-500 bg-transparent hover:bg-slate-200">
                    <FaUndo size={iconSize} />
                </Button>
                <Button isIconOnly onClick={handleEdit}
                    className="text-blue-500 bg-transparent hover:bg-slate-200">
                    <FaSave size={iconSize} />
                </Button></div>)
                : (
                    <Button isIconOnly onClick={handleDelete}
                        className="text-red-500 bg-transparent hover:bg-slate-200">
                        <FaTrash size={iconSize} />
                    </Button>)}
        </div>
    );
};

export default ItemManager;