// GalleryPopup.tsx

import BaseModelPopup, { BaseModelPopupProps, WindowSizeType, Item } from '@/components/BaseModelPopup';
import models, { Movie } from '@/services/models';
import { Gallery } from '@/services/models';

class GalleryPopupClass extends BaseModelPopup<Gallery> {
    constructor(props: BaseModelPopupProps<Gallery>) {
        super(props);
        this.state = {
            ...this.state,
        };
    }
    protected windowSize: WindowSizeType = 'sm';

    render() {
        return super.render();
    }
}

interface GalleryPopupProps {
    movieId: number;
    isOpen: boolean;
    galleries: Gallery[];
    setGalleries: (galleries: Gallery[]) => void;
    onClose: () => void;
}

const GalleriesPopup: React.FC<GalleryPopupProps> = ({ movieId, isOpen, galleries, setGalleries, onClose }) => {

    const castGalleryToItem = (gallery: Gallery) => {
        return {
            id: gallery.id,
            fields: [
                { name: 'URL', value: gallery.url, size: 2 }
            ]
        }
    }

    const castItemToGallery = (item: Item) => {
        return {
            id: item.id,
            url: item.fields[0].value
        } as Gallery;
    }

    const onUpdate = async (gallery: Gallery) => {
        await models.gallery.update(gallery.id, gallery);
    }

    const onCreate = async (gallery: Gallery) => {
        gallery.movie = { id: movieId } as Movie;
        const re= await models.gallery.create(gallery);
        return re;
    }
    const onDelete = async (id: number) => {
        await models.gallery.delete(id);
    }

    return <GalleryPopupClass
        models={galleries}
        setModels={setGalleries}
        isOpen={isOpen}
        onClose={onClose}
        title="Galleries"
        castModelToItem={castGalleryToItem}
        castItemToModel={castItemToGallery}
        onUpdate={onUpdate}
        onCreate={onCreate}
        onDelete={onDelete}
    />
}



export default GalleriesPopup;