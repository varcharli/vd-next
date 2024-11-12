import React, { ReactNode, useState } from 'react';
import { FaBookmark, FaLink, FaRegImages, FaPenAlt } from 'react-icons/fa';
import PlayListPop from '../play-lists/PlayListPop';
import { Movie } from '@/services/apiMovie';
import PlayLinksPopup from '../play-links/PlayLinksPopup';
import { PlayLink } from '@/services/apiPlayLink';
import GalleriesPopup from '../gallery/GalleryPopup';
import { Gallery } from '@/services/apiGallery';
import MovieForm from './MovieForm';
import { MyTooltip } from '@/components';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Button } from '@nextui-org/react';
import { TiThMenu } from "react-icons/ti";


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

    const actionButton = (text?: string, onClick?: () => void, icon?: ReactNode,
        className?: string) => {
        return (
            <MyTooltip content={text || ''} >
                <Button isIconOnly color="primary" variant="flat"
                    onClick={onClick}
                    className={className ?? 'text-slate-500 hover:bg-slate-300'} >
                    {icon}
                </Button>
            </MyTooltip>
        );
    }

    const dropdownItem = (text: string, onClick?: () => void, icon?: ReactNode,
        showDivider?: boolean) => {
        showDivider = showDivider ?? false;
        return (
            <DropdownItem onClick={onClick} showDivider={showDivider}>
                <div className='flex gap-3 items-center font-thin text-medium'>
                    <div className='w-[16px] h-[16px] text-slate-500'> {icon}</div>
                    {text}
                </div>
            </DropdownItem>
        );
    }
    if (!movie) {
        return <div />;
    }

    return (
        <div className="flex gap-4 w-auto justify-end">
            {actionButton('Play List', handleShowPlayList, <FaBookmark size={20}
                className={`${movie.playLists?.length ? "text-orange-500" : "text-slate-500"} hover:bg-slate-300`}
            />)}
            {actionButton('Play Links', handleShowPlayLinks, <FaLink size={20} />)}
            <Dropdown>
                <DropdownTrigger>
                    <Button isIconOnly color="primary" variant="flat"
                        className='text-slate-500 hover:bg-slate-300'>
                        <TiThMenu size={20} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu>
                    {dropdownItem('Edit movie content', handleOpenForm, <FaPenAlt />)}
                    {dropdownItem('Galleries', handleShowGalleries, <FaRegImages />, true)}
                    {dropdownItem(movie.fromUrl ? `From ${movie.fromUrl}` : 'No source')}
                </DropdownMenu>
            </Dropdown>

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
                onSubmit={(movie) => { refMovie(movie) }}
                mode='update'
            />
        </div>
    );
}





export default MovieActionBar;