import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/react';
import models, { Movie } from '@/services/models';
import { useRouter } from 'next/router';
import { LinkButton } from '@/components';

const MoviePage = () => {
  const router = useRouter();
  // const movieId = parseInt(router.query.id as string, 10);
  // console.log('movieId:', movieId);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const movieId = parseInt(router.query.id as string, 10);

    const fetchMovie = async () => {
      const response = await models.movie.getById(movieId);
      const data = response.data;
      if (!data) {
        //push to 404 page
        router.push('/404');
        return;
      }
      const date = new Date(data.releaseDate);
      data.releaseDate = date.toLocaleDateString('en-CA');
      setMovie(data);
    };
    fetchMovie();
  }, [router]);



  const handleBack = () => {
    window.history.back();
  }

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <div className="p-4 flex flex-col gap-3" style={{ flex: 1 }} >
        <LinkButton onClick={handleBack} >
          Back to movies
        </LinkButton>
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
        <Image className='border border-gray-300 rounded-2xl
        overflow-hidden shadow-lg '
          src={movie.posterUrl || '/default-poster.png'} alt={movie.name} height={600} />
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