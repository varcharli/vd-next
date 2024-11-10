import React, { ReactNode, useState } from 'react';
import { Button, Tooltip } from '@nextui-org/react';
import { FaBookmark, FaLink, FaRegImages, FaPenAlt } from 'react-icons/fa';
import PlayListPop from '../play-lists/PlayListPop';
import { Movie } from '@/services/apiMovie';
import PlayLinksPopup from '../play-links/PlayLinksPopup';
import { PlayLink } from '@/services/apiPlayLink';
import GalleriesPopup from '../gallery/GalleryPopup';
import { Gallery } from '@/services/apiGallery';
import MovieForm from './MovieForm';

interface MovieActionBarProps {
    movieId: number;
    currentMovie: Movie;
    currentPlayLinks: PlayLink[];
    setPlayLinks: (links: PlayLink[]) => void;
    currentGalleries: Gallery[];
    setGalleries: (galleries: Gallery[]) => void;
    refMovie: (movie: Movie) => void;
}

const MovieActionBar: React.FC<MovieActionBarProps> = ({
    movieId,
    refMovie,
    currentMovie,
    currentPlayLinks, setPlayLinks,
    currentGalleries, setGalleries }) => {
    const [showPlayList, setShowPlayList] = useState(false);
    const [movie, setMovie] = useState<Movie | null>(currentMovie || null);
    const [isShowPlayLinks, setIsShowPlayLinks] = useState(false);
    const [isShowGalleries, setIsShowGalleries] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
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

    const handleOpenForm = () => {
        setIsFormOpen(true);
    }
    const handleCloseForm = () => {
        setIsFormOpen(false);
    }

    if (!movie) {
        return <div />;
    }

    const button = (text: string, onClick: () => void, icon: ReactNode,
        className?: string) => {
        return (
            <Tooltip color="warning" className='text-slate-100'
            content={text} delay={1000}>
                <Button isIconOnly color="primary" variant="flat"
                    onClick={onClick}
                    className={className ?? 'text-slate-500 hover:bg-slate-300'} >
                    {icon}
                </Button>
            </Tooltip>
        );
    }

    return (
        <div className="flex gap-4 w-auto justify-end">
            {button('Play Links', handleShowPlayLinks, <FaLink size={20} />)}
            {button('Galleries', handleShowGalleries, <FaRegImages size={20} />)}
            {button('Edit movie content', handleOpenForm, <FaPenAlt size={20} />)}
            {button('Play List', handleShowPlayList, <FaBookmark size={20}
                className={`${movie.playLists?.length ? "text-orange-500" : "text-slate-500"} hover:bg-slate-300`}
            />)}

            <PlayLinksPopup
                isOpen={isShowPlayLinks}
                playLinks={currentPlayLinks || []}
                setPlayLinks={setPlayLinks || (() => { })}
                movieId={movieId}
                onClose={handleHidePlayLinks || (() => { })}
            />
            <PlayListPop movie={movie}
                show={showPlayList}
                onClose={handleHidePlayList} />
            <GalleriesPopup
                isOpen={isShowGalleries}
                galleries={currentGalleries || []}
                setGalleries={setGalleries}
                movieId={movieId}
                onClose={handleHideGalleries}
            />
            <MovieForm
                isOpen={isFormOpen}
                movieId={movieId}
                movie={movie}
                onClose={handleCloseForm}
                onSubmit={(movie) => {refMovie(movie)}}
                mode='update'
            />
        </div>
    );
}

export default MovieActionBar;