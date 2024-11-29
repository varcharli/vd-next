import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input } from "@nextui-org/react";
import Logo from '@/public/icons/logo.svg';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaUserCircle } from "react-icons/fa";

const AppTopbar = () => {

    const router = useRouter();
    const handleSearch = () => {
        const searchQuery = document.getElementById('search_input') as HTMLInputElement;
        if (searchQuery) {
            router.push({
                pathname: '/movies',
                query: { title: searchQuery.value }
            });
        }
    }

    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // const item = (href: string, title: string) => {
    //     return (
    //         <NavbarItem className="ml-6 font-thin" >
    //             <Link className="text-black "
    //                 href={href}>{title} </Link>
    //         </NavbarItem>
    //     )
    // }

    return (
        <Navbar isBordered maxWidth="full" className="bg-white ">
            <NavbarContent justify="start">
                <NavbarBrand>
                    <Link href="/" className="mr-3" >
                        <Image src={Logo} alt="logo" width={32} height={32} />
                    </Link>
                    <Input id="search_input"
                        placeholder="Type to search..."
                        size="md"
                        startContent={<FaSearch
                            onClick={() => handleSearch()}
                            className='text-slate-400 w-4 cursor-pointer' />}
                        type="search"
                        onKeyDown={handleKeyDown}
                        className="text-slate-400"
                    />
                </NavbarBrand>
                <NavbarBrand>

                </NavbarBrand>
            </NavbarContent>
            <NavbarContent justify="end" >
                {/* {item('/movies', 'Home')}
                {item('/history', 'History')}
                {item('/play-list', 'List')}
                {item('/profile', 'Profile')} */}
                <NavbarItem className="ml-6 font-thin" >
                    <Link className="text-black "
                        href='/profile'><FaUserCircle size={26} className="text-slate-500 mt-2"/> </Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export default AppTopbar;
