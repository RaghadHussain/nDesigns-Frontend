import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { getCart } from '../../services/cartService';
import { getUserAddress } from '../../services/addressService';
import { applyDiscount } from '../../services/discountService';
import { checkout } from '../../services/checkoutService';
import { getDeliveryFee } from '../../services/deliverySettingsService';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const CheckoutPage = ({}) => {
  useDocumentTitle("Checkout")
  const navigate = useNavigate();
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
        const [cartData, feeData] = await Promise.all([
          getCart(),
          getDeliveryFee(),
        ]);
        setCartItems(cartData.items);
        setDeliveryFee(feeData.fee);

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
      navigate(`/checkout/confirmation/${order._id}`);
    } catch (err) {
      console.log(`Error: ${err}`)
      setError(err.message);
    }
  };

  const subTotal = cartItems.reduce((sum, item) => sum + item.variantId.price * item.quantity, 0);

  return (
    <main>
      <h1>Checkout</h1>
      <p className='error'>{error}</p>

      <h2>Items</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>{item.variantId.size} x {item.quantity} - {item.variantId.price * item.quantity}</li>
        ))}
      </ul>
      <p>Subtotal: {subTotal}</p>
      <p>Delivery Fee: BHD {deliveryFee}</p>

      <h2>Address</h2>
      {address
        ? <p>{address.city}, Block {address.block}, Road {address.road}, Building {address.building}</p>
        : <p>No address found. <a href='/account/address'>Add one</a>.</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='paymentMethod'>Payment Method:</label>
          <select id='paymentMethod' name='paymentMethod' value={formData.paymentMethod} onChange={handleChange}>
            <option value='cash'>Cash on Delivery</option>
            <option value='card'>Card</option>
          </select>
        </div>
        <div>
          <label htmlFor='discountCode'>Discount Code:</label>
          <input
            type='text'
            id='discountCode'
            value={formData.discountCode}
            name='discountCode'
            onChange={handleChange}
          />
          <button type='button' onClick={handleApplyDiscount}>Apply</button>
          <p>{discountMessage}</p>
        </div>
        <div>
          <label htmlFor='pointsToRedeem'>Points to Redeem:</label>
          <input
            type='number'
            id='pointsToRedeem'
            value={formData.pointsToRedeem}
            name='pointsToRedeem'
            onChange={handleChange}
            min='0'
          />
        </div>
        <div>
          <button disabled={!address || cartItems.length === 0}>Place Order</button>
        </div>
      </form>
    </main>
  );
};

export default CheckoutPage;
