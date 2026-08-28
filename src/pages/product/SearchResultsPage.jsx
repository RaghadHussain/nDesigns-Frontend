import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { search } from "../../services/productService";
import { getVariantByProduct } from "../../services/productVariantService";
import ProductCard from "../../components/product/ProductCard";

function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchResults() {
            try {
                setLoading(true);
                setError("");

                const productList = await search(query);

                const productsWithVariants = [];
                for (const product of productList) {
                    const variants = await getVariantByProduct(product._id);
                    const prices = variants.map((variant) => variant.price);

                    productsWithVariants.push({
                        ...product,
                        sizes: variants.map((variant) => variant.size),
                        lowestPrice: prices.length ? Math.min(...prices) : null,
                    });
                }

                setProducts(productsWithVariants);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchResults();
    }, [query]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Search Results for "{query}"</h2>

            {products.length === 0 ? (
                <p>No products match "{query}".</p>
            ) : (
                <div>
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchResultsPage;
