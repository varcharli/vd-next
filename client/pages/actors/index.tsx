import { MainFrame, MainContent } from "@/components/frame";
import { Pagination } from "@nextui-org/react"
import { Empty, Loading, SearchInput } from "@/components";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import models from "@/services/models";
import { Actor } from "@/services/models";
import ActorNav from "./ActorNav";
import { MyAvatar } from "@/components";

export default function ActorsPage() {
    const router = useRouter();
    const page = Number(router.query.page) || 1;
    const [totalPages, setTotalPages] = useState(0);
    const title = Array.isArray(router.query.title) ? router.query.title[0] : router.query.title || '';
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const pageSize = 12;
    const [actors, setActors] = useState<Actor[]>([]);

    const handleSearch = () => {
        router.push({
            pathname: '/actors',
            query: {
                title: searchText,
                page: 1
            }
        });
    }

    const handlePageChange = (page: number) => {
        router.push({
            pathname: '/actors',
            query: {
                title: title,
                page
            }
        });
    }

    const handleActorClick = (id: number) => {
        router.push(`/actors/${id}`);
    }
    const fetchActors = async (page: number, limit: number, title: string,
    ): Promise<{ data: Actor[], totalPages: number }> => {
        const response = await models.actor.get({ page, limit, title });
        const data = response.data[0];
        const totalPages = Number.isInteger(response.data[1]) ? Math.ceil(response.data[1] / limit) : 0;
        return { data, totalPages };
    };


    useEffect(() => {
        if (!title) {
            setActors([]);
            setIsLoading(false);
            return;
        }

        fetchActors(page, pageSize, title).then(({ data, totalPages }) => {
            setActors(data);
            setTotalPages(totalPages);
            setIsLoading(false);
        }
        );
    }, [title, page]);

    const actorsList = () => {
        if (!Array.isArray(actors)) {
            return <Empty />;
        }
        if (actors.length === 0) {
            return <Empty />;
        }

        return (
            <div className="flex flex-wrap gap-3 justify-center">
                {actors?.map(actor => {
                    return (
                        <div key={actor.id}
                            onClick={() => handleActorClick(actor.id)}
                            className='flex flex-col gap-1 items-center w-25 cursor-pointer' >

                            {/* <Avatar src={actor.photoUrl} className='h-25 w-25' /> */}
                            <MyAvatar src={actor.photoUrl} title={actor.name} size={200} />

                            {/* <Skeleton className="w-20 h-16" isLoaded={!isLoading} >
                                <h1 className='w-20 h-16' >{actor.name}</h1>
                            </Skeleton> */}
                        </div>
                    )
                })}
            </div>
        );
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <MainFrame>
            <ActorNav />
            <MainContent>
                <div className="flex flex-col items-center gap-3 text-slate-500
                    h-[200px] justify-center ">
                    <div className="h-10  flex items-center" >
                        Enter the name of the actor you want to search for
                    </div>
                    <div className="h-10 w-1/2 flex items-center ">
                        <SearchInput value={searchText} placeholder="Search Actors"
                            onSearch={handleSearch}
                            onChange={setSearchText} />
                    </div>
                </div>
                <div className="flex flex-col w-full ">
                    {actorsList()}
                    <div className="flex justify-center py-6">
                        {totalPages > 1 &&
                            <Pagination showControls total={totalPages} initialPage={page}
                                onChange={handlePageChange} />}
                    </div>

                </div>

            </MainContent>

        </MainFrame>
    );
};

