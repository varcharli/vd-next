import { useState, useEffect } from 'react';
import { Pagination } from '@nextui-org/react';
import models, { Movie } from '@/services/models';
import MovieBox from '@/components/MovieBox';

interface MoviesListProps {
    page: number;
    limit: number;
    title: string;
    order: string;
    onPageChange: (page: number) => void;
}

const MoviesList = ({ page, limit, title, order, onPageChange }: MoviesListProps) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    // const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const limit = 16;



    const fetchMovies = async (page: number, limit: number, title: string, order: string): Promise<{ data: Movie[], totalPages: number }> => {

        const response = await models.movie.get({ page, limit, title, order });
        const data = response.data[0];
        data.forEach((movie: Movie) => {
            const date = new Date(movie.releaseDate);
            movie.releaseDate = date.toLocaleDateString('en-CA');
        });
        const totalPages = Number.isInteger(response.data[1]) ? Math.ceil(response.data[1] / limit) : 0;

        // if(data.length < limit) {
        //     const diff = limit - data.length;
        //     const addData = [];
        //     for (let i = 0; i < diff; i++) {
        //         addData.push({ id: i, name: '', releaseDate: '', sn: '', posterUrl: '' });
        //     }
        // }

        return { data, totalPages };
    };

    useEffect(() => {
        const loadMovies = async () => {
            // const order = localStorage.getItem('movieOrder') || 'id DESC';
            const { data, totalPages } = await fetchMovies(page, limit, title, order);
            setMovies(data);
            setTotalPages(totalPages);
        };
        loadMovies();
    }, [page, limit, title,order]);

    return (
        <div>
            <div className='flex flex-wrap'>
                {movies.map(movie => (
                    <div key={movie.id}>
                        <MovieBox movie={movie} />
                    </div>
                ))}
            </div>
            <div className='flex justify-center'>
                {totalPages > 1 &&
                    <Pagination
                        showControls
                        total={totalPages}
                        initialPage={1}
                        page={page}
                        onChange={(page) => onPageChange(page)}
                    />}
            </div>
        </div>
    );
};

export default MoviesList;