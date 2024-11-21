// pages/movies/index.tsx
import MoviesList from './MoviesList';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import PlayListNav from './PlayListNav';
import { NavBar,NavTitle,NavItem } from '../home/NavBar';

const MoviesPage = () => {
    const orderReleaseDate = 'releaseDate DESC';
    const orderSerialNumber = 'sn ASC';
    const orderCreateDate = 'id DESC';
    const router = useRouter();
    const page = Number(router.query.page) || 1;
    const pageSize = Number(router.query.limit) || 0;
    const title = Array.isArray(router.query.title) ? router.query.title[0] : router.query.title || '';
    // const playListId = Number(router.query.playListId) || undefined;
    const [playListId, setPlayListId] = useState<number | undefined>(undefined);
    const actorId = Number(router.query.actorId) || undefined;
    const [order, setOrder] = useState(orderReleaseDate);

    const [limit, setLimit] = useState(pageSize);
    const [isLoading, setIsLoading] = useState(true);


    const saveOrder = (order: string) => {
        localStorage.setItem('movieOrder', order);
    }


    useEffect(() => {
        const storedOrder = localStorage.getItem('movieOrder');
        if (storedOrder) {
            setOrder(storedOrder);
        }
        setPlayListId(Number(router.query.playListId) || undefined);
        setIsLoading(false);
    }, [router.query.playListId]);

    // const handleHome = () => {
    //     // setPlayListId(undefined);
    //     saveOrder(orderReleaseDate);
    //     router.push('/movies');
    // }

    const handlePageChange = (page: number) => {
        // window.location.href = `/movies?page=${page}&limit=${limit}&title=${title}`;
        const query: { [key: string]: string | number | undefined } = {};

        if (page > 1) { query.page = page; }
        if (limit) { query.limit = limit; }
        if (title) { query.title = title; }
        if (playListId) { query.playListId = playListId; }
        if (actorId) { query.actorId = actorId; }

        router.push({
            pathname: `/movies`,
            query
        });
    }
    useEffect(() => {
        const updateLimit = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setLimit(8);
            } else if (width <= 1080) {
                setLimit(12);
            } else {
                setLimit(14);
            }
        };

        if (limit == 0) {
            updateLimit();
        } // Set initial limit
    }, [limit]);

    const handlePlayListChange = (playListId?: number) => {
        saveOrder(orderCreateDate);
        setPlayListId(playListId);
        router.push({
            pathname: `/movies`,
            query: { page: 1, limit, title, playListId }
        });
    }

    const handleOrderChange = (order: string) => {
        // localStorage.setItem('movieOrder', order);
        saveOrder(order);
        setOrder(order);
        router.push({
            pathname: `/movies`,
            query: { page: 1, limit, title, playListId }
        });
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    const orderLi = (orderName: string, orderTitle: string) => {
        return (
            <NavItem key={orderName} 
                onClick={() => handleOrderChange(orderName)} 
                actived={order === orderName} 
                text={orderTitle} />
        );
    }

    return (
        <div className="flex">
            <NavBar >
                <PlayListNav onPlayListChange={handlePlayListChange} playListId={playListId} />
                {/* <h1 className="text-2xl font-thin text-gray-700 my-4">Sort by</h1> */}
                <NavTitle text='Sort by' />
                <ul>
                    {orderLi(orderCreateDate, 'Create Date')}
                    {orderLi(orderReleaseDate, 'Release Date')}
                    {orderLi(orderSerialNumber, 'Serial Number')}
                </ul>
            </NavBar>
            <div className='w-full flex justify-center'>
                <div className="p-4 max-w-screen-2xl ">
                    {/* <h1 className="text-4xl font-bold my-4">Movies</h1> */}
                    <MoviesList page={page} limit={limit} title={title}
                        order={order} playListId={playListId} actorId={actorId}
                        onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
};




export default MoviesPage;