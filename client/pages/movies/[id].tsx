import { useEffect, useState } from 'react';
import { Avatar } from '@nextui-org/react';
import Image from 'next/image';
import models, { Movie, PlayLink } from '@/services/models';
import { useRouter } from 'next/router';
import { Gallery, LinkButton } from '@/components';
import UserImg from '@/public/images/user.svg';
import { Loading } from '@/components';
import { MovieActionBar } from './MovieActionBar';
import { GalleryPopup } from '@/components/Gallery';
import { PlayLinksPanel } from '../play-links/PlayLinksPanel';


const MoviePage = () => {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowGallery, setIsShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [playLinks, setPlayLinks] = useState<PlayLink[]>([]);


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
      setPlayLinks(data.playLinks);
      setIsLoading(false);
    };
    fetchMovie();
  }, [router]);

  const handleBack = () => {
    window.history.back();
  }

  const handleShowGallery = (index: number) => {
    setGalleryIndex(index);
    setIsShowGallery(true);
  }
  const handleHideGallery = () => {
    setIsShowGallery(false);
  }

  useEffect(() => {
    console.log('PlayLinksPanel', playLinks);
  }
    , [playLinks]);


  if (!movie || isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex">
      <div className="p-4 flex flex-col gap-3 flex-initial w-[500px]" >
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
        <div className="font-thin gap-3 flex flex-wrap ">
          {movie.actors.map(actor => {
            return (
              <div key={actor.id} className='flex flex-col gap-1 items-center' >
                <Avatar src={actor.photoUrl || UserImg} className='h-25 w-25' />
                <h1 className='w-20' >{actor.name}</h1>
              </div>);
          }
          )}
        </div>
        <div className="font-thin text-gray-600">
          {movie.description}
        </div>
        <MovieActionBar currentMovie={movie} currentPlayLinks={playLinks} setPlayLinks={setPlayLinks} />
        <PlayLinksPanel playLinks={playLinks} />
      </div>
      <div className="flex flex-col flex-initial " >
        <div className="flex justify-center p-4" >
          <div>
            <Image className='border border-gray-300 rounded-2xl shadow-lg '
              priority
              width={0} height={0}
              sizes='100vw'
              style={{ width: '100%', height: 'auto' }}
              src={movie.largePosterUrl || movie.posterUrl || '/default-poster.png'} alt={movie.name} />
          </div>
        </div>

        <div className='p-4'>
          <Gallery
            images={movie.galleries.map((i) => i.url).
              filter((i) => i) as string[]}
            onClick={(index) => handleShowGallery(index)}
          />
          {isShowGallery && <GalleryPopup
            images={movie.galleries.map((i) => i.url).filter((i) => i) as string[]}
            index={galleryIndex}
            onClose={handleHideGallery}
          />}

        </div>
      </div>
    </div>
  );
};

export default MoviePage;