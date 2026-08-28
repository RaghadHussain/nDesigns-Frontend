import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';

import { getOrderById } from '../../services/orderService';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const OrderConfirmationPage = ({}) => {
  useDocumentTitle("Order Confirmed")
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder(){
      try {
        const data = await getOrderById(id);
        setOrder(data.order);
        setItems(data.items);
      } catch (err) {
        console.log(`Error: ${err}`)
        setError(err.message);
      }
    }
    fetchOrder();
  }, [id]);

  if (error) return <p className='error'>{error}</p>
  if (!order) return <p>Loading...</p>

  return (
    <main>
      <h1>Order Confirmed</h1>
      <p>Thank you! Your order has been placed.</p>

      <h2>Order {order._id}</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>{item.variantId.size} x {item.quantity} - {item.totalPrice}</li>
        ))}
      </ul>
      <p>Subtotal: {order.subTotal}</p>
      <p>Discount: {order.discountAmount}</p>
      <p>Delivery Fee: {order.deliveryFee}</p>
      <p>Total: {order.totalAmount}</p>
      <p>Status: {order.orderStatus}</p>

      <Link to='/'>Back to Home</Link>
    </main>
  );
};

export default OrderConfirmationPage;
