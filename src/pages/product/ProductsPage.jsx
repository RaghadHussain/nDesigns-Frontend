import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { getAllProducts } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import { getVariantByProduct } from "../../services/productVariantService";
import ShopSidebar from "../../components/product/ShopSidebar";
import ProductCard from "../../components/product/ProductCard";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const PRODUCTS_PER_PAGE = 9;

function ProductsPage() {
    useDocumentTitle("Shop");
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [maxPrice, setMaxPrice] = useState(null);
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);

    async function fetchShopData() {
        try {
            setLoading(true);
            setError("");

            const productList = await getAllProducts();
            const categoryList = await getAllCategories();

            const productsWithVariants = [];
            for (const product of productList) {
                const variants = await getVariantByProduct(product._id);
                const prices = variants.map((variant) => variant.price);

                productsWithVariants.push({
                    ...product,
                    variants: variants,
                    sizes: variants.map((variant) => variant.size),
                    lowestPrice: prices.length ? Math.min(...prices) : null,
                });
            }

            setProducts(productsWithVariants);
            setCategories(categoryList);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchShopData();
    }, []);

    const productPrices = products.map((product) => product.lowestPrice)
        .filter((price) => price !== null);
    const minPriceBound = productPrices.length ? Math.min(...productPrices) : 0;
    const maxPriceBound = productPrices.length ? Math.max(...productPrices) : 0;
    const priceCeiling = maxPrice === null ? maxPriceBound : maxPrice;

    const availableSizes = [];
    for (const product of products) {
        for (const size of product.sizes) {
            if (!availableSizes.includes(size)) {
                availableSizes.push(size);
            }
        }
    }
    availableSizes.sort();

    const productCountByCategory = {};
    for (const product of products) {
        productCountByCategory[product.category._id] =
            (productCountByCategory[product.category._id] || 0) + 1;
    }

    // Apply the sidebar filters.
    let visibleProducts = products.filter((product) => {
        if (selectedCategory && product.category._id !== selectedCategory) {
            return false;
        }
        if (
            selectedSizes.length &&
            !selectedSizes.some((size) => product.sizes.includes(size))
        ) {
            return false;
        }
        if (product.lowestPrice !== null && product.lowestPrice > priceCeiling) {
            return false;
        }
        return true;
    });

    // Apply the sort option.
    if (sortBy === "price-asc") {
        visibleProducts.sort((productA, productB) => productA.lowestPrice - productB.lowestPrice);
    } else if (sortBy === "price-desc") {
        visibleProducts.sort((productA, productB) => productB.lowestPrice - productA.lowestPrice);
    } else if (sortBy === "name") {
        visibleProducts.sort((productA, productB) => productA.name.localeCompare(productB.name));
    } else {
        visibleProducts.sort(
            (productA, productB) => new Date(productB.createdAt) - new Date(productA.createdAt)
        );
    }

    // Split into pages.
    const pageCount = Math.max(1, Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE));
    const currentPage = Math.min(page, pageCount);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const productsOnPage = visibleProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    const pageNumbers = []; 
    for (let number = 1; number <= pageCount; number++) {
        pageNumbers.push(number);
    }

    function changeCategory(categoryId) {
        setSelectedCategory(categoryId);
        setPage(1);
    }

    function changeMaxPrice(price) {
        setMaxPrice(price);
        setPage(1);
    }

    function changeSort(value) {
        setSortBy(value);
        setPage(1);
    }

    function toggleSize(size) {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter((selectedSize) => selectedSize !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
        setPage(1);
    }

    const selectedCategoryName = categories.find(
        (category) => category._id === selectedCategory
    )?.name;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <ShopSidebar
                categories={categories}
                productCountByCategory={productCountByCategory}
                selectedCategory={selectedCategory}
                onCategoryChange={changeCategory}
                minPriceBound={minPriceBound}
                maxPriceBound={maxPriceBound}
                priceCeiling={priceCeiling}
                onPriceChange={changeMaxPrice}
                availableSizes={availableSizes}
                selectedSizes={selectedSizes}
                onToggleSize={toggleSize}
            />

            <main>
                <div>
                    <div>
                        <Link to="/">Home</Link>
                        <span> / </span>
                        <Link to="/products">Shop</Link>
                        {selectedCategoryName && (
                            <>
                                <span> / </span>
                                <span>{selectedCategoryName}</span>
                            </>
                        )}
                    </div>

                    <label>
                        Sort by:{" "}
                        <select value={sortBy} onChange={(event) => changeSort(event.target.value)}>
                            <option value="newest">Newest Collection</option>
                            <option value="price-asc">Price from Low to High</option>
                            <option value="price-desc">Price from High to Low</option>
                            <option value="name">Name from A to Z</option>
                        </select>
                    </label>
                </div>

                {productsOnPage.length === 0 ? (
                    <p>No products match your filters.</p>
                ) : (
                    <div>
                        {productsOnPage.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {pageCount > 1 && (
                    <div>
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                        >
                            Previous
                        </button>
                        {pageNumbers.map((number) => (
                            <button
                                type="button"
                                key={number}
                                disabled={number === currentPage}
                                onClick={() => setPage(number)}
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            type="button"
                            disabled={currentPage === pageCount}
                            onClick={() => setPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ProductsPage;
