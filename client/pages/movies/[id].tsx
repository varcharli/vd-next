import { useEffect, useState } from 'react';
import { Avatar } from '@nextui-org/react';
import models, { Movie, PlayLink, Gallery, DownloadLink } from '@/services/models';
import { useRouter } from 'next/router';
import { Gallery as GalleryList } from '@/components';
import UserImg from '@/public/images/user.svg';
import { Loading } from '@/components';
import MovieActionBar from './MovieActionBar';
import { GalleryPopup } from '@/components/Gallery';
import PlayLinksPanel from '../play-links/PlayLinksPanel';
import DownloadLinksPanel from '../download-links/DownloadLinksPanel';

import { MyImage, IconTurned } from '@/components';

const MoviePage = () => {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowGallery, setIsShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [playLinks, setPlayLinks] = useState<PlayLink[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [formRefed, setFormRefed] = useState(false);
  const movieId = parseInt(router.query.id as string, 10);



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
      setDownloadLinks(data.downloadLinks);
      setGalleries(data.galleries);
      setIsLoading(false);
    };
    fetchMovie();
  }, [router, formRefed]);

  const handleBack = () => {
    const referrer = document.referrer;
    const currentHost = window.location.host;

    if (referrer && new URL(referrer).host === currentHost) {
      window.history.back();
    } else {
      window.location.href = '/movies';
    }
  };

  const handleShowGallery = (index: number) => {
    setGalleryIndex(index);
    setIsShowGallery(true);
  }
  const handleHideGallery = () => {
    setIsShowGallery(false);
  }

  const handleActorClick = (actorId: number) => {
    router.push({
      pathname: '/movies',
      query: { actorId }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handelFormRef = (_: Movie) => {
    console.log('handelFormRef ', formRefed);
    setFormRefed(!formRefed);
  }

  if (!movie || isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex">
      <div className="p-4 flex flex-col gap-3 flex-initial w-[500px]" >
        <div className='flex justify-between'>
          {/* <LinkButton onClick={handleBack} > */}
          <IconTurned onClick={handleBack} text="Back to movies" />
          {/* </LinkButton> */}

        </div>

        <h1 className="text-3xl">{movie.name}</h1>

        <div className="text-orange-500 text-3xl ">
          {movie.sn}
        </div>
        <div className="font-thin" >
          {movie.releaseDate}
        </div>
        <div className="font-thin gap-3 flex flex-wrap ">
          {movie.actors.map(actor => {
            return (
              <div key={actor.id}
                onClick={() => handleActorClick(actor.id)}
                className='flex flex-col gap-1 items-center' >
                <Avatar src={actor.photoUrl || UserImg} className='h-25 w-25' />
                <h1 className='w-20' >{actor.name}</h1>
              </div>);
          }
          )}
        </div>
        <div className="font-thin text-gray-600">
          {movie.description}
        </div>
        <MovieActionBar currentMovie={movie}
          movieId={movieId}
          refMovie={handelFormRef}
          currentPlayLinks={playLinks} setPlayLinks={setPlayLinks}
          currentGalleries={galleries} setGalleries={setGalleries}
          currentDownloadLinks={downloadLinks} setDownloadLinks={setDownloadLinks}
        />
        <div>
          <PlayLinksPanel playLinks={playLinks} />
          <DownloadLinksPanel downloadLinks={downloadLinks} />
        </div>

      </div>
      <div className="flex flex-col flex-initial " >
        <div className="flex p-4" >
          <div>
            <MyImage className='rounded-xl shadow-lg border-1 border-gray-200'
              src={movie.largePosterUrl || movie.posterUrl || '/default-poster.png'}
              alt={movie.name}
              mode='full' />
          </div>
        </div>

        <div className='p-4 '>
          <GalleryList
            images={galleries.map((i) => i.url).
              filter((i) => i) as string[]}
            onClick={(index) => handleShowGallery(index)}
          />
          {isShowGallery && <GalleryPopup
            images={galleries.map((i) => i.url).filter((i) => i) as string[]}
            index={galleryIndex}
            onClose={handleHideGallery}
          />}

        </div>
      </div>
    </div>
  );
};

export default MoviePage;