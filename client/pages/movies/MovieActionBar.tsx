import React, { ReactNode, useState } from 'react';
import { FaBookmark } from 'react-icons/fa';
import { GrLink, GrCloudDownload, GrMenu, GrGallery, GrEdit,GrUserAdd } from 'react-icons/gr';
import PlayListPop from '../play-lists/PlayListPop';
import { Movie } from '@/services/apiMovie';
import PlayLinksPopup from '../play-links/PlayLinksPopup';
import { PlayLink } from '@/services/apiPlayLink';
import GalleriesPopup from '../gallery/GalleryPopup';
import DownloadLinksPopup from '../download-links/DownloadLinksPopup';
import { Gallery } from '@/services/apiGallery';
import { DownloadLink } from '@/services/apiDownloadLink';
import MovieForm from './MovieForm';
import { MyTooltip } from '@/components';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Button } from '@nextui-org/react';
import MovieActors from './MovieActors';
import { Actor } from '@/services/apiActor';


interface MovieActionBarProps {
    movieId: number;
    currentMovie: Movie;
    currentPlayLinks: PlayLink[];
    setPlayLinks: (links: PlayLink[]) => void;
    currentGalleries: Gallery[];
    setGalleries: (galleries: Gallery[]) => void;
    refMovie: (movie: Movie) => void;
    currentDownloadLinks: DownloadLink[];
    setDownloadLinks: (downloadLinks: DownloadLink[]) => void;
    currentActors: Actor[];
    setActors: (actors: Actor[]) => void;
}



const MovieActionBar: React.FC<MovieActionBarProps> = ({
    movieId,
    refMovie,
    currentMovie,
    currentPlayLinks, setPlayLinks,
    currentGalleries, setGalleries,
    currentDownloadLinks, setDownloadLinks,
    currentActors,setActors
}) => {
    const [showPlayList, setShowPlayList] = useState(false);
    const [movie, setMovie] = useState<Movie | null>(currentMovie || null);
    const [isShowPlayLinks, setIsShowPlayLinks] = useState(false);
    const [isShowGalleries, setIsShowGalleries] = useState(false);
    const [isShowDownloadLinks, setIsShowDownloadLinks] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isShowActors, setIsShowActors] = useState(false);

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
    const handleShowDownloadLinks = () => {
        setIsShowDownloadLinks(true);
    }
    const handleHideDownloadLinks = () => {
        setIsShowDownloadLinks(false
        );
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

    const handleOpenActors = () => {
        setIsShowActors(true);
    }
    const handleCloseActors = () => {
        setIsShowActors(false);
    }

    const fromUrlTitle = () => {
        const length=20;
        if (movie && movie.fromUrl) {
            let url=(movie.fromUrl).substring(0, length);
            if(url.length==length){url=url+'...'}
            return `From ${url}`;
        } else {
            return 'No source';
        }
    }

    const handleFromUrl = () => {
        if (movie && movie.fromUrl) {
            window.open(movie.fromUrl, '_blank');
        }
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
            {actionButton('Play Links', handleShowPlayLinks, <GrLink size={20} />)}
            {actionButton('Download Links', handleShowDownloadLinks, <GrCloudDownload size={20} />)}

            <Dropdown>
                <DropdownTrigger>
                    <Button isIconOnly color="primary" variant="flat"
                        className='text-slate-500 hover:bg-slate-300'>
                        <GrMenu size={20} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu>
                    {dropdownItem('Edit movie content', handleOpenForm, <GrEdit />)}
                    {dropdownItem('Galleries', handleShowGalleries, <GrGallery />, true)}
                    {dropdownItem('Actors', handleOpenActors, <GrUserAdd/>, true)}
                    {dropdownItem(fromUrlTitle(), handleFromUrl)}
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
            <DownloadLinksPopup
                movieId={movieId}
                isOpen={isShowDownloadLinks}
                downloadLinks={currentDownloadLinks || []}
                setDownloadLinks={setDownloadLinks}
                onClose={handleHideDownloadLinks}
            />
            <MovieForm
                isOpen={isFormOpen}
                movieId={movieId}
                movie={movie}
                onClose={handleCloseForm}
                onSubmit={(movie) => { refMovie(movie) }}
                mode='update'
            />
            <MovieActors 
                movieId={movieId}
                isOpen={isShowActors}
                onClose={handleCloseActors}
                curActors={currentActors || []}
                onUpdate={setActors}
            />
        </div>
    );
}





export default MovieActionBar;