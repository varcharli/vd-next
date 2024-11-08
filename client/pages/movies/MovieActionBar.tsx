import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { FaBookmark, FaLink, FaRegImages } from 'react-icons/fa';
import PlayListPop from '../play-lists/PlayListPop';
import { Movie } from '@/services/apiMovie';
import PlayLinksPopup from '../play-links/PlayLinksPopup';
import { PlayLink } from '@/services/apiPlayLink';
import GalleriesPopup from '../gallery/GalleryPopup';
import { Gallery } from '@/services/apiGallery';

interface MovieActionBarProps {
    currentMovie: Movie;
    currentPlayLinks: PlayLink[];
    setPlayLinks: (links: PlayLink[]) => void;
    currentGalleries: Gallery[];
    setGalleries: (galleries: Gallery[]) => void;
}

const MovieActionBar: React.FC<MovieActionBarProps> = ({ 
    currentMovie,
    currentPlayLinks, setPlayLinks,
    currentGalleries, setGalleries }) => {
    const [showPlayList, setShowPlayList] = useState(false);
    const [movie, setMovie] = useState<Movie | null>(currentMovie || null);
    const [isShowPlayLinks, setIsShowPlayLinks] = useState(false);
    const [isShowGalleries, setIsShowGalleries] = useState(false);

    const handleShowPlayList = () => {
        setShowPlayList(true);
    }

    const handleHidePlayList = () => {
        setShowPlayList(false);
    }

    const handleShowGalleries = () => {
        setIsShowGalleries(true);
    }
    const handleHideGalleries = () => {
        setIsShowGalleries(false);
    }

    React.useEffect(() => {
        setMovie(currentMovie);
    }, [currentMovie]);

    const handleShowPlayLinks = () => {
        setIsShowPlayLinks(true);
    }

    const handleHidePlayLinks = () => {
        setIsShowPlayLinks(false);
    }


    if (!movie) {
        return <div />;
    }

    return (
        <div className="flex gap-4 w-auto justify-end">
            <Button isIconOnly color="primary" variant="flat"
                onClick={handleShowPlayLinks}
                className='text-slate-500 hover:bg-slate-300'  >
                <FaLink size={20} />
            </Button>
            <Button isIconOnly color="primary" variant="flat"
                onClick={handleShowGalleries}
                className='text-slate-500 hover:bg-slate-300'  >
                <FaRegImages size={20} />
            </Button>
            <Button isIconOnly color="primary" variant="flat"
                onClick={handleShowPlayList}
                className={`${movie.playLists?.length ? "text-orange-500" : "text-slate-500"} hover:bg-slate-300`}  >
                <FaBookmark size={20} />
            </Button>
            <PlayListPop movie={movie} show={showPlayList} onClose={handleHidePlayList} />
            <PlayLinksPopup
                isOpen={isShowPlayLinks}
                playLinks={currentPlayLinks || []}
                setPlayLinks={setPlayLinks || (() => { })}
                movieId={movie?.id}
                onClose={handleHidePlayLinks || (() => { })}
            />
            <GalleriesPopup
                isOpen={isShowGalleries}
                galleries={currentGalleries || []}
                setGalleries={setGalleries}
                movieId={movie.id}
                onClose={handleHideGalleries}
            />
        </div>
    );
}

export default MovieActionBar;