
import React, { Component } from 'react';
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import models, { Actor} from '@/services/models';

type FormMode = 'create' | 'update';

interface FormProps {
    actorId?: number;
    actor?: Actor;
    onSubmit?: (actor: Actor) => void;
    mode: FormMode;
    isOpen: boolean;
    onClose: () => void;
}

interface FormState {
    currentActor: Actor;
    fields: FormField[];
}

interface FormField {
    key: string;
    title: string;
    value: string;
}

const needFields = ['id', 'name', 'description', 'photoUrl'];

const castActorToFields = (actor: Actor): FormField[] => {
    const fields: FormField[] = []
    needFields.forEach((field) => {
        if (field !== 'id') {
            fields.push({
                key:field,
                title: field.charAt(0).toUpperCase() + field.slice(1),
                value: String(actor[field as keyof Actor] || '')
            } as FormField);
        }
    });
    return fields;
}

const castFieldsToActor = (fields: FormField[]): Actor => {
    function f(key: string) {
        const value= fields.find(field => field.key === key)?.value;
        if(value=="null" || value=="undefined"  ){
            return '';
        } else {
            return value;
        }
    }
    const actor: Actor = {
        id: Number(f('id')),
        name: f('name'),
        description: f('description'),
        photoUrl: f('photoUrl'),
    } as Actor;
    return actor;
}

class ActorForm extends Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);

        if (props.mode === 'update') {
            if (!props.actor || !props.actorId) {
                throw new Error('At update mode,Actor is required.');
            } else {
                this.state = {
                    currentActor: props.actor,
                    fields: castActorToFields(props.actor)
                }
            }
        }

        if (props.mode === 'create') {
            const newModel = {
                id: 0,
                name: '',
                description: '',
                photoUrl: '',

            } as Actor;
            this.state = {
                currentActor: newModel,
                fields: castActorToFields(newModel)
            }
        }
    }

    readonly title = "Actor Form";

    protected getRecord =  (actor:Actor) => {
        const record={
            name: actor.name,
            description: actor.description,
            photoUrl: actor.photoUrl,
        } as Actor;
        return record;
    }

    protected handelUpdate = async (actor: Actor) => {
        const record= this.getRecord(actor);
        await models.actor.update( this.props.actorId!, record);
    }

    protected handelCreate = async (actor: Actor) => {
        const record= this.getRecord(actor);
        await models.actor.create(record);
    }

    protected handleSubmit =async () => {
        const submit = async () => {
            const currentModel = castFieldsToActor(this.state?.fields);
            if (this.props.mode === 'update') {
                await this.handelUpdate(currentModel);
            }
            if (this.props.mode === 'create') {
                await this.handelCreate(currentModel);
            }
            if (this.props.onSubmit) {
                this.props.onSubmit(currentModel);
            }
        }
        await submit();
        this.props.onClose();
    }

    protected fieldInput = (field: FormField) => {
        return (
            <div key={field.key} className='flex flex-col' >
            <label className='text-slate-500 ml-1' >{field.title}</label>
            <Input key={field.key}
                value={field.value}
                placeholder='Enter value'
                onChange={(e) => {
                    const value = e.target.value;
                    const newFields = this.state?.fields?.map(f => {
                        if (f.key === field.key) {
                            return { ...f, value };
                        }
                        return f;
                    });
                    this.setState({ fields: newFields });
                }}
                classNames={{
                    label: "text-red/50",
                    input:["placeholder:text-default-700/50"]
                }}
                // labelPlacement="outside"
            /></div>
        );
    }

    render(): React.ReactNode {
        const { isOpen, onClose } = this.props;
        return (
            <Modal size="lg" placement="bottom-center" backdrop="opaque"
                isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>{this.title}</ModalHeader>
                    <ModalBody className='min-h-64'>
                        <div className='flex flex-col gap-3'>
                            {this.state?.fields?.map(this.fieldInput)}
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <div className='flex flex-col w-full mt-3'>
                            <Button onClick={this.handleSubmit} >
                                {this.props.mode === 'update' ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    }
}

export default ActorForm;