// DownloadLinksPopup.tsx

import React from 'react';
import BaseModelPopup, { BaseModelPopupProps, WindowSizeType, Item } from '@/components/BaseModelPopup';
import models, { DownloadLink, Movie } from '@/services/models';

class DownloadLinksPopupClass extends BaseModelPopup<DownloadLink> {
    constructor(props: BaseModelPopupProps<DownloadLink>) {
        super(props);
        this.state = {
            ...this.state,
        };
    }
    protected windowSize: WindowSizeType = 'md';

    render() {
        return super.render();
    }
}

interface DownloadLinksPopupProps {
    movieId: number;
    isOpen: boolean;
    downloadLinks: DownloadLink[];
    setDownloadLinks: (downloadLinks: DownloadLink[]) => void;
    onClose: () => void;
}

const DownloadLinksPopup: React.FC<DownloadLinksPopupProps> = ({ movieId, isOpen, downloadLinks, setDownloadLinks, onClose }) => {
    const castDownloadLinkToItem = (downloadLink: DownloadLink): Item => ({
        id: downloadLink.id,
        fields: [
            { name: 'URL', value: downloadLink.url, size: 2 }
        ]
    });

    const castItemToDownloadLink = (item: Item): DownloadLink => ({
        id: item.id,
        url: item.fields[0].value,
        movie: { id: movieId } as Movie
    });

    const onUpdate = async (downloadLink: DownloadLink) => {
        await models.downloadLink.update(downloadLink.id, downloadLink);
    };

    const onCreate = async (downloadLink: DownloadLink) => {
        downloadLink.movie = { id: movieId } as Movie;
       const re= await models.downloadLink.create(downloadLink);
       return re;
    };

    const onDelete = async (id: number) => {
        await models.downloadLink.delete(id);
    };

    return <DownloadLinksPopupClass
        models={downloadLinks}
        setModels={setDownloadLinks}
        isOpen={isOpen}
        onClose={onClose}
        title="Download Links"
        castModelToItem={castDownloadLinkToItem}
        castItemToModel={castItemToDownloadLink}
        onUpdate={onUpdate}
        onCreate={onCreate}
        onDelete={onDelete}
    />;
};

export default DownloadLinksPopup;