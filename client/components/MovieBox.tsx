import MyImage from './MyImage';
import { useRouter } from 'next/navigation';
import { Movie } from '@/services/models';

const MovieBox = ({ movie, isZoomed = true }: { movie: Movie, isZoomed?: boolean }) => {
    const router = useRouter();
    const handleMovieClick = (movie: Movie) => {
        router.push(`/movies/${movie.id}`);
    }

    const imageDiv = () => {
        return (
        <div className='w-[200px]  h-[300px] 
            border-1 border-gray-200 shadow-lg
             bg-slate-50
            flex rounded-2xl overflow-clip '>
            <MyImage className='shadow-lg '
                src={movie.posterUrl || '/default-poster.png'}
                alt={movie.name}
                mode="cover"
                zoomed={isZoomed}
                width={200}
                height={300}
            />
             </div>
            
        );
    }

    return (
        // use div relative and image layout=fill to make image responsive.
        <div className='flex flex-col my-2 justify-center'
            onClick={() => {
                if (movie.id) { handleMovieClick(movie) }
            }}>

            {imageDiv()}
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