"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import models, { Movie } from '@/services/models';
import { useParams } from 'next/navigation';

const MoviePage = () => {
  const { id } = useParams() as { id: string };
  const movieId = parseInt(id, 10);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await models.movie.getById(movieId);
      const data = response.data;
      const date = new Date(data.releaseDate);
      data.releaseDate = date.toLocaleDateString('en-CA');
      setMovie(data);
    };
    fetchMovie();
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <div className="p-4 flex flex-col gap-3" style={{ flex: 1 }} >
        <h1 className="text-3xl">{movie.name}</h1>
        <div className="font-thin">
          {movie.sn}
        </div>
        <div className="font-thin" >
          {movie.releaseDate}
        </div>
        <div className="font-thin text-gray-600">
          {movie.description}
        </div>

      </div>
      <div className="flex justify-center p-4" style={{ flex: 2 }}>
        <Image className='border border-gray-300 rounded-xl overflow-hidden shadow-lg '
        src={movie.posterUrl || '/default-poster.png'} alt={movie.name} width={500} height={500} />
        {/* <div className="relative  w-full h-full max-w-[500px] max-h-[750px] min-h-[500px]">
          <Image
            src={movie.posterUrl || '/default-poster.png'}
            alt={movie.name}
            layout="fill"
            objectFit="contain"
          />
        </div> */}
      </div>
    </div>
  );
};

export default MoviePage;