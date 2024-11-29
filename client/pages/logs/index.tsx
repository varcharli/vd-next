import { MainNav } from "@/components/frame";
import { useEffect, useState } from "react";
import { SearchInput } from "@/components";
import { MainFrame, MainContent } from "@/components/frame";
import models, { ScraperLog } from "@/services/models";
import { Loading } from "@/components";
import { Pagination, Card, CardHeader, CardBody, Divider, } from "@nextui-org/react";
import { useRouter } from "next/router";



export default function LogsPage() {
    const pageSize = 30;
    const router = useRouter();
    const page = Number(router.query.page) || 1;
    const [totalPages, setTotalPages] = useState(0);
    const title = Array.isArray(router.query.title) ? router.query.title[0] : router.query.title || '';
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [logs, setLogs] = useState<ScraperLog[]>([]);



    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            const response = await models.scraperLog.get({ page, limit: pageSize, name: searchText });
            if (response.data) {
                setLogs(response.data[0]);
                const totalPages = Number.isInteger(response.data[1]) ? Math.ceil(response.data[1] / pageSize) : 0;
                setTotalPages(totalPages);
            }
            setIsLoading(false);
        }

        fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page,title]);

    const card = (log: ScraperLog) => {
        return (
            <Card key={log.id} className="mb-4" 
                isBlurred={false} radius="sm" shadow="sm" >
                <CardHeader>
                    <div className="flex w-full items-center justify-between">
                        <div className="text-lg text-slate-500">{log.name}</div>
                        <div className="text-sm text-slate-500 font-thin">{log.time}</div>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="text-slate-500 font-thin">{log.log}</div>
                </CardBody>
                {/* <Divider /> */}
                {/* <CardFooter>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">{log.time}</div>
                    </div>
                </CardFooter> */}
            </Card>
        );
    }

    const handlePageChange = (page: number) => {
        router.push({
            pathname: '/logs',
            query: {
                title: title,
                page
            }
        });
    }

    const handleSearch = (value: string) => {
        router.push({
            pathname: '/logs',
            query: {
                title: value,
                page: 1
            }
        });
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <MainFrame>
            <MainNav />
            <MainContent>
                <div className="p-4">
                    <div className="flex flex-col ">
                        <div className="flex items-center justify-between ">
                            <div className="text-slate-500 font-thin" >System Logs here.You can search at right input.</div>
                            <div className="w-[200px]">
                                <SearchInput value={searchText} 
                                onSearch={handleSearch}
                                onChange={(value)=>{setSearchText(value)}} />
                            </div>

                        </div>
                        <div className="py-5">
                            {logs.map(log => card(log))}
                        </div>
                        <div className="flex justify-center py-6">
                            {totalPages > 1 &&
                                <Pagination showControls total={totalPages} initialPage={page}
                                    onChange={handlePageChange} />}
                        </div>
                    </div>
                </div>
            </MainContent>
        </MainFrame>
    );
};

