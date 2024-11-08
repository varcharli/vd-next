// 文件: BasePopup.tsx
import React, { Component } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import ItemManager, { ItemManagerTitle, Item } from './ItemManager';
export type {Item} from './ItemManager';


export interface BaseModelPopupProps<T> {
    isOpen: boolean;
    onClose: () => void;
    models: T[];
    setModels: (models: T[]) => void;
    onCreate: (model: T) => Promise<T>;
    onUpdate: (model: T) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    castItemToModel: (item: Item) => T;
    castModelToItem: (model: T) => Item;
    title: string;
}

export type WindowSizeType = 'lg' | 'xs' | 'sm' | 'md' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';

interface BaseModelPopupState {
    items: Item[];
}

class BaseModelPopup<T> extends Component<BaseModelPopupProps<T>, BaseModelPopupState> {
    constructor(props: BaseModelPopupProps<T>) {
        super(props);
        this.state = {
            items: props.models?.map((m) => {
                return props.castModelToItem(m);;
            })
        };
    }



    componentDidUpdate(prevProps: Readonly<BaseModelPopupProps<T>>, prevState: Readonly<BaseModelPopupState>): void {
        if (prevState.items !== this.state.items) {
            const newModels = this.state.items?.map((item) => {
                return this.props.castItemToModel(item);
            }
            );
            this.props.setModels(newModels);
        }
    }

    protected handleUpdate = async (item: Item) => {
        const model = this.props.castItemToModel(item);
        await this.props.onUpdate(model);
        this.setState({
            items: this.state.items.map((i) => {
                if (i.id === item.id) {
                    return item;
                }
                return i;
            })
        });
    }

    protected handleCreate = async (item: Item) => {
        const model = this.props.castItemToModel(item);
        const newModel = await this.props.onCreate(model);
        const newItem = this.props.castModelToItem(newModel);
        this.setState({
            items: [...this.state.items, newItem]
        });
    }

    protected handleDelete = async (id: number) => {
        await this.props.onDelete(id);
        this.setState({
            items: this.state.items.filter((item) => item.id !== id)
        });
    }

    protected windowSize: WindowSizeType = 'lg';
    protected header = (title: string): React.ReactNode => {
        return <ModalHeader>{title}</ModalHeader>;
    }

    render(): React.ReactNode {
        const { isOpen, onClose, title, castModelToItem } = this.props;
        const { items } = this.state;
        const newItem = castModelToItem({ id: 0 } as T);

        return (
            <Modal size={this.windowSize} placement="bottom-center" backdrop="opaque"
                isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {this.header(title)}
                    <ModalBody className='min-h-64'>
                        <div className='flex flex-col'>
                            <div>
                                <ItemManager key={0} item={newItem} status='create'
                                    onCreate={async (item) => 
                                        await this.handleCreate(item)} />
                            </div>
                            <ItemManagerTitle fields={newItem.fields} />
                            <div className='flex flex-col mt-5'>
                                {items?.map((item) => (
                                    <ItemManager key={item.id} item={item}
                                        onUpdate={async (item) =>
                                            await this.handleUpdate(item)}
                                        onDelete={async (id) =>
                                            await this.handleDelete(id)} />
                                ))}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className='flex w-full mt-3'>
                            <Button className='w-full' onClick={onClose}>Close</Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );

    }
};

export default BaseModelPopup;