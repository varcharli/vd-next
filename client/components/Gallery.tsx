import React, { useState } from 'react';
import { Image } from '@nextui-org/react';
import { FaAngleLeft, FaAngleRight, FaWindowClose } from 'react-icons/fa';

interface GalleryProps {
  images: string[];
  onClick?: (index: number) => void;
}

interface GalleryPopupProps extends GalleryProps {
  index: number;
  onClose: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onClick }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {images.map((url, index) => (
        <Image key={index} src={url}
          onClick={() => onClick && onClick(index)}
          alt={`Gallery image ${index + 1}`}
          radius='sm'
          className="w-[90px] h-[90px] object-cover" />
      ))}
    </div>
  );
};


export const GalleryPopup: React.FC<GalleryPopupProps> = ({ images, index, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(index);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleOverlayClick}>
      <button
        className="absolute top-4 right-4 text-white"
        onClick={onClose}
      >
        <FaWindowClose className="h-8 w-8" />
      </button>
      <button
        className="absolute left-4 text-white"
        onClick={handlePrev}
      >
        <FaAngleLeft className="h-12 w-12" />
      </button>
      <div className="relative w-full max-w-4xl h-3/4 flex items-center justify-center">
        <div className="absolute inset-0" onClick={handleOverlayClick}></div>
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}

          className="rounded-lg"
        />
      </div>
      <button
        className="absolute right-4 text-white"
        onClick={handleNext}
      >
        <FaAngleRight className="h-12 w-12" />
      </button>
    </div>
  );
};

export default Gallery;