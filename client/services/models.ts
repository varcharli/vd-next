import { movie } from './apiMovie';
export type { Movie } from './apiMovie';
import { actor } from './apiActor';
export type { Actor } from './apiActor';
import { auth } from './apiAuth';

const models = {
    movie,
    actor,
    auth,
};

export default models;
