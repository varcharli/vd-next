'use client';

import { useState, useEffect } from 'react';
import { Pagination } from '@nextui-org/react';
import models, { Movie } from '@/services/models';
import MovieBox from '@/components/MovieBox';

const fetchMovies = async (page: number, limit: number): Promise<{ data: Movie[], totalPages: number }> => {
    const response = await models.movie.get({ page, limit });
    const data = response.data[0];
    data.forEach((movie: Movie) => {
        const date = new Date(movie.releaseDate);
        movie.releaseDate = date.toLocaleDateString('en-CA');
    });
    const totalPages = Number.isInteger(response.data[1]) ? Math.ceil(response.data[1] / limit) : 0;
    return { data, totalPages };
};

const MoviesList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 28;

    useEffect(() => {
        const loadMovies = async () => {
            const { data, totalPages } = await fetchMovies(page, limit);
            setMovies(data);
            setTotalPages(totalPages);
        };
        loadMovies();
    }, [page]);

    return (
        <div>
            <div className='flex flex-wrap'>
                {movies.map(movie => (
                    <div key={movie.id}>
                        <MovieBox movie={movie} />
                    </div>
                ))}
            </div>
            <Pagination
                total={totalPages}
                initialPage={1}
                page={page}
                onChange={(page) => setPage(page)}
            />
        </div>
    );
};

export default MoviesList;