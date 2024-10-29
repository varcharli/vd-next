import { movie } from './apiMovie';
export type { Movie } from './apiMovie';
import { actor } from './apiActor';
export type { Actor } from './apiActor';
import { auth } from './apiAuth';
import { playList } from './apiPlayList';
export type { PlayList } from './apiPlayList';

const models = {
    movie,
    actor,
    auth,
    playList,
};

export default models;
