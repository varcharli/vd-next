import { useState, useEffect } from 'react';
import { Pagination } from '@nextui-org/react';
import models, { Movie } from '@/services/models';
import MovieBox from '@/components/MovieBox';
import { Empty, Loading } from '@/components';

interface MoviesListProps {
    page: number;
    limit: number;
    title: string;
    order: string;
    playListId?: number;
    actorId?: number;
    onPageChange: (page: number) => void;
}

const MoviesList = ({ page, limit, title, order, playListId, actorId, onPageChange }: MoviesListProps) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [nullMovies, setNullMovies] = useState<Movie[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    // const minHeight = limit === 8 ? 'h-[400px]' :
    //     limit === 12 ? 'h-[1300px]' :
    //         limit === 14 ? 'h-[800px]' :
    //             'h-[80vh]'; // 默认值




    const fetchMovies = async (page: number, limit: number, title: string,
        order: string, playListId?: number, actorId?: number): Promise<{ data: Movie[], totalPages: number }> => {
        const response = await models.movie.get({ page, limit, title, order, playListId, actorId });
        const data = response.data[0];
        data.forEach((movie: Movie) => {
            const date = new Date(movie.releaseDate);
            movie.releaseDate = date.toLocaleDateString('en-CA');
        });
        const totalPages = Number.isInteger(response.data[1]) ? Math.ceil(response.data[1] / limit) : 0;
        return { data, totalPages };
    };

    useEffect(() => {
        const loadMovies = async () => {
            const { data, totalPages } = await fetchMovies(page, limit, title, order, playListId,actorId);
            setMovies(data);
            setNullMovies([]);
            if (data.length < limit) {
                const nullMovies = Array(limit - data.length).fill({
                    id: 0,
                    name: '',
                    releaseDate: '',
                    posterUrl: '',
                    sn: '',
                });
                setNullMovies(nullMovies);
            }
            setTotalPages(totalPages);
        };

        const loading = async () => {
            setIsLoading(true);
            await loadMovies();
            setIsLoading(false);
        }

        loading();
    }, [page, limit, title, order, playListId,actorId]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            {movies.length === 0
                ? <Empty /> :
                // <div className={`flex flex-wrap ${minHeight}`}>
                <div className='flex flex-wrap'>
                    {movies.map(movie => (
                        <div key={movie.id}>
                            <MovieBox movie={movie} />
                        </div>
                    ))}
                    {nullMovies.map((movie, index) => (
                        <div key={index}>
                            <MovieBox movie={movie} />
                        </div>
                    ))}
                </div>
            }
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