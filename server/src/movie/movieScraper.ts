import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { Gallery } from '../gallery/gallery.entity';
import { GalleryService } from 'src/gallery/gallery.service';
import { Actor } from 'src/actor/actor.entity';
import { ActorService } from 'src/actor/actor.service';
import { DownloadLink } from '@/download-link/download-link.entity';
import { DownloadLinkService } from '@/download-link/download-link.service';

export const saveOneMovie = async ({
    movie,
    actorService,
    galleryService,
    downloadLinkService,
    movieRepository,
}: {
    movie: Movie,
    actorService: ActorService,
    galleryService: GalleryService,
    downloadLinkService: DownloadLinkService,
    movieRepository: Repository<Movie>,
}) => {
    const actors = [] as Actor[];
    if (movie.actors) {
        for (const item of movie.actors) {
            const re = await actorService.findByName(item.name)
            if (re) {
                actors.push(re);
            } else {
                const newActor = await actorService.create({ name: item.name, photoUrl: item.photoUrl } as Actor);
                actors.push(newActor);
            }
        }
    }
    const galleries = [] as Gallery[];
    if (movie.galleries) {
        for (const item of movie.galleries) {
            const re = await galleryService.findByUrl(item.url);
            if (re) {
                // item = { id: re.id } as Gallery;
                // await this.galleryService.update(re.id, { movie: saved } as Gallery);
                galleries.push(re);
            }
            else {
                const newGallery = await galleryService.create({ url: item.url } as Gallery);
                // item = { id: newGallery.id } as Gallery;
                galleries.push(newGallery);
            }
        }
    }

    const downloadLinks = [] as DownloadLink[];
    if (movie.downloadLinks) {
        for (const item of movie.downloadLinks) {
            const newDownloadLink = await downloadLinkService.create({
                url: item.url,
                name: item.name,
                size: item.size,
                date: item.date,
            } as DownloadLink);
            downloadLinks.push(newDownloadLink);
        }
    }

    


    const m = new Movie();
    m.sn = movie.sn;
    m.name = movie.name;
    m.releaseDate = movie.releaseDate;
    m.posterUrl = movie.posterUrl;
    m.largePosterUrl = movie.largePosterUrl;
    m.description = movie.description;
    m.fromUrl = movie.fromUrl;
    m.actors = actors;
    m.galleries = galleries;
    m.downloadLinks = downloadLinks;
    m.scrapterFinished = true;

    const curMovie = await movieRepository.findOneBy({ sn: movie.sn });
    if (curMovie) {
        const updated= await movieRepository.update(curMovie.id, m);
        return curMovie.id;
    } else{
        const saved = await movieRepository.save(m);
        return saved.id;
    }
    // const saved = await movieRepository.save(m);
    // console.log("re", saved);

    // return saved;
}

export const saveMovieIndexs = async ({
    movies,
    movieRepository,
}: {
    movies: Movie[],
    movieRepository: Repository<Movie>,
}) => {
    let count = 0;
    for (const movie of movies) {
        const re = await movieRepository.findOneBy({ sn: movie.sn });
        if (!re) {
            movie.scrapterFinished = false;
            await movieRepository.save(movie);
            count++;
        }
    }
    return count;
}

export const getUnfinishedMovies = async ({
    limit = 100,
    offset = 0,
    movieRepository,
}: {
    limit?: number,
    offset?: number,
    movieRepository: Repository<Movie>,
}) => {
    return movieRepository.find({
        where: { scrapterFinished: false },
        take: limit,
        skip: offset,
    });
}