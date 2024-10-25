// app/page.tsx
import { Suspense } from 'react';
import axios from 'axios';

interface Movie {
  id: number;
  name: string;
  description: string;
}

const fetchMovies = async (): Promise<Movie[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/movies`);
  return response.data;
};

const MoviesList = async () => {
  const movies = await fetchMovies();

  return (
    <ul>
      {movies.map(movie => (
        <li key={movie.id}>
          <h2>{movie.name}</h2>
          <p>{movie.description}</p>
        </li>
      ))}
    </ul>
  );
};

const Home = () => {
  return (
    <div>
      <h1>Movies</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <MoviesList />
      </Suspense>
    </div>
  );
};

export default Home;