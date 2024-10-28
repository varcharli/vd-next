import React from 'react';
import Image from 'next/image';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {images.map((url, index) => (
        <Image key={index} src={url} alt={`Gallery image ${index + 1}`} className="w-24 h-24 object-cover" />
      ))}
    </div>
  );
};

export default Gallery;