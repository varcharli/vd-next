// app/page.tsx
import { Suspense } from 'react';
import axios from 'axios';
import Image from 'next/image';


interface Movie {
    releaseDate: string;
    posterUrl: string | undefined;
    id: number;
    name: string;
    description: string;
    sn: string;
}

const fetchMovies = async (): Promise<Movie[]> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/movies`);
    const data = response.data;
    data.forEach((movie: Movie) => {
        const date = new Date(movie.releaseDate);
        movie.releaseDate = date.toLocaleDateString('en-CA');
    }
    );
    return data;
};

const MovieBox = ({ movie }: { movie: Movie }) => {
    return (
        <div className='flex flex-col my-2' >
            <div className="w-48 h-72 border border-gray-300
            rounded-lg overflow-hidden shadow-lg m-2">
                <Image src={movie.posterUrl || '/default-poster.jpg'} alt={movie.name} width={200} height={300}
                    className='object-cover w-full h-full'
                />
            </div>

            <div className='w-48 mx-2 flex justify-between' >
                <div className="font-thin text-gray-600">
                    {movie.sn}
                </div>
                <div className='font-thin text-gray-600 text-right' >
                    {movie.releaseDate}
                </div>
            </div>
            <div className="w-48 mx-2 ">
                <h2 className="line-clamp-2 overflow-hidden text-ellipsis">{movie.name}</h2>
            </div>
        </div>
    );
};

const MoviesList = async () => {
    const movies = await fetchMovies();

    return (
        <div className='flex flex-wrap' >
            {movies.map(movie => (
                <div key={movie.id}>
                    <MovieBox movie={movie} />
                </div>
            ))}
        </div>
    );
};

const Movies = () => {
    return (
        <div className="flex">
            <div className="min-w-40 p-4" >
                <h1 className="text-2xl font-thin text-gray-700 my-4">Sort by</h1>
                <ul>
                    <li className="mb-2">Year</li>
                    <li className="mb-2">Rating</li>
                    <li className="mb-2">Popularity</li>
                </ul>
            </div>
            <div className='w-full flex justify-center'>
                <div className="p-4 max-w-screen-2xl ">
                    <h1 className="text-4xl font-bold my-4">Movies</h1>
                    <Suspense fallback={<p>Loading...</p>}>
                        <MoviesList />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Movies;