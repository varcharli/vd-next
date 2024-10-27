// app/page.tsx
import { Suspense } from 'react';
import models, { Movie } from '@/services/models';
import  MovieBox  from '@/components/MovieBox';

const fetchMovies = async (): Promise<Movie[]> => {
    const response = await models.movie.get();
    const data = response.data;
    data.forEach((movie: Movie) => {
        const date = new Date(movie.releaseDate);
        movie.releaseDate = date.toLocaleDateString('en-CA');
    });
    return data;
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