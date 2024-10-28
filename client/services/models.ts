import { movie } from './apiMovie';
export type { Movie } from './apiMovie';
import { actor } from './apiActor';
export type { Actor } from './apiActor';

const models = {
    movie,
    actor,
};

export default models;
