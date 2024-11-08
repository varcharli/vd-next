import { movie } from './apiMovie';
export type { Movie } from './apiMovie';
import { actor } from './apiActor';
export type { Actor } from './apiActor';
import { auth } from './apiAuth';
import { playList } from './apiPlayList';
export type { PlayList } from './apiPlayList';
import { playLink } from './apiPlayLink';
export type { PlayLink } from './apiPlayLink';
import { gallery } from './apiGallery';
export type { Gallery } from './apiGallery';

const models = {
    movie,
    actor,
    auth,
    playList,
    playLink,
    gallery,
};

export default models;
