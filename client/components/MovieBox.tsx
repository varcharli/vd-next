// import Image from 'next/image';
import { Image } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Movie } from '@/services/models';


const MovieBox = ({ movie }: { movie: Movie }) => {
    const router = useRouter();
    const handleMovieClick = (movie: Movie) => {
        router.push(`/movies/${movie.id}`);
    }

    return (
        <div className='flex flex-col my-2'
            onClick={() => { handleMovieClick(movie) }}>
            <div className="w-48 h-72 
            border border-gray-300 rounded-2xl
            overflow-hidden shadow-lg m-2">
                {movie.posterUrl ? <Image src={movie.posterUrl} alt={movie.name} width={200} height={300} />
                    : <div className='w-[200px] h-[300px] bg-slate-300'/>
                }

            </div>

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