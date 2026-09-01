import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getCart, deleteCart } from '../../../services/cartService'
import { updateCartItem, deleteCartItem } from '../../../services/cartItemService'
import { getProductById } from '../../../services/productService'
import { getSettings } from '../../../services/settingsService'
import getImageUrl from '../../../utils/imageUrl'
import useDocumentTitle from '../../../hooks/useDocumentTitle'

function CartPage() {
    useDocumentTitle("Cart")
    const [cartItems, setCartItems] = useState([])
    const [deliveryFeeSetting, setDeliveryFeeSetting] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    async function fetchCartData() {
        try {
            setLoading(true);
            setError("");

            const [{ items }, settingsData] = await Promise.all([
                getCart(),
                getSettings(),
            ]);
            setDeliveryFeeSetting(settingsData.deliveryFee);

            const itemsWithProducts = await Promise.all(
                items.map(async (item) => {
                    const variant = item.variantId;
                    const product = await getProductById(variant.productId);
                    return { ...item, variant, product };
                })
            );

            setCartItems(itemsWithProducts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCartData();
    }, []);

    async function changeQuantity(itemId, newQuantity) {
        const item = cartItems.find((cartItem) => cartItem._id === itemId);
        if (!item || newQuantity < 1 || newQuantity > item.variant.quantity) {
            return;
        }

        const previousItems = cartItems;
        setCartItems(
            cartItems.map((cartItem) =>
                cartItem._id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
            )
        );

        try {
            await updateCartItem(itemId, { quantity: newQuantity });
        } catch (err) {
            setCartItems(previousItems);
            setError(err.message);
        }
    }

    async function clearCart() {
        const previousItems = cartItems;
        setCartItems([]);

        try {
            await deleteCart();
        } catch (err) {
            setCartItems(previousItems);
            setError(err.message);
        }
    }

    async function removeItem(itemId) {
        const previousItems = cartItems;
        setCartItems(cartItems.filter((cartItem) => cartItem._id !== itemId));

        try {
            await deleteCartItem(itemId);
        } catch (err) {
            setCartItems(previousItems);
            setError(err.message);
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.variant.price * item.quantity,
        0
    );
    const deliveryFee = cartItems.length > 0 ? deliveryFeeSetting : 0;
    const grandTotal = subtotal + deliveryFee;

    return (
        <div className='cart-page container'>
            <h1>Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className='empty-state'>
                    <p>Your cart is empty.</p>
                    <Link to="/products" className='btn'>Continue Shopping</Link>
                </div>
            ) : (
                <div className='cart-layout'>
                    <section className='cart-items'>
                        <div className='cart-items__header'>
                            <h2>Product Details</h2>
                            <button type="button" onClick={clearCart} className='btn btn--ghost btn--sm'>Clear Cart</button>
                        </div>
                        <div className='admin-table-wrap'>
                            <table className='cart-table'>
                                <thead>
                                    <tr>
                                        <th>Product Details</th>
                                        <th>Size</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => {
                                        const firstImage = item.product.images && item.product.images[0];
                                        return (
                                            <tr key={item._id}>
                                                <td>
                                                    <Link to={`/products/${item.product._id}`} className='cart-table__product'>
                                                        {firstImage && (
                                                            <img
                                                                src={getImageUrl(firstImage)}
                                                                alt={item.product.name}
                                                                width="60"
                                                            />
                                                        )}
                                                        {item.product.name}
                                                    </Link>
                                                </td>
                                                <td>{item.variant.size}</td>
                                                <td>
                                                    <div className='stepper'>
                                                        <button
                                                            type="button"
                                                            onClick={() => changeQuantity(item._id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => changeQuantity(item._id, item.quantity + 1)}
                                                            disabled={item.quantity >= item.variant.quantity}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='cart-table__price'>BHD {(item.variant.price * item.quantity).toFixed(2)}</div>
                                                    <button type="button" onClick={() => removeItem(item._id)} className='cart-table__remove'>
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className='cart-summary'>
                        <h2>Order Summary</h2>
                        <div className='summary-list'>
                            <div className='summary-list__row'>
                                <span>Cart Subtotal</span>
                                <span>BHD {subtotal.toFixed(2)}</span>
                            </div>
                            <div className='summary-list__row'>
                                <span>Delivery Fee</span>
                                <span>BHD {deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className='summary-list__row summary-list__row--total'>
                                <strong>Grand Total</strong>
                                <strong>BHD {grandTotal.toFixed(2)}</strong>
                            </div>
                        </div>

                        <button type="button" onClick={() => navigate('/checkout')} className='btn btn--block cart-summary__checkout'>
                            Proceed to Checkout
                        </button>
                        <Link to="/products" className='cart-summary__continue'>Continue Shopping</Link>
                    </section>
                </div>
            )}
        </div>
    )
}

export default CartPage
