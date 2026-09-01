import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';

import { useAuth } from '../../context/AuthContext';
import { getCart } from '../../services/cartService';
import { getUserAddress } from '../../services/addressService';
import { applyDiscount } from '../../services/discountService';
import { checkout } from '../../services/checkoutService';
import { getSettings } from '../../services/settingsService';
import { getCurrentUser } from '../../services/authService';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const CheckoutPage = ({}) => {
  useDocumentTitle("Checkout")
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [error, setError] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [formData, setFormData] = useState({
    paymentMethod: 'cash',
    discountCode: '',
    pointsToRedeem: '',
  });

  useEffect(() => {
    async function fetchCheckoutData(){
      try {
        const [cartData, settingsData] = await Promise.all([
          getCart(),
          getSettings(),
        ]);
        setCartItems(cartData.items);
        setDeliveryFee(settingsData.deliveryFee);

        try {
          const addressData = await getUserAddress();
          setAddress(addressData);
        } catch (err) {
          if (err.message !== 'No Address Found') {
            throw err;
          }
        }
      } catch (err) {
        console.log(`Error: ${err}`)
        setError(err.message);
      }
    }
    fetchCheckoutData();
  }, []);

  function handleChange(event){
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleApplyDiscount(){
    try {
      const discount = await applyDiscount(formData.discountCode);
      setDiscountMessage(`Code valid: ${discount.discountValue}% off`);
    } catch (err) {
      console.log(`Error: ${err}`)
      setDiscountMessage(err.message);
    }
  }

  async function handleSubmit(event){
    event.preventDefault();
    try {
      const order = await checkout({
        addressId: address._id,
        paymentMethod: formData.paymentMethod,
        discountCode: formData.discountCode || undefined,
        pointsToRedeem: formData.pointsToRedeem ? Number(formData.pointsToRedeem) : undefined,
      });
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
      navigate(`/checkout/confirmation/${order._id}`);
    } catch (err) {
      console.log(`Error: ${err}`)
      setError(err.message);
    }
  };

  const subTotal = cartItems.reduce((sum, item) => sum + item.variantId.price * item.quantity, 0);

  return (
    <main className='checkout-page container'>
      <h1>Checkout</h1>
      <p className='error'>{error}</p>

      <div className='checkout-layout'>
        <form onSubmit={handleSubmit} className='checkout-form'>
          <section className='checkout-section'>
            <h2>Address</h2>
            {address
              ? <p className='checkout-address'>{address.city}, Block {address.block}, Road {address.road}, Building {address.building}</p>
              : <p className='notice'>No address found. <Link to='/account/profile'>Add one</Link>.</p>}
          </section>

          <section className='checkout-section'>
            <h2>Payment</h2>
            <div className='field'>
              <label htmlFor='paymentMethod'>Payment Method</label>
              <select id='paymentMethod' name='paymentMethod' value={formData.paymentMethod} onChange={handleChange}>
                <option value='cash'>Cash on Delivery</option>
                <option value='card'>Card</option>
              </select>
            </div>
            <div className='field checkout-discount'>
              <label htmlFor='discountCode'>Discount Code</label>
              <div className='checkout-discount__row'>
                <input
                  type='text'
                  id='discountCode'
                  value={formData.discountCode}
                  name='discountCode'
                  onChange={handleChange}
                />
                <button type='button' onClick={handleApplyDiscount} className='btn btn--outline btn--sm'>Apply</button>
              </div>
              <p className='notice'>{discountMessage}</p>
            </div>
            <div className='field'>
              <label htmlFor='pointsToRedeem'>Points to Redeem</label>
              <p className='checkout-points-available'>Available Points: {user.loyaltyPoints}</p>
              <input
                type='number'
                id='pointsToRedeem'
                value={formData.pointsToRedeem}
                name='pointsToRedeem'
                onChange={handleChange}
                min='0'
                max={user.loyaltyPoints}
              />
            </div>
          </section>

          <button disabled={!address || cartItems.length === 0} className='btn btn--block checkout-submit'>Place Order</button>
        </form>

        <aside className='checkout-summary'>
          <h2>Items</h2>
          <ul className='line-items'>
            {cartItems.map((item) => (
              <li key={item._id} className='line-items__row'>{item.variantId.size} x {item.quantity} - <span>{item.variantId.price * item.quantity}</span></li>
            ))}
          </ul>
          <div className='summary-list'>
            <div className='summary-list__row'>Subtotal: <span>{subTotal}</span></div>
            <div className='summary-list__row'>Delivery Fee: <span>BHD {deliveryFee}</span></div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;
