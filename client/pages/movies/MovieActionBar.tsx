import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { FaBookmark, FaLink } from 'react-icons/fa';
import { PlayListPop } from '../play-lists/PlayListPop';
import { Movie } from '@/services/apiMovie';

interface MovieActionBarProps {
    currentMovie: Movie;
}

export const MovieActionBar: React.FC<MovieActionBarProps> = ({ currentMovie }) => {
    const [showPlayList, setShowPlayList] = useState(false);
    const [movie, setMovie] = useState<Movie | null>(currentMovie);

    const handleShowPlayList = () => {
        setShowPlayList(true);
    }

    const handleHidePlayList = () => {
        setShowPlayList(false);
    }

    React.useEffect(() => { 
        setMovie(currentMovie);
    } , [currentMovie]);

    if (!movie) {
        return <div/>;
    }

    return (
        <div className="flex gap-4 w-auto justify-end">
            <Button isIconOnly color="primary" variant="flat"
                className='text-slate-500 hover:text-red-500'  >
                <FaLink size={20} />
            </Button>
            <Button isIconOnly color="primary" variant="flat"
                onClick={handleShowPlayList}
                className='text-slate-500 hover:text-red-500'  >
                <FaBookmark size={20} />
            </Button>
            <PlayListPop movie={movie} show={showPlayList} onClose={handleHidePlayList} />
        </div>

    );
}