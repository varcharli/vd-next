
// import React, { Component } from 'react';
// import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
// // import models, { Movie } from '@/services/models';

// type FormMode = 'create' | 'update';

// interface FormProps<T> {
//     objId?: number;
//     obj?: T;
//     onSubmit?: (obj: T) => void;
//     mode: FormMode;
//     isOpen: boolean;
//     onClose: () => void;
// }

// interface FormState<T> {
//     currentObj: T;
//     fields: FormField[];
// }

// interface FormField {
//     key: string;
//     title: string;
//     value: string;
// }

// const needFields = ['id', 'name', 'sn', 'releaseDate', 'posterUrl', 'largePosterUrl'];

// function castObjToFields<T> (obj:T): FormField[]{
//     const fields: FormField[] = []
//     needFields.forEach((field) => {
//         if (field !== 'id') {
//             fields.push({
//                 key:field,
//                 title: field.charAt(0).toUpperCase() + field.slice(1),
//                 value: String(obj[field as keyof T] || '')
//             } as FormField);
//         }
//     });
//     return fields;
// }

// function castFieldsToMovie <T> (fields: FormField[]): T {
//     function f(key: string) {
//         const value= fields.find(field => field.key === key)?.value;
//         if(value=="null" || value=="undefined"  ){
//             return '';
//         } else {
//             return value;
//         }
//     }
//     const obj: T = {} as T;
//     needFields.forEach((field) => {
//         if (field !== 'id') {
//             // obj[field]=f(field);
//         }
//     });
//     return obj;
// }

// class BaseFormPopup <T> extends Component<FormProps<T>, FormState<T>> {
//     constructor(props: FormProps<T>) {
//         super(props);

//         if (props.mode === 'update') {
//             if (!props.obj || !props.objId) {
//                 throw new Error('At update mode,Data is required.');
//             } else {
//                 this.state = {
//                     currentMovie: props.movie,
//                     fields: castMovieToFields(props.movie)
//                 }
//             }
//         }

//         if (props.mode === 'create') {
//             const newModel = {
//                 id: 0,
//                 name: '',
//                 sn: '',
//                 releaseDate: '',
//                 posterUrl: '',
//                 largePosterUrl: '',
//             } as Movie;
//             this.state = {
//                 currentMovie: newModel,
//                 fields: castMovieToFields(newModel)
//             }
//         }
//     }

//     readonly title = "Movie Form";

//     protected getRecord =  (movie:Movie) => {
//         const record={
//             name: movie.name,
//             sn: movie.sn,
//             releaseDate: movie.releaseDate,
//             posterUrl: movie.posterUrl,
//             largePosterUrl: movie.largePosterUrl,
//         } as Movie;
//         return record;
//     }

//     protected handelUpdate = async (movie: Movie) => {
//         const record= this.getRecord(movie);
//         await models.movie.update( this.props.movieId!, record);
//     }

//     protected handelCreate = async (movie: Movie) => {
//         const record= this.getRecord(movie);
//         await models.movie.create(record);
//     }

//     protected handleSubmit =async () => {
//         const submit = async () => {
//             const currentModel = castFieldsToMovie(this.state?.fields);
//             if (this.props.mode === 'update') {
//                 await this.handelUpdate(currentModel);
//             }
//             if (this.props.mode === 'create') {
//                 await this.handelCreate(currentModel);
//             }
//             if (this.props.onSubmit) {
//                 this.props.onSubmit(currentModel);
//             }
//         }
//         await submit();
//         this.props.onClose();
//     }

//     protected fieldInput = (field: FormField) => {
//         return (
//             <div key={field.key} className='flex flex-col' >
//             <label className='text-slate-500 ml-1' >{field.title}</label>
//             <Input key={field.key}
//                 value={field.value}
//                 placeholder='Enter value'
//                 onChange={(e) => {
//                     const value = e.target.value;
//                     const newFields = this.state?.fields?.map(f => {
//                         if (f.key === field.key) {
//                             return { ...f, value };
//                         }
//                         return f;
//                     });
//                     this.setState({ fields: newFields });
//                 }}
//                 classNames={{
//                     label: "text-red/50",
//                     input:["placeholder:text-default-700/50"]
//                 }}
//                 // labelPlacement="outside"
//             /></div>
//         );
//     }

//     render(): React.ReactNode {
//         const { isOpen, onClose } = this.props;
//         return (
//             <Modal size="lg" placement="bottom-center" backdrop="opaque"
//                 isOpen={isOpen} onClose={onClose}>
//                 <ModalContent>
//                     <ModalHeader>{this.title}</ModalHeader>
//                     <ModalBody className='min-h-64'>
//                         <div className='flex flex-col gap-3'>
//                             {this.state?.fields?.map(this.fieldInput)}
//                         </div>

//                     </ModalBody>
//                     <ModalFooter>
//                         <div className='flex flex-col w-full mt-3'>
//                             <Button onClick={this.handleSubmit} >
//                                 {this.props.mode === 'update' ? 'Update' : 'Create'}
//                             </Button>
//                         </div>
//                     </ModalFooter>
//                 </ModalContent>
//             </Modal>
//         );
//     }
// }

// export default MovieForm;