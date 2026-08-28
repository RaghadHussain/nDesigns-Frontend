import { Link } from "react-router";
import getImageUrl from "../../utils/imageUrl";

function ProductCard({ product }) {
    const firstImage = product.images && product.images[0];

    return (
        <article>
            <Link to={`/products/${product._id}`}>
                {firstImage ? (
                    <img src={getImageUrl(firstImage)} alt={product.name} />
                ) : (
                    <div>{product.name}</div>
                )}
            </Link>

            <div>
                <h3>
                    <Link to={`/products/${product._id}`}>{product.name}</Link>
                </h3>
                <span>
                    {product.lowestPrice !== null ? `BHD ${product.lowestPrice}` : "—"}
                </span>
            </div>

            {product.sizes.length > 0 && (
                <ul>
                    {product.sizes.map((size) => (
                        <li key={size}>{size}</li>
                    ))}
                </ul>
            )}
        </article>
    );
}

export default ProductCard;
