// pages/movies/index.tsx
import { MoviesList } from '@/components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import { GoTriangleRight } from "react-icons/go";


const MoviesPage = () => {
    const router = useRouter();
    const page = Number(router.query.page) || 1;
    const pageSize = Number(router.query.limit) || 0;
    const title = Array.isArray(router.query.title) ? router.query.title[0] : router.query.title || '';
    const [order, setOrder] = useState('id DESC');
    const [limit, setLimit] = useState(pageSize);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const storedOrder = localStorage.getItem('movieOrder');
        if (storedOrder) {
            setOrder(storedOrder);
        }
        setIsLoading(false);
    }, []);

    const handlePageChange = (page: number) => {
        // window.location.href = `/movies?page=${page}&limit=${limit}&title=${title}`;
        router.push({
            pathname: `/movies`,
            query: { page, limit, title }
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
            console.log('width', width);
        };

        if (limit == 0) {
            updateLimit();
        } // Set initial limit
        // window.addEventListener('resize', updateLimit);

        // return () => {
        //     window.removeEventListener('resize', updateLimit);
        // };
    }, [limit]);

    const handleOrderChange = (order: string) => {
        localStorage.setItem('movieOrder', order);
        setOrder(order);
        router.push({
            pathname: `/movies`,
            query: { page: 1, limit, title }
        });
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    const orderLi = (orderName: string, orderTitle: string) => {
        return (
            <li className="mb-2 py-1"  >
                <GoTriangleRight className={`inline-block mb-1 mr-1 
                    ${order === orderName ? "text-black-500" : "text-transparent"}`} />
                <button onClick={() => handleOrderChange(orderName)}
                    className={order === orderName ? "text-black-500" : "text-gray-500"}>
                    {orderTitle}
                </button>
            </li>
        );
    }

    return (
        <div className="flex">
            <div className="min-w-40 p-4" >
                <h1 className="text-2xl font-thin text-gray-700 my-4">Sort by</h1>
                <ul>
                    {orderLi('id DESC', 'Create Date')}
                    {orderLi('releaseDate DESC', 'Release Date')}
                    {orderLi('sn ASC', 'Serial Number')}
                </ul>
            </div>
            <div className='w-full flex justify-center'>
                <div className="p-4 max-w-screen-2xl ">
                    {/* <h1 className="text-4xl font-bold my-4">Movies</h1> */}
                    <MoviesList page={page} limit={limit} title={title} order={order} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
};




export default MoviesPage;