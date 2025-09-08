import React, { useState } from 'react';

const SearchInput = ({ onSearch, placeholder = 'Search...' }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClear = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input
                type="text"
                value={searchQuery}
                onChange={handleChange}
                placeholder={placeholder}
                className="search-input"
            />
            {searchQuery && (
                <button
                    type="button"
                    className="search-clear-button"
                    onClick={handleClear}
                >
                    ×
                </button>
            )}
            <button type="submit" className="search-submit-button">
                Search
            </button>
        </form>
    );
};

export default SearchInput;