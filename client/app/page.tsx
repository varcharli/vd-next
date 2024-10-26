// app/page.tsx
import { redirect } from 'next/navigation';

const Home = () => {
    redirect('/movies');
};

export default Home;