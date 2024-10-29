import React from 'react';
import {Image} from '@nextui-org/react';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {images.map((url, index) => (
        <Image key={index} src={url} alt={`Gallery image ${index + 1}`} 
        radius='sm'
        className="w-[90px] h-[90px] object-cover" />
      ))}
    </div>
  );
};

export default Gallery;