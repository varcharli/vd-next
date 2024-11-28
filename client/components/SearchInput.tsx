import { Input } from '@nextui-org/react';
import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchInputProps {
    onSearch?: (value: string) => void;
    onChange?: (value: string) => void;
    value?: string;
    placeholder?: string;
    className?: string;
}


const SearchInput: React.FC<SearchInputProps> = ({ onSearch, value, placeholder, className, onChange }) => {

    const [searchValue, setSearchValue] = React.useState(value);

    const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.target.value;
        setSearchValue(value);
        if(onChange) onChange(value);
    }

    const handleSearch = () => {
        if (onSearch) onSearch(searchValue || '');
    }

    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };
    return (
        <Input id="search_input"
            value={searchValue}
            placeholder={placeholder}
            size="md"
            startContent={<FaSearch
                onClick={handleSearch}
                className='text-slate-400 w-4 cursor-pointer' />}
            type="search"
            onKeyDown={handleKeyDown}
            className={"text-slate-400 " + className}
            onChange={handleChange}
        />);
}

export default SearchInput;