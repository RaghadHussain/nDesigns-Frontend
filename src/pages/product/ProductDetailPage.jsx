import React from 'react'
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router';
import { getVariantByProduct } from '../../services/productVariantService'
import { getProductById, getAllProducts } from "../../services/productService";
import { getCategoryById } from '../../services/categoryService';
import { createCartItem } from '../../services/cartItemService';
import { useAuth } from '../../context/AuthContext'
import ProductCard from '../../components/product/ProductCard'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const SERVER_URL = import.meta.env.VITE_BACK_END_SERVER_URL;


function ProductDetailPage() {
    const [product, setProduct] = useState();
    useDocumentTitle(product ? product.name : "Product");
    const [variants, setVariants] = useState([]);
    const [category, setCategory] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartStatus, setCartStatus] = useState("");


    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth()
    const { id } = useParams()
    const navigate = useNavigate()

    async function fetchProductDetails() {
        setLoading(true);
        setError("");
        try {
            const [productData, variantData] = await Promise.all([
                getProductById(id),
                getVariantByProduct(id),
            ]);
            setProduct(productData);
            setVariants(variantData);

            const firstAvailable = variantData.find((variant) => variant.quantity > 0);
            setSelectedVariant(firstAvailable || null)
            setQuantity(1);

            const [categoryData, allProducts] = await Promise.all([
                getCategoryById(productData.category),
                getAllProducts(),
            ]);
            setCategory(categoryData);

            const relatedProductsRaw = allProducts
                .filter((product) => product.category._id === productData.category && product._id !== productData._id)
                .slice(0, 4);

            const relatedProducts = await Promise.all(
                relatedProductsRaw.map(async (relatedProduct) => {
                    const relatedVariants = await getVariantByProduct(relatedProduct._id);
                    const relatedPrices = relatedVariants.map((variant) => variant.price);
                    return {
                        ...relatedProduct,
                        sizes: relatedVariants.map((variant) => variant.size),
                        lowestPrice: relatedPrices.length ? Math.min(...relatedPrices) : null,
                    };
                })
            );
            setRecommended(relatedProducts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function decreaseQuantity() {
        setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
    }

    function increaseQuantity() {
        setQuantity((currentQuantity) =>
            Math.min(selectedVariant?.quantity || 1, currentQuantity + 1)
        );
    }

    async function handleAddToCart() {
        if (!user) {
            navigate('/sign-in');
            return;
        }
        if (!selectedVariant) return;

        setAddingToCart(true);
        setCartStatus("");
        try {
            await createCartItem({ variantId: selectedVariant._id, quantity });
            setCartStatus("Added to cart!");
        } catch (err) {
            setCartStatus(err.message);
        } finally {
            setAddingToCart(false);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [id, user])

    useEffect(() => {
        if (!cartStatus) return;
        const timeoutId = setTimeout(() => setCartStatus(""), 3000);
        return () => clearTimeout(timeoutId);
    }, [cartStatus])

    if (error) {
        return <p>{error}</p>
    }
    if (loading) {
        return <p>Loading...</p>
    }

    const hasNoStock = variants.length === 0 || variants.every((variant) => variant.quantity === 0);

    return (
        <div className='product-detail container'>
            <div className='breadcrumb'>
                <Link to='/'>Home</Link>
                <span> / </span>
                <Link to='/products'>Shop</Link>
                {
                    category && (
                        <>
                            <span> / </span>
                            <Link to={`/products?category=${category._id}`}>{category.name}</Link>

                        </>
                    )
                }
                <span> / </span>
                <span>{product.name}</span>
            </div>

            <div className='product-detail__layout'>
                {product.images && product.images.length > 0 ? (
                    <div className='product-detail__gallery'>
                        <div className='product-detail__thumbs'>
                            {product.images.map((oneImge, index) => (
                                <button
                                    type="button"
                                    key={oneImge}
                                    onClick={() => setImage(index)}
                                    className={`product-detail__thumb${index === image ? ' product-detail__thumb--active' : ''}`}
                                >
                                    <img src={`${SERVER_URL}${oneImge}`} alt={`${product.name}`} />
                                </button>
                            ))}
                        </div>

                        <div className='product-detail__main-image placeholder-image'>
                            <img src={`${SERVER_URL}${product.images[image]}`} alt={product.name} />
                        </div>
                    </div>
                ) : (
                    <div className='product-detail__gallery product-detail__main-image placeholder-image'>No image available</div>
                )}

                <div className='product-detail__info'>
                    {category && <p className='eyebrow'>{category.name}</p>}
                    <h1>{product.name}</h1>
                    <p className='product-detail__price'>
                        {selectedVariant
                            ? `BHD ${selectedVariant.price}`
                            : hasNoStock
                            ? "Out of Stock"
                            : "Select a size"}
                    </p>

                    <div className='product-detail__sizes'>
                        <div className='product-detail__sizes-header'>
                            <span>Select Size</span>
                            <Link to="#">Size Guide</Link>
                        </div>
                        <div className='product-detail__size-options'>
                            {variants.map((variant) => {
                                const isOutOfStock = variant.quantity === 0;
                                const isSelected = selectedVariant?._id === variant._id;
                                return (
                                    <button
                                        type="button"
                                        key={variant._id}
                                        disabled={isOutOfStock}
                                        aria-pressed={isSelected}
                                        onClick={() => {
                                            setSelectedVariant(variant);
                                            setQuantity(1);
                                        }}
                                        className={`product-detail__size${isSelected ? ' product-detail__size--active' : ''}`}
                                    >
                                        {variant.size} {isOutOfStock
                                            ? "(Out of Stock)"
                                            : variant.quantity <= 3
                                            ? `(Only ${variant.quantity} left)`
                                            : ""}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {hasNoStock ? (
                        <p className='error'>This product is currently out of stock.</p>
                    ) : user?.role !== "admin" && (
                        <div className='product-detail__actions'>
                            <div className='stepper'>
                                <button type="button" onClick={decreaseQuantity} disabled={quantity <= 1}>
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button
                                    type="button"
                                    onClick={increaseQuantity}
                                    disabled={!selectedVariant || quantity >= selectedVariant.quantity}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || addingToCart}
                                className='btn product-detail__add-to-cart'
                            >
                                {addingToCart ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    )}
                    {cartStatus && <p className='notice'>{cartStatus}</p>}

                    <div className='product-detail__description'>
                        <h2>Description</h2>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>

            {recommended.length > 0 && (
                <div className='product-detail__recommended'>
                    <h2>Recommended for you</h2>
                    <div className='product-grid'>
                        {recommended.map((recommendedProduct) => (
                            <ProductCard key={recommendedProduct._id} product={recommendedProduct} />
                        ))}
                    </div>
                </div>
            )}
        </div>

    )
}

export default ProductDetailPage