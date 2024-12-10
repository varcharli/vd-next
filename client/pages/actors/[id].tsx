import { useRouter } from 'next/router';
import models, { Actor, Movie } from '@/services/models';
import { useEffect, useState } from 'react';
import { MainContent, MainFrame } from '@/components/frame';
import { IconTurned, Loading } from '@/components';
import { Image } from '@nextui-org/react';
import { MovieBox } from '@/components';


export default function ActorPage() {
  const router = useRouter();
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const movieLenth=12;

  const handleBack = () => {
    window.history.back();
  }


  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const actorId = parseInt(router.query.id as string, 10);

    const fetchActor = async () => {
      const response = await models.actor.getById(actorId);
      const data = response.data;
      if (!data) {
        router.push('/404');
        return;
      }

      const re = await models.movie.get({ actorId: actorId, limit: movieLenth });
      if (re.data && re.data.length > 0) {
        const reMovies = re.data[0];
        setMovies(reMovies);
      } else {
        setMovies([]);
      }
      setActor(data);
    };

    fetchActor();
  }, [router]);

  if (!actor) {
    return <Loading />;
  }



  return <MainFrame>
    <MainContent>
      <div className="flex gap-5">
        <div className='flex flex-col gap-3 w-[600px] justify-start'>
          <IconTurned onClick={handleBack} text="Back to actors" />
          <Image src={actor.photoUrl} alt={actor.name} />
          <h1 className='text-orange-500'>{actor.name}</h1>
          <div className='text-slate-500'>
            {actor.description}
          </div>

        </div>
        <div className='flex flex-col ' >
          <div className='flex flex-wrap gap-3'>
            {movies.map(movie => <MovieBox key={movie.id} movie={movie} />)}
            </div>
        </div>


      </div>

    </MainContent>
  </MainFrame>;
}