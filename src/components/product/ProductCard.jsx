import { Link } from "react-router";
import getImageUrl from "../../utils/imageUrl";

function ProductCard({ product }) {
    const firstImage = product.images && product.images[0];

    return (
        <article className='product-card'>
            <Link to={`/products/${product._id}`} className='product-card__image placeholder-image'>
                {firstImage ? (
                    <img src={getImageUrl(firstImage)} alt={product.name} />
                ) : (
                    <div>{product.name}</div>
                )}
            </Link>

            <div className='product-card__meta'>
                <h3 className='product-card__title'>
                    <Link to={`/products/${product._id}`}>{product.name}</Link>
                </h3>
                <span className='product-card__price'>
                    {product.lowestPrice !== null ? `BHD ${product.lowestPrice}` : "—"}
                </span>
            </div>

            {product.sizes.length > 0 && (
                <ul className='product-card__sizes'>
                    {product.sizes.map((size) => (
                        <li key={size}>{size}</li>
                    ))}
                </ul>
            )}
        </article>
    );
}

export default ProductCard;
