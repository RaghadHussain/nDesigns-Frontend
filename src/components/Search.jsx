import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { FiSearch } from 'react-icons/fi'
import { search } from '../services/productService'
import getImageUrl from '../utils/imageUrl'

const SUGGESTIONS_LIMIT = 5;

function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        setLoading(true);
        async function searchResults() {
            try {
                const response = await search(query);
                setResults(response);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        searchResults();
    }, [query]);

    function goToResultsPage() {
        if (!query.trim()) return;
        setShowSuggestions(false);
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            goToResultsPage();
        }
    }

    const suggestions = results.slice(0, SUGGESTIONS_LIMIT);

    return (
        <div>
            <div>
                <input
                    type="text"
                    id="searchBox"
                    placeholder="Search Here ..."
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={handleKeyDown}
                />
                <button type="button" onClick={goToResultsPage} aria-label="Search">
                    <FiSearch />
                </button>
            </div>

            {showSuggestions && query && (
                <div>
                    {loading && "Loading..."}

                    {!loading && suggestions.length > 0 && (
                        <div>
                            {suggestions.map((product) => {
                                const firstImage = product.images && product.images[0];
                                return (
                                    <Link
                                        key={product._id}
                                        to={`/products/${product._id}`}
                                        onClick={() => setShowSuggestions(false)}
                                    >
                                        {firstImage && (
                                            <img src={getImageUrl(firstImage)} alt={product.name} width="40" />
                                        )}
                                        <strong>{product.name}</strong>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {!loading && suggestions.length === 0 && (
                        <strong>No Matching Results ...</strong>
                    )}
                </div>
            )}
        </div>
    )
}

export default Search
