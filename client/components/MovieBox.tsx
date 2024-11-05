import Image from 'next/image';
// import { Image } from '@nextui-org/react';

import { useRouter } from 'next/navigation';
import { Movie } from '@/services/models';


const MovieBox = ({ movie, isZoomed = true }: { movie: Movie, isZoomed: boolean }) => {
    const router = useRouter();
    const handleMovieClick = (movie: Movie) => {
        router.push(`/movies/${movie.id}`);
    }

    const imageDiv = () => {
        return (
            <div className="w-48 h-72 
            border border-gray-300 rounded-2xl
            overflow-hidden relative
             shadow-lg m-2">
                {movie.posterUrl
                    ? <Image
                        priority
                        src={movie.posterUrl} alt={movie.name}
                        fill
                    />
                    : <div className='w-[200px] h-[300px] bg-slate-200' />
                }
            </div>
        );
    }

    const zoomedDiv = () => {
        return (
            <div className="w-48 h-72 group
            border border-gray-300 rounded-2xl
            overflow-hidden relative
             shadow-lg m-2
            transition-transform duration-500 ease-in-out transform hover:shadow-xl hover:shadow-slate-800/50 ">
                {movie.posterUrl
                    ? <Image 
                        priority
                        src={movie.posterUrl} alt={movie.name}
                        fill
                        sizes='100vw 100vh'
                        className="transition-transform duration-300 ease-in-out transform group-hover:scale-125"
                    />
                    : <div className='w-[200px] h-[300px] bg-slate-200' />
                }
            </div>
        );
    }

    return (
        // use div relative and image layout=fill to make image responsive.
        <div className='flex flex-col my-2'
            onClick={() => {
                if (movie.id) { handleMovieClick(movie) }
            }}>

            {isZoomed ? zoomedDiv() : imageDiv()}
            <div className='w-48 h-6  mx-2 flex justify-between' >
                <div className="font-thin text-gray-600">
                    {movie.sn || ' '}
                </div>
                <div className='font-thin text-gray-600 text-right' >
                    {movie.releaseDate || ' '}
                </div>
            </div>
            <div className="w-48 h-14 mx-2 ">
                <h2 className="line-clamp-2 overflow-hidden text-ellipsis">{movie.name || ' '}</h2>
            </div>
        </div>
    );
};

export default MovieBox;